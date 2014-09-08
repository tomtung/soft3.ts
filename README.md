This is a software implementation of a 3-D graphics engine by [Yubing Dong](https://github.com/tomtung/) for course [CSCI 580 - 3-D Graphics and Rendering](http://www-bcf.usc.edu/~saty/edu/courses/CS580/f14/) in the Fall 2014 semester. See [demo](https://tomtung.github.io/CS580/).

## Build

To generate `js/app.js`:

	tsc -d --out js/app.js --target ES5 ts/app.ts

## API Changes

This engine is implemented from scratch using [TypeScript](http://www.typescriptlang.org/) / JavaScript, in which the C-style API given in the homework doesn't always make sense. The API has therefore been redesigned. A comparison table is shown below.

|	C-style API	|	JavaScript API	|
|	-------------	|	-----------	|
|	`GzNewFrameBuffer`,`GzNewDisplay`	|	Constructor `Display`	|
|	`GzFreeDisplay`	|	(Unnecessary)	|
|	`GzGetDisplayParams`	| (Unsupported)	|
|	`GzInitDisplay`	|	`Display.prototype.reset`	|
|	`GzPutDisplay`, `GzGetDisplay`	|	`Display.prototype.pixelAt` returns a `PixelRef` object, which supports get/set operation	|
|	`GzFlushDisplay2File`	|	`Display.prototype.toNetpbm`	|
|	`GzFlushDisplay2FrameBuffer`	|	`Display.prototype.drawOnCanvas`	|
|	`GzNewRender`	|	Constructor `Renderer`	|
|	`GzFreeRender`	|	(Unnecessary)	|
|	`GzBeginRender`	|	`Display.prototype.reset`	|
|	`GzPutAttribute`	|	`Renderer.prototype.setAttributes`	|
|	`GzPutTriangle`	|	`Renderer.prototype.renderTriangle`	|
