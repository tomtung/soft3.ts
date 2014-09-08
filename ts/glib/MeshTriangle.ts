/// <reference path="MeshVertex.ts" />

module CS580GL {
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
}