module CS580GL {
    /** A Vector2 object represents a 2-D Vector */
    export class Vector2 {
        constructor(
            public x: number = 0,
            public y: number = 0
            ) { }

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
    }
} 