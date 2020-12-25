import * as z0 from './z0/z0.js';
import { TextureManager } from './z0/graphics/texturemanager.js';
import { Scene } from './z0/tree/scene.js';
import * as Key from './z0/input/key.js';
import { Sprite2D } from './z0/graphics/sprite2d.js';
import { ShaderSprite2D } from './z0/graphics/shadersprite2d.js';
import { Fractal, Julia, Mandelbrot } from './fractal/shader.js';

let canvas = document.querySelector('canvas');

canvas.width = window.innerWidth * .96;
canvas.height = window.innerHeight * .96;

z0._init(canvas)

class Main extends Scene {
    mandelbrot;
    julia;
    renderer;
    tlX = 0; 
    tlY = 1;
    scale = 2;
    rot = 0;

    constructor() {
        super(2000)
    }

    _start() {
        let image = loadImage('./controls.png');

        Promise.all([image]).then((images) => {
            this.juliaFractal = new Julia();
            this.mandelbrotFractal = new Mandelbrot();
            this.mandelbrot = new ShaderSprite2D(null, this.mandelbrotFractal, canvas.width / 2, canvas.height / 2, canvas.width, canvas.height, 0, 1);
            this.julia = new ShaderSprite2D(null, this.juliaFractal, canvas.width / 2, canvas.height / 2, canvas.width, canvas.height, 0, 1);
            this.julia.setVisible(false);

            TextureManager.image = TextureManager.addTexture(images[0]);
            this.controls = new Sprite2D(null, TextureManager.image, canvas.width - 512 / 2, canvas.height - 256 / 2 + 40, 512, 256, 0, 5);

            z0._startUpdates();
        });
    }

    _update(delta) {
        let multiplier = this.scale / 2;

        if(Key.isKeyDown('a')) {
            this.tlX -= delta * multiplier;
        }

        if(Key.isKeyDown('d')) {
            this.tlX += delta * multiplier;
        }

        if(Key.isKeyDown('w')) {
            this.tlY += delta * multiplier;
        }

        if(Key.isKeyDown('s')) {
            this.tlY -= delta * multiplier;
        }

        if(Key.isKeyDown('q')) {
            this.scale += delta * multiplier;
            this.controls.setVisible(false);
        }

        if(Key.isKeyDown('e')) {
            this.scale -= delta * multiplier;
            this.controls.setVisible(false);
        }

        if(Key.isKeyDown('j')) {
            this.julia.setVisible(true);
            this.mandelbrot.setVisible(false);
        } else if (Key.isKeyDown('m')) {
            this.julia.setVisible(false);
            this.mandelbrot.setVisible(true);
        }

        if(!(window.innerWidth * .96 === canvas.width && window.innerHeight * .96 === canvas.height)) {
            canvas.width = window.innerWidth * .96;
            canvas.height = window.innerHeight * .96;
            this.mandelbrot.setWidth(canvas.width);
            this.mandelbrot.setHeight(canvas.height);
            this.mandelbrot.setLoc(canvas.width / 2, canvas.height / 2);
            this.julia.setWidth(canvas.width);
            this.julia.setHeight(canvas.height);
            this.julia.setLoc(canvas.width / 2, canvas.height / 2);
        }

        this.mandelbrotFractal.update(this.tlX, this.tlY, this.scale, this.rot);
        this.juliaFractal.update(this.tlX, this.tlY, this.scale, this.rot);
    } 
}


let main = z0.getTree().addScene(new Main())
z0.getTree().setActiveScene(main);

function loadImage(url) {
    return new Promise((res, rej) => {
        let image = new Image();
        image.addEventListener('load', () => {
            res(image);
        });
        image.addEventListener('error', () => {
            rej();
        })
        image.src = url;
    })
}

class vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
