/// <reference path="Matrix4.ts" />

module CS580GL {
    /** A Vector3 object represents a 3-D Vector */
    export class Vector3 {
        constructor(public x: number = 0, public y: number = 0, public z: number = 0) {
        }

        setXYZ(x: number, y: number, z: number): Vector3 {
            this.x = x;
            this.y = y;
            this.z = z;
            return this;
        }

        setX(value: number): Vector3 {
            this.x = value;
            return this;
        }

        setY(value: number): Vector3 {
            this.y = value;
            return this;
        }

        setZ(value: number): Vector3 {
            this.z = value;
            return this;
        }

        copyFrom(v: Vector3): Vector3 {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
            return this;
        }

        dot(v: Vector3): number {
            return this.x * v.x + this.y * v.y + this.z * v.z;
        }

        static dot(v1: Vector3, v2: Vector3): number {
            return v1.clone().dot(v2);
        }

        add(v: Vector3): Vector3 {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
            return this;
        }

        static add(v1: Vector3, v2: Vector3) {
            return v1.clone().add(v2);
        }

        subtract(v: Vector3): Vector3 {
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;
            return this;
        }

        static subtract(v1: Vector3, v2: Vector3) {
            return v1.clone().subtract(v2);
        }

        cross(other: Vector3): Vector3 {
            return this.setXYZ(
                    this.y * other.z - this.z * other.y,
                    this.z * other.x - this.x * other.z,
                    this.x * other.y - this.y * other.x
            );
        }

        static cross(v1: Vector3, v2: Vector3): Vector3 {
            return v1.clone().cross(v2);
        }

        divideScalar(scalar: number): Vector3 {
            var scalarInv = 1 / scalar;
            this.x *= scalarInv;
            this.y *= scalarInv;
            this.z *= scalarInv;
            return this;
        }

        /**
         * Convert this vector to homogeneous coordinates (by appending a forth dimension with value 1),
         * apply the matrix, and convert back to non-homogeneous coordinates
         */
        applyAsHomogeneous(matrix: Matrix4): Vector3 {
            var e = matrix.elements;
            var wInv = 1 / (e[12] * this.x + e[13] * this.y + e[14] * this.z + e[15]);
            return this.setXYZ(
                    wInv * (e[0] * this.x + e[1] * this.y + e[2] * this.z + e[3]),
                    wInv * (e[4] * this.x + e[5] * this.y + e[6] * this.z + e[7]),
                    wInv * (e[8] * this.x + e[9] * this.y + e[10] * this.z + e[11])
            );
        }

        lengthSq(): number {
            return this.x * this.x + this.y * this.y + this.z * this.z;
        }

        length(): number {
            return Math.sqrt(this.lengthSq());
        }

        normalize(): Vector3 {
            return this.divideScalar(this.length());
        }

        clone(): Vector3 {
            return new CS580GL.Vector3(this.x, this.y, this.z);
        }
    }
}
