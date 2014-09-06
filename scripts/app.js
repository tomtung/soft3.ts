/// <reference path="glib.ts" />
//
// 2014 Fall - CSCI 580 3D - Graphics Rendering
// by Yubing Dong
//
// ---- Homework 1 ----
function renderHowework1(rectData) {
    var display = new CS580GL.Display(512, 512).reset({
        red: 123,
        green: 112,
        blue: 96,
        alpha: 0xff,
        z: 0
    });

    var scaleRgb = function (value) {
        return Math.round(Math.max(0, Math.min(4095, value)) / 4095 * 255);
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
                display.pixelAt(x, y).setRed(r).setGreen(g).setBlue(b);
            }
        }
    };

    rectData.trim().split("\n").forEach(renderRectangle);

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
                break;

            default:
        }
    };

    // Call once after load, and call each time the selection changes
    renderSelection();
    selectElem.onchange = renderSelection;
};
