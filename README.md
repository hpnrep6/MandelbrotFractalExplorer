## Description

A Mandelbrot and Julia set fractal explorer implented using WebGL.

[Live version](https://hpnrep6.github.io/MandelbrotFractalExplorer/)

![Screenshot of fractal explorer](https://github.com/hpnrep6/MandelbrotFractalExplorer/blob/master/screenshot.png)

## Controls

- [W][A][S][D] - Move around
- [Q][E] - Zoom out/in
- [M][J] - Switch between viewing the Mandelbrot set and the Julia set

## Issues

- Because this is implemented in a WebGL fragment shader, there will be floating point precision issues when the zoomed in a lot, resulting in the fractal becoming pixelated.
