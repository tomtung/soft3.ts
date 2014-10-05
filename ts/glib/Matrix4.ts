module CS580GL {
    /** A 4x4 Matrix */
    export class Matrix4 {
        /** A row-major array of matrix elements */
        elements: Float32Array = new Float32Array(16);

        /** Construct a 4x4 matrix from a row-major array of numbers */
        constructor(elements: any) {
            this.elements.set(elements);
        }

        toString(): string {
            var e = this.elements;
            return "[" + e[0] + "\t" + e[1] + "\t" + e[2] + "\t" + e[3] + ";\n" +
                e[4] + "\t" + e[5] + "\t" + e[6] + "\t" + e[7] + ";\n" +
                e[8] + "\t" + e[9] + "\t" + e[10] + "\t" + e[11] + ";\n" +
                e[12] + "\t" + e[13] + "\t" + e[14] + "\t" + e[15] + "]";
        }

        /** Clone this matrix */
        clone(): Matrix4 {
            return new Matrix4(this.elements);
        }

        /** Copy content from another matrix */
        copyFrom(other: Matrix4): Matrix4 {
            this.elements.set(other.elements);
            return this;
        }

        /** Create an identity matrix */
        static identity(): Matrix4 {
            return new Matrix4([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]);
        }

        /** Create a zero matrix */
        static zeros(): Matrix4 {
            return new Matrix4([
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0
            ]);
        }

        /** Multipy this matrix (left) to another matrix (right) */
        multiply(other: Matrix4): Matrix4 {
            var te = this.elements;
            var oe = other.elements;

            this.elements.set([
                // 1st row
                    te[0] * oe[0] + te[1] * oe[4] + te[2] * oe[8] + te[3] * oe[12],
                    te[0] * oe[1] + te[1] * oe[5] + te[2] * oe[9] + te[3] * oe[13],
                    te[0] * oe[2] + te[1] * oe[6] + te[2] * oe[10] + te[3] * oe[14],
                    te[0] * oe[3] + te[1] * oe[7] + te[2] * oe[11] + te[3] * oe[15],
                // 2nd row
                    te[4] * oe[0] + te[5] * oe[4] + te[6] * oe[8] + te[7] * oe[12],
                    te[4] * oe[1] + te[5] * oe[5] + te[6] * oe[9] + te[7] * oe[13],
                    te[4] * oe[2] + te[5] * oe[6] + te[6] * oe[10] + te[7] * oe[14],
                    te[4] * oe[3] + te[5] * oe[7] + te[6] * oe[11] + te[7] * oe[15],
                // 3rd row
                    te[8] * oe[0] + te[9] * oe[4] + te[10] * oe[8] + te[11] * oe[12],
                    te[8] * oe[1] + te[9] * oe[5] + te[10] * oe[9] + te[11] * oe[13],
                    te[8] * oe[2] + te[9] * oe[6] + te[10] * oe[10] + te[11] * oe[14],
                    te[8] * oe[3] + te[9] * oe[7] + te[10] * oe[11] + te[11] * oe[15],
                // 4th row
                    te[12] * oe[0] + te[13] * oe[4] + te[14] * oe[8] + te[15] * oe[12],
                    te[12] * oe[1] + te[13] * oe[5] + te[14] * oe[9] + te[15] * oe[13],
                    te[12] * oe[2] + te[13] * oe[6] + te[14] * oe[10] + te[15] * oe[14],
                    te[12] * oe[3] + te[13] * oe[7] + te[14] * oe[11] + te[15] * oe[15]
            ]);

            return this;
        }

        /** Multiply two matrices and return a new matrix as the result */
        static multiply(l: Matrix4, r: Matrix4): Matrix4 {
            return l.clone().multiply(r);
        }

        /** Create a new translation matrix */
        static makeTranslation(x: number, y: number, z: number): Matrix4 {
            return new Matrix4([
                1, 0, 0, x,
                0, 1, 0, y,
                0, 0, 1, z,
                0, 0, 0, 1
            ]);
        }

        /** Create a new scale matrix */
        static makeScale(x: number, y: number, z: number): Matrix4 {
            return new Matrix4([
                x, 0, 0, 0,
                0, y, 0, 0,
                0, 0, z, 0,
                0, 0, 0, 1
            ]);
        }

        /** Create a new rotation matrix for rotation around x-axis */
        static makeRotationX(theta: number): Matrix4 {
            var s = Math.sin(theta);
            var c = Math.cos(theta);
            return new Matrix4([
                1, 0, 0, 0,
                0, c, -s, 0,
                0, s, c, 0,
                0, 0, 0, 1
            ]);
        }

        /** Create a new rotation matrix for rotation around y-axis */
        static makeRotationY(theta: number): Matrix4 {
            var s = Math.sin(theta);
            var c = Math.cos(theta);
            return new Matrix4([
                c, 0, s, 0,
                0, 1, 0, 0,
                -s, 0, c, 0,
                0, 0, 0, 1
            ]);
        }

        /** Create a new rotation matrix for rotation around z-axis */
        static makeRotationZ(theta: number): Matrix4 {
            var s = Math.sin(theta);
            var c = Math.cos(theta);
            return new Matrix4([
                c, -s, 0, 0,
                s, c, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]);
        }
    }
}
