/// <reference path="Pixel.ts" />
/// <reference path="Display.ts" />
/// <reference path="utils.ts" />

module SOFT3 {
    /** A PixelRef object is a reference to a pixel in a Display object. */
    export class PixelRef implements Pixel {
        zIndex: number;
        rIndex: number;
        gIndex: number;
        bIndex: number;
        aIndex: number;

        constructor(public display: Display, x: number, y: number) {
            if (x < 0 || x >= display.width || y < 0 || y >= display.height) {
                throw "Index out of bound.";
            }

            this.zIndex = x + y * display.width;
            this.rIndex = 4 * this.zIndex;
            this.gIndex = this.rIndex + 1;
            this.bIndex = this.gIndex + 1;
            this.aIndex = this.bIndex + 1;
        }

        get redUint8(): number {
            return this.display.rgbaBuffer[this.rIndex];
        }

        set redUint8(value: number) {
            this.display.rgbaBuffer[this.rIndex] = value;
        }

        get greenUint8(): number {
            return this.display.rgbaBuffer[this.gIndex];
        }

        set greenUint8(value: number) {
            this.display.rgbaBuffer[this.gIndex] = value;
        }

        get blueUint8(): number {
            return this.display.rgbaBuffer[this.bIndex];
        }

        set blueUint8(value: number) {
            this.display.rgbaBuffer[this.bIndex] = value;
        }

        get alphaUint8(): number {
            return this.display.rgbaBuffer[this.aIndex];
        }

        set alphaUint8(value: number) {
            this.display.rgbaBuffer[this.aIndex] = value;
        }

        get z(): number {
            return this.display.zBuffer[this.zIndex];
        }

        set z(value: number) {
            this.display.zBuffer[this.zIndex] = value;
        }

        // Mixin methods from Pixel
        setRedUint8: (number) => Pixel;
        setGreenUint8: (number) => Pixel;
        setBlueUint8: (number) => Pixel;
        setAlphaUint8: (number) => Pixel;
        setZ: (number) => Pixel;
        copyFrom: (Pixel) => Pixel;
        setColor: (Color) => Pixel;
    }

    applyMixins(PixelRef, [Pixel]);
} 
