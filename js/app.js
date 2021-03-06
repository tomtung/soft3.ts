﻿var SOFT3;
(function (SOFT3) {
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
    SOFT3.clamp = clamp;

    function applyMixins(derivedConstructor, baseConstructors) {
        baseConstructors.forEach(function (baseConstructor) {
            Object.getOwnPropertyNames(baseConstructor.prototype).forEach(function (name) {
                derivedConstructor.prototype[name] = baseConstructor.prototype[name];
            });
        });
    }
    SOFT3.applyMixins = applyMixins;

    function floatEq(x, y) {
        return Math.abs(x - y) < 1e-6;
    }
    SOFT3.floatEq = floatEq;
})(SOFT3 || (SOFT3 = {}));
/// <reference path="utils.ts" />
var SOFT3;
(function (SOFT3) {
    /** A Color object represents a color. */
    var Color = (function () {
        function Color(/** Red channel value between 0 and 1. Default is 1. */
        red, //
        /** Green channel value between 0 and 1. Default is 1. */
        green, //
        /** Blue channel value between 0 and 1. Default is 1. */
        blue) {
            if (typeof red === "undefined") { red = 1; }
            if (typeof green === "undefined") { green = 1; }
            if (typeof blue === "undefined") { blue = 1; }
            this.red = red;
            this.green = green;
            this.blue = blue;
        }
        Color.prototype.clone = function () {
            return new Color(this.red, this.green, this.blue);
        };

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

        Color.channelValueToUint8 = function (value) {
            return Math.round(SOFT3.clamp(value * 255, 0, 255));
        };

        Color.prototype.setRed = function (value) {
            this.red = value;
            return this;
        };

        Object.defineProperty(Color.prototype, "redUint8", {
            get: function () {
                return Color.channelValueToUint8(this.red);
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
                return Color.channelValueToUint8(this.green);
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
                return Color.channelValueToUint8(this.blue);
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

        Color.prototype.multiply = function (other) {
            this.red *= other.red;
            this.green *= other.green;
            this.blue *= other.blue;
            return this;
        };

        Color.multiply = function (c1, c2) {
            return c1.clone().multiply(c2);
        };

        Color.prototype.multiplyScalar = function (scalar) {
            this.red = this.red * scalar;
            this.green = this.green * scalar;
            this.blue = this.blue * scalar;
            return this;
        };

        Color.multiplyScalar = function (color, scalar) {
            return color.clone().multiplyScalar(scalar);
        };

        Color.prototype.getHex = function () {
            return (this.redUint8 << 16) | (this.greenUint8 << 8) | this.blueUint8;
        };

        Color.prototype.getHexString = function () {
            // Smart implementation borrowed from three.js
            return ("000000" + this.getHex().toString(16)).slice(-6);
        };

        Color.prototype.clamp = function () {
            this.red = SOFT3.clamp(this.red, 0, 1);
            this.green = SOFT3.clamp(this.green, 0, 1);
            this.blue = SOFT3.clamp(this.blue, 0, 1);
            return this;
        };

        Color.clamp = function (color) {
            return color.clone().clamp();
        };

        Color.prototype.add = function (other) {
            this.red += other.red;
            this.green += other.green;
            this.blue += other.blue;
            return this;
        };

        Color.add = function (c1, c2) {
            return c1.clone().add(c2);
        };

        Color.prototype.subtract = function (other) {
            this.red -= other.red;
            this.green -= other.green;
            this.blue -= other.blue;
            return this;
        };

        Color.subtract = function (c1, c2) {
            return c1.clone().subtract(c2);
        };
        return Color;
    })();
    SOFT3.Color = Color;
})(SOFT3 || (SOFT3 = {}));
/// <reference path="Color.ts" />
var SOFT3;
(function (SOFT3) {
    /** A Pixel object represents a pixel with RGBA color and depth information. */
    var Pixel = (function () {
        function Pixel(pixelValue) {
            if (typeof pixelValue === "undefined") { pixelValue = {}; }
            this.redUint8 = pixelValue.redUint8 || 0;
            this.greenUint8 = pixelValue.greenUint8 || 0;
            this.blueUint8 = pixelValue.blueUint8 || 0;
            this.alphaUint8 = pixelValue.alphaUint8 || 0xff;
            this.z = pixelValue.z || 0x7fffffff;
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
            this.greenUint8 = color.greenUint8;
            this.blueUint8 = color.blueUint8;
            this.alphaUint8 = 0xff;
            return this;
        };
        return Pixel;
    })();
    SOFT3.Pixel = Pixel;
})(SOFT3 || (SOFT3 = {}));
/// <reference path="Pixel.ts" />
/// <reference path="Display.ts" />
/// <reference path="utils.ts" />
var SOFT3;
(function (SOFT3) {
    /** A PixelRef object is a reference to a pixel in a Display object. */
    var PixelRef = (function () {
        function PixelRef(display, x, y) {
            this.display = display;
            if (x < 0 || x >= display.width || y < 0 || y >= display.height) {
                throw "Index out of bound.";
            }

            this.zIndex = x + y * display.width;
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
    SOFT3.PixelRef = PixelRef;

    SOFT3.applyMixins(PixelRef, [SOFT3.Pixel]);
})(SOFT3 || (SOFT3 = {}));
/// <reference path="PixelRef.ts" />
var SOFT3;
(function (SOFT3) {
    /**
    * A Display object represents a frame buffer,
    * which contains an array of 32-bit RGBA pixel values and a 32-bit depth value for each pixel.
    *
    * Note that the RGBA array and the Z buffer are stored separately,
    * since it is hard to efficiently use heterogeneous arrays in JavaScript
    */
    var Display = (function () {
        function Display(width, height) {
            this.width = width;
            this.height = height;
            if (width <= 0 || height <= 0) {
                throw "Resolution must be positive.";
            }
            this.rgbaBuffer = new Uint8Array(width * height * 4);
            this.zBuffer = new Int32Array(width * height);
            this.reset();
        }
        /** Returns a reference to the pixel at the position specified by x and y */
        Display.prototype.pixelAt = function (x, y) {
            return new SOFT3.PixelRef(this, x, y);
        };

        /** Reset the entire frame buffer with the (optional) given pixel value */
        Display.prototype.reset = function (pixel) {
            if (typeof pixel === "undefined") { pixel = new SOFT3.Pixel({
                redUint8: 0,
                greenUint8: 0,
                blueUint8: 0,
                alphaUint8: 0xff,
                z: Display.Z_MAX
            }); }
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
            var imageData = canvasContext.createImageData(this.width, this.height);
            imageData.data.set(this.rgbaBuffer);
            canvasContext.putImageData(imageData, x, y);
        };

        /** Flush the frame in the Netpbm image format (PPM) and return the result as a Blob */
        Display.prototype.toNetpbm = function () {
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

            return new Blob([result], { type: 'image/x-portable-anymap' });
        };
        Display.Z_MAX = 0x7fffffff;
        return Display;
    })();
    SOFT3.Display = Display;
})(SOFT3 || (SOFT3 = {}));
var SOFT3;
(function (SOFT3) {
    /** A 4x4 Matrix */
    var Matrix4 = (function () {
        /** Construct a 4x4 matrix from a row-major array of numbers */
        function Matrix4(elements) {
            /** A row-major array of matrix elements */
            this.elements = new Float32Array(16);
            this.elements.set(elements);
        }
        Matrix4.prototype.toString = function () {
            var e = this.elements;
            return "[" + e[0] + "\t" + e[1] + "\t" + e[2] + "\t" + e[3] + ";\n" + e[4] + "\t" + e[5] + "\t" + e[6] + "\t" + e[7] + ";\n" + e[8] + "\t" + e[9] + "\t" + e[10] + "\t" + e[11] + ";\n" + e[12] + "\t" + e[13] + "\t" + e[14] + "\t" + e[15] + "]";
        };

        /** Clone this matrix */
        Matrix4.prototype.clone = function () {
            return new Matrix4(this.elements);
        };

        /** Copy content from another matrix */
        Matrix4.prototype.copyFrom = function (other) {
            this.elements.set(other.elements);
            return this;
        };

        /** Create an identity matrix */
        Matrix4.identity = function () {
            return new Matrix4([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]);
        };

        /** Create a zero matrix */
        Matrix4.zeros = function () {
            return new Matrix4([
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0
            ]);
        };

        /** Multipy this matrix (left) to another matrix (right) */
        Matrix4.prototype.multiply = function (other) {
            var te = this.elements;
            var oe = other.elements;

            this.elements.set([
                te[0] * oe[0] + te[1] * oe[4] + te[2] * oe[8] + te[3] * oe[12],
                te[0] * oe[1] + te[1] * oe[5] + te[2] * oe[9] + te[3] * oe[13],
                te[0] * oe[2] + te[1] * oe[6] + te[2] * oe[10] + te[3] * oe[14],
                te[0] * oe[3] + te[1] * oe[7] + te[2] * oe[11] + te[3] * oe[15],
                te[4] * oe[0] + te[5] * oe[4] + te[6] * oe[8] + te[7] * oe[12],
                te[4] * oe[1] + te[5] * oe[5] + te[6] * oe[9] + te[7] * oe[13],
                te[4] * oe[2] + te[5] * oe[6] + te[6] * oe[10] + te[7] * oe[14],
                te[4] * oe[3] + te[5] * oe[7] + te[6] * oe[11] + te[7] * oe[15],
                te[8] * oe[0] + te[9] * oe[4] + te[10] * oe[8] + te[11] * oe[12],
                te[8] * oe[1] + te[9] * oe[5] + te[10] * oe[9] + te[11] * oe[13],
                te[8] * oe[2] + te[9] * oe[6] + te[10] * oe[10] + te[11] * oe[14],
                te[8] * oe[3] + te[9] * oe[7] + te[10] * oe[11] + te[11] * oe[15],
                te[12] * oe[0] + te[13] * oe[4] + te[14] * oe[8] + te[15] * oe[12],
                te[12] * oe[1] + te[13] * oe[5] + te[14] * oe[9] + te[15] * oe[13],
                te[12] * oe[2] + te[13] * oe[6] + te[14] * oe[10] + te[15] * oe[14],
                te[12] * oe[3] + te[13] * oe[7] + te[14] * oe[11] + te[15] * oe[15]
            ]);

            return this;
        };

        /** Multiply two matrices and return a new matrix as the result */
        Matrix4.multiply = function (l, r) {
            return l.clone().multiply(r);
        };

        /** Create a new translation matrix */
        Matrix4.makeTranslation = function (x, y, z) {
            return new Matrix4([
                1, 0, 0, x,
                0, 1, 0, y,
                0, 0, 1, z,
                0, 0, 0, 1
            ]);
        };

        /** Create a new scale matrix */
        Matrix4.makeScale = function (x, y, z) {
            return new Matrix4([
                x, 0, 0, 0,
                0, y, 0, 0,
                0, 0, z, 0,
                0, 0, 0, 1
            ]);
        };

        /** Create a new rotation matrix for rotation around x-axis */
        Matrix4.makeRotationX = function (theta) {
            var s = Math.sin(theta);
            var c = Math.cos(theta);
            return new Matrix4([
                1, 0, 0, 0,
                0, c, -s, 0,
                0, s, c, 0,
                0, 0, 0, 1
            ]);
        };

        /** Create a new rotation matrix for rotation around y-axis */
        Matrix4.makeRotationY = function (theta) {
            var s = Math.sin(theta);
            var c = Math.cos(theta);
            return new Matrix4([
                c, 0, s, 0,
                0, 1, 0, 0,
                -s, 0, c, 0,
                0, 0, 0, 1
            ]);
        };

        /** Create a new rotation matrix for rotation around z-axis */
        Matrix4.makeRotationZ = function (theta) {
            var s = Math.sin(theta);
            var c = Math.cos(theta);
            return new Matrix4([
                c, -s, 0, 0,
                s, c, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]);
        };
        return Matrix4;
    })();
    SOFT3.Matrix4 = Matrix4;
})(SOFT3 || (SOFT3 = {}));
/// <reference path="Matrix4.ts" />
var SOFT3;
(function (SOFT3) {
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

        Vector3.dot = function (v1, v2) {
            return v1.clone().dot(v2);
        };

        Vector3.prototype.add = function (v) {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
            return this;
        };

        Vector3.add = function (v1, v2) {
            return v1.clone().add(v2);
        };

        Vector3.prototype.subtract = function (v) {
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;
            return this;
        };

        Vector3.subtract = function (v1, v2) {
            return v1.clone().subtract(v2);
        };

        Vector3.prototype.cross = function (other) {
            return this.setXYZ(this.y * other.z - this.z * other.y, this.z * other.x - this.x * other.z, this.x * other.y - this.y * other.x);
        };

        Vector3.cross = function (v1, v2) {
            return v1.clone().cross(v2);
        };

        Vector3.prototype.multiplyScalar = function (scalar) {
            this.x *= scalar;
            this.y *= scalar;
            this.z *= scalar;
            return this;
        };

        Vector3.multiplyScalar = function (vec, scalar) {
            return vec.clone().multiplyScalar(scalar);
        };

        Vector3.prototype.divideScalar = function (scalar) {
            return this.multiplyScalar(1 / scalar);
        };

        Vector3.divideScalar = function (vec, scalar) {
            return Vector3.multiplyScalar(vec, 1 / scalar);
        };

        Vector3.prototype.negate = function () {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            return this;
        };

        /**
        * Convert this vector to homogeneous coordinates (by appending a forth dimension with value 1),
        * apply the matrix, and convert back to non-homogeneous coordinates
        */
        Vector3.prototype.applyAsHomogeneous = function (matrix) {
            var e = matrix.elements;
            var wInv = 1 / (e[12] * this.x + e[13] * this.y + e[14] * this.z + e[15]);
            return this.setXYZ(wInv * (e[0] * this.x + e[1] * this.y + e[2] * this.z + e[3]), wInv * (e[4] * this.x + e[5] * this.y + e[6] * this.z + e[7]), wInv * (e[8] * this.x + e[9] * this.y + e[10] * this.z + e[11]));
        };

        /**
        * Transforms the direction of this vector by the 3 x 3 subset of the matrix, and then normalizes the result.
        * @param matrix
        */
        Vector3.prototype.transformDirection = function (matrix) {
            var e = matrix.elements;
            return this.setXYZ(e[0] * this.x + e[1] * this.y + e[2] * this.z, e[4] * this.x + e[5] * this.y + e[6] * this.z, e[8] * this.x + e[9] * this.y + e[10] * this.z).normalize();
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
            return new SOFT3.Vector3(this.x, this.y, this.z);
        };
        return Vector3;
    })();
    SOFT3.Vector3 = Vector3;
})(SOFT3 || (SOFT3 = {}));
/// <reference path="Vector3.ts" />
/// <reference path="Matrix4.ts" />
var SOFT3;
(function (SOFT3) {
    /** A camera with perspective projection. The aspect ratio is always assumed to be 1. */
    var Camera = (function () {
        function Camera(parameters) {
            /** The look-at matrix, which does both translation and rotation. */
            this.lookAtMatrix = SOFT3.Matrix4.zeros();
            /** The perspective matrix. Note that z will be scaled into range [0, 1] */
            this.perspectiveMatrix = SOFT3.Matrix4.zeros();
            this.position = parameters.position;
            this.lookAtTarget = parameters.lookAtTarget;
            this.up = parameters.up;
            this.fov = parameters.fov;
            this.updateLookAtMatrix().updatePerspectiveMatrix();
        }
        /**
        * Update the look-at matrix.
        * Must be invoked if camera position, look-at target, or up vector is changed.
        */
        Camera.prototype.updateLookAtMatrix = function () {
            var w = SOFT3.Vector3.subtract(this.position, this.lookAtTarget).normalize();

            // Edge case handling code borrowed from three.js
            if (w.length() == 0) {
                w.z = 1;
            }

            var u = SOFT3.Vector3.cross(this.up, w).normalize();

            // Edge case handling code also borrowed from three.js
            if (Math.abs(u.length()) < 1e-5) {
                w.x += 1e-4;
                u = SOFT3.Vector3.cross(this.up, w).normalize();
            }

            var v = SOFT3.Vector3.cross(w, u);

            this.lookAtMatrix = new SOFT3.Matrix4([
                u.x, u.y, u.z, -SOFT3.Vector3.dot(u, this.position),
                v.x, v.y, v.z, -SOFT3.Vector3.dot(v, this.position),
                w.x, w.y, w.z, -SOFT3.Vector3.dot(w, this.position),
                0, 0, 0, 1
            ]);

            return this;
        };

        /** Update the perspective matrix. Must be invoked if fov is changed. */
        Camera.prototype.updatePerspectiveMatrix = function () {
            var dInv = Math.tan(this.fov / 2);
            this.perspectiveMatrix = new SOFT3.Matrix4([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, dInv, 0,
                0, 0, -dInv, 1
            ]);

            return this;
        };
        return Camera;
    })();
    SOFT3.Camera = Camera;
})(SOFT3 || (SOFT3 = {}));
var SOFT3;
(function (SOFT3) {
    /** A Vector2 object represents a 2-D Vector */
    var Vector2 = (function () {
        function Vector2(x, y) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            this.x = x;
            this.y = y;
        }
        Vector2.prototype.clone = function () {
            return new Vector2(this.x, this.y);
        };

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

        Vector2.prototype.multiplyScalar = function (scalar) {
            this.x *= scalar;
            this.y *= scalar;
            return this;
        };

        Vector2.multiplyScalar = function (v, scalar) {
            return v.clone().multiplyScalar(scalar);
        };

        Vector2.prototype.add = function (other) {
            this.x += other.x;
            this.y += other.y;
            return this;
        };

        Vector2.add = function (v1, v2) {
            return v1.clone().add(v2);
        };

        Vector2.prototype.subtract = function (other) {
            this.x -= other.x;
            this.y -= other.y;
            return this;
        };

        Vector2.subtract = function (v1, v2) {
            return v1.clone().subtract(v2);
        };
        return Vector2;
    })();
    SOFT3.Vector2 = Vector2;
})(SOFT3 || (SOFT3 = {}));
/// <reference path="Vector2.ts" />
/// <reference path="Vector3.ts" />
/// <reference path="Color.ts" />
var SOFT3;
(function (SOFT3) {
    

    /** A TriangleFace object represents a triangle face in a triangle mesh */
    var MeshTriangle = (function () {
        function MeshTriangle(a, b, c) {
            this.a = a;
            this.b = b;
            this.c = c;
        }
        MeshTriangle.prototype.toVertexArray = function () {
            return [this.a, this.b, this.c];
        };
        return MeshTriangle;
    })();
    SOFT3.MeshTriangle = MeshTriangle;
})(SOFT3 || (SOFT3 = {}));
/// <reference path="Display.ts" />
/// <reference path="Camera.ts" />
/// <reference path="MeshTriangle.ts" />
/// <reference path="utils.ts" />
var SOFT3;
(function (SOFT3) {
    (function (ShadingMode) {
        ShadingMode[ShadingMode["Flat"] = 0] = "Flat";
        ShadingMode[ShadingMode["Gouraud"] = 1] = "Gouraud";
        ShadingMode[ShadingMode["Phong"] = 2] = "Phong";
        ShadingMode[ShadingMode["TextureOnly"] = 3] = "TextureOnly";
    })(SOFT3.ShadingMode || (SOFT3.ShadingMode = {}));
    var ShadingMode = SOFT3.ShadingMode;

    SOFT3.allWhiteTexture = function (s, t) {
        return new SOFT3.Color(1, 1, 1);
    };

    function makeImageTexture(image) {
        var height = image.height;
        var width = image.width;
        var data = new Uint8Array(image.data.length);
        data.set(image.data);
        var colorAt = function (x, y) {
            var rIndex = (x + y * width) * 4;
            var gIndex = rIndex + 1;
            var bIndex = gIndex + 1;

            return SOFT3.Color.fromRGBUint8(data[rIndex], data[gIndex], data[bIndex]);
        };

        return function (s, t) {
            s = SOFT3.clamp(s, 0, 1);
            t = SOFT3.clamp(t, 0, 1);

            var x = (width - 1) * s;
            var y = (height - 1) * t;

            var x1 = Math.floor(x);
            var x2 = Math.min(x1 + 1, width - 1);
            var y1 = Math.floor(y);
            var y2 = Math.min(y1 + 1, height - 1);

            return colorAt(x1, y1).multiplyScalar((x1 + 1 - x) * (y1 + 1 - y)).add(colorAt(x1, y2).multiplyScalar((x1 + 1 - x) * (y - y1))).add(colorAt(x2, y1).multiplyScalar((x - x1) * (y1 + 1 - y))).add(colorAt(x2, y2).multiplyScalar((x - x1) * (y - y1)));
        };
    }
    SOFT3.makeImageTexture = makeImageTexture;

    /** Render objects constructor */
    var Renderer = (function () {
        function Renderer(display) {
            this.display = display;
            this.toWorldTransformationStack = [];
            this.normalTransformationStack = [];
            this.accumulatedTransformation = SOFT3.Matrix4.identity();
            this.accumulatedNormalTransformation = SOFT3.Matrix4.identity();
            this.shading = 0 /* Flat */;
            this.ambientLight = new SOFT3.Color(0.0, 0.0, 0.0);
            this.ambientCoefficient = 1.0;
            this.directionalLights = [];
            this.diffuseCoefficient = 1.0;
            this.specularCoefficient = 0.0;
            this.shininess = 0.0;
            this.texture = SOFT3.allWhiteTexture;
            this.antiAliasShift = new SOFT3.Vector2(0, 0);
            this.antiAliasFilter = [
                { delta: new SOFT3.Vector2(-0.52, 0.38), weight: 0.128 },
                { delta: new SOFT3.Vector2(0.41, 0.56), weight: 0.119 },
                { delta: new SOFT3.Vector2(0.27, 0.08), weight: 0.294 },
                { delta: new SOFT3.Vector2(-0.17, -0.29), weight: 0.249 },
                { delta: new SOFT3.Vector2(0.58, -0.55), weight: 0.104 },
                { delta: new SOFT3.Vector2(-0.31, -0.71), weight: 0.106 }
            ];
            this.antiAliasSubRenderers = null;
            this.updateToScreenTransformation();
        }
        /** Update the to-screen transformation matrix. Must be invoked if  display is changed. */
        Renderer.prototype.updateToScreenTransformation = function () {
            var halfX = this.display.width / 2;
            var halfY = this.display.height / 2;
            this.toScreenTransformation = new SOFT3.Matrix4([
                halfX, 0, 0, halfX,
                0, -halfY, 0, halfY,
                0, 0, -SOFT3.Display.Z_MAX, 0,
                0, 0, 0, 1
            ]);
            return this;
        };

        /** Update the perspective matrix. Must be invoked if camera, display, or to-world transformations are changed. */
        Renderer.prototype.updateAccumulatedTransformation = function () {
            var _this = this;
            if (!this.camera) {
                this.accumulatedTransformation = SOFT3.Matrix4.identity();
            } else {
                this.accumulatedTransformation.copyFrom(this.toScreenTransformation).multiply(this.camera.perspectiveMatrix).multiply(this.camera.lookAtMatrix);
                this.toWorldTransformationStack.forEach(function (m) {
                    _this.accumulatedTransformation.multiply(m);
                });

                this.accumulatedNormalTransformation.copyFrom(this.camera.lookAtMatrix);
                this.normalTransformationStack.forEach(function (m) {
                    _this.accumulatedNormalTransformation.multiply(m);
                });
            }

            return this;
        };

        Renderer.prototype.renderPixel = function (x, y, z, color) {
            if (z >= 0 && x >= 0 && y >= 0 && x < this.display.width && y < this.display.height) {
                var pixelRef = this.display.pixelAt(x, y);
                if (pixelRef.z > z) {
                    pixelRef.setColor(color);
                    pixelRef.z = z;
                }
            }
            return this;
        };

        Renderer.prototype.getTextureColorFromScreenSpace = function (sScreen, tScreen, zScreen) {
            var coeff = zScreen / (SOFT3.Display.Z_MAX - zScreen) + 1;
            var s = sScreen * coeff;
            var t = tScreen * coeff;

            return this.texture(s, t);
        };

        Renderer.prototype.drawScanLine = function (y, x1, x2, z1, z2, st1, st2, shadingParams) {
            var _this = this;
            var mZ, x, z, invDeltaX, roundXOffset, gouraudColor, mGouraudColor, textureColor, color, normal, mNormal, mST, st;

            if (x1 >= this.display.width || x2 < 0) {
                return;
            }

            invDeltaX = 1 / (x1 - x2);
            mZ = (z1 - z2) * invDeltaX;
            mST = SOFT3.Vector2.subtract(st1, st2).multiplyScalar(invDeltaX);

            x = Math.ceil(x1);
            roundXOffset = x - x1;

            z = z1 + mZ * roundXOffset;
            st = SOFT3.Vector2.multiplyScalar(mST, roundXOffset).add(st1);
            textureColor = this.getTextureColorFromScreenSpace(st.x, st.y, z);

            switch (this.shading) {
                case 3 /* TextureOnly */:
                    color = textureColor.clone();
                    break;
                case 0 /* Flat */:
                    color = SOFT3.Color.multiply(shadingParams.flatColor, textureColor);
                    break;
                case 1 /* Gouraud */:
                    mGouraudColor = SOFT3.Color.subtract(shadingParams.color1, shadingParams.color2).multiplyScalar(invDeltaX);
                    gouraudColor = shadingParams.color1.clone(); // avoid clamping
                    color = SOFT3.Color.multiply(gouraudColor, textureColor);
                    break;
                case 2 /* Phong */:
                    mNormal = SOFT3.Vector3.subtract(shadingParams.normal1, shadingParams.normal2).multiplyScalar(invDeltaX);
                    normal = SOFT3.Vector3.multiplyScalar(mNormal, roundXOffset).add(shadingParams.normal1);
                    color = this.shadeByNormal(shadingParams.normal1, textureColor); // avoid clamping
                    break;
                default:
                    debugger;
            }

            var advance = function () {
                x += 1;
                z += mZ;

                st.add(mST);
                textureColor = _this.getTextureColorFromScreenSpace(st.x, st.y, z).clamp();

                switch (_this.shading) {
                    case 3 /* TextureOnly */:
                        color = textureColor.clone();
                        break;
                    case 0 /* Flat */:
                        color = SOFT3.Color.multiply(shadingParams.flatColor, textureColor);
                        break;
                    case 1 /* Gouraud */:
                        gouraudColor.add(mGouraudColor);
                        color = SOFT3.Color.multiply(gouraudColor, textureColor);
                        break;
                    case 2 /* Phong */:
                        normal.add(mNormal);
                        color = _this.shadeByNormal(normal, textureColor);
                        break;
                    default:
                        debugger;
                }

                color.clamp();
            };

            for (; x <= Math.min(x2, this.display.width - 1); advance()) {
                this.renderPixel(x, y, Math.round(z), color);
            }
        };

        Renderer.computeReflectZ = function (n, l) {
            return n.dot(l) * 2 * n.z - l.z;
        };

        Renderer.prototype.shadeByNormal = function (normal, textureColor) {
            var _this = this;
            if (typeof textureColor === "undefined") { textureColor = new SOFT3.Color(1, 1, 1); }
            var n = normal.clone().normalize();

            var diffuse = new SOFT3.Color(0, 0, 0), specular = new SOFT3.Color(0, 0, 0);

            this.directionalLights.forEach(function (light) {
                var l = light.direction.normalize();

                var nDotL = n.dot(l), reflectZ;
                if (nDotL > 0 && n.z > 0) {
                    reflectZ = Renderer.computeReflectZ(n, l);
                } else if (nDotL < 0 && n.z < 0) {
                    n.negate();
                    nDotL = -nDotL;
                    reflectZ = Renderer.computeReflectZ(n, l);
                } else {
                    return;
                }

                diffuse.add(SOFT3.Color.multiplyScalar(light.color, SOFT3.clamp(nDotL, 0, 1)));
                specular.add(SOFT3.Color.multiplyScalar(light.color, Math.pow(SOFT3.clamp(reflectZ, 0, 1), _this.shininess)));
            });

            return SOFT3.Color.multiplyScalar(this.ambientLight, this.ambientCoefficient).add(diffuse.multiplyScalar(this.diffuseCoefficient)).multiply(textureColor).add(specular.multiplyScalar(this.specularCoefficient)).clamp();
        };

        Renderer.prototype.renderScreenTriangle = function (triangle) {
            var _this = this;
            // Sort vertices
            var vertices = triangle.toVertexArray().sort(function (l, r) {
                return !SOFT3.floatEq(l.position.y, r.position.y) ? l.position.y - r.position.y : l.position.x - r.position.x;
            });
            vertices.forEach(function (v) {
                v.position.x += _this.antiAliasShift.x;
                v.position.y += _this.antiAliasShift.y;
            });
            var pos = function (i) {
                return vertices[i].position;
            };
            var vNormal = function (i) {
                return vertices[i].normal;
            };
            var vST = function (i) {
                return vertices[i].textureCoordinate;
            };

            // Set up interpolation for x and z
            // Order 01, 02, 12. Same for mX, mZ, mST.
            var invDeltaY = [1 / (pos(0).y - pos(1).y), 1 / (pos(0).y - pos(2).y), 1 / (pos(1).y - pos(2).y)];

            // Compute slopes mX = dx/dy, mY = dz/dy, mST = dST/dy
            var mX = [
                invDeltaY[0] * (pos(0).x - pos(1).x),
                invDeltaY[1] * (pos(0).x - pos(2).x),
                invDeltaY[2] * (pos(1).x - pos(2).x)
            ];
            var mZ = [
                invDeltaY[0] * (pos(0).z - pos(1).z),
                invDeltaY[1] * (pos(0).z - pos(2).z),
                invDeltaY[2] * (pos(1).z - pos(2).z)
            ];
            var mST = [
                SOFT3.Vector2.subtract(vST(0), vST(1)).multiplyScalar(invDeltaY[0]),
                SOFT3.Vector2.subtract(vST(0), vST(2)).multiplyScalar(invDeltaY[1]),
                SOFT3.Vector2.subtract(vST(1), vST(2)).multiplyScalar(invDeltaY[2])
            ];

            var isMidVertexLeft;
            if (Math.abs(pos(2).y - pos(0).y) < 1e-7) {
                isMidVertexLeft = pos(1).x < pos(0).x;
            } else {
                isMidVertexLeft = pos(1).x < (((pos(1).y - pos(0).y) * (pos(2).x - pos(0).x) + (pos(2).y - pos(0).y) * pos(0).x) / (pos(2).y - pos(0).y));
            }

            // Current scan line (x,z) positions on each edge
            var roundYOffset = [
                Math.ceil(pos(0).y) - pos(0).y,
                Math.ceil(pos(1).y) - pos(1).y
            ];
            var x = [
                pos(0).x + mX[0] * roundYOffset[0],
                pos(0).x + mX[1] * roundYOffset[0],
                pos(1).x + mX[2] * roundYOffset[1]
            ];
            var z = [
                pos(0).z + mZ[0] * roundYOffset[0],
                pos(0).z + mZ[1] * roundYOffset[0],
                pos(1).z + mZ[2] * roundYOffset[1]
            ];
            var st = [
                SOFT3.Vector2.multiplyScalar(mST[0], roundYOffset[0]).add(vST(0)),
                SOFT3.Vector2.multiplyScalar(mST[1], roundYOffset[0]).add(vST(0)),
                SOFT3.Vector2.multiplyScalar(mST[2], roundYOffset[1]).add(vST(1))
            ];

            var y = Math.ceil(pos(0).y);

            // Set up shading
            // The flat color for flat shading
            var flatColor;

            // For Gouraud shading:
            // - vColors: colors on vertices
            // - mColors: slopes d(color)/dy
            // - color: color values on the intersection of current scan line and edges
            var vColors, mColor, color;

            // For Phong shading:
            // - mNormals: slopes d(normal)/dy
            // - normal: normal values on the intersection of current scan line and edges
            var mNormal, normal;

            switch (this.shading) {
                case 0 /* Flat */:
                    flatColor = this.shadeByNormal(triangle.a.normal);
                    break;
                case 1 /* Gouraud */:
                    vColors = [
                        this.shadeByNormal(vertices[0].normal),
                        this.shadeByNormal(vertices[1].normal),
                        this.shadeByNormal(vertices[2].normal)
                    ];
                    mColor = [
                        SOFT3.Color.subtract(vColors[0], vColors[1]).multiplyScalar(invDeltaY[0]),
                        SOFT3.Color.subtract(vColors[0], vColors[2]).multiplyScalar(invDeltaY[1]),
                        SOFT3.Color.subtract(vColors[1], vColors[2]).multiplyScalar(invDeltaY[2])
                    ];
                    color = [
                        SOFT3.Color.multiplyScalar(mColor[0], roundYOffset[0]).add(vColors[0]),
                        SOFT3.Color.multiplyScalar(mColor[1], roundYOffset[0]).add(vColors[0]),
                        SOFT3.Color.multiplyScalar(mColor[2], roundYOffset[1]).add(vColors[1])
                    ];
                    break;
                case 2 /* Phong */:
                    mNormal = [
                        SOFT3.Vector3.subtract(vNormal(0), vNormal(1)).multiplyScalar(invDeltaY[0]),
                        SOFT3.Vector3.subtract(vNormal(0), vNormal(2)).multiplyScalar(invDeltaY[1]),
                        SOFT3.Vector3.subtract(vNormal(1), vNormal(2)).multiplyScalar(invDeltaY[2])
                    ];
                    normal = [
                        SOFT3.Vector3.multiplyScalar(mNormal[0], roundYOffset[0]).add(vNormal(0)),
                        SOFT3.Vector3.multiplyScalar(mNormal[1], roundYOffset[0]).add(vNormal(0)),
                        SOFT3.Vector3.multiplyScalar(mNormal[2], roundYOffset[1]).add(vNormal(1))
                    ];
                    break;
                case 3 /* TextureOnly */:
                    break;
                default:
                    debugger;
            }

            // Helper function that advances the scan line
            var upperAdvance = function () {
                y += 1;
                x[0] += mX[0];
                z[0] += mZ[0];
                x[1] += mX[1];
                z[1] += mZ[1];
                st[0].add(mST[0]);
                st[1].add(mST[1]);
                if (_this.shading === 1 /* Gouraud */) {
                    color[0].add(mColor[0]);
                    color[1].add(mColor[1]);
                } else if (_this.shading === 2 /* Phong */) {
                    normal[0].add(mNormal[0]);
                    normal[1].add(mNormal[1]);
                }
            };
            var lowerAdvance = function () {
                y += 1;
                x[1] += mX[1];
                z[1] += mZ[1];
                x[2] += mX[2];
                z[2] += mZ[2];
                st[1].add(mST[1]);
                st[2].add(mST[2]);
                if (_this.shading == 1 /* Gouraud */) {
                    color[1].add(mColor[1]);
                    color[2].add(mColor[2]);
                } else if (_this.shading === 2 /* Phong */) {
                    normal[1].add(mNormal[1]);
                    normal[2].add(mNormal[2]);
                }
            };

            var shadingParams;
            if (this.shading === 0 /* Flat */) {
                shadingParams = { flatColor: flatColor };
            }
            if (isMidVertexLeft) {
                if (this.shading === 1 /* Gouraud */) {
                    shadingParams = {
                        color1: color[0],
                        color2: color[1]
                    };
                } else if (this.shading === 2 /* Phong */) {
                    shadingParams = {
                        normal1: normal[0],
                        normal2: normal[1]
                    };
                }
                for (; y < pos(1).y; upperAdvance()) {
                    this.drawScanLine(y, x[0], x[1], z[0], z[1], st[0], st[1], shadingParams);
                }

                if (this.shading === 1 /* Gouraud */) {
                    shadingParams = {
                        color1: color[2],
                        color2: color[1]
                    };
                } else if (this.shading === 2 /* Phong */) {
                    shadingParams = {
                        normal1: normal[2],
                        normal2: normal[1]
                    };
                }
                for (; y <= pos(2).y; lowerAdvance()) {
                    this.drawScanLine(y, x[2], x[1], z[2], z[1], st[2], st[1], shadingParams);
                }
            } else {
                if (this.shading === 1 /* Gouraud */) {
                    shadingParams = {
                        color1: color[1],
                        color2: color[0]
                    };
                } else if (this.shading === 2 /* Phong */) {
                    shadingParams = {
                        normal1: normal[1],
                        normal2: normal[0]
                    };
                }
                for (; y < pos(1).y; upperAdvance()) {
                    this.drawScanLine(y, x[1], x[0], z[1], z[0], st[1], st[0], shadingParams);
                }

                if (this.shading === 1 /* Gouraud */) {
                    shadingParams = {
                        color1: color[1],
                        color2: color[2]
                    };
                } else if (this.shading === 2 /* Phong */) {
                    shadingParams = {
                        normal1: normal[1],
                        normal2: normal[2]
                    };
                }
                for (; y <= pos(2).y; lowerAdvance()) {
                    this.drawScanLine(y, x[1], x[2], z[1], z[2], st[1], st[2], shadingParams);
                }
            }

            return this;
        };

        Renderer.prototype.getTransformedVertex = function (vertex) {
            var screenPos = vertex.position.clone().applyAsHomogeneous(this.accumulatedTransformation);
            var screenNormal = vertex.normal.clone().transformDirection(this.accumulatedNormalTransformation);
            var warpFactor = 1 + screenPos.z / (SOFT3.Display.Z_MAX - screenPos.z);
            var screenTexture = vertex.textureCoordinate.clone().multiplyScalar(1 / warpFactor);

            return {
                position: screenPos,
                normal: screenNormal,
                textureCoordinate: screenTexture
            };
        };

        Renderer.prototype.renderTriangle = function (triangle) {
            var screenTriangle = new SOFT3.MeshTriangle(this.getTransformedVertex(triangle.a), this.getTransformedVertex(triangle.b), this.getTransformedVertex(triangle.c));
            this.renderScreenTriangle(screenTriangle);
            return this;
        };

        /**
        * Must be called whenever antiAliasFilter is changed.
        */
        Renderer.prototype.initializeAntiAliasSubRenderers = function () {
            this.antiAliasSubRenderers = [];
            for (var i = 0; i < this.antiAliasFilter.length; i += 1) {
                var subRenderer = new Renderer(new SOFT3.Display(this.display.width, this.display.height));
                subRenderer.antiAliasShift = this.antiAliasFilter[i].delta;
                this.antiAliasSubRenderers.push(subRenderer);
            }
            return this;
        };

        /**
        * Render all triangles contained in the scene.
        * Note that if antiAlias is set, the z-buffer of display would no longer be valid for additional rendering.
        */
        Renderer.prototype.renderAllTriangles = function (triangles, antiAlias) {
            if (typeof antiAlias === "undefined") { antiAlias = false; }
            if (!antiAlias) {
                for (var i = 0; i < triangles.length; i += 1) {
                    this.renderTriangle(triangles[i]);
                }
            } else {
                // Lazy initialization
                if (!this.antiAliasSubRenderers) {
                    this.initializeAntiAliasSubRenderers();
                }

                for (var i = 0; i < this.antiAliasFilter.length; i += 1) {
                    var subRenderer = this.antiAliasSubRenderers[i];

                    // Shallow copy should suffice for the moment,
                    // but we should be careful for future changes in Renderer
                    subRenderer.accumulatedNormalTransformation = this.accumulatedNormalTransformation;
                    subRenderer.camera = this.camera;
                    subRenderer.toWorldTransformationStack = this.toWorldTransformationStack;
                    subRenderer.normalTransformationStack = this.normalTransformationStack;
                    subRenderer.normalTransformationStack = this.normalTransformationStack;
                    subRenderer.toScreenTransformation = this.toScreenTransformation;
                    subRenderer.accumulatedTransformation = this.accumulatedTransformation;
                    subRenderer.accumulatedNormalTransformation = this.accumulatedNormalTransformation;
                    subRenderer.shading = this.shading;
                    subRenderer.ambientLight = this.ambientLight;
                    subRenderer.ambientCoefficient = this.ambientCoefficient;
                    subRenderer.directionalLights = this.directionalLights;
                    subRenderer.diffuseCoefficient = this.diffuseCoefficient;
                    subRenderer.specularCoefficient = this.specularCoefficient;
                    subRenderer.shininess = this.shininess;
                    subRenderer.texture = this.texture;

                    var subDisplay = subRenderer.display;
                    subDisplay.rgbaBuffer.set(this.display.rgbaBuffer);
                    subDisplay.zBuffer.set(this.display.zBuffer);

                    subRenderer.renderAllTriangles(triangles, false);
                }

                for (var j = 0; j < this.display.rgbaBuffer.length; j += 4) {
                    var r = 0, g = 0, b = 0;
                    for (var i = 0; i < this.antiAliasFilter.length; i += 1) {
                        var w = this.antiAliasFilter[i].weight;
                        var subBuffer = this.antiAliasSubRenderers[i].display.rgbaBuffer;
                        r += subBuffer[j] * w;
                        g += subBuffer[j + 1] * w;
                        b += subBuffer[j + 2] * w;
                    }

                    this.display.rgbaBuffer[j] = Math.floor(r);
                    this.display.rgbaBuffer[j + 1] = Math.floor(g);
                    this.display.rgbaBuffer[j + 2] = Math.floor(b);
                }
            }
            return this;
        };
        return Renderer;
    })();
    SOFT3.Renderer = Renderer;
})(SOFT3 || (SOFT3 = {}));
/// <reference path="soft3/Renderer.ts" />
(function () {
    function parseTriangles(trianglesData, invertZ) {
        if (typeof invertZ === "undefined") { invertZ = true; }
        var result = [];

        var parseVertex = function (textLine) {
            var numbers = textLine.trim().split(/\s+/).map(function (s) {
                return parseFloat(s);
            });
            return {
                position: new SOFT3.Vector3(numbers[0], numbers[1], invertZ ? -numbers[2] : numbers[2]),
                normal: new SOFT3.Vector3(numbers[3], numbers[4], invertZ ? -numbers[5] : numbers[5]),
                textureCoordinate: new SOFT3.Vector2(numbers[6], numbers[7])
            };
        };

        var lines = trianglesData.trim().split(/\r\n?|\r?\n/);
        for (var i = 0; i < lines.length; i += 4) {
            var v1 = parseVertex(lines[i + 1]);
            var v2 = parseVertex(lines[i + 2]);
            var v3 = parseVertex(lines[i + 3]);

            var triangle = new SOFT3.MeshTriangle(v1, v2, v3);
            result.push(triangle);
        }

        return result;
    }

    function applyTransformationParams(renderer, params) {
        renderer.toWorldTransformationStack = [
            SOFT3.Matrix4.makeTranslation(params.translate.x, params.translate.y, params.translate.z),
            SOFT3.Matrix4.makeRotationZ(params.rotate.z),
            SOFT3.Matrix4.makeRotationY(params.rotate.y),
            SOFT3.Matrix4.makeRotationX(params.rotate.x),
            SOFT3.Matrix4.makeScale(params.scale.x, params.scale.y, params.scale.z)
        ];

        renderer.normalTransformationStack = [
            SOFT3.Matrix4.makeRotationZ(params.rotate.z),
            SOFT3.Matrix4.makeRotationY(params.rotate.y),
            SOFT3.Matrix4.makeRotationX(params.rotate.x)
        ];

        if (params.rotateCamera) {
            if (params.rotateCameraY) {
                renderer.camera.position.applyAsHomogeneous(SOFT3.Matrix4.makeRotationY(1 / 180 * Math.PI));
            }
            renderer.camera.updateLookAtMatrix();
        }

        renderer.updateAccumulatedTransformation();
    }

    function mandelbrotTexture(s, t) {
        var maxNIter = 1000, nIter = 0, ca = s * 3.5 - 2.5, cb = t * 2 - 1, a = 0, b = 0;
        while (a * a + b * b < 4 * 4 && nIter < maxNIter) {
            var aTemp = a * a - b * b + ca;
            b = 2 * a * b + cb;
            a = aTemp;
            nIter += 1;
        }
        if (nIter >= maxNIter) {
            return new SOFT3.Color(0, 0, 0);
        } else {
            var c = 3 * Math.log(nIter) / Math.log(maxNIter);
            var i = Math.floor(c);
            var f = c - i;
            switch (i) {
                case 0:
                    return new SOFT3.Color(0, 1, f);
                    break;
                case 1:
                    return new SOFT3.Color(0, 1 - f, 1);
                    break;
                case 2:
                    return new SOFT3.Color(f, 0, 1);
                    break;
                default:
                    return new SOFT3.Color(1, 0, 1);
                    break;
            }
        }
    }

    function doRender(dataStr, getParameters, flush) {
        var backgroundPixel = new SOFT3.Pixel().setColor(new SOFT3.Color(0.976, 0.976, 0.976));
        var display = new SOFT3.Display(256, 256);

        var renderer = new SOFT3.Renderer(display);
        renderer.camera = new SOFT3.Camera({
            position: new SOFT3.Vector3(13.2, -8.7, 14.8),
            lookAtTarget: new SOFT3.Vector3(0.8, 0.7, -4.5),
            up: new SOFT3.Vector3(-0.2, 1.0, 0),
            fov: 53.7 / 180 * Math.PI
        });

        renderer.ambientCoefficient = 0.2;
        renderer.diffuseCoefficient = 0.8;
        renderer.specularCoefficient = 0.3;
        renderer.shininess = 32;
        renderer.ambientLight = new SOFT3.Color(0.3, 0.3, 0.3);
        renderer.directionalLights = [
            {
                direction: new SOFT3.Vector3(-0.7071, 0.7071, 0),
                color: new SOFT3.Color(0.5, 0.5, 0.9)
            },
            {
                direction: new SOFT3.Vector3(0, -0.7071, 0.7071),
                color: new SOFT3.Color(0.9, 0.2, 0.3)
            },
            {
                direction: new SOFT3.Vector3(0.7071, 0.0, 0.7071),
                color: new SOFT3.Color(0.2, 0.7, 0.3)
            }
        ];

        var triangles = parseTriangles(dataStr);

        var renderLoop = function (toImageFile) {
            if (typeof toImageFile === "undefined") { toImageFile = false; }
            var parameters = getParameters();

            var oldShading = renderer.shading;
            renderer.shading = parameters.shading;

            var oldTexture = renderer.texture;
            renderer.texture = parameters.texture;

            display.reset(backgroundPixel);
            applyTransformationParams(renderer, parameters);

            renderer.renderAllTriangles(triangles, parameters.antiAlias);

            flush(display, toImageFile);

            var updateImageFile = (oldShading !== renderer.shading || oldTexture !== renderer.texture);
            if (parameters.rotateCamera) {
                requestAnimationFrame(function () {
                    return renderLoop(updateImageFile);
                });
            } else {
                setTimeout(function () {
                    return requestAnimationFrame(function () {
                        return renderLoop(updateImageFile);
                    });
                }, 100);
            }
        };

        renderLoop(true);
    }

    // Utility function for loading text file content
    function loadTextFileAsync(url, callback) {
        var client = new XMLHttpRequest();
        client.open('GET', url);
        client.onreadystatechange = function () {
            if (client.readyState === XMLHttpRequest.DONE) {
                callback(client.responseText);
            }
        };
        client.send();
    }

    // Utility function for loading
    function loadCorsImageDataAsync(src, callback) {
        var canvas = document.createElement("canvas");
        var image = document.createElement("img");
        image.onload = function () {
            canvas.width = image.width;
            canvas.height = image.height;
            var context = canvas.getContext('2d');
            context.drawImage(image, 0, 0);
            var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            callback(imageData);
        };
        image.crossOrigin = '';
        image.src = src;
    }

    window.onload = function () {
        var canvasElem = document.getElementById("canvas");
        var downloadAnchorElem = document.getElementById("download");

        var rotateCameraElem = document.getElementById("camera-rotation");
        var translateXElem = document.getElementById("translate-x");
        var translateYElem = document.getElementById("translate-y");
        var translateZElem = document.getElementById("translate-z");
        var rotateXElem = document.getElementById("rotate-x");
        var rotateYElem = document.getElementById("rotate-y");
        var rotateZElem = document.getElementById("rotate-z");
        var scaleXElem = document.getElementById("scale-x");
        var scaleYElem = document.getElementById("scale-y");
        var scaleZElem = document.getElementById("scale-z");

        var shadingElem = document.getElementById("shading");
        var textureElem = document.getElementById("texture");

        var antiAliasCheckboxElem = document.getElementById("anti-alias-checkbox");

        var textureContainer = {
            texture: SOFT3.allWhiteTexture = SOFT3.allWhiteTexture
        };

        // Utility function for getting parameters from input elements
        var getParameters = function () {
            var shading;
            switch (shadingElem.value) {
                case "texture-only":
                    shading = 3 /* TextureOnly */;
                    break;
                case "flat":
                    shading = 0 /* Flat */;
                    break;
                case "gouraud":
                    shading = 1 /* Gouraud */;
                    break;
                case "phong":
                    shading = 2 /* Phong */;
                    break;
                default:
                    debugger;
            }

            var texture;

            var params = {
                translate: {
                    x: parseFloat(translateXElem.value),
                    y: parseFloat(translateYElem.value),
                    z: parseFloat(translateZElem.value)
                },
                rotate: {
                    x: parseFloat(rotateXElem.value) / 180 * Math.PI,
                    y: parseFloat(rotateYElem.value) / 180 * Math.PI,
                    z: parseFloat(rotateZElem.value) / 180 * Math.PI
                },
                scale: {
                    x: parseFloat(scaleXElem.value),
                    y: parseFloat(scaleYElem.value),
                    z: parseFloat(scaleZElem.value)
                },
                rotateCameraY: rotateCameraElem.checked,
                shading: shading,
                texture: textureContainer.texture,
                antiAlias: antiAliasCheckboxElem.checked
            };
            params.rotateCamera = params.rotateCameraY;
            return params;
        };

        // Utility function for flushing the Display into both the Canvas and a PPM file
        var flush = function (display, toImageFile) {
            if (typeof toImageFile === "undefined") { toImageFile = false; }
            display.drawOnCanvas(canvasElem);

            if (toImageFile) {
                downloadAnchorElem.href = URL.createObjectURL(display.toNetpbm());
                downloadAnchorElem.setAttribute('download', 'render-result.ppm');
            }
        };

        // Hook-up input elements and their corresponding output
        var inputElems = document.getElementsByTagName("input");
        var hookUpInputOutput = function (i, o) {
            o.value = i.value;
            i.oninput = function () {
                o.value = i.value;
            };
        };
        for (var i = 0; i < inputElems.length; i += 1) {
            var inputElem = inputElems[i];
            var outputElem = document.getElementById(inputElem.id + "-output");
            if (outputElem) {
                hookUpInputOutput(inputElem, outputElem);
            }
        }

        // Hook-up texture control events
        textureElem.onchange = function () {
            switch (textureElem.value) {
                case "no-texture":
                    textureContainer.texture = SOFT3.allWhiteTexture;
                    break;
                case "image-texture":
                    loadCorsImageDataAsync("data/texture.jpg", function (imageData) {
                        textureContainer.texture = SOFT3.makeImageTexture(imageData);
                    });
                    break;
                case "procedural-texture":
                    textureContainer.texture = mandelbrotTexture;
                    break;
                default:
                    debugger;
            }
        };

        URL.revokeObjectURL(downloadAnchorElem.href);
        downloadAnchorElem.href = "#";

        loadTextFileAsync("data/pot.asc", function (text) {
            doRender(text, getParameters, flush);
        });
    };
})();
//# sourceMappingURL=app.js.map
