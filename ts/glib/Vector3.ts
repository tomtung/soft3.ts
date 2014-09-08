module CS580GL {
    /** A Vector3 object represents a 3-D Vector */
    export class Vector3 {
        constructor(
            public x: number = 0,
            public y: number = 0,
            public z: number = 0
            ) { }

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

        divideScalar(scalar: number): Vector3 {
            this.x /= scalar;
            this.y /= scalar;
            this.z /= scalar;
            return this;
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