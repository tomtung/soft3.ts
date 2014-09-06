﻿/// <reference path="glib.ts" />

//
// 2014 Fall - CSCI 580 3D - Graphics Rendering
// by Yubing Dong
//

// ---- Homework 1 ----
function renderHowework1(rectData: string): CS580GL.Display {
    var display = new CS580GL.Display(512, 512).reset({
        redUint8: 123,
        greenUint8: 112,
        blueUint8: 96,
        alphaUint8: 0xff,
        z: 0
    });

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

    return display;
}

// ---- Homework 2 ----

function renderHomework2(pot4Data: string): CS580GL.Display {
    var display = new CS580GL.Display(256, 256).reset({
        redUint8: 123,
        greenUint8: 112,
        blueUint8: 96,
        alphaUint8: 0xff,
        z: 0
    });

    var lines = pot4Data.trim().split("\r");
    for (var i = 0; i < lines.length; i += 4) {
        
    }

    // TODO

    return display;
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

    // Utility function for flushing the Display into both the Canvas and a PPM file
    var flush = (display: CS580GL.Display) => {
        display.drawOnCanvas(canvasElem);

        downloadAnchorElem.href = URL.createObjectURL(display.toNetpbm());
        downloadAnchorElem.setAttribute('download', 'render-result.ppm');
    }

    // Load data for the selected homework,
    // call the corresponding render function,
    // and flush the rendering result
    var renderSelection = () => {
        URL.revokeObjectURL(downloadAnchorElem.href);
        downloadAnchorElem.href = "#";

        switch (selectElem.value) {
            case "hw1":
                canvasElem.height = canvasElem.width = 512;
                loadTextFileAsync("data/rects", text => {
                    flush(renderHowework1(text));
                });
                break;
            
            case "hw2":
                canvasElem.height = canvasElem.width = 256;
                loadTextFileAsync("data/pot4.screen.asc", text => {
                    flush(renderHomework2(text));
                })
                break;

            default:
        }
    };

    // Call once after load, and call each time the selection changes
    renderSelection();
    selectElem.onchange = renderSelection;
};
