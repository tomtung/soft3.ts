/// <reference path="PixelRef.ts" />

module SOFT3 {
    /**
     * A Display object represents a frame buffer,
     * which contains an array of 32-bit RGBA pixel values and a 32-bit depth value for each pixel.
     *
     * Note that the RGBA array and the Z buffer are stored separately,
     * since it is hard to efficiently use heterogeneous arrays in JavaScript
     */
    export class Display {
        rgbaBuffer: Uint8Array;
        zBuffer: Int32Array;

        static Z_MAX = 0x7fffffff;

        constructor(public width: number, public height: number) {
            if (width <= 0 || height <= 0) {
                throw "Resolution must be positive.";
            }
            this.rgbaBuffer = new Uint8Array(width * height * 4);
            this.zBuffer = new Int32Array(width * height);
            this.reset();
        }

        /** Returns a reference to the pixel at the position specified by x and y */
        pixelAt(x: number, y: number): PixelRef {
            return new PixelRef(this, x, y);
        }

        /** Reset the entire frame buffer with the (optional) given pixel value */
        reset(pixel: Pixel = new Pixel({
            redUint8: 0,
            greenUint8: 0,
            blueUint8: 0,
            alphaUint8: 0xff,
            z: Display.Z_MAX
        })): Display {
            for (var i = 0; i < this.rgbaBuffer.length; i += 4) {
                this.rgbaBuffer[i] = pixel.redUint8;
                this.rgbaBuffer[i + 1] = pixel.greenUint8;
                this.rgbaBuffer[i + 2] = pixel.blueUint8;
                this.rgbaBuffer[i + 3] = pixel.alphaUint8;
            }
            for (i = 0; i < this.zBuffer.length; i += 1) {
                this.zBuffer[i] = pixel.z;
            }
            return this;
        }

        /** Flush the frame into a HTML Canvas element */
        drawOnCanvas(canvasElem: HTMLCanvasElement, x: number = 0, y: number = 0) {
            var canvasContext = canvasElem.getContext("2d");
            var imageData = canvasContext.createImageData(this.width, this.height);
            imageData.data.set(this.rgbaBuffer);
            canvasContext.putImageData(imageData, x, y);
        }

        /** Flush the frame in the Netpbm image format (PPM) and return the result as a Blob */
        toNetpbm(): Blob {
            var result = "P3\n" + this.width + " " + this.height + "\n255\n";

            for (var i = 0, xPos = 0; i < this.rgbaBuffer.length; i += 4, xPos += 1) {
                result += this.rgbaBuffer[i] + " " + this.rgbaBuffer[i + 1] + " " + this.rgbaBuffer[i + 2];

                if (xPos + 1 === this.width) {
                    result += "\n";
                    xPos = 0;
                } else {
                    result += "\t";
                }
            }

            return new Blob([result], {type: 'image/x-portable-anymap'});
        }
    }
} 
