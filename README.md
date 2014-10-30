# soft3.ts

soft3.ts is a small 3D software rendering engine implemented in [Typescript](http://www.typescriptlang.org/), which compiles to Javascript and runs on any modern browswer.

Based on only the most basic operation of "setting the color of the pixel", the entire engine is built up with implementation of 3D transformations, (Gouraud & Phong) shading, texture mapping, and anti-aliasing. Note that, however, since almost everything is Javascript running on CPU, the engine can be too slow for realtime animation if the the object is larger or more complex, or if computationally intensive features (e.g. Phong shading, anti-aliasing) are enabled.

This was a homework project for course [CSCI 580 - 3-D Graphics and Rendering](http://www-bcf.usc.edu/~saty/edu/courses/CS580/f14/).

## Build

When `*.ts` files are modified, it is necessary to regenerate `js/app.js`:

	tsc -d --out js/app.js --target ES5 ts/app.ts

## Run

For an online demo, see [demo](https://tomtung.github.io/soft3.ts/). To run this HTML application locally, you need to start an HTTP server. For example, if you have Python installed, in the folder simply run

	python -m SimpleHTTPServer

then visit [localhost:8000](http://localhost:8000/) in your browser.
