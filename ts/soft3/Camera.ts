/// <reference path="Vector3.ts" />
/// <reference path="Matrix4.ts" />

module SOFT3 {
    export interface ICameraParameters {
        position: Vector3;
        lookAtTarget: Vector3;
        up: Vector3;
        fov: number;
    }

    /** A camera with perspective projection. The aspect ratio is always assumed to be 1. */
    export class Camera {

        /** The look-at matrix, which does both translation and rotation. */
        public lookAtMatrix: Matrix4 = Matrix4.zeros();

        /** The perspective matrix. Note that z will be scaled into range [0, 1] */
        public perspectiveMatrix: Matrix4 = Matrix4.zeros();

        /** Camera position */
        position: Vector3;

        /** Position of the target which the camera looks at */
        lookAtTarget: Vector3;

        /** The up direction */
        up: Vector3;

        /** Field of view, in radian */
        fov: number;

        constructor(parameters: ICameraParameters) {
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
        public updateLookAtMatrix(): Camera {
            var w = Vector3.subtract(this.position, this.lookAtTarget).normalize();

            // Edge case handling code borrowed from three.js
            if (w.length() == 0) {
                w.z = 1;
            }

            var u = Vector3.cross(this.up, w).normalize();

            // Edge case handling code also borrowed from three.js
            if (Math.abs(u.length()) < 1e-5) {
                w.x += 1e-4;
                u = Vector3.cross(this.up, w).normalize();
            }

            var v = Vector3.cross(w, u);

            this.lookAtMatrix = new Matrix4([
                u.x, u.y, u.z, -Vector3.dot(u, this.position),
                v.x, v.y, v.z, -Vector3.dot(v, this.position),
                w.x, w.y, w.z, -Vector3.dot(w, this.position),
                0, 0, 0, 1
            ]);

            return this;
        }

        /** Update the perspective matrix. Must be invoked if fov is changed. */
        public updatePerspectiveMatrix(): Camera {
            var dInv = Math.tan(this.fov / 2);
            this.perspectiveMatrix = new Matrix4([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, dInv, 0,
                0, 0, -dInv, 1
            ]);

            return this;
        }
    }
}
