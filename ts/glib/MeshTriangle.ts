/// <reference path="MeshVertex.ts" />

module CS580GL {
    /** A TriangleFace object represents a triangle face in a triangle mesh */
    export class MeshTriangle {
        constructor(
            public a: IMeshVertex,
            public b: IMeshVertex,
            public c: IMeshVertex) {
        }

        toVertexArray(): IMeshVertex[] {
            return [this.a, this.b, this.c];
        }
    }
}