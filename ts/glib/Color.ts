module CS580GL {
	/** A Color object represents a color. */
    export class Color {
        constructor(
            //
            /** Red channel value between 0 and 1. Default is 1. */
            public red: number = 1,
            //
            /** Red channel value between 0 and 1. Default is 1. */
            public green: number = 1,
            //
            /** Red channel value between 0 and 1. Default is 1. */
            public blue: number = 1
        ) { }

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

        multiplyScalar(scalar: number): Color {
            this.red = this.red * scalar;
            this.green = this.green * scalar;
            this.blue = this.blue * scalar;
            return this;
        }

        getHex(): number {
            return (this.redUint8 << 16) | (this.greenUint8 << 8) | this.blueUint8;
        }

        getHexString(): string {
            // Smart implementatin borrowed from three.js
            return ("000000" + this.getHex().toString(16)).slice(-6);
        }
    }
}
