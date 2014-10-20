declare module CS580GL {
    /** A simple utility function for clamping numbers */
    function clamp(num: number, min: number, max: number): number;
    function applyMixins(derivedConstructor: any, baseConstructors: any[]): void;
    function floatEq(x: number, y: number): boolean;
}
declare module CS580GL {
    /** A Color object represents a color. */
    class Color {
        /** Red channel value between 0 and 1. Default is 1. */
        public red: number;
        /** Green channel value between 0 and 1. Default is 1. */
        public green: number;
        /** Blue channel value between 0 and 1. Default is 1. */
        public blue: number;
        constructor(/** Red channel value between 0 and 1. Default is 1. */
            red?: number, /** Green channel value between 0 and 1. Default is 1. */
            green?: number, /** Blue channel value between 0 and 1. Default is 1. */
            blue?: number);
        public clone(): Color;
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
        public multiply(other: Color): Color;
        static multiply(c1: Color, c2: Color): Color;
        public multiplyScalar(scalar: number): Color;
        static multiplyScalar(color: Color, scalar: number): Color;
        public getHex(): number;
        public getHexString(): string;
        public clamp(): Color;
        static clamp(color: Color): Color;
        public add(other: Color): Color;
        static add(c1: Color, c2: Color): Color;
        public subtract(other: Color): Color;
        static subtract(c1: Color, c2: Color): Color;
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
    * since it is hard to efficiently use heterogeneous arrays in JavaScript
    */
    class Display {
        public width: number;
        public height: number;
        public rgbaBuffer: Uint8Array;
        public zBuffer: Int32Array;
        static Z_MAX: number;
        constructor(width: number, height: number);
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
    /** A 4x4 Matrix */
    class Matrix4 {
        /** A row-major array of matrix elements */
        public elements: Float32Array;
        /** Construct a 4x4 matrix from a row-major array of numbers */
        constructor(elements: any);
        public toString(): string;
        /** Clone this matrix */
        public clone(): Matrix4;
        /** Copy content from another matrix */
        public copyFrom(other: Matrix4): Matrix4;
        /** Create an identity matrix */
        static identity(): Matrix4;
        /** Create a zero matrix */
        static zeros(): Matrix4;
        /** Multipy this matrix (left) to another matrix (right) */
        public multiply(other: Matrix4): Matrix4;
        /** Multiply two matrices and return a new matrix as the result */
        static multiply(l: Matrix4, r: Matrix4): Matrix4;
        /** Create a new translation matrix */
        static makeTranslation(x: number, y: number, z: number): Matrix4;
        /** Create a new scale matrix */
        static makeScale(x: number, y: number, z: number): Matrix4;
        /** Create a new rotation matrix for rotation around x-axis */
        static makeRotationX(theta: number): Matrix4;
        /** Create a new rotation matrix for rotation around y-axis */
        static makeRotationY(theta: number): Matrix4;
        /** Create a new rotation matrix for rotation around z-axis */
        static makeRotationZ(theta: number): Matrix4;
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
        public subtract(v: Vector3): Vector3;
        static subtract(v1: Vector3, v2: Vector3): Vector3;
        public cross(other: Vector3): Vector3;
        static cross(v1: Vector3, v2: Vector3): Vector3;
        public multiplyScalar(scalar: number): Vector3;
        static multiplyScalar(vec: Vector3, scalar: number): Vector3;
        public divideScalar(scalar: number): Vector3;
        static divideScalar(vec: Vector3, scalar: number): Vector3;
        public negate(): Vector3;
        /**
        * Convert this vector to homogeneous coordinates (by appending a forth dimension with value 1),
        * apply the matrix, and convert back to non-homogeneous coordinates
        */
        public applyAsHomogeneous(matrix: Matrix4): Vector3;
        /**
        * Transforms the direction of this vector by the 3 x 3 subset of the matrix, and then normalizes the result.
        * @param matrix
        */
        public transformDirection(matrix: Matrix4): Vector3;
        public lengthSq(): number;
        public length(): number;
        public normalize(): Vector3;
        public clone(): Vector3;
    }
}
declare module CS580GL {
    interface ICameraParameters {
        position: Vector3;
        lookAtTarget: Vector3;
        up: Vector3;
        fov: number;
    }
    /** A camera with perspective projection. The aspect ratio is always assumed to be 1. */
    class Camera {
        /** The look-at matrix, which does both translation and rotation. */
        public lookAtMatrix: Matrix4;
        /** The perspective matrix. Note that z will be scaled into range [0, 1] */
        public perspectiveMatrix: Matrix4;
        /** Camera position */
        public position: Vector3;
        /** Position of the target which the camera looks at */
        public lookAtTarget: Vector3;
        /** The up direction */
        public up: Vector3;
        /** Field of view, in radian */
        public fov: number;
        constructor(parameters: ICameraParameters);
        /**
        * Update the look-at matrix.
        * Must be invoked if camera position, look-at target, or up vector is changed.
        */
        public updateLookAtMatrix(): Camera;
        /** Update the perspective matrix. Must be invoked if fov is changed. */
        public updatePerspectiveMatrix(): Camera;
    }
}
declare module CS580GL {
    /** A Vector2 object represents a 2-D Vector */
    class Vector2 {
        public x: number;
        public y: number;
        constructor(x?: number, y?: number);
        public clone(): Vector2;
        public setXY(x: number, y: number): Vector2;
        public setX(value: number): Vector2;
        public setY(value: number): Vector2;
        public copyFrom(v: Vector2): Vector2;
        public multiplyScalar(scalar: number): Vector2;
        static multiplyScalar(v: Vector2, scalar: number): Vector2;
        public add(other: Vector2): Vector2;
        static add(v1: Vector2, v2: Vector2): Vector2;
        public subtract(other: Vector2): Vector2;
        static subtract(v1: Vector2, v2: Vector2): Vector2;
    }
}
declare module CS580GL {
    /**
    * A MeshVertex object represents a vertex,
    * including its position, normal, and texture mapping coordinate values
    */
    interface IMeshVertex {
        position: Vector3;
        normal: Vector3;
        textureCoordinate: Vector2;
    }
    /** A TriangleFace object represents a triangle face in a triangle mesh */
    class MeshTriangle {
        public a: IMeshVertex;
        public b: IMeshVertex;
        public c: IMeshVertex;
        constructor(a: IMeshVertex, b: IMeshVertex, c: IMeshVertex);
        public toVertexArray(): IMeshVertex[];
    }
}
declare module CS580GL {
    interface IDirectionalLight {
        direction: Vector3;
        color: Color;
    }
    enum ShadingMode {
        Flat = 0,
        Gouraud = 1,
        Phong = 2,
        TextureOnly = 3,
    }
    interface IShadingParams {
        flatColor?: Color;
        color1?: Color;
        color2?: Color;
        normal1?: Vector3;
        normal2?: Vector3;
    }
    interface ITexture {
        (s: number, t: number): Color;
    }
    var allWhiteTexture: ITexture;
    function makeImageTexture(image: ImageData): ITexture;
    /** Render objects constructor */
    class Renderer {
        public display: Display;
        public camera: Camera;
        public toWorldTransformationStack: Matrix4[];
        public normalTransformationStack: Matrix4[];
        public toScreenTransformation: Matrix4;
        public accumulatedTransformation: Matrix4;
        public accumulatedNormalTransformation: Matrix4;
        public shading: ShadingMode;
        public ambientLight: Color;
        public ambientCoefficient: number;
        public directionalLights: IDirectionalLight[];
        public diffuseCoefficient: number;
        public specularCoefficient: number;
        public shininess: number;
        public texture: ITexture;
        constructor(display: Display);
        /** Update the to-screen transformation matrix. Must be invoked if  display is changed. */
        public updateToScreenTransformation(): Renderer;
        /** Update the perspective matrix. Must be invoked if camera, display, or to-world transformations are changed. */
        public updateAccumulatedTransformation(): Renderer;
        public renderPixel(x: number, y: number, z: number, color: Color): Renderer;
        private getTextureColorFromScreenSpace(sScreen, tScreen, zScreen);
        private drawScanLine(y, x1, x2, z1, z2, st1, st2, shadingParams);
        private static computeReflectZ(n, l);
        private shadeByNormal(normal, textureColor?);
        public renderScreenTriangle(triangle: MeshTriangle): Renderer;
        private getTransformedVertex(vertex);
        public renderTriangle(triangle: MeshTriangle): Renderer;
    }
}
