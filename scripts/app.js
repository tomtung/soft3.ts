﻿/// <reference path="glib.ts" />
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

    var drawRectangleLine = function (line) {
        var numbers = line.split("\t").map(function (n) {
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

    rectData.trim().split("\n").forEach(drawRectangleLine);

    return display;
}

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

    var flush = function (display) {
        display.drawOnCanvas(canvasElem);

        URL.revokeObjectURL(downloadAnchorElem.href);
        downloadAnchorElem.href = URL.createObjectURL(display.toNetpbm());
        downloadAnchorElem.setAttribute('download', 'render-result.ppm');
    };

    var renderSelection = function () {
        switch (selectElem.value) {
            case "hw1":
                loadTextFileAsync("data/rects", function (text) {
                    flush(renderHowework1(text));
                });
                break;
            default:
        }
    };

    renderSelection();
    selectElem.onchange = renderSelection;
};
