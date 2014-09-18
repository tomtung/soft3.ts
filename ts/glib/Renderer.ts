/// <reference path="Display.ts" />
/// <reference path="Camera.ts" />
/// <reference path="MeshTriangle.ts" />

module CS580GL {
    export interface RenderAttributes {
        flatColor?: Color
    }

    /** Render objects contructor */
    export class Renderer {
        flatColor: Color;

        constructor(public display: Display) {
        }

        setAttributes(attributes: RenderAttributes): Renderer {
            if (attributes.flatColor) {
                this.flatColor = attributes.flatColor;
            }
            return this;
        }

        renderPixel(x: number, y: number, z: number, color: Color): Renderer {
            if (z >= 0 && x >= 0 && y >= 0 && x < this.display.xres && y < this.display.yres) {
                var pixelRef = this.display.pixelAt(x, y);
                if (pixelRef.z > z) {
                    pixelRef.setColor(color);
                    pixelRef.z = z;
                }
            }
            return this;
        }

        renderTriangle(triangle: MeshTriangle): Renderer {
            var floatEq = (x: number, y: number) => Math.abs(x - y) < 1e-6;

            var renderScanLine = (x1: number, z1: number, x2: number, z2: number, y: number) => {
                var m: number, x: number, z: number;
                if (x1 >= this.display.xres || x2 < 0) {
                    return;
                }

                m = (z1 - z2) / (x1 - x2);
                x = Math.max(0, Math.round(x1)); // Note: Use round instead of ceil
                z = z1 + m * (x - x1); // TODO why use int instead of float?
                for (; x < Math.min(x2, this.display.xres - 1); x += 1, z += m) {
                    this.renderPixel(x, y, Math.round(z), this.flatColor);
                }
            }

            // Sort vertices
            var vertices = triangle.toVertexArray().sort((l, r) =>
                !floatEq(l.position.y, r.position.y) ?
                l.position.y - r.position.y :
                l.position.x - r.position.x
                );
            var pos = vertices.map(v => v.position);

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
                y += 1, x01 += mx01, z01 += mz01, x02 += mx02, z02 += mz02;
            };
            var lowerAdvance = (): void => {
                y += 1, x12 += mx12, z12 += mz12, x02 += mx02, z02 += mz02;
            }

            if (isMidVertexLeft) {
                for (; y < pos[1].y; upperAdvance()) {
                    renderScanLine(x01, z01, x02, z02, y);
                }

                for (; y <= pos[2].y; lowerAdvance()) {
                    renderScanLine(x12, z12, x02, z02, y);
                }
            } else {
                for (; y < pos[1].y; upperAdvance()) {
                    renderScanLine(x02, z02, x01, z01, y);
                }

                for (; y <= pos[2].y; lowerAdvance()) {
                    renderScanLine(x02, z02, x12, z12, y);
                }
            }

            return this;
        }
    } 
}