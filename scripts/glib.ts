//
// 2014 Fall - CSCI 580 3D - Graphics Rendering
// by Yubing Dong
//

var __applyMixins = this.__applyMixins || function (derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        })
    });
}

/**
 * The CS580GL module contains the hand-crafted 3-D rendering library.
 *
 * Since JavaScript and C++ are very different languages,
 * sometimes the suggested C-style C++ API doesn't make sense for JavaScript.
 *
 * Here's a comparison table between the suggested C++ API and JavaScript API:
 * ( Homework 1 )
 * - NewFrameBuffer:            the constructor of Display objects
 * - NewDisplay:                the constructor of Display objects
 * - FreeFrameBuffer:           unnecessary in JavaScript
 * - FreeDisplay:               unncessary in JavaScript
 * - ClearDisplay:              Display.prototype.reset
 * - {Get|Set}DisplayPixel:     Display.prototype.pixelAt returns a PixelRef object, which supports get/set operation
 * - FlushDisplayToPPMFile:     Display.prototype.toNetpbm
 * ( Homework 2 )
 * - NewRender:                 the constructor of Renderer objects
 * - FreeRender:                unnecessary in JavaScript
 * - BeginRender:               Display.prototype.reset
 * - PutAttribute:              Renderer.prototype.setAttributes
 * - PutTriangle:               Renderer.prototype.renderTriangle
 * @module CS580GL
 */
module CS580GL {
    /** A simple utility function for clamping numbers */
    export function clamp(num: number, min: number, max: number): number {
        if (num < min) {
            return min;
        } else if (num > max) {
            return max;
        } else {
            return num;
        }
    }

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

    /** A Pixel object represents a pixel with RGBA color and depth information. */
    export class Pixel {
        redUint8: number;
        greenUint8: number;
        blueUint8: number;
        alphaUint8: number;
        z: number;

        constructor(pixelValue: any = {}) {
            this.redUint8 = pixelValue.redUint8 || 0;
            this.greenUint8 = pixelValue.greenUint8|| 0;
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

    /** A PixelRef object is a reference to a pixel in a Display object. */
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

    __applyMixins(PixelRef, [Pixel]);

    /**
     * A Display object represents a frame buffer,
     * which contains an array of 32-bit RGBA pixel values and a 32-bit depth value for each pixel.
     *
     * Note that the RGBA array and the Z buffer are stored separately,
     * since it is hard to efficiently use heterogenious arrays in JavaScript
     */
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
            z: 0x7fffffff
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
            var imageData = canvasContext.createImageData(this.xres, this.yres);
            imageData.data.set(this.rgbaBuffer);
            canvasContext.putImageData(imageData, x, y);
        }

        /** Flush the frame in the Netpbm image format (PPM) and return the result as a Blob */
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

    /** A Vector3 object represents a 3-D Vector */
    export class Vector3 {
        constructor(
            public x: number = 0,
            public y: number = 0,
            public z: number = 0
         ) { }

        setXYZ(x: number, y: number, z: number): Vector3 {
            this.x = x;
            this.y = y;
            this.z = z;
            return this;
        }

        setX(value: number): Vector3 {
            this.x = value;
            return this;
        }

        setY(value: number): Vector3 {
            this.y = value;
            return this;
        }

        setZ(value: number): Vector3 {
            this.z = value;
            return this;
        }

        copyFrom(v: Vector3): Vector3 {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
            return this;
        }

        dot(v: Vector3): number {
            return this.x * v.x + this.y * v.y + this.z * v.z;
        }

        static dot(v1: Vector3, v2: Vector3): number {
            return v1.clone().dot(v2);
        }

        add(v: Vector3): Vector3 {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
            return this;
        }

        static add(v1: Vector3, v2: Vector3) {
            return v1.clone().add(v2);
        }

        divideScalar(scalar: number): Vector3 {
            this.x /= scalar;
            this.y /= scalar;
            this.z /= scalar;
            return this;
        }

        lengthSq(): number {
            return this.x * this.x + this.y * this.y + this.z * this.z;
        }

        length(): number {
            return Math.sqrt(this.lengthSq());
        }

        normalize(): Vector3 {
            return this.divideScalar(this.length());
        }

        clone(): Vector3 {
            return new CS580GL.Vector3(this.x, this.y, this.z);
        }
    }

    /** A Vector2 object represents a 2-D Vector */
    export class Vector2 {
        constructor(
            public x: number = 0,
            public y: number = 0
            ) { }

        setXY(x: number, y: number): Vector2 {
            this.x = x;
            this.y = y;
            return this;
        }

        setX(value: number): Vector2 {
            this.x = value;
            return this;
        }

        setY(value: number): Vector2 {
            this.y = value;
            return this;
        }

        copyFrom(v: Vector2): Vector2 {
            this.x = v.x;
            this.y = v.y;
            return this;
        }
    }

