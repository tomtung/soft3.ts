/// <reference path="soft3/Renderer.ts" />

(() => {
    function parseTriangles(trianglesData: string, invertZ: boolean = true): SOFT3.MeshTriangle[] {
        var result = [];

        var parseVertex = (textLine: string): SOFT3.IMeshVertex => {
            var numbers = textLine.trim().split(/\s+/).map(s => parseFloat(s));
            return {
                position: new SOFT3.Vector3(numbers[0], numbers[1], invertZ ? -numbers[2] : numbers[2]),
                normal: new SOFT3.Vector3(numbers[3], numbers[4], invertZ ? -numbers[5] : numbers[5]),
                textureCoordinate: new SOFT3.Vector2(numbers[6], numbers[7])
            };
        };

        var lines = trianglesData.trim().split(/\r\n?|\r?\n/);
        for (var i = 0; i < lines.length; i += 4) {
            var v1 = parseVertex(lines[i + 1]);
            var v2 = parseVertex(lines[i + 2]);
            var v3 = parseVertex(lines[i + 3]);

            var triangle = new SOFT3.MeshTriangle(v1, v2, v3);
            result.push(triangle);
        }

        return result;
    }

    function applyTransformationParams(renderer: SOFT3.Renderer, params: any) {
        renderer.toWorldTransformationStack = [
            SOFT3.Matrix4.makeTranslation(params.translate.x, params.translate.y, params.translate.z),
            SOFT3.Matrix4.makeRotationZ(params.rotate.z),
            SOFT3.Matrix4.makeRotationY(params.rotate.y),
            SOFT3.Matrix4.makeRotationX(params.rotate.x),
            SOFT3.Matrix4.makeScale(params.scale.x, params.scale.y, params.scale.z)
        ];

        renderer.normalTransformationStack = [
            SOFT3.Matrix4.makeRotationZ(params.rotate.z),
            SOFT3.Matrix4.makeRotationY(params.rotate.y),
            SOFT3.Matrix4.makeRotationX(params.rotate.x)
        ];

        if (params.rotateCamera) {
            if (params.rotateCameraY) {
                renderer.camera.position.applyAsHomogeneous(SOFT3.Matrix4.makeRotationY(1 / 180 * Math.PI));
            }
            renderer.camera.updateLookAtMatrix();
        }

        renderer.updateAccumulatedTransformation();
    }

    function mandelbrotTexture(s: number, t: number): SOFT3.Color {
        var maxNIter = 1000, nIter = 0,
            ca = s * 3.5 - 2.5, cb = t * 2 - 1,
            a = 0, b = 0;
        while (a * a + b * b < 4 * 4 && nIter < maxNIter) {
            var aTemp = a * a - b * b + ca;
            b = 2 * a * b + cb;
            a = aTemp;
            nIter += 1;
        }
        if (nIter >= maxNIter) {
            return new SOFT3.Color(0, 0, 0);
        } else {
            var c = 3 * Math.log(nIter) / Math.log(maxNIter);
            var i = Math.floor(c);
            var f = c - i;
            switch (i) {
                case 0:
                    return new SOFT3.Color(0, 1, f);
                    break;
                case 1:
                    return new SOFT3.Color(0, 1 - f, 1);
                    break;
                case 2:
                    return new SOFT3.Color(f, 0, 1);
                    break;
                default:
                    return new SOFT3.Color(1, 0, 1);
                    break;
            }
        }
    }

    function doRender(dataStr: string, getParameters: () => any, flush: (display: SOFT3.Display, toImageFile?: boolean) => void): void {
        var backgroundPixel = new SOFT3.Pixel().setColor(new SOFT3.Color(0.976, 0.976, 0.976));
        var display = new SOFT3.Display(256, 256);

        var renderer = new SOFT3.Renderer(display);
        renderer.camera = new SOFT3.Camera({
            position: new SOFT3.Vector3(13.2, -8.7, 14.8),
            lookAtTarget: new SOFT3.Vector3(0.8, 0.7, -4.5),
            up: new SOFT3.Vector3(-0.2, 1.0, 0),
            fov: 53.7 / 180 * Math.PI
        });

        renderer.ambientCoefficient = 0.2;
        renderer.diffuseCoefficient = 0.8;
        renderer.specularCoefficient = 0.3;
        renderer.shininess = 32;
        renderer.ambientLight = new SOFT3.Color(0.3, 0.3, 0.3);
        renderer.directionalLights = [
            {
                direction: new SOFT3.Vector3(-0.7071, 0.7071, 0),
                color: new SOFT3.Color(0.5, 0.5, 0.9)
            },
            {
                direction: new SOFT3.Vector3(0, -0.7071, 0.7071),
                color: new SOFT3.Color(0.9, 0.2, 0.3)
            },
            {
                direction: new SOFT3.Vector3(0.7071, 0.0, 0.7071),
                color: new SOFT3.Color(0.2, 0.7, 0.3)
            }
        ];

        var triangles = parseTriangles(dataStr);

        var renderLoop = (toImageFile: boolean = false) => {
            var parameters = getParameters();

            var oldShading = renderer.shading;
            renderer.shading = parameters.shading;

            var oldTexture = renderer.texture;
            renderer.texture = parameters.texture;

            display.reset(backgroundPixel);
            applyTransformationParams(renderer, parameters);

            renderer.renderAllTriangles(triangles, parameters.antiAlias);

            flush(display, toImageFile);

            var updateImageFile = (oldShading !== renderer.shading || oldTexture !== renderer.texture);
            if (parameters.rotateCamera) {
                requestAnimationFrame(() => renderLoop(updateImageFile));
            } else {
                setTimeout(() => requestAnimationFrame(() => renderLoop(updateImageFile)), 100);
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

    // Utility function for loading
    function loadCorsImageDataAsync(src: string, callback: (ImageData) => any): void {
        var canvas = <HTMLCanvasElement> document.createElement("canvas");
        var image = <HTMLImageElement> document.createElement("img");
        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            var context = canvas.getContext('2d');
            context.drawImage(image, 0, 0);
            var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            callback(imageData);
        };
        image.crossOrigin = '';
        image.src = src;
    }

    window.onload = () => {
        var canvasElem = <HTMLCanvasElement> document.getElementById("canvas");
        var downloadAnchorElem = <HTMLAnchorElement> document.getElementById("download");

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

        var shadingElem = <HTMLSelectElement> document.getElementById("shading");
        var textureElem = <HTMLSelectElement> document.getElementById("texture");

        var antiAliasCheckboxElem = <HTMLInputElement> document.getElementById("anti-alias-checkbox");

        var textureContainer = {
            texture: SOFT3.allWhiteTexture = SOFT3.allWhiteTexture
        };

        // Utility function for getting parameters from input elements
        var getParameters = () => {
            var shading: SOFT3.ShadingMode;
            switch (shadingElem.value) {
                case "texture-only":
                    shading = SOFT3.ShadingMode.TextureOnly;
                    break;
                case "flat":
                    shading = SOFT3.ShadingMode.Flat;
                    break;
                case "gouraud":
                    shading = SOFT3.ShadingMode.Gouraud;
                    break;
                case "phong":
                    shading = SOFT3.ShadingMode.Phong;
                    break;
                default:
                    debugger;
            }

            var texture: SOFT3.ITexture;

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
                rotateCameraY: rotateCameraElem.checked,
                shading: shading,
                texture: textureContainer.texture,
                antiAlias: antiAliasCheckboxElem.checked
            };
            params.rotateCamera = params.rotateCameraY;
            return params;
        };

        // Utility function for flushing the Display into both the Canvas and a PPM file
        var flush = (display: SOFT3.Display, toImageFile: boolean = false) => {
            display.drawOnCanvas(canvasElem);

            if (toImageFile) {
                downloadAnchorElem.href = URL.createObjectURL(display.toNetpbm());
                downloadAnchorElem.setAttribute('download', 'render-result.ppm');
            }
        };

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

        // Hook-up texture control events
        textureElem.onchange = () => {
            switch (textureElem.value) {
                case "no-texture":
                    textureContainer.texture = SOFT3.allWhiteTexture;
                    break;
                case "image-texture":
                    loadCorsImageDataAsync("data/texture.jpg", imageData => {
                        textureContainer.texture = SOFT3.makeImageTexture(imageData);
                    });
                    break;
                case "procedural-texture":
                    textureContainer.texture = mandelbrotTexture;
                    break;
                default:
                    debugger;
            }
        };

        URL.revokeObjectURL(downloadAnchorElem.href);
        downloadAnchorElem.href = "#";

        loadTextFileAsync("data/pot.asc", text => {
            doRender(text, getParameters, flush);
        });
    };
})();
