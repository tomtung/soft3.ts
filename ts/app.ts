/// <reference path="glib/Renderer.ts" />

(() => {
    var defaultBackgroundColor = CS580GL.Color.fromRGBUint8(123, 112, 96);
    var defaultBackgroundPixel = new CS580GL.Pixel().setColor(defaultBackgroundColor);

    // ---- Homework 1 ----
    function renderHowework1(
        rectData: string,
        flush: (display: CS580GL.Display, toImageFile?: boolean) => void
    ): void {
        var display = new CS580GL.Display(512, 512).reset(defaultBackgroundPixel);

        var scaleRgb = (value: number) =>
            Math.round(
                CS580GL.clamp(value, 0, 4095) / 4095 * 255
            );

        var renderRectangle = (dataLine: string) => {
            var numbers = dataLine.split("\t").map(n => parseInt(n));
            var r = scaleRgb(numbers[4]);
            var g = scaleRgb(numbers[5]);
            var b = scaleRgb(numbers[6]);
            for (var x = Math.max(0, numbers[0]); x <= Math.min(numbers[2], 511); x++) {
                for (var y = Math.max(0, numbers[1]); y <= Math.min(numbers[3], 511); y++) {
                    display.pixelAt(x, y).setRedUint8(r).setGreenUint8(g).setBlueUint8(b);
                }
            }
        }

        rectData.trim().split("\n").forEach(renderRectangle);

        flush(display, true);
    }

    // Helper function for Homework 2 & 3: flat shading
    function simpleShading(normal: CS580GL.Vector3): CS580GL.Color {
        var light = new CS580GL.Vector3(0.707, 0.5, 0.5);
        var coef = CS580GL.Vector3.dot(normal, light);
        if (coef < 0) {
            coef = -coef;
        }
        if (coef > 1) {
            coef = 1;
        }
        return new CS580GL.Color(0.95, 0.65, 0.88).multiplyScalar(coef);
    }

    // Helper function for Homework 2 & 3: parse triangle data string
    function parseTriangles(trianglesData: string, invertZ: boolean = true): CS580GL.MeshTriangle[] {
        var result = [];

        var parseVertex = (textLine: string) : CS580GL.IMeshVertex => {
            var numbers = textLine.trim().split(/\s+/).map(s => parseFloat(s));
            return {
                position: new CS580GL.Vector3(numbers[0], numbers[1], invertZ ? -numbers[2] : numbers[2]),
                normal: new CS580GL.Vector3(numbers[3], numbers[4], invertZ ? -numbers[5] : numbers[5]),
                uv: new CS580GL.Vector2(numbers[6], numbers[7])
            };
        }

        var lines = trianglesData.trim().split("\r");
        for (var i = 0; i < lines.length; i += 4) {
            var v1 = parseVertex(lines[i + 1]);
            var v2 = parseVertex(lines[i + 2]);
            var v3 = parseVertex(lines[i + 3]);

            var triangle = new CS580GL.MeshTriangle(v1, v2, v3);
            result.push(triangle);
        }

        return result;
    }
    
    // ---- Homework 2 ----

    function renderHomework2(
        screenPotData: string,
        flush: (display: CS580GL.Display, toImageFile?: boolean) => void
    ): void {
        var display = new CS580GL.Display(256, 256).reset(defaultBackgroundPixel);
        var renderer = new CS580GL.Renderer(display);

        var triangles = parseTriangles(screenPotData, false);
        for (var i = 0; i < triangles.length; i += 1) {
            renderer.flatColor = simpleShading(triangles[i].a.normal);
            renderer.renderScreenTriangle(triangles[i]);
        }

        flush(display, true);
    }

    // ---- Homework 3 ----

    function renderHomework3(
        potData: string,
        getParameters: () => any,
        flush: (display: CS580GL.Display, toImageFile?: boolean) => void
    ): void {
        var display = new CS580GL.Display(256, 256);

        var renderer = new CS580GL.Renderer(display);
        
        renderer.camera = new CS580GL.Camera({
            position: new CS580GL.Vector3(13.2, -8.7, 14.8),
            lookAtTarget: new CS580GL.Vector3(0.8, 0.7, -4.5),
            up: new CS580GL.Vector3(-0.2, 1.0, 0),
            fov: 53.7 / 180 * Math.PI
        });

        var renderLoop = (toImageFile: boolean = false) => {
            var parameters = getParameters();

            if (!parameters.isCurrent) {
                return;
            }

            display.reset(defaultBackgroundPixel);
            renderer.toWorldTransformationStack = [
                CS580GL.Matrix4.makeTranslation(parameters.translate.x, parameters.translate.y, parameters.translate.z),
                CS580GL.Matrix4.makeRotationZ(parameters.rotate.z),
                CS580GL.Matrix4.makeRotationY(parameters.rotate.y),
                CS580GL.Matrix4.makeRotationX(parameters.rotate.x),
                CS580GL.Matrix4.makeScale(parameters.scale.x, parameters.scale.y, parameters.scale.z)
            ];

            renderer.updateAccumulatedTransformation();

            var triangles = parseTriangles(potData);
            for (var i = 0; i < triangles.length; i += 1) {
                var shadingNormal = triangles[i].a.normal.clone();
                shadingNormal.setZ(- shadingNormal.z);
                renderer.flatColor = simpleShading(shadingNormal);

                renderer.renderTriangle(triangles[i]);
            }

            flush(display, toImageFile);

            if (parameters.rotateCamera) {
                renderer.camera.position.applyAsHomogeneous(CS580GL.Matrix4.makeRotationY(1 / 180 * Math.PI));
                renderer.camera.updateLookAtMatrix();
            }

            requestAnimationFrame(() => renderLoop());
        }

        renderLoop(true);
    }

    // Utility function for loading text file content
    function loadTextFileAsync(url: string, callback: (string) => any): void {
        var client = new XMLHttpRequest();
        client.open('GET', url);
        client.onreadystatechange = () => {
            if (client.readyState === XMLHttpRequest.DONE) {
                callback(client.responseText);
            }
        }
        client.send();
    }

    window.onload = () => {
        var canvasElem = <HTMLCanvasElement> document.getElementById("canvas");
        var downloadAnchorElem = <HTMLAnchorElement> document.getElementById("download");
        var selectElem = <HTMLSelectElement> document.getElementById("select");

        var hw3ControlsElem = <HTMLDivElement> document.getElementById("hw3-controls");
        var rotateCameraElem = <HTMLInputElement> document.getElementById("camera-rotation");
        var translateXElem = <HTMLInputElement> document.getElementById("translate-x");
        var translateYElem = <HTMLInputElement> document.getElementById("translate-y");
        var translateZElem = <HTMLInputElement> document.getElementById("translate-z");
        var rotateXElem = <HTMLInputElement> document.getElementById("rotate-x");
        var rotateYElem = <HTMLInputElement> document.getElementById("rotate-y");
        var rotateZElem = <HTMLInputElement> document.getElementById("rotate-z");
        var scaleXElem = <HTMLInputElement> document.getElementById("scale-x");
        var scaleYElem = <HTMLInputElement> document.getElementById("scale-y");
        var scaleZElem = <HTMLInputElement> document.getElementById("scale-z");

        // Utility function for flushing the Display into both the Canvas and a PPM file
        var flush = (display: CS580GL.Display, toImageFile: boolean = false) => {
            //display.reset(defaultBackgroundPixel); // remove this would be better, but wrong
            display.drawOnCanvas(canvasElem);

            if (toImageFile) {
                downloadAnchorElem.href = URL.createObjectURL(display.toNetpbm());
                downloadAnchorElem.setAttribute('download', 'render-result.ppm');
            }
        }

        // Load data for the selected homework,
        // call the corresponding render function,
        // and flush the rendering result
        var renderSelection = () => {
            URL.revokeObjectURL(downloadAnchorElem.href);
            downloadAnchorElem.href = "#";

            hw3ControlsElem.style.visibility = selectElem.value == "hw3" ? "visible" : "collapse";

            switch (selectElem.value) {
            case "hw1":
                canvasElem.height = canvasElem.width = 512;
                loadTextFileAsync("data/rects", text => {
                    renderHowework1(text, flush);
                });
                break;

            case "hw2":
                canvasElem.height = canvasElem.width = 256;
                loadTextFileAsync("data/pot4.screen.asc", text => {
                    renderHomework2(text, flush);
                });
                break;

            case "hw3":
                canvasElem.height = canvasElem.width = 256;

                var getParameters = () => {
                    return {
                        translate: {
                            x: parseFloat(translateXElem.value),
                            y: parseFloat(translateYElem.value),
                            z: parseFloat(translateZElem.value)
                        },
                        rotate: {
                            x: parseFloat(rotateXElem.value) / 180 * Math.PI,
                            y: parseFloat(rotateYElem.value) / 180 * Math.PI,
                            z: parseFloat(rotateZElem.value) / 180 * Math.PI,
                        },
                        scale: {
                            x: parseFloat(scaleXElem.value),
                            y: parseFloat(scaleYElem.value),
                            z: parseFloat(scaleZElem.value)
                        },
                        isCurrent: selectElem.value == "hw3",
                        rotateCamera: rotateCameraElem.checked
                    };
                };

                loadTextFileAsync("data/pot4.asc", text => {
                    renderHomework3(text, getParameters, flush);
                });
                break;

            default:
            }
        };

        // Call once after load, and call each time the selection changes
        renderSelection();
        selectElem.onchange = renderSelection;
    };
})();

function onInputChange(inputElem: HTMLInputElement) {
    document.getElementById(inputElem.id + "-output").value = inputElem.value;
}