    /**
     * A MeshVertex object represents a vertex,
     * including its position, normal, and UV mapping values
     */
    export interface MeshVertex {
        position: Vector3;
        normal?: Vector3;
        uv?: Vector2;
    }

    /** A TriangleFace object represents a triangle face in a triangle mesh */
    export class MeshTriangle {
        constructor(
            public a: MeshVertex,
            public b: MeshVertex,
            public c: MeshVertex) {
        }

        toVertexArray(): MeshVertex[] {
            return [this.a, this.b, this.c];
        }
    }

    export interface RenderAttributes {
        flatColor?: Color
    }

    /** Render objects contructor */
    export class Renderer {
        flatColor: Color;

        constructor(public display: Display) {
        }

        setAttributes(attributes: RenderAttributes): Renderer {
            if (attributes.flatColor) {
                this.flatColor = attributes.flatColor;
            }
            return this;
        }

        renderPixel(x: number, y: number, z: number, color: Color): Renderer {
            if (z >= 0 && x >= 0 && y >= 0 && x < this.display.xres && y < this.display.yres) {
                var pixelRef = this.display.pixelAt(x, y);
                if (pixelRef.z > z) {
                    pixelRef.setColor(color);
                    pixelRef.z = z;
                }
            }
            return this;
        }

        renderTriangle(triangle: MeshTriangle): Renderer {
            function floatEq(x: number, y: number): boolean {
                return Math.abs(x - y) < 1e-6;
            }

            var renderScanLine = (x1: number, z1: number, x2: number, z2: number, y: number) => {
                var tmp: number, m: number, x: number, z: number;
                if (x1 > x2) {
                    tmp = x1, x1 = x2, x2 = tmp;
                    tmp = z1, z1 = z2, z2 = tmp;
                }

                if (x1 >= this.display.xres || x2 < 0) {
                    return;
                }

                m = (z1 - z2) / (x1 - x2);
                x = Math.max(0, Math.round(x1)); // Note: Use round instead of ceil
                z = z1 + m * (x - x1); // TODO why use int instead of float?
                for (; x < Math.min(x2, this.display.xres - 1); x += 1, z += m) {
                    this.renderPixel(x, y, Math.round(z), this.flatColor);
                }
            }

            var vertices = triangle.toVertexArray();
            vertices.sort((l, r) => l.position.y - r.position.y);

            var p = vertices.map(v => v.position);

            var y = Math.ceil(p[0].y);
            var deltaY = y - p[0].y;

            if (floatEq(p[0].y, p[1].y)) {
                var mx02 = (p[0].x - p[2].x) / (p[0].y - p[2].y);
                var x02 = p[0].x + mx02 * deltaY;
                var mz02 = (p[0].z - p[2].z) / (p[0].y - p[2].y);
                var z02 = p[0].z + mz02 * deltaY;

                var mx12 = (p[1].x - p[2].x) / (p[1].y - p[2].y);
                var x12 = p[1].x + mx12 * deltaY;
                var mz12 = (p[1].z - p[2].z) / (p[1].y - p[2].y);
                var z12 = p[1].z + mz12 * deltaY;

                for (; y <= p[2].y; y += 1, x12 += mx12, z12 += mz12, x02 += mx02, z02 += mz02) {
                    renderScanLine(x12, z12, x02, z02, y);
                }
            } else {
                var mx01 = (p[0].x - p[1].x) / (p[0].y - p[1].y);
                var x01 = p[0].x + mx01 * deltaY;
                var mz01 = (p[0].z - p[1].z) / (p[0].y - p[1].y);
                var z01 = p[0].z + mz01 * deltaY;

                var mx02 = (p[0].x - p[2].x) / (p[0].y - p[2].y);
                var x02 = p[0].x + mx02 * deltaY;
                var mz02 = (p[0].z - p[2].z) / (p[0].y - p[2].y);
                var z02 = p[0].z + mz02 * deltaY;

                for (; y < p[1].y; y += 1, x01 += mx01, z01 += mz01, x02 += mx02, z02 += mz02) {
                    renderScanLine(x01, z01, x02, z02, y);
                }

                if (!floatEq(p[1].y, p[2].y)) {
                    deltaY = y - p[1].y;
                    var mx12 = (p[1].x - p[2].x) / (p[1].y - p[2].y);
                    var x12 = p[1].x + mx12 * deltaY;
                    var mz12 = (p[1].z - p[2].z) / (p[1].y - p[2].y);
                    var z12 = p[1].z + mz12 * deltaY;

                    for (; y <= p[2].y; y += 1, x12 += mx12, z12 += mz12, x02 += mx02, z02 += mz02) {
                        renderScanLine(x12, z12, x02, z02, y);
                    }
                }
            }
            return this;
        }
    }
}
