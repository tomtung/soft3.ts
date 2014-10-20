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
        Flat,
        Gouraud,
        Phong,
        TextureOnly
    }

    export interface IShadingParams {
        // for flat shading
        flatColor?: Color
        // for Gouraud shading
        color1?: Color
        color2?: Color
        // for Phong shading
        normal1?: Vector3
        normal2?: Vector3
    }

    export interface ITexture {
        (s: number, t: number): Color;
    }

    export var allWhiteTexture: ITexture = (s: number, t: number) => new Color(1, 1, 1);

    export function makeImageTexture(image: ImageData): ITexture {
        var height = image.height;
        var width = image.width;
        var data = new Uint8Array(image.data.length);
        data.set(image.data);
        var colorAt = (x: number, y: number) => {
            var rIndex = (x + y * width) * 4;
            var gIndex = rIndex + 1;
            var bIndex = gIndex + 1;

            return Color.fromRGBUint8(data[rIndex], data[gIndex], data[bIndex]);
        };

        return (s: number, t: number) => {
            s = clamp(s, 0, 1);
            t = clamp(t, 0, 1);

            var x = (width - 1) * s;
            var y = (height - 1) * t;

            var x1 = Math.floor(x);
            var x2 = Math.min(x1 + 1, width - 1);
            var y1 = Math.floor(y);
            var y2 = Math.min(y1 + 1, height - 1);

            return colorAt(x1, y1).multiplyScalar((x2 - x) * (y2 - y)).
                add(colorAt(x1, y2).multiplyScalar((x2 - x) * (y - y1))).
                add(colorAt(x2, y1).multiplyScalar((x - x1) * (y2 - y))).
                add(colorAt(x2, y2).multiplyScalar((x - x1) * (y - y1)));
        }
    }

    /** Render objects constructor */
    export class Renderer {
        camera: Camera;
        toWorldTransformationStack: Matrix4[] = [];
        normalTransformationStack: Matrix4[] = [];
        toScreenTransformation: Matrix4;
        accumulatedTransformation: Matrix4 = Matrix4.identity();
        accumulatedNormalTransformation: Matrix4 = Matrix4.identity();
        shading: ShadingMode = ShadingMode.Flat;
        ambientLight: Color = new Color(0.0, 0.0, 0.0);
        ambientCoefficient: number = 1.0;
        directionalLights: IDirectionalLight[] = [];
        diffuseCoefficient: number = 1.0;
        specularCoefficient: number = 0.0;
        shininess: number = 0.0;
        texture: ITexture = allWhiteTexture;

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

                this.accumulatedNormalTransformation.copyFrom(this.camera.lookAtMatrix);
                this.normalTransformationStack.forEach(m => {
                    this.accumulatedNormalTransformation.multiply(m);
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

        private getTextureColorFromScreenSpace(sScreen: number, tScreen: number, zScreen: number) {
            var coeff = zScreen / (Display.Z_MAX - zScreen) + 1;
            var s = sScreen * coeff;
            var t = tScreen * coeff;

            return this.texture(s, t);
        }

        private drawScanLine(y: number, x1: number, x2: number, z1: number, z2: number, st1: Vector2, st2: Vector2, shadingParams: IShadingParams) {
            var mZ: number, x: number, z: number, invDeltaX: number, roundXOffset: number,
                gouraudColor: Color, mGouraudColor: Color, textureColor: Color, color: Color,
                normal: Vector3, mNormal: Vector3,
                mST: Vector2, st: Vector2;

            if (x1 >= this.display.width || x2 < 0) {
                return;
            }

            invDeltaX = 1 / (x1 - x2);
            mZ = (z1 - z2) * invDeltaX;
            mST = Vector2.subtract(st1, st2).multiplyScalar(invDeltaX);

            x = Math.round(x1); // Note: Use round instead of ceil
            roundXOffset = x - x1;

            z = z1 + mZ * roundXOffset;
            st = st1.clone();
            textureColor = this.getTextureColorFromScreenSpace(st.x, st.y, z);

            switch (this.shading) {
                case ShadingMode.TextureOnly:
                    color = textureColor.clone();
                    break;
                case ShadingMode.Flat:
                    color = Color.multiply(shadingParams.flatColor, textureColor);
                    break;
                case ShadingMode.Gouraud:
                    mGouraudColor = Color.subtract(shadingParams.color1, shadingParams.color2).multiplyScalar(invDeltaX);
                    gouraudColor = shadingParams.color1.clone(); // avoid clamping
                    color = Color.multiply(gouraudColor, textureColor);
                    break;
                case ShadingMode.Phong:
                    mNormal = Vector3.subtract(shadingParams.normal1, shadingParams.normal2).multiplyScalar(invDeltaX);
                    normal = Vector3.multiplyScalar(mNormal, roundXOffset).add(shadingParams.normal1);
                    color = this.shadeByNormal(shadingParams.normal1, textureColor); // avoid clamping
                    break;
                default:
                    debugger;
            }

            var advance = () => {
                x += 1;
                z += mZ;

                st.add(mST);
                textureColor = this.getTextureColorFromScreenSpace(st.x, st.y, z).clamp();

                switch (this.shading) {
                    case ShadingMode.TextureOnly:
                        color = textureColor.clone();
                        break;
                    case ShadingMode.Flat:
                        color = Color.multiply(shadingParams.flatColor, textureColor);
                        break;
                    case ShadingMode.Gouraud:
                        gouraudColor.add(mGouraudColor);
                        color = Color.multiply(gouraudColor, textureColor);
                        break;
                    case ShadingMode.Phong:
                        normal.add(mNormal);
                        color = this.shadeByNormal(normal, textureColor);
                        break;
                    default:
                        debugger;
                }

                color.clamp();
            };

            for (; x < Math.min(x2, this.display.width - 1); advance()) {
                this.renderPixel(x, y, Math.round(z), color);
            }
        }

        private static computeReflectZ(n: Vector3, l: Vector3): number {
            return n.dot(l) * 2 * n.z - l.z;
        }

        private shadeByNormal(normal: Vector3, textureColor: Color = new Color(1, 1, 1)): Color {
            var n = normal.clone().normalize();

            var diffuse = new Color(0, 0, 0), specular = new Color(0, 0, 0);

            this.directionalLights.forEach(light => {
                var l = light.direction.normalize();

                var nDotL = n.dot(l), reflectZ: number;
                if (nDotL > 0 && n.z > 0) {
                    reflectZ = Renderer.computeReflectZ(n, l);
                } else if (nDotL < 0 && n.z < 0) {
                    n.negate();
                    nDotL = -nDotL;
                    reflectZ = Renderer.computeReflectZ(n, l);
                } else {
                    return;
                }

                diffuse.add(
                    Color.multiplyScalar(light.color, clamp(nDotL, 0, 1))
                );
                specular.add(
                    Color.multiplyScalar(light.color, Math.pow(clamp(reflectZ, 0, 1), this.shininess))
                );
            });

            return Color.multiplyScalar(this.ambientLight, this.ambientCoefficient).
                add(diffuse.multiplyScalar(this.diffuseCoefficient)).
                multiply(textureColor).
                add(specular.multiplyScalar(this.specularCoefficient)).
                clamp();
        }

        renderScreenTriangle(triangle: MeshTriangle): Renderer {
            // Sort vertices
            var vertices = triangle.toVertexArray().sort((l, r) =>
                    !floatEq(l.position.y, r.position.y) ?
                        l.position.y - r.position.y :
                        l.position.x - r.position.x
            );
            var pos = (i: number) => vertices[i].position;
            var vNormal = (i: number) => vertices[i].normal;
            var vST = (i: number) => vertices[i].textureCoordinate;

            // Set up interpolation for x and z

            // Order 01, 02, 12. Same for mX, mZ, mST.
            var invDeltaY = [1 / (pos(0).y - pos(1).y), 1 / (pos(0).y - pos(2).y), 1 / (pos(1).y - pos(2).y)];

            // Compute slopes mX = dx/dy, mY = dz/dy, mST = dST/dy
            var mX = [
                    invDeltaY[0] * (pos(0).x - pos(1).x),
                    invDeltaY[1] * (pos(0).x - pos(2).x),
                    invDeltaY[2] * (pos(1).x - pos(2).x)
            ];
            var mZ = [
                    invDeltaY[0] * (pos(0).z - pos(1).z),
                    invDeltaY[1] * (pos(0).z - pos(2).z),
                    invDeltaY[2] * (pos(1).z - pos(2).z)
            ];
            var mST = [
                Vector2.subtract(vST(0), vST(1)).multiplyScalar(invDeltaY[0]),
                Vector2.subtract(vST(0), vST(2)).multiplyScalar(invDeltaY[1]),
                Vector2.subtract(vST(1), vST(2)).multiplyScalar(invDeltaY[2])
            ];

            var isMidVertexLeft = isFinite(mX[0]) && (mX[0] < mX[1]);

            // Current scan line (x,z) positions on each edge
            var roundYOffset = [
                    Math.ceil(pos(0).y) - pos(0).y,
                    Math.ceil(pos(1).y) - pos(1).y
            ];
            var x = [
                    pos(0).x + mX[0] * roundYOffset[0],
                    pos(0).x + mX[1] * roundYOffset[0],
                    pos(1).x + mX[2] * roundYOffset[1]
            ];
            var z = [
                    pos(0).z + mZ[0] * roundYOffset[0],
                    pos(0).z + mZ[1] * roundYOffset[0],
                    pos(1).z + mZ[2] * roundYOffset[1]
            ];
            var st: Vector2[] = [
                Vector2.multiplyScalar(mST[0], roundYOffset[0]).add(vST(0)),
                Vector2.multiplyScalar(mST[1], roundYOffset[0]).add(vST(0)),
                Vector2.multiplyScalar(mST[2], roundYOffset[1]).add(vST(1))
            ];

            var y = Math.ceil(pos(0).y);

            // Set up shading

            // The flat color for flat shading
            var flatColor: Color;

            // For Gouraud shading:
            // - vColors: colors on vertices
            // - mColors: slopes d(color)/dy
            // - color: color values on the intersection of current scan line and edges
            var vColors: Color[], mColor: Color[], color: Color[];

            // For Phong shading:
            // - mNormals: slopes d(normal)/dy
            // - normal: normal values on the intersection of current scan line and edges
            var mNormal: Vector3[], normal: Vector3[];

            switch (this.shading) {
                case ShadingMode.Flat:
                    flatColor = this.shadeByNormal(triangle.a.normal);
                    break;
                case ShadingMode.Gouraud:
                    vColors = [
                        this.shadeByNormal(vertices[0].normal),
                        this.shadeByNormal(vertices[1].normal),
                        this.shadeByNormal(vertices[2].normal)
                    ];
                    mColor = [
                        Color.subtract(vColors[0], vColors[1]).multiplyScalar(invDeltaY[0]),
                        Color.subtract(vColors[0], vColors[2]).multiplyScalar(invDeltaY[1]),
                        Color.subtract(vColors[1], vColors[2]).multiplyScalar(invDeltaY[2])
                    ];
                    color = [
                        Color.multiplyScalar(mColor[0], roundYOffset[0]).add(vColors[0]),
                        Color.multiplyScalar(mColor[1], roundYOffset[0]).add(vColors[0]),
                        Color.multiplyScalar(mColor[2], roundYOffset[1]).add(vColors[1])
                    ];
                    break;
                case ShadingMode.Phong:
                    mNormal = [
                        Vector3.subtract(vNormal(0), vNormal(1)).multiplyScalar(invDeltaY[0]),
                        Vector3.subtract(vNormal(0), vNormal(2)).multiplyScalar(invDeltaY[1]),
                        Vector3.subtract(vNormal(1), vNormal(2)).multiplyScalar(invDeltaY[2])
                    ];
                    normal = [
                        Vector3.multiplyScalar(mNormal[0], roundYOffset[0]).add(vNormal(0)),
                        Vector3.multiplyScalar(mNormal[1], roundYOffset[0]).add(vNormal(0)),
                        Vector3.multiplyScalar(mNormal[2], roundYOffset[1]).add(vNormal(1))
                    ];
                    break;
                case ShadingMode.TextureOnly:
                    break;
                default:
                    debugger;
            }

            // Helper function that advances the scan line
            var upperAdvance = (): void => {
                y += 1;
                x[0] += mX[0];
                z[0] += mZ[0];
                x[1] += mX[1];
                z[1] += mZ[1];
                st[0].add(mST[0]);
                st[1].add(mST[1]);
                if (this.shading === ShadingMode.Gouraud) {
                    color[0].add(mColor[0]);
                    color[1].add(mColor[1]);
                } else if (this.shading === ShadingMode.Phong) {
                    normal[0].add(mNormal[0]);
                    normal[1].add(mNormal[1]);
                }
            };
            var lowerAdvance = (): void => {
                y += 1;
                x[1] += mX[1];
                z[1] += mZ[1];
                x[2] += mX[2];
                z[2] += mZ[2];
                st[1].add(mST[1]);
                st[2].add(mST[2]);
                if (this.shading == ShadingMode.Gouraud) {
                    color[1].add(mColor[1]);
                    color[2].add(mColor[2]);
                } else if (this.shading === ShadingMode.Phong) {
                    normal[1].add(mNormal[1]);
                    normal[2].add(mNormal[2]);
                }
            };

            var shadingParams: IShadingParams;
            if (this.shading === ShadingMode.Flat) {
                shadingParams = {flatColor: flatColor};
            }
            if (isMidVertexLeft) {
                if (this.shading === ShadingMode.Gouraud) {
                    shadingParams = {
                        color1: color[0],
                        color2: color[1]
                    }
                } else if (this.shading === ShadingMode.Phong) {
                    shadingParams = {
                        normal1: normal[0],
                        normal2: normal[1]
                    }
                }
                for (; y < pos(1).y; upperAdvance()) {
                    this.drawScanLine(y, x[0], x[1], z[0], z[1], st[0], st[1], shadingParams);
                }

                if (this.shading === ShadingMode.Gouraud) {
                    shadingParams = {
                        color1: color[2],
                        color2: color[1]
                    }
                } else if (this.shading === ShadingMode.Phong) {
                    shadingParams = {
                        normal1: normal[2],
                        normal2: normal[1]
                    }
                }
                for (; y <= pos(2).y; lowerAdvance()) {
                    this.drawScanLine(y, x[2], x[1], z[2], z[1], st[2], st[1], shadingParams);
                }
            } else {
                if (this.shading === ShadingMode.Gouraud) {
                    shadingParams = {
                        color1: color[1],
                        color2: color[0]
                    }
                } else if (this.shading === ShadingMode.Phong) {
                    shadingParams = {
                        normal1: normal[1],
                        normal2: normal[0]
                    }
                }
                for (; y < pos(1).y; upperAdvance()) {
                    this.drawScanLine(y, x[1], x[0], z[1], z[0], st[1], st[0], shadingParams);
                }

                if (this.shading === ShadingMode.Gouraud) {
                    shadingParams = {
                        color1: color[1],
                        color2: color[2]
                    }
                } else if (this.shading === ShadingMode.Phong) {
                    shadingParams = {
                        normal1: normal[1],
                        normal2: normal[2]
                    }
                }
                for (; y <= pos(2).y; lowerAdvance()) {
                    this.drawScanLine(y, x[1], x[2], z[1], z[2], st[1], st[2], shadingParams);
                }
            }

            return this;
        }

        private getTransformedVertex(vertex: IMeshVertex): IMeshVertex {
            var screenPos = vertex.position.clone().applyAsHomogeneous(this.accumulatedTransformation);
            var screenNormal = vertex.normal.clone().transformDirection(this.accumulatedNormalTransformation);
            var warpFactor = 1 + screenPos.z / (Display.Z_MAX - screenPos.z);
            var screenTexture = vertex.textureCoordinate.clone().multiplyScalar(1 / warpFactor);

            return {
                position: screenPos,
                normal: screenNormal,
                textureCoordinate: screenTexture
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
