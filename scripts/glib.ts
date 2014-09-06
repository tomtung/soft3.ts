module CS580GL {
    export interface Pixel {
        red: number;
        green: number;
        blue: number;
        alpha: number;
        z: number;
    }

    // A PixelRef object is a reference to a pixel in a Display object
    export class PixelRef implements Pixel {
        zIndex: number;
        rIndex: number;
        gIndex: number;
        bIndex: number;
        aIndex: number;

        constructor(public display: Display, x: number, y: number) {
            if (x < 0 || x >= display.xres || y < 0 || y >= display.yres) {
                throw "Index out of bound.";
            }

            this.zIndex = x + y * display.xres;
            this.rIndex = 4 * this.zIndex;
            this.gIndex = this.rIndex + 1;
            this.bIndex = this.gIndex + 1;
            this.aIndex = this.bIndex + 1;
        }

        get red(): number {
            return this.display.rgbaBuffer[this.rIndex];
        }

        set red(value: number) {
            this.display.rgbaBuffer[this.rIndex] = value;
        }

        setRed(value: number): PixelRef {
            this.red = value;
            return this;
        }

        get green(): number {
            return this.display.rgbaBuffer[this.gIndex];
        }

        set green(value: number) {
            this.display.rgbaBuffer[this.gIndex] = value;
        }

        setGreen(value: number): PixelRef {
            this.green = value;
            return this;
        }

        get blue(): number {
            return this.display.rgbaBuffer[this.bIndex];
        }

        set blue(value: number) {
            this.display.rgbaBuffer[this.bIndex] = value;
        }

        setBlue(value: number): PixelRef {
            this.blue = value;
            return this;
        }

        get alpha(): number {
            return this.display.rgbaBuffer[this.aIndex];
        }

        set alpha(value: number) {
            this.display.rgbaBuffer[this.aIndex] = value;
        }

        setAlpha(value: number): PixelRef {
            this.red = value;
            return this;
        }

        get z(): number {
            return this.display.zBuffer[this.zIndex];
        }

        set z(value: number) {
            this.display.zBuffer[this.zIndex] = value;
        }

        setZ(value: number): PixelRef {
            this.z = value;
            return this;
        }
    }

    export class Display {
        rgbaBuffer: Uint8Array;
        zBuffer: Int32Array;

        constructor(public xres: number, public yres: number) {
            if (xres <= 0 || yres <= 0) {
                throw "Resolution must be positive.";
            }
            this.rgbaBuffer = new Uint8Array(xres * yres * 4);
            this.zBuffer = new Int32Array(xres * yres);
            this.reset();
        }

        pixelAt(x: number, y: number): PixelRef {
            return new PixelRef(this, x, y);
        }

        reset(pixel: Pixel = {
            red: 0,
            green: 0,
            blue: 0,
            alpha: 0xff,
            z: 0x7fffffff
        }): Display {
            for (var i = 0; i < this.rgbaBuffer.length; i += 4) {
                this.rgbaBuffer[i] = pixel.red;
                this.rgbaBuffer[i + 1] = pixel.green;
                this.rgbaBuffer[i + 2] = pixel.blue;
                this.rgbaBuffer[i + 3] = pixel.alpha;
            }
            for (i = 0; i < this.zBuffer.length; i += 1) {
                this.zBuffer[i] = pixel.z;
            }
            return this;
        }

        drawOnCanvas(canvasElem: HTMLCanvasElement, x: number = 0, y: number = 0) {
            var canvasContext = canvasElem.getContext("2d");
            var imageData = canvasContext.createImageData(this.xres, this.yres);
            imageData.data.set(this.rgbaBuffer);
            canvasContext.putImageData(imageData, x, y);
        }

        toNetpbm(): Blob {
            var result = "P3\n" + this.xres + " " + this.yres + "\n255\n";

            for (var i = 0, xPos = 0; i < this.rgbaBuffer.length; i += 4, xPos += 1) {
                result += this.rgbaBuffer[i] + " " + this.rgbaBuffer[i + 1] + " " + this.rgbaBuffer[i + 2];

                if (xPos + 1 === this.xres) {
                    result += "\n";
                    xPos = 0;
                } else {
                    result += "\t";
                }
            }

            return new Blob([result], { type: 'image/x-portable-anymap' });
        }
    }
}
