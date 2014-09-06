/// <reference path="glib.ts" />

function renderHowework1(rectData: string): CS580GL.Display {
    var display = new CS580GL.Display(512, 512).reset({
        red: 123,
        green: 112,
        blue: 96,
        alpha: 0xff,
        z: 0
    });

    var scaleRgb = (value: number) =>
        Math.round(
            Math.max(0, Math.min(4095, value)) / 4095 * 255
        );

    var drawRectangleLine = (line: string) => {
        var numbers = line.split("\t").map(n => parseInt(n));
        var r = scaleRgb(numbers[4]);
        var g = scaleRgb(numbers[5]);
        var b = scaleRgb(numbers[6]);
        for (var x = Math.max(0, numbers[0]); x <= Math.min(numbers[2], 511); x++) {
            for (var y = Math.max(0, numbers[1]); y <= Math.min(numbers[3], 511); y++) {
                display.pixelAt(x, y).setRed(r).setGreen(g).setBlue(b);
            }
        }
    }

    rectData.trim().split("\n").forEach(drawRectangleLine);

    return display;
}

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

    var flush = (display: CS580GL.Display) => {
        display.drawOnCanvas(canvasElem);

        URL.revokeObjectURL(downloadAnchorElem.href);
        downloadAnchorElem.href = URL.createObjectURL(display.toNetpbm());
        downloadAnchorElem.setAttribute('download', 'render-result.ppm');
    }

    var renderSelection = () => {
        switch (selectElem.value) {
            case "hw1":
                loadTextFileAsync("data/rects", text => {
                    flush(renderHowework1(text));
                })
            break;
            default:
        }
    };

    renderSelection();
    selectElem.onchange = renderSelection;
};
