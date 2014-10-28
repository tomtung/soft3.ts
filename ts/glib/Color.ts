/// <reference path="utils.ts" />

module CS580GL {
    /** A Color object represents a color. */
    export class Color {
        constructor(//
        /** Red channel value between 0 and 1. Default is 1. */
        public red: number = 1, //
        //
        /** Green channel value between 0 and 1. Default is 1. */
        public green: number = 1,//
        //
        /** Blue channel value between 0 and 1. Default is 1. */
        public blue: number = 1) {
        }


        clone(): Color {
            return new Color(this.red, this.green, this.blue)
        }

        setRGB(red: number, green: number, blue: number): Color {
            this.red = red;
            this.green = green;
            this.blue = blue;
            return this;
        }

        setRGBUint8(redUint8: number, greenUint8: number, blueUint8: number): Color {
            this.red = redUint8 / 255;
            this.green = greenUint8 / 255;
            this.blue = blueUint8 / 255;
            return this;
        }

        static fromRGBUint8(redUint8: number, greenUint8: number, blueUint8: number): Color {
            return new Color().setRGBUint8(redUint8, greenUint8, blueUint8);
        }

        static channelValueToUint8(value: number): number {
            return Math.round(clamp(value * 255, 0, 255));
        }

        setRed(value: number): Color {
            this.red = value;
            return this;
        }

        get redUint8(): number {
            return Color.channelValueToUint8(this.red);
        }

        set redUint8(value: number) {
            this.red = value / 255;
        }

        setRedUint8(value: number): Color {
            this.redUint8 = value;
            return this;
        }

        setGreen(value: number): Color {
            this.green = value;
            return this;
        }

        get greenUint8(): number {
            return Color.channelValueToUint8(this.green);
        }

        set greenUint8(value: number) {
            this.green = value / 255;
        }

        setGreenUint8(value: number): Color {
            this.greenUint8 = value;
            return this;
        }

        setBlue(value: number): Color {
            this.blue = value;
            return this;
        }

        get blueUint8(): number {
            return Color.channelValueToUint8(this.blue);
        }

        set blueUint8(value: number) {
            this.blue = value / 255;
        }

        setBlueUint8(value: number): Color {
            this.blueUint8 = value;
            return this;
        }

        multiply(other: Color): Color {
            this.red *= other.red;
            this.green *= other.green;
            this.blue *= other.blue;
            return this;
        }

        static multiply(c1: Color, c2: Color): Color {
            return c1.clone().multiply(c2);
        }

        multiplyScalar(scalar: number): Color {
            this.red = this.red * scalar;
            this.green = this.green * scalar;
            this.blue = this.blue * scalar;
            return this;
        }

        static multiplyScalar(color: Color, scalar: number): Color {
            return color.clone().multiplyScalar(scalar);
        }

        getHex(): number {
            return (this.redUint8 << 16) | (this.greenUint8 << 8) | this.blueUint8;
        }

        getHexString(): string {
            // Smart implementation borrowed from three.js
            return ("000000" + this.getHex().toString(16)).slice(-6);
        }

        clamp(): Color {
            this.red = clamp(this.red, 0, 1);
            this.green = clamp(this.green, 0, 1);
            this.blue = clamp(this.blue, 0, 1);
            return this;
        }

        static clamp(color: Color): Color {
            return color.clone().clamp();
        }

        add(other: Color): Color {
            this.red += other.red;
            this.green += other.green;
            this.blue += other.blue;
            return this;
        }

        static add(c1: Color, c2: Color): Color {
            return c1.clone().add(c2);
        }

        subtract(other: Color): Color {
            this.red -= other.red;
            this.green -= other.green;
            this.blue -= other.blue;
            return this;
        }

        static subtract(c1: Color, c2: Color): Color {
            return c1.clone().subtract(c2);
        }
    }
}
