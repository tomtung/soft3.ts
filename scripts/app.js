/// <reference path="glib.ts" />
//
// 2014 Fall - CSCI 580 3D - Graphics Rendering
// by Yubing Dong
//
var defaultBackgroundColor = CS580GL.Color.fromRGBUint8(123, 112, 96);
var defaultBackgroundPixel = new CS580GL.Pixel().setColor(defaultBackgroundColor);

// ---- Homework 1 ----
function renderHowework1(rectData) {
    var display = new CS580GL.Display(512, 512).reset(defaultBackgroundPixel);

    var scaleRgb = function (value) {
        return Math.round(CS580GL.clamp(value, 0, 4095) / 4095 * 255);
    };

    var renderRectangle = function (dataLine) {
        var numbers = dataLine.split("\t").map(function (n) {
            return parseInt(n);
        });
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

    return display;
}

// ---- Homework 2 ----
function renderHomework2(pot4Data) {
    var display = new CS580GL.Display(256, 256).reset(defaultBackgroundPixel);

    function parseVertex(textLine) {
        var numbers = textLine.trim().split(/\s+/).map(function (s) {
            return parseFloat(s);
        });
        return {
            position: new CS580GL.Vector3(numbers[0], numbers[1], numbers[2]),
            normal: new CS580GL.Vector3(numbers[3], numbers[4], numbers[5]),
            uv: new CS580GL.Vector2(numbers[6], numbers[7])
        };
    }

    function simpleShading(normal) {
        var light = new CS580GL.Vector3(0.707, 0.5, 0.5);
        var coef = CS580GL.Vector3.dot(normal, light);
        if (coef < 0) {
            coef = -coef;
        }
        if (coef > 1) {
            coef > 1;
        }
        return new CS580GL.Color(0.95, 0.65, 0.88).multiplyScalar(coef);
    }

    var lines = pot4Data.trim().split("\r");
    for (var i = 0; i < lines.length; i += 4) {
        var v1 = parseVertex(lines[i + 1]);
        var v2 = parseVertex(lines[i + 2]);
        var v3 = parseVertex(lines[i + 3]);

        var triangle = new CS580GL.Triangle(v1.position, v2.position, v3.position);
        var flatColor = simpleShading(v1.normal);
        // TODO render it on display
    }

    return display;
}

// Utility function for loading text file content
function loadTextFileAsync(url, callback) {
    var client = new XMLHttpRequest();
    client.open('GET', url);
    client.onreadystatechange = function () {
        if (client.readyState === XMLHttpRequest.DONE) {
            callback(client.responseText);
        }
    };
    client.send();
}

window.onload = function () {
    var canvasElem = document.getElementById("canvas");
    var downloadAnchorElem = document.getElementById("download");
    var selectElem = document.getElementById("select");

    // Utility function for flushing the Display into both the Canvas and a PPM file
    var flush = function (display) {
        display.drawOnCanvas(canvasElem);

        downloadAnchorElem.href = URL.createObjectURL(display.toNetpbm());
        downloadAnchorElem.setAttribute('download', 'render-result.ppm');
    };

    // Load data for the selected homework,
    // call the corresponding render function,
    // and flush the rendering result
    var renderSelection = function () {
        URL.revokeObjectURL(downloadAnchorElem.href);
        downloadAnchorElem.href = "#";

        switch (selectElem.value) {
            case "hw1":
                canvasElem.height = canvasElem.width = 512;
                loadTextFileAsync("data/rects", function (text) {
                    flush(renderHowework1(text));
                });
                break;

            case "hw2":
                canvasElem.height = canvasElem.width = 256;
                loadTextFileAsync("data/pot4.screen.asc", function (text) {
                    flush(renderHomework2(text));
                });
                break;

            default:
        }
    };

    // Call once after load, and call each time the selection changes
    renderSelection();
    selectElem.onchange = renderSelection;
};
