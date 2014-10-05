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

    export function applyMixins(derivedConstructor: any, baseConstructors: any[]) {
        baseConstructors.forEach(baseConstructor => {
            Object.getOwnPropertyNames(baseConstructor.prototype).forEach(name => {
                derivedConstructor.prototype[name] = baseConstructor.prototype[name];
            })
        });
    }


    export function floatEq(x: number, y: number): boolean {
        return Math.abs(x - y) < 1e-6;
    }
}
