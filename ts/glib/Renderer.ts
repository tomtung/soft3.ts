/// <reference path="Display.ts" />
/// <reference path="Camera.ts" />
/// <reference path="MeshTriangle.ts" />
/// <reference path="utils.ts" />

module CS580GL {

    export interface IDirectionalLight {
        direction: Vector3
        color: Color
    }

    export enum ShadingMode {
        Flat
    }

    export interface IShadingValues {
        flatColor?: Color
    }

    /** Render objects constructor */
    export class Renderer {
        camera: Camera;
        toWorldTransformationStack: Matrix4[] = [];
        toScreenTransformation: Matrix4;
        accumulatedTransformation: Matrix4 = Matrix4.identity();
        shading: ShadingMode = ShadingMode.Flat;
        ambientLight: Color = new Color(0.0, 0.0, 0.0);
        directionalLights: IDirectionalLight[] = [];

        constructor(public display: Display) {
            this.updateToScreenTransformation();
        }

        /** Update the to-screen transformation matrix. Must be invoked if  display is changed. */
        updateToScreenTransformation(): Renderer {
            var halfX = this.display.width / 2;
            var halfY = this.display.height / 2;
            this.toScreenTransformation = new Matrix4([
                halfX, 0, 0, halfX,
                0, -halfY, 0, halfY,
                0, 0, -Display.Z_MAX, 0,
                0, 0, 0, 1
            ]);
            return this;
        }

        /** Update the perspective matrix. Must be invoked if camera, display, or to-world transformations are changed. */
        updateAccumulatedTransformation(): Renderer {
            if (!this.camera) {
                this.accumulatedTransformation = Matrix4.identity();
            } else {
                this.accumulatedTransformation.
                    copyFrom(this.toScreenTransformation).
                    multiply(this.camera.perspectiveMatrix).
                    multiply(this.camera.lookAtMatrix);
                this.toWorldTransformationStack.forEach(m => {
                    this.accumulatedTransformation.multiply(m);
                });
            }

            return this;
        }

        renderPixel(x: number, y: number, z: number, color: Color): Renderer {
            if (z >= 0 && x >= 0 && y >= 0 && x < this.display.width && y < this.display.height) {
                var pixelRef = this.display.pixelAt(x, y);
                if (pixelRef.z > z) {
                    pixelRef.setColor(color);
                    pixelRef.z = z;
                }
            }
            return this;
        }

        drawScanLine(x1: number, z1: number, x2: number, z2: number, y: number, shadingValues: IShadingValues) {
            var m: number, x: number, z: number, color: Color;
            if (x1 >= this.display.width || x2 < 0) {
                return;
            }

            if (this.shading === ShadingMode.Flat) {
                color = shadingValues.flatColor;
            }

            m = (z1 - z2) / (x1 - x2);
            x = Math.max(0, Math.round(x1)); // Note: Use round instead of ceil
            z = z1 + m * (x - x1);
            for (; x < Math.min(x2, this.display.width - 1); x += 1, z += m) {
                this.renderPixel(x, y, Math.round(z), color);
            }
        }

        private shadeByNormal(normal: Vector3): Color {
            var color = this.ambientLight.clone();
            this.directionalLights.forEach(l => {
                var prod = normal.dot(l.direction);
                if (prod < 0) {
                    prod = -prod;
                }
                if (prod > 1) {
                    prod = 1;
                }
                color.add(
                    Color.multiplyScalar(l.color, prod)
                );
            });
            return color.clamp();
        }

        renderScreenTriangle(triangle: MeshTriangle): Renderer {
            // Sort vertices
            var vertices = triangle.toVertexArray().sort((l, r) =>
                    !floatEq(l.position.y, r.position.y) ?
                        l.position.y - r.position.y :
                        l.position.x - r.position.x
            );
            var pos = vertices.map(v => v.position);

            // Set up shading
            var shadingValues: any = {};
            switch(this.shading) {
                case ShadingMode.Flat:
                    shadingValues.flatColor = this.shadeByNormal(triangle.a.normal);
                    break;
                default:
                    debugger;
            }

            // Initialize interpolation
            var deltaY = [pos[0].y - pos[1].y, pos[0].y - pos[2].y, pos[1].y - pos[2].y];

            // Compute slopes dx/dy and dz/dy
            var edgeSlopeXY = (vi: number, vj: number) => (pos[vi].x - pos[vj].x) / (pos[vi].y - pos[vj].y);
            var mx01 = edgeSlopeXY(0, 1),
                mx02 = edgeSlopeXY(0, 2),
                mx12 = edgeSlopeXY(1, 2);

            var edgeSlopeZY = (vi: number, vj: number) => (pos[vi].z - pos[vj].z) / (pos[vi].y - pos[vj].y);
            var mz01 = edgeSlopeZY(0, 1),
                mz02 = edgeSlopeZY(0, 2),
                mz12 = edgeSlopeZY(1, 2);

            // Initial scan line positions on each edge            

            var edgeInitialX = (vi: number, mx: number) => pos[vi].x + mx * (Math.ceil(pos[vi].y) - pos[vi].y);
            var edgeInitialZ = (vi: number, mz: number) => pos[vi].z + mz * (Math.ceil(pos[vi].y) - pos[vi].y);

            var x01 = edgeInitialX(0, mx01),
                x02 = edgeInitialX(0, mx02),
                x12 = edgeInitialX(1, mx12);
            var z01 = edgeInitialZ(0, mz01),
                z02 = edgeInitialZ(0, mz02),
                z12 = edgeInitialZ(1, mz12);

            var y = Math.ceil(pos[0].y);

            var isMidVertexLeft = isFinite(mx01) && (mx01 < mx02);

            // Helper function that advances the scan line
            var upperAdvance = (): void => {
                y += 1;
                x01 += mx01;
                z01 += mz01;
                x02 += mx02;
                z02 += mz02;
            };
            var lowerAdvance = (): void => {
                y += 1;
                x12 += mx12;
                z12 += mz12;
                x02 += mx02;
                z02 += mz02;
            };

            if (isMidVertexLeft) {
                for (; y < pos[1].y; upperAdvance()) {
                    this.drawScanLine(x01, z01, x02, z02, y, shadingValues);
                }

                for (; y <= pos[2].y; lowerAdvance()) {
                    this.drawScanLine(x12, z12, x02, z02, y, shadingValues);
                }
            } else {
                for (; y < pos[1].y; upperAdvance()) {
                    this.drawScanLine(x02, z02, x01, z01, y, shadingValues);
                }

                for (; y <= pos[2].y; lowerAdvance()) {
                    this.drawScanLine(x02, z02, x12, z12, y, shadingValues);
                }
            }

            return this;
        }

        private getTransformedVertex(vertex: IMeshVertex): IMeshVertex {
            // Note that normal is not transformed, because we don't transform lighting either
            return {
                position: vertex.position.clone().applyAsHomogeneous(this.accumulatedTransformation),
                normal: vertex.normal,
                textureCoordinate: vertex.textureCoordinate
            };
        }

        renderTriangle(triangle: MeshTriangle): Renderer {
            var screenTriangle = new MeshTriangle(
                this.getTransformedVertex(triangle.a),
                this.getTransformedVertex(triangle.b),
                this.getTransformedVertex(triangle.c)
            );
            this.renderScreenTriangle(screenTriangle);
            return this;
        }
    }
}
