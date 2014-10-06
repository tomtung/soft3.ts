/// <reference path="glib/Renderer.ts" />

(() => {
    var defaultBackgroundColor = CS580GL.Color.fromRGBUint8(123, 112, 96);
    var defaultBackgroundPixel = new CS580GL.Pixel().setColor(defaultBackgroundColor);

    // ---- Homework 1 ----
    function renderHomework1(rectData: string, flush: (display: CS580GL.Display, toImageFile?: boolean) => void): void {
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
        };

        rectData.trim().split("\n").forEach(renderRectangle);

        flush(display, true);
    }

    // ---- Homework 2 ----

    // Helper function for Homework 2 and beyond: parse triangle data string
    function parseTriangles(trianglesData: string, invertZ: boolean = true): CS580GL.MeshTriangle[] {
        var result = [];

        var parseVertex = (textLine: string): CS580GL.IMeshVertex => {
            var numbers = textLine.trim().split(/\s+/).map(s => parseFloat(s));
            return {
                position: new CS580GL.Vector3(numbers[0], numbers[1], invertZ ? -numbers[2] : numbers[2]),
                normal: new CS580GL.Vector3(numbers[3], numbers[4], invertZ ? -numbers[5] : numbers[5]),
                textureCoordinate: new CS580GL.Vector2(numbers[6], numbers[7])
            };
        };

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

    function renderHomework2(screenPotData: string, flush: (display: CS580GL.Display, toImageFile?: boolean) => void): void {
        var display = new CS580GL.Display(256, 256).reset(defaultBackgroundPixel);
        var renderer = new CS580GL.Renderer(display);
        renderer.shading = CS580GL.ShadingMode.Flat;
        renderer.directionalLights = [
            {
                direction: new CS580GL.Vector3(-0.707, -0.5, -0.5),
                color: new CS580GL.Color(0.95, 0.65, 0.88)
            },
            {
                direction: new CS580GL.Vector3(0.707, 0.5, 0.5),
                color: new CS580GL.Color(0.95, 0.65, 0.88)
            }
        ];

        var triangles = parseTriangles(screenPotData, false);
        for (var i = 0; i < triangles.length; i += 1) {
            renderer.renderScreenTriangle(triangles[i]);
        }

        flush(display, true);
    }

    // ---- Homework 3 ----

    // Helper function for Homework 3 and beyond: create a default camera
    function getDefaultCamera(): CS580GL.Camera {
        return new CS580GL.Camera({
            position: new CS580GL.Vector3(13.2, -8.7, 14.8),
            lookAtTarget: new CS580GL.Vector3(0.8, 0.7, -4.5),
            up: new CS580GL.Vector3(-0.2, 1.0, 0),
            fov: 53.7 / 180 * Math.PI
        });
    }

    // Helper function for Homework 3 and beyond: apply transformations according to parameter settings
    function applyTransformationParams(renderer: CS580GL.Renderer, params: any) {
        renderer.toWorldTransformationStack = [
            CS580GL.Matrix4.makeTranslation(params.translate.x, params.translate.y, params.translate.z),
            CS580GL.Matrix4.makeRotationZ(params.rotate.z),
            CS580GL.Matrix4.makeRotationY(params.rotate.y),
            CS580GL.Matrix4.makeRotationX(params.rotate.x),
            CS580GL.Matrix4.makeScale(params.scale.x, params.scale.y, params.scale.z)
        ];

        renderer.normalTransformationStack = [
            CS580GL.Matrix4.makeRotationZ(params.rotate.z),
            CS580GL.Matrix4.makeRotationY(params.rotate.y),
            CS580GL.Matrix4.makeRotationX(params.rotate.x)
        ];

        if (params.rotateCamera) {
            if (params.rotateCameraY) {
                renderer.camera.position.applyAsHomogeneous(CS580GL.Matrix4.makeRotationY(1 / 180 * Math.PI));
            }
            renderer.camera.updateLookAtMatrix();
        }

        renderer.updateAccumulatedTransformation();
    }

    function renderHomework3(potData: string, getParameters: () => any, flush: (display: CS580GL.Display, toImageFile?: boolean) => void): void {
        var display = new CS580GL.Display(256, 256);

        var renderer = new CS580GL.Renderer(display);
        renderer.camera = getDefaultCamera();

        renderer.shading = CS580GL.ShadingMode.Flat;
        renderer.directionalLights = [
            {
                direction: new CS580GL.Vector3(0.818, 0.523, -0.23),
                color: new CS580GL.Color(0.95, 0.65, 0.88)
            },
            {
                direction: new CS580GL.Vector3(-0.818, -0.523, 0.23),
                color: new CS580GL.Color(0.95, 0.65, 0.88)
            }
        ];

        var triangles = parseTriangles(potData);

        var renderLoop = (toImageFile: boolean = false) => {
            var parameters = getParameters();

            if (parameters.selection !== "hw3") {
                return;
            }

            display.reset(defaultBackgroundPixel);
            applyTransformationParams(renderer, parameters);

            for (var i = 0; i < triangles.length; i += 1) {
                renderer.renderTriangle(triangles[i]);
            }

            flush(display, toImageFile);

            if (parameters.rotateCamera) {
                requestAnimationFrame(() => renderLoop());
            } else {
                setTimeout(() => requestAnimationFrame(() => renderLoop()), 100);
            }
        };

        renderLoop(true);
    }

    // ---- Homework 4 ----

    function renderHomework4(potData: string, getParameters: () => any, flush: (display: CS580GL.Display, toImageFile?: boolean) => void): void {
        var display = new CS580GL.Display(256, 256);

        var renderer = new CS580GL.Renderer(display);
        renderer.camera = getDefaultCamera();

        renderer.ambientCoefficient = 0.1;
        renderer.diffuseCoefficient = 0.7;
        renderer.specularCoefficient = 0.3;
        renderer.shininess = 32;
        renderer.ambientLight = new CS580GL.Color(0.3, 0.3, 0.3);
        renderer.directionalLights = [
            {
                direction: new CS580GL.Vector3(-0.7071, 0.7071, 0),
                color: new CS580GL.Color(0.5, 0.5, 0.9)
            },
            {
                direction: new CS580GL.Vector3(0, -0.7071, 0.7071),
                color: new CS580GL.Color(0.9, 0.2, 0.3)
            },
            {
                direction: new CS580GL.Vector3(0.7071, 0.0, 0.7071),
                color: new CS580GL.Color(0.2, 0.7, 0.3)
            }
        ];

        var triangles = parseTriangles(potData);

        var renderLoop = (toImageFile: boolean = false) => {
            var parameters = getParameters();

            if (parameters.selection !== "hw4") {
                return;
            }

            var oldShading = renderer.shading;
            switch (parameters.shading) {
                case "flat":
                    renderer.shading = CS580GL.ShadingMode.Flat;
                    break;
                case "gouraud":
                    renderer.shading = CS580GL.ShadingMode.Gouraud;
                    break;
                case "phong":
                    renderer.shading = CS580GL.ShadingMode.Phong;
                    break;
                default:
                    debugger;
            }

            display.reset(defaultBackgroundPixel);
            applyTransformationParams(renderer, parameters);

            for (var i = 0; i < triangles.length; i += 1) {
                renderer.renderTriangle(triangles[i]);
            }

            flush(display, toImageFile);

            if (parameters.rotateCamera) {
                requestAnimationFrame(() => renderLoop(oldShading !== renderer.shading));
            } else {
                setTimeout(() => requestAnimationFrame(() => renderLoop(oldShading !== renderer.shading)), 100);
            }
        };

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
        };
        client.send();
    }

    window.onload = () => {
        var canvasElem = <HTMLCanvasElement> document.getElementById("canvas");
        var downloadAnchorElem = <HTMLAnchorElement> document.getElementById("download");
        var selectElem = <HTMLSelectElement> document.getElementById("select");

        var transformControlsElem = <HTMLDivElement> document.getElementById("transform-controls");
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

        var shadingControlsElem = <HTMLDivElement> document.getElementById("shading-controls");
        var shadingElem = <HTMLSelectElement> document.getElementById("shading");

        // Utility function for getting parameters from input elements
        var getParameters = () => {
            var params: any = {
                translate: {
                    x: parseFloat(translateXElem.value),
                    y: parseFloat(translateYElem.value),
                    z: parseFloat(translateZElem.value)
                },
                rotate: {
                    x: parseFloat(rotateXElem.value) / 180 * Math.PI,
                    y: parseFloat(rotateYElem.value) / 180 * Math.PI,
                    z: parseFloat(rotateZElem.value) / 180 * Math.PI
                },
                scale: {
                    x: parseFloat(scaleXElem.value),
                    y: parseFloat(scaleYElem.value),
                    z: parseFloat(scaleZElem.value)
                },
                selection: <string> selectElem.value,
                rotateCameraY: rotateCameraElem.checked,
                shading: shadingElem.value
            };
            params.rotateCamera = params.rotateCameraY;
            return params;
        };

        // Utility function for flushing the Display into both the Canvas and a PPM file
        var flush = (display: CS580GL.Display, toImageFile: boolean = false) => {
            //display.reset(defaultBackgroundPixel); // remove this would be better, but wrong
            display.drawOnCanvas(canvasElem);

            if (toImageFile) {
                downloadAnchorElem.href = URL.createObjectURL(display.toNetpbm());
                downloadAnchorElem.setAttribute('download', 'render-result.ppm');
            }
        };

        // Load data for the selected homework,
        // call the corresponding render function,
        // and flush the rendering result
        var renderSelection = () => {
            URL.revokeObjectURL(downloadAnchorElem.href);
            downloadAnchorElem.href = "#";

            if (selectElem.value === "hw1" || selectElem.value === "hw2") {
                transformControlsElem.style.visibility = "collapse";
            } else {
                transformControlsElem.style.visibility = "visible";
            }

            if (selectElem.value === "hw4") {
                shadingControlsElem.style.visibility = "visible";
            } else {
                shadingControlsElem.style.visibility = "collapse";
            }

            switch (selectElem.value) {
                case "hw1":
                    canvasElem.height = canvasElem.width = 512;
                    loadTextFileAsync("data/rects", text => {
                        renderHomework1(text, flush);
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
                    loadTextFileAsync("data/pot4.asc", text => {
                        renderHomework3(text, getParameters, flush);
                    });
                    break;

                case "hw4":
                    canvasElem.height = canvasElem.width = 256;
                    loadTextFileAsync("data/pot4.asc", text => {
                        renderHomework4(text, getParameters, flush);
                    });
                    break;

                default:
            }
        };

        // Call once after load, and call each time the selection changes
        renderSelection();
        selectElem.onchange = renderSelection;

        // Hook-up input elements and their corresponding output
        var inputElems = document.getElementsByTagName("input");
        var hookUpInputOutput = (i: HTMLInputElement, o: any) => {
            o.value = i.value;
            i.oninput = () => {
                o.value = i.value;
            };
        };
        for (var i = 0; i < inputElems.length; i += 1) {
            var inputElem = inputElems[i];
            var outputElem: any = document.getElementById(inputElem.id + "-output");
            if (outputElem) {
                hookUpInputOutput(inputElem, outputElem);
            }
        }
    };
})();
