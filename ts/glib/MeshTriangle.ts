/// <reference path="Vector2.ts" />
/// <reference path="Vector3.ts" />
/// <reference path="Color.ts" />

module CS580GL {
    /**
     * A MeshVertex object represents a vertex,
     * including its position, normal, and texture mapping coordinate values
     */
    export interface IMeshVertex {
        position: Vector3;
        normal?: Vector3;
        textureCoordinate?: Vector2;
    }

    /** A TriangleFace object represents a triangle face in a triangle mesh */
    export class MeshTriangle {
        constructor(public a: IMeshVertex, public b: IMeshVertex, public c: IMeshVertex) {
        }

        toVertexArray(): IMeshVertex[] {
            return [this.a, this.b, this.c];
        }
    }
}
