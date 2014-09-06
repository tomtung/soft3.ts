//
// 2014 Fall - CSCI 580 3D - Graphics Rendering
// by Yubing Dong
//
var __applyMixins = this.__applyMixins || function (derivedCtor, baseCtors) {
    baseCtors.forEach(function (baseCtor) {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
};

/**
* The CS580GL module contains the hand-crafted 3-D rendering library.
*
* Since JavaScript and C++ are very different languages,
* sometimes the suggested C-style C++ API doesn't make sense for JavaScript.
*
* Here's a comparison table between the suggested C++ API and JavaScript API:
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
    /** A simple utility function for clamping numbers */
    function clamp(num, min, max) {
        if (num < min) {
            return min;
        } else if (num > max) {
            return max;
        } else {
            return num;
        }
    }
    CS580GL.clamp = clamp;

    /** A Color object represents a color. */
    var Color = (function () {
        function Color(//
        /** Red channel value between 0 and 1. Default is 1. */
        red, //
        /** Red channel value between 0 and 1. Default is 1. */
        green, //
        /** Red channel value between 0 and 1. Default is 1. */
        blue) {
            if (typeof red === "undefined") { red = 1; }
            if (typeof green === "undefined") { green = 1; }
            if (typeof blue === "undefined") { blue = 1; }
            this.red = red;
            this.green = green;
            this.blue = blue;
        }
        Color.prototype.setRGB = function (red, green, blue) {
            this.red = red;
            this.green = green;
            this.blue = blue;
            return this;
        };

        Color.prototype.setRGBUint8 = function (redUint8, greenUint8, blueUint8) {
            this.red = redUint8 / 255;
            this.green = greenUint8 / 255;
            this.blue = blueUint8 / 255;
            return this;
        };

        Color.fromRGBUint8 = function (redUint8, greenUint8, blueUint8) {
            return new Color().setRGBUint8(redUint8, greenUint8, blueUint8);
        };

        Color.prototype.setRed = function (value) {
            this.red = value;
            return this;
        };

        Object.defineProperty(Color.prototype, "redUint8", {
            get: function () {
                return this.red * 255;
            },
            set: function (value) {
                this.red = value / 255;
            },
            enumerable: true,
            configurable: true
        });


        Color.prototype.setRedUint8 = function (value) {
            this.redUint8 = value;
            return this;
        };

        Color.prototype.setGreen = function (value) {
            this.green = value;
            return this;
        };

        Object.defineProperty(Color.prototype, "greenUint8", {
            get: function () {
                return this.green * 255;
            },
            set: function (value) {
                this.green = value / 255;
            },
            enumerable: true,
            configurable: true
        });


        Color.prototype.setGreenUint8 = function (value) {
            this.greenUint8 = value;
            return this;
        };

        Color.prototype.setBlue = function (value) {
            this.blue = value;
            return this;
        };

        Object.defineProperty(Color.prototype, "blueUint8", {
            get: function () {
                return this.blue * 255;
            },
            set: function (value) {
                this.blue = value / 255;
            },
            enumerable: true,
            configurable: true
        });


        Color.prototype.setBlueUint8 = function (value) {
            this.blueUint8 = value;
            return this;
        };
        return Color;
    })();
    CS580GL.Color = Color;

    /** A Pixel object represents a pixel with RGBA color and depth information. */
    var Pixel = (function () {
        function Pixel() {
            this.redUint8 = 0;
            this.greenUint8 = 0;
            this.blueUint8 = 0;
            this.alphaUint8 = 0xff;
            this.z = 0x7fffffff;
        }
        Pixel.prototype.setRedUint8 = function (value) {
            this.redUint8 = value;
            return this;
        };

        Pixel.prototype.setGreenUint8 = function (value) {
            this.greenUint8 = value;
            return this;
        };

        Pixel.prototype.setBlueUint8 = function (value) {
            this.blueUint8 = value;
            return this;
        };

        Pixel.prototype.setAlphaUint8 = function (value) {
            this.redUint8 = value;
            return this;
        };

        Pixel.prototype.setZ = function (value) {
            this.z = value;
            return this;
        };

        Pixel.prototype.copyFrom = function (that) {
            this.redUint8 = that.redUint8;
            this.greenUint8 = that.greenUint8;
            this.blueUint8 = that.blueUint8;
            this.alphaUint8 = that.alphaUint8;
            this.z = that.z;
            return this;
        };

        Pixel.prototype.setColor = function (color) {
            this.redUint8 = color.redUint8;
            this.greenUint8 = color.redUint8;
            this.blueUint8 = color.blueUint8;
            this.alphaUint8 = 0xff;
            return this;
        };
        return Pixel;
    })();
    CS580GL.Pixel = Pixel;

    /** A PixelRef object is a reference to a pixel in a Display object. */
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
        Object.defineProperty(PixelRef.prototype, "redUint8", {
            get: function () {
                return this.display.rgbaBuffer[this.rIndex];
            },
            set: function (value) {
                this.display.rgbaBuffer[this.rIndex] = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(PixelRef.prototype, "greenUint8", {
            get: function () {
                return this.display.rgbaBuffer[this.gIndex];
            },
            set: function (value) {
                this.display.rgbaBuffer[this.gIndex] = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(PixelRef.prototype, "blueUint8", {
            get: function () {
                return this.display.rgbaBuffer[this.bIndex];
            },
            set: function (value) {
                this.display.rgbaBuffer[this.bIndex] = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(PixelRef.prototype, "alphaUint8", {
            get: function () {
                return this.display.rgbaBuffer[this.aIndex];
            },
            set: function (value) {
                this.display.rgbaBuffer[this.aIndex] = value;
            },
            enumerable: true,
            configurable: true
        });


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

        return PixelRef;
    })();
    CS580GL.PixelRef = PixelRef;

    __applyMixins(PixelRef, [Pixel]);

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
                redUint8: 0,
                greenUint8: 0,
                blueUint8: 0,
                alphaUint8: 0xff,
                z: 0x7fffffff
            }; }
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

    /** A Vector3 object represents a 3-D Vector */
    var Vector3 = (function () {
        function Vector3(x, y, z) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof z === "undefined") { z = 0; }
            this.x = x;
            this.y = y;
            this.z = z;
        }
        Vector3.prototype.setXYZ = function (x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
            return this;
        };

        Vector3.prototype.setX = function (value) {
            this.x = value;
            return this;
        };

        Vector3.prototype.setY = function (value) {
            this.y = value;
            return this;
        };

        Vector3.prototype.setZ = function (value) {
            this.z = value;
            return this;
        };

        Vector3.prototype.copyFrom = function (v) {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
            return this;
        };

        Vector3.prototype.dot = function (v) {
            return this.x * v.x + this.y * v.y + this.z * v.z;
        };

        Vector3.prototype.divideScalar = function (scalar) {
            this.x /= scalar;
            this.y /= scalar;
            this.z /= scalar;
            return this;
        };

        Vector3.prototype.lengthSq = function () {
            return this.x * this.x + this.y * this.y + this.z * this.z;
        };

        Vector3.prototype.length = function () {
            return Math.sqrt(this.lengthSq());
        };

        Vector3.prototype.normalize = function () {
            return this.divideScalar(this.length());
        };

        Vector3.prototype.clone = function () {
            return new CS580GL.Vector3(this.x, this.y, this.z);
        };
        return Vector3;
    })();
    CS580GL.Vector3 = Vector3;

    /** A Vector2 object represents a 2-D Vector */
    var Vector2 = (function () {
        function Vector2(x, y) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            this.x = x;
            this.y = y;
        }
        Vector2.prototype.setXY = function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        };

        Vector2.prototype.setX = function (value) {
            this.x = value;
            return this;
        };

        Vector2.prototype.setY = function (value) {
            this.y = value;
            return this;
        };

        Vector2.prototype.copyFrom = function (v) {
            this.x = v.x;
            this.y = v.y;
            return this;
        };
        return Vector2;
    })();
    CS580GL.Vector2 = Vector2;
})(CS580GL || (CS580GL = {}));
