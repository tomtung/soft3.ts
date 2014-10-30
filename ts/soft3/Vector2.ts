module SOFT3 {
    /** A Vector2 object represents a 2-D Vector */
    export class Vector2 {
        constructor(public x: number = 0, public y: number = 0) {
        }

        clone(): Vector2 {
            return new Vector2(this.x, this.y);
        }

        setXY(x: number, y: number): Vector2 {
            this.x = x;
            this.y = y;
            return this;
        }

        setX(value: number): Vector2 {
            this.x = value;
            return this;
        }

        setY(value: number): Vector2 {
            this.y = value;
            return this;
        }

        copyFrom(v: Vector2): Vector2 {
            this.x = v.x;
            this.y = v.y;
            return this;
        }

        multiplyScalar(scalar: number): Vector2 {
            this.x *= scalar;
            this.y *= scalar;
            return this;
        }

        static multiplyScalar(v: Vector2, scalar: number): Vector2 {
            return v.clone().multiplyScalar(scalar);
        }

        add(other: Vector2): Vector2 {
            this.x += other.x;
            this.y += other.y;
            return this;
        }

        static add(v1: Vector2, v2: Vector2): Vector2 {
            return v1.clone().add(v2);
        }

        subtract(other: Vector2): Vector2 {
            this.x -= other.x;
            this.y -= other.y;
            return this;
        }

        static subtract(v1: Vector2, v2: Vector2): Vector2 {
            return v1.clone().subtract(v2);
        }
    }
} 
