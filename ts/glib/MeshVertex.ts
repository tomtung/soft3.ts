/// <reference path="Vector2.ts" />
/// <reference path="Vector3.ts" />

module CS580GL {
    /**
    * A MeshVertex object represents a vertex,
    * including its position, normal, and UV mapping values
    */
    export interface IMeshVertex {
        position: Vector3;
        normal?: Vector3;
        uv?: Vector2;
    }
}