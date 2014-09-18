/// <reference path="Vector3.ts" />
/// <reference path="Matrix4.ts" />

module CS580GL {
    /** A camera with perspective projection. The aspect ratio is always assumed to be 1. */
    export class Camera {

        /** The look-at matrix, which does both tranlsation and rotation. */
        public lookAtMatrix: Matrix4 = Matrix4.zeros();

        /** The perspective matrix. Note that z will be scaled into range [0, 1] */
        public perspectiveMatrix: Matrix4 = Matrix4.zeros();

        constructor(
            //
            /** Camera position */
            public position: Vector3,
            //
            /** Position of the target which the camera looks at */
            public lookAtTarget: Vector3,
            //
            /** The up direction */
            public up: Vector3,
            //
            /** Field of view, in radian */
            public fov: number
        ) {
            this.updateLookAtMatrix().updatePerspectiveMatrix();
        }

        setPosition(position: Vector3): Camera {
            this.position.copyFrom(position);
            return this.updateLookAtMatrix();
        }

        setLookAtTarget(target: Vector3): Camera {
            this.lookAtTarget.copyFrom(target);
            return this.updateLookAtMatrix();
        }

        setUpDirection(up: Vector3) {
            this.up.copyFrom(up);
            return this.updateLookAtMatrix();
        }

        setFov(fov: number) {
            this.fov = fov;
            return this.updatePerspectiveMatrix();
        }

        /** Update the look-at matrix. Must be invoked if camera position, look-at target, or up vector is changed. */
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
                w.x, w.y, w.z, -Vector3.dot(w, this.position)
            ]);

            return this;
        }

        /** Update the perspective matrix. Must be invoked if fov is changed. */
        public updatePerspectiveMatrix(): Camera {
            var dInv = Math.tan(this.fov);
            this.perspectiveMatrix = new Matrix4([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, dInv, 0,
                0, 0, dInv, 1
            ]);

            return this;
        }

    }
}