//
// 2014 Fall - CSCI 580 3D - Graphics Rendering
// by Yubing Dong
//
/**
* The CS580GL module contains the hand-crafted 3-D rendering library.
*
* Since JavaScript and C++ are very different languages,
* sometimes the suggested C-style C++ API doesn't make sense for JavaScript.
*
* Here s a comparison table between the suggested C++ API and JavaScript API:
* - NewFrameBuffer:            the constructor of Display objects
* - NewDisplay:                the constructor of Display objects
* - FreeFrameBuffer:           unnecessary in JavaScript
* - FreeDisplay:               unncessary in JavaScript
* - ClearDisplay:              Display.prototype.reset
* - {Get|Set}DisplayPixel:     Display.prototype.pixelAt returns a PixelRef object, which supports get/set operation
* - FlushDisplayToPPMFile:     Display.prototype.toNetpbm
*
* @module CS580GL
*/
var CS580GL;
(function (CS580GL) {
    

    /** A PixelRef object is a reference to a pixel in a Display object */
    var PixelRef = (function () {
        function PixelRef(display, x, y) {
            this.display = display;
            if (x < 0 || x >= display.xres || y < 0 || y >= display.yres) {
                throw "Index out of bound.";
            }

            this.zIndex = x + y * display.xres;
            this.rIndex = 4 * this.zIndex;
            this.gIndex = this.rIndex + 1;
            this.bIndex = this.gIndex + 1;
            this.aIndex = this.bIndex + 1;
        }
        Object.defineProperty(PixelRef.prototype, "red", {
            get: function () {
                return this.display.rgbaBuffer[this.rIndex];
            },
            set: function (value) {
                this.display.rgbaBuffer[this.rIndex] = value;
            },
            enumerable: true,
            configurable: true
        });


        PixelRef.prototype.setRed = function (value) {
            this.red = value;
            return this;
        };

        Object.defineProperty(PixelRef.prototype, "green", {
            get: function () {
                return this.display.rgbaBuffer[this.gIndex];
            },
            set: function (value) {
                this.display.rgbaBuffer[this.gIndex] = value;
            },
            enumerable: true,
            configurable: true
        });


        PixelRef.prototype.setGreen = function (value) {
            this.green = value;
            return this;
        };

        Object.defineProperty(PixelRef.prototype, "blue", {
            get: function () {
                return this.display.rgbaBuffer[this.bIndex];
            },
            set: function (value) {
                this.display.rgbaBuffer[this.bIndex] = value;
            },
            enumerable: true,
            configurable: true
        });


        PixelRef.prototype.setBlue = function (value) {
            this.blue = value;
            return this;
        };

        Object.defineProperty(PixelRef.prototype, "alpha", {
            get: function () {
                return this.display.rgbaBuffer[this.aIndex];
            },
            set: function (value) {
                this.display.rgbaBuffer[this.aIndex] = value;
            },
            enumerable: true,
            configurable: true
        });


        PixelRef.prototype.setAlpha = function (value) {
            this.red = value;
            return this;
        };

        Object.defineProperty(PixelRef.prototype, "z", {
            get: function () {
                return this.display.zBuffer[this.zIndex];
            },
            set: function (value) {
                this.display.zBuffer[this.zIndex] = value;
            },
            enumerable: true,
            configurable: true
        });


        PixelRef.prototype.setZ = function (value) {
            this.z = value;
            return this;
        };
        return PixelRef;
    })();
    CS580GL.PixelRef = PixelRef;

    /**
    * A Display object represents a frame buffer,
    * which contains an array of 32-bit RGBA pixel values and a 32-bit depth value for each pixel.
    *
    * Note that the RGBA array and the Z buffer are stored separately,
    * since it is hard to efficiently use heterogenious arrays in JavaScript
    */
    var Display = (function () {
        function Display(xres, yres) {
            this.xres = xres;
            this.yres = yres;
            if (xres <= 0 || yres <= 0) {
                throw "Resolution must be positive.";
            }
            this.rgbaBuffer = new Uint8Array(xres * yres * 4);
            this.zBuffer = new Int32Array(xres * yres);
            this.reset();
        }
        /** Returns a reference to the pixel at the position specified by x and y */
        Display.prototype.pixelAt = function (x, y) {
            return new PixelRef(this, x, y);
        };

        /** Reset the entire frame buffer with the (optional) given pixel value */
        Display.prototype.reset = function (pixel) {
            if (typeof pixel === "undefined") { pixel = {
                red: 0,
                green: 0,
                blue: 0,
                alpha: 0xff,
                z: 0x7fffffff
            }; }
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
        };

        /** Flush the frame into a HTML Canvas element */
        Display.prototype.drawOnCanvas = function (canvasElem, x, y) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            var canvasContext = canvasElem.getContext("2d");
            var imageData = canvasContext.createImageData(this.xres, this.yres);
            imageData.data.set(this.rgbaBuffer);
            canvasContext.putImageData(imageData, x, y);
        };

        /** Flush the frame in the Netpbm image format (PPM) and return the result as a Blob */
        Display.prototype.toNetpbm = function () {
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
        };
        return Display;
    })();
    CS580GL.Display = Display;
})(CS580GL || (CS580GL = {}));
