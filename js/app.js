var CS580GL;
(function (CS580GL) {
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

        Color.channelValueToUint8 = function (value) {
            return Math.round(CS580GL.clamp(value * 255, 0, 255));
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

        Color.prototype.multiplyScalar = function (scalar) {
            this.red = this.red * scalar;
            this.green = this.green * scalar;
            this.blue = this.blue * scalar;
            return this;
        };

        Color.prototype.getHex = function () {
            return (this.redUint8 << 16) | (this.greenUint8 << 8) | this.blueUint8;
        };

        Color.prototype.getHexString = function () {
            // Smart implementatin borrowed from three.js
            return ("000000" + this.getHex().toString(16)).slice(-6);
        };
        return Color;
    })();
    CS580GL.Color = Color;
})(CS580GL || (CS580GL = {}));
/// <reference path="Color.ts" />
var CS580GL;
(function (CS580GL) {
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
    CS580GL.Pixel = Pixel;
})(CS580GL || (CS580GL = {}));
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

    function applyMixins(derivedCtor, baseCtors) {
        baseCtors.forEach(function (baseCtor) {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            });
        });
    }
    CS580GL.applyMixins = applyMixins;
})(CS580GL || (CS580GL = {}));
/// <reference path="Pixel.ts" />
/// <reference path="Display.ts" />
/// <reference path="utils.ts" />
var CS580GL;
(function (CS580GL) {
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

    CS580GL.applyMixins(PixelRef, [CS580GL.Pixel]);
})(CS580GL || (CS580GL = {}));
/// <reference path="PixelRef.ts" />
var CS580GL;
(function (CS580GL) {
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
            return new CS580GL.PixelRef(this, x, y);
        };

        /** Reset the entire frame buffer with the (optional) given pixel value */
        Display.prototype.reset = function (pixel) {
            if (typeof pixel === "undefined") { pixel = new CS580GL.Pixel({
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
        Display.Z_MAX = 0x7fffffff;
        return Display;
    })();
    CS580GL.Display = Display;
})(CS580GL || (CS580GL = {}));
var CS580GL;
(function (CS580GL) {
    /** A 4x4 Matix */
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
    CS580GL.Matrix4 = Matrix4;
})(CS580GL || (CS580GL = {}));
/// <reference path="Matrix4.ts" />
var CS580GL;
(function (CS580GL) {
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

        Vector3.prototype.divideScalar = function (scalar) {
            var scalarInv = 1 / scalar;
            this.x *= scalarInv;
            this.y *= scalarInv;
            this.z *= scalarInv;
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
})(CS580GL || (CS580GL = {}));
/// <reference path="Vector3.ts" />
/// <reference path="Matrix4.ts" />
var CS580GL;
(function (CS580GL) {
    ;

    /** A camera with perspective projection. The aspect ratio is always assumed to be 1. */
    var Camera = (function () {
        function Camera(parameters) {
            /** The look-at matrix, which does both tranlsation and rotation. */
            this.lookAtMatrix = CS580GL.Matrix4.zeros();
            /** The perspective matrix. Note that z will be scaled into range [0, 1] */
            this.perspectiveMatrix = CS580GL.Matrix4.zeros();
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
            var w = CS580GL.Vector3.subtract(this.position, this.lookAtTarget).normalize();

            // Edge case handling code borrowed from three.js
            if (w.length() == 0) {
                w.z = 1;
            }

            var u = CS580GL.Vector3.cross(this.up, w).normalize();

            // Edge case handling code also borrowed from three.js
            if (Math.abs(u.length()) < 1e-5) {
                w.x += 1e-4;
                u = CS580GL.Vector3.cross(this.up, w).normalize();
            }

            var v = CS580GL.Vector3.cross(w, u);

            this.lookAtMatrix = new CS580GL.Matrix4([
                u.x, u.y, u.z, -CS580GL.Vector3.dot(u, this.position),
                v.x, v.y, v.z, -CS580GL.Vector3.dot(v, this.position),
                w.x, w.y, w.z, -CS580GL.Vector3.dot(w, this.position),
                0, 0, 0, 1
            ]);

            return this;
        };

        /** Update the perspective matrix. Must be invoked if fov is changed. */
        Camera.prototype.updatePerspectiveMatrix = function () {
            var dInv = Math.tan(this.fov / 2);
            this.perspectiveMatrix = new CS580GL.Matrix4([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, dInv, 0,
                0, 0, -dInv, 1
            ]);

            return this;
        };
        return Camera;
    })();
    CS580GL.Camera = Camera;
})(CS580GL || (CS580GL = {}));
var CS580GL;
(function (CS580GL) {
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
/// <reference path="Vector2.ts" />
/// <reference path="Vector3.ts" />
/// <reference path="MeshVertex.ts" />
var CS580GL;
(function (CS580GL) {
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
    CS580GL.MeshTriangle = MeshTriangle;
})(CS580GL || (CS580GL = {}));
/// <reference path="Display.ts" />
/// <reference path="Camera.ts" />
/// <reference path="MeshTriangle.ts" />
var CS580GL;
(function (CS580GL) {
    /** Render objects contructor */
    var Renderer = (function () {
        function Renderer(display) {
            this.display = display;
            this.toWorldTransformationStack = [];
            this.accumulatedTransformation = CS580GL.Matrix4.identity();
            this.updateToScreenTransformation();
        }
        /** Update the to-screen transformation matrix. Must be invoked if  display is changed. */
        Renderer.prototype.updateToScreenTransformation = function () {
            var halfX = this.display.xres / 2;
            var halfY = this.display.yres / 2;
            this.toScreenTransformation = new CS580GL.Matrix4([
                halfX, 0, 0, halfX,
                0, -halfY, 0, halfY,
                0, 0, -CS580GL.Display.Z_MAX, 0,
                0, 0, 0, 1
            ]);
            return this;
        };

        /** Update the perspective matrix. Must be invoked if camera, display, or to-world transformations are changed. */
        Renderer.prototype.updateAccumulatedTransformation = function () {
            var _this = this;
            if (!this.camera) {
                this.accumulatedTransformation = CS580GL.Matrix4.identity();
            } else {
                this.accumulatedTransformation.copyFrom(this.toScreenTransformation).multiply(this.camera.perspectiveMatrix).multiply(this.camera.lookAtMatrix);
                this.toWorldTransformationStack.forEach(function (m) {
                    _this.accumulatedTransformation.multiply(m);
                });
            }

            return this;
        };

        Renderer.prototype.renderPixel = function (x, y, z, color) {
            if (z >= 0 && x >= 0 && y >= 0 && x < this.display.xres && y < this.display.yres) {
                var pixelRef = this.display.pixelAt(x, y);
                if (pixelRef.z > z) {
                    pixelRef.setColor(color);
                    pixelRef.z = z;
                }
            }
            return this;
        };

        Renderer.prototype.renderScreenTriangle = function (triangle) {
            var _this = this;
            var floatEq = function (x, y) {
                return Math.abs(x - y) < 1e-6;
            };

            var renderScanLine = function (x1, z1, x2, z2, y) {
                var m, x, z;
                if (x1 >= _this.display.xres || x2 < 0) {
                    return;
                }

                m = (z1 - z2) / (x1 - x2);
                x = Math.max(0, Math.round(x1)); // Note: Use round instead of ceil
                z = z1 + m * (x - x1);
                for (; x < Math.min(x2, _this.display.xres - 1); x += 1, z += m) {
                    _this.renderPixel(x, y, Math.round(z), _this.flatColor);
                }
            };

            // Sort vertices
            var vertices = triangle.toVertexArray().sort(function (l, r) {
                return !floatEq(l.position.y, r.position.y) ? l.position.y - r.position.y : l.position.x - r.position.x;
            });
            var pos = vertices.map(function (v) {
                return v.position;
            });

            // Compute slopes dx/dy and dz/dy
            var edgeSlopeXY = function (vi, vj) {
                return (pos[vi].x - pos[vj].x) / (pos[vi].y - pos[vj].y);
            };
            var mx01 = edgeSlopeXY(0, 1), mx02 = edgeSlopeXY(0, 2), mx12 = edgeSlopeXY(1, 2);

            var edgeSlopeZY = function (vi, vj) {
                return (pos[vi].z - pos[vj].z) / (pos[vi].y - pos[vj].y);
            };
            var mz01 = edgeSlopeZY(0, 1), mz02 = edgeSlopeZY(0, 2), mz12 = edgeSlopeZY(1, 2);

            // Initial scan line positions on each edge
            var edgeInitialX = function (vi, mx) {
                return pos[vi].x + mx * (Math.ceil(pos[vi].y) - pos[vi].y);
            };
            var edgeInitialZ = function (vi, mz) {
                return pos[vi].z + mz * (Math.ceil(pos[vi].y) - pos[vi].y);
            };

            var x01 = edgeInitialX(0, mx01), x02 = edgeInitialX(0, mx02), x12 = edgeInitialX(1, mx12);
            var z01 = edgeInitialZ(0, mz01), z02 = edgeInitialZ(0, mz02), z12 = edgeInitialZ(1, mz12);

            var y = Math.ceil(pos[0].y);

            var isMidVertexLeft = isFinite(mx01) && (mx01 < mx02);

            // Helper function that advances the scan line
            var upperAdvance = function () {
                y += 1, x01 += mx01, z01 += mz01, x02 += mx02, z02 += mz02;
            };
            var lowerAdvance = function () {
                y += 1, x12 += mx12, z12 += mz12, x02 += mx02, z02 += mz02;
            };

            if (isMidVertexLeft) {
                for (; y < pos[1].y; upperAdvance()) {
                    renderScanLine(x01, z01, x02, z02, y);
                }

                for (; y <= pos[2].y; lowerAdvance()) {
                    renderScanLine(x12, z12, x02, z02, y);
                }
            } else {
                for (; y < pos[1].y; upperAdvance()) {
                    renderScanLine(x02, z02, x01, z01, y);
                }

                for (; y <= pos[2].y; lowerAdvance()) {
                    renderScanLine(x02, z02, x12, z12, y);
                }
            }

            return this;
        };

        Renderer.prototype.renderTriangle = function (triangle) {
            // Note that normal and texture are ignored for the moement
            var screenTriangle = new CS580GL.MeshTriangle({ position: triangle.a.position.clone().applyAsHomogeneous(this.accumulatedTransformation) }, { position: triangle.b.position.clone().applyAsHomogeneous(this.accumulatedTransformation) }, { position: triangle.c.position.clone().applyAsHomogeneous(this.accumulatedTransformation) });
            this.renderScreenTriangle(screenTriangle);
            return this;
        };
        return Renderer;
    })();
    CS580GL.Renderer = Renderer;
})(CS580GL || (CS580GL = {}));
/// <reference path="glib/Renderer.ts" />
(function () {
    var defaultBackgroundColor = CS580GL.Color.fromRGBUint8(123, 112, 96);
    var defaultBackgroundPixel = new CS580GL.Pixel().setColor(defaultBackgroundColor);

    // ---- Homework 1 ----
    function renderHowework1(rectData, flush) {
        var display = new CS580GL.Display(512, 512).reset(defaultBackgroundPixel);

        var scaleRgb = function (value) {
            return Math.round(CS580GL.clamp(value, 0, 4095) / 4095 * 255);
        };

        var renderRectangle = function (dataLine) {
            var numbers = dataLine.split("\t").map(function (n) {
                return parseInt(n);
            });
            var r = scaleRgb(numbers[4]);
            var g = scaleRgb(numbers[5]);
            var b = scaleRgb(numbers[6]);
            for (var x = Math.max(0, numbers[0]); x <= Math.min(numbers[2], 511); x++) {
                for (var y = Math.max(0, numbers[1]); y <= Math.min(numbers[3], 511); y++) {
                    display.pixelAt(x, y).setRedUint8(r).setGreenUint8(g).setBlueUint8(b);
                }
            }
        };

        rectData.trim().split("\n").forEach(renderRectangle);

        flush(display);
    }

    // Helper function for Homework 2 & 3: flat shading
    function simpleShading(normal) {
        var light = new CS580GL.Vector3(0.707, 0.5, 0.5);
        var coef = CS580GL.Vector3.dot(normal, light);
        if (coef < 0) {
            coef = -coef;
        }
        if (coef > 1) {
            coef = 1;
        }
        return new CS580GL.Color(0.95, 0.65, 0.88).multiplyScalar(coef);
    }

    // Helper function for Homework 2 & 3: parse triangle data string
    function parseTriangles(trianglesData, invertZ) {
        if (typeof invertZ === "undefined") { invertZ = true; }
        var result = [];

        var parseVertex = function (textLine) {
            var numbers = textLine.trim().split(/\s+/).map(function (s) {
                return parseFloat(s);
            });
            return {
                position: new CS580GL.Vector3(numbers[0], numbers[1], invertZ ? -numbers[2] : numbers[2]),
                normal: new CS580GL.Vector3(numbers[3], numbers[4], invertZ ? -numbers[5] : numbers[5]),
                uv: new CS580GL.Vector2(numbers[6], numbers[7])
            };
        };

        var lines = trianglesData.trim().split("\r");
        for (var i = 0; i < lines.length; i += 4) {
            var v1 = parseVertex(lines[i + 1]);
            var v2 = parseVertex(lines[i + 2]);
            var v3 = parseVertex(lines[i + 3]);

            var triangle = new CS580GL.MeshTriangle(v1, v2, v3);
            result.push(triangle);
        }

        return result;
    }

    // ---- Homework 2 ----
    function renderHomework2(screenPotData, flush) {
        var display = new CS580GL.Display(256, 256).reset(defaultBackgroundPixel);
        var renderer = new CS580GL.Renderer(display);

        var triangles = parseTriangles(screenPotData, false);
        for (var i = 0; i < triangles.length; i += 1) {
            renderer.flatColor = simpleShading(triangles[i].a.normal);
            renderer.renderScreenTriangle(triangles[i]);
        }

        flush(display);
    }

    // ---- Homework 3 ----
    function renderHomework3(potData, getParameters, flush) {
        var display = new CS580GL.Display(256, 256).reset(defaultBackgroundPixel);

        var renderer = new CS580GL.Renderer(display);

        renderer.camera = new CS580GL.Camera({
            position: new CS580GL.Vector3(13.2, -8.7, 14.8),
            lookAtTarget: new CS580GL.Vector3(0.8, 0.7, -4.5),
            up: new CS580GL.Vector3(-0.2, 1.0, 0),
            fov: 53.7 / 180 * Math.PI
        });

        var parameters = getParameters();
        renderer.toWorldTransformationStack = [
            CS580GL.Matrix4.makeTranslation(parameters.translate.x, parameters.translate.y, parameters.translate.z),
            CS580GL.Matrix4.makeRotationZ(parameters.rotate.z),
            CS580GL.Matrix4.makeRotationY(parameters.rotate.y),
            CS580GL.Matrix4.makeRotationX(parameters.rotate.x),
            CS580GL.Matrix4.makeScale(parameters.scale.x, parameters.scale.y, parameters.scale.z)
        ];

        renderer.updateAccumulatedTransformation();

        var triangles = parseTriangles(potData);
        for (var i = 0; i < triangles.length; i += 1) {
            var shadingNormal = triangles[i].a.normal.clone();
            shadingNormal.setZ(-shadingNormal.z);
            renderer.flatColor = simpleShading(shadingNormal);

            renderer.renderTriangle(triangles[i]);
        }

        flush(display);
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

    window.onload = function () {
        var canvasElem = document.getElementById("canvas");
        var downloadAnchorElem = document.getElementById("download");
        var selectElem = document.getElementById("select");

        downloadAnchorElem.onclick = function () {
            return alert("test!");
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

        // Load data for the selected homework,
        // call the corresponding render function,
        // and flush the rendering result
        var renderSelection = function () {
            URL.revokeObjectURL(downloadAnchorElem.href);
            downloadAnchorElem.href = "#";

            switch (selectElem.value) {
                case "hw1":
                    canvasElem.height = canvasElem.width = 512;
                    loadTextFileAsync("data/rects", function (text) {
                        renderHowework1(text, flush);
                    });
                    break;

                case "hw2":
                    canvasElem.height = canvasElem.width = 256;
                    loadTextFileAsync("data/pot4.screen.asc", function (text) {
                        renderHomework2(text, flush);
                    });
                    break;

                case "hw3":
                    canvasElem.height = canvasElem.width = 256;

                    var getParameters = function () {
                        return {
                            translate: { x: 0, y: -3.25, z: -3.5 },
                            rotate: { x: 45 / 180 * Math.PI, y: 30 / 180 * Math.PI, z: 0 },
                            scale: { x: 3.25, y: 3.25, z: 3.25 }
                        };
                    };

                    loadTextFileAsync("data/pot4.asc", function (text) {
                        renderHomework3(text, getParameters, flush);
                    });
                    break;

                default:
            }
        };

        // Call once after load, and call each time the selection changes
        renderSelection();
        selectElem.onchange = renderSelection;
    };
})();
