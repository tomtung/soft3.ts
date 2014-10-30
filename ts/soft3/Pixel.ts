/// <reference path="Color.ts" />

module SOFT3 {
    /** A Pixel object represents a pixel with RGBA color and depth information. */
    export class Pixel {
        redUint8: number;
        greenUint8: number;
        blueUint8: number;
        alphaUint8: number;
        z: number;

        constructor(pixelValue: any = {}) {
            this.redUint8 = pixelValue.redUint8 || 0;
            this.greenUint8 = pixelValue.greenUint8 || 0;
            this.blueUint8 = pixelValue.blueUint8 || 0;
            this.alphaUint8 = pixelValue.alphaUint8 || 0xff;
            this.z = pixelValue.z || 0x7fffffff;
        }

        setRedUint8(value: number): Pixel {
            this.redUint8 = value;
            return this;
        }

        setGreenUint8(value: number): Pixel {
            this.greenUint8 = value;
            return this;
        }

        setBlueUint8(value: number): Pixel {
            this.blueUint8 = value;
            return this;
        }

        setAlphaUint8(value: number): Pixel {
            this.redUint8 = value;
            return this;
        }

        setZ(value: number): Pixel {
            this.z = value;
            return this;
        }

        copyFrom(that: Pixel): Pixel {
            this.redUint8 = that.redUint8;
            this.greenUint8 = that.greenUint8;
            this.blueUint8 = that.blueUint8;
            this.alphaUint8 = that.alphaUint8;
            this.z = that.z;
            return this;
        }

        setColor(color: Color): Pixel {
            this.redUint8 = color.redUint8;
            this.greenUint8 = color.greenUint8;
            this.blueUint8 = color.blueUint8;
            this.alphaUint8 = 0xff;
            return this;
        }
    }
}
