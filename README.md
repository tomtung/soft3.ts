This is a software implementation of a 3-D graphics engine by [Yubing Dong](https://github.com/tomtung/) for course [CSCI 580 - 3-D Graphics and Rendering](http://www-bcf.usc.edu/~saty/edu/courses/CS580/f14/) in the Fall 2014 semester.

For an online demo, see [demo](https://tomtung.github.io/CS580/). To run this HTML application locally, you need to start an HTTP server. For example, if you have Python installed, in the folder simply run

	python -m SimpleHTTPServer

then visit [localhost:8000](http://localhost:8000/) in your browser.

## Build

When `*.ts` files are modified, it is necessary to regenerate `js/app.js`:

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
|	`GzPutAttribute`	|	Directly set field values of a `Renderer` object.	|
|	`GzPutTriangle`	|	`Renderer.prototype.renderTriangle`	|
|	`GzRotXMat`	|	`Matrix4.prototype.makeRotationX`	|
|	`GzRotYMat`	|	`Matrix4.prototype.makeRotationY`	|
|	`GzRotZMat`	|	`Matrix4.prototype.makeRotationZ`	|
|	`GzTrxMat`	|	`Matrix4.prototype.makeTranslation`	|
|	`GzScaleMat`	|	`Matrix4.prototype.makeScale`	|
|	`GzPutCamera`	|	Set `camera` property on a `Renderer` object with a `Camera` object	|
|	`GzPushMatrix`, `GzPushMatrix`	|	Modify `toWorldTransformationStack` property on a `Renderer` object	|
