declare module CS580GL {
    /** A Color object represents a color. */
    class Color {
        /** Red channel value between 0 and 1. Default is 1. */
        public red: number;
        /** Red channel value between 0 and 1. Default is 1. */
        public green: number;
        /** Red channel value between 0 and 1. Default is 1. */
        public blue: number;
        constructor(/** Red channel value between 0 and 1. Default is 1. */
            red?: number, /** Red channel value between 0 and 1. Default is 1. */
            green?: number, /** Red channel value between 0 and 1. Default is 1. */
            blue?: number);
        public setRGB(red: number, green: number, blue: number): Color;
        public setRGBUint8(redUint8: number, greenUint8: number, blueUint8: number): Color;
        static fromRGBUint8(redUint8: number, greenUint8: number, blueUint8: number): Color;
        static channelValueToUint8(value: number): number;
        public setRed(value: number): Color;
        public redUint8 : number;
        public setRedUint8(value: number): Color;
        public setGreen(value: number): Color;
        public greenUint8 : number;
        public setGreenUint8(value: number): Color;
        public setBlue(value: number): Color;
        public blueUint8 : number;
        public setBlueUint8(value: number): Color;
        public multiplyScalar(scalar: number): Color;
        public getHex(): number;
        public getHexString(): string;
    }
}
declare module CS580GL {
    /** A Pixel object represents a pixel with RGBA color and depth information. */
    class Pixel {
        public redUint8: number;
        public greenUint8: number;
        public blueUint8: number;
        public alphaUint8: number;
        public z: number;
        constructor(pixelValue?: any);
        public setRedUint8(value: number): Pixel;
        public setGreenUint8(value: number): Pixel;
        public setBlueUint8(value: number): Pixel;
        public setAlphaUint8(value: number): Pixel;
        public setZ(value: number): Pixel;
        public copyFrom(that: Pixel): Pixel;
        public setColor(color: Color): Pixel;
    }
}
declare module CS580GL {
    /** A simple utility function for clamping numbers */
    function clamp(num: number, min: number, max: number): number;
    function applyMixins(derivedCtor: any, baseCtors: any[]): void;
}
declare module CS580GL {
    /** A PixelRef object is a reference to a pixel in a Display object. */
    class PixelRef implements Pixel {
        public display: Display;
        public zIndex: number;
        public rIndex: number;
        public gIndex: number;
        public bIndex: number;
        public aIndex: number;
        constructor(display: Display, x: number, y: number);
        public redUint8 : number;
        public greenUint8 : number;
        public blueUint8 : number;
        public alphaUint8 : number;
        public z : number;
        public setRedUint8: (number: any) => Pixel;
        public setGreenUint8: (number: any) => Pixel;
        public setBlueUint8: (number: any) => Pixel;
        public setAlphaUint8: (number: any) => Pixel;
        public setZ: (number: any) => Pixel;
        public copyFrom: (Pixel: any) => Pixel;
        public setColor: (Color: any) => Pixel;
    }
}
declare module CS580GL {
    /**
    * A Display object represents a frame buffer,
    * which contains an array of 32-bit RGBA pixel values and a 32-bit depth value for each pixel.
    *
    * Note that the RGBA array and the Z buffer are stored separately,
    * since it is hard to efficiently use heterogenious arrays in JavaScript
    */
    class Display {
        public xres: number;
        public yres: number;
        public rgbaBuffer: Uint8Array;
        public zBuffer: Int32Array;
        constructor(xres: number, yres: number);
        /** Returns a reference to the pixel at the position specified by x and y */
        public pixelAt(x: number, y: number): PixelRef;
        /** Reset the entire frame buffer with the (optional) given pixel value */
        public reset(pixel?: Pixel): Display;
        /** Flush the frame into a HTML Canvas element */
        public drawOnCanvas(canvasElem: HTMLCanvasElement, x?: number, y?: number): void;
        /** Flush the frame in the Netpbm image format (PPM) and return the result as a Blob */
        public toNetpbm(): Blob;
    }
}
declare module CS580GL {
    /** A Vector2 object represents a 2-D Vector */
    class Vector2 {
        public x: number;
        public y: number;
        constructor(x?: number, y?: number);
        public setXY(x: number, y: number): Vector2;
        public setX(value: number): Vector2;
        public setY(value: number): Vector2;
        public copyFrom(v: Vector2): Vector2;
    }
}
declare module CS580GL {
    /** A Vector3 object represents a 3-D Vector */
    class Vector3 {
        public x: number;
        public y: number;
        public z: number;
        constructor(x?: number, y?: number, z?: number);
        public setXYZ(x: number, y: number, z: number): Vector3;
        public setX(value: number): Vector3;
        public setY(value: number): Vector3;
        public setZ(value: number): Vector3;
        public copyFrom(v: Vector3): Vector3;
        public dot(v: Vector3): number;
        static dot(v1: Vector3, v2: Vector3): number;
        public add(v: Vector3): Vector3;
        static add(v1: Vector3, v2: Vector3): Vector3;
        public divideScalar(scalar: number): Vector3;
        public lengthSq(): number;
        public length(): number;
        public normalize(): Vector3;
        public clone(): Vector3;
    }
}
declare module CS580GL {
    /**
    * A MeshVertex object represents a vertex,
    * including its position, normal, and UV mapping values
    */
    interface MeshVertex {
        position: Vector3;
        normal?: Vector3;
        uv?: Vector2;
    }
}
declare module CS580GL {
    /** A TriangleFace object represents a triangle face in a triangle mesh */
    class MeshTriangle {
        public a: MeshVertex;
        public b: MeshVertex;
        public c: MeshVertex;
        constructor(a: MeshVertex, b: MeshVertex, c: MeshVertex);
        public toVertexArray(): MeshVertex[];
    }
}
declare module CS580GL {
    interface RenderAttributes {
        flatColor?: Color;
    }
    /** Render objects contructor */
    class Renderer {
        public display: Display;
        public flatColor: Color;
        constructor(display: Display);
        public setAttributes(attributes: RenderAttributes): Renderer;
        public renderPixel(x: number, y: number, z: number, color: Color): Renderer;
        public renderTriangle(triangle: MeshTriangle): Renderer;
    }
}
