import { ShaderSprite2DRenderer } from '../z0/graphics/shadersprite2d.js';
import { getGL, getCanvas } from '../z0/var.js';

const mandelbrot = `

    #define iterations 400.

    precision highp float;

    varying vec2 vTexCoord;
    varying float vAlpha;
    
    uniform sampler2D uSampler;

    uniform mediump vec2 uRes;
    uniform mediump float uTime;
    uniform mediump float uTimeDelta;

    uniform vec2 uTranslate;
    uniform float uScale;
    uniform float uRot;

    
    vec2 rotate(vec2 p, vec2 o, float r) {
        float c = cos(uRot), s = sin(uRot);

        p -= o;

        p = vec2(
            p.x * c - p.y * s,
            p.x * s + p.y * c
        );

        p += o;

        return p;
    }

    void main() {
        vec2 fragCoord = gl_FragCoord.xy;

        float iTime = uTime / 1000.;

        vec2 uv = (fragCoord/max(uRes.x, uRes.y) - .5) * 2.;

        uv *= max(uScale, 0.);

        uv += uTranslate;

        uv = rotate(uv, vec2(uTranslate), uRot);

        vec2 z;
        
        float iters;
        
        for(float iter = 0.; iter < iterations; iter++) {
            z = vec2(z.x*z.x-z.y*z.y, z.x * z.y+z.y*z.x) + uv;
            if(length(z) > 2.) {
                iters = iter;
                break;
            }
        }
        
        vec3 col;
        col.x = pow(iters / iterations, .9);

        gl_FragColor = vec4(col, 1.0);
    }
`

const julia = `

    #define iterations 400.

    precision highp float;

    varying vec2 vTexCoord;
    varying float vAlpha;
    
    uniform sampler2D uSampler;

    uniform mediump vec2 uRes;
    uniform mediump float uTime;
    uniform mediump float uTimeDelta;

    uniform vec2 uTranslate;
    uniform float uScale;
    uniform float uRot;

    
    vec2 rotate(vec2 p, vec2 o, float r) {
        float c = cos(uRot), s = sin(uRot);

        p -= o;

        p = vec2(
            p.x * c - p.y * s,
            p.x * s + p.y * c
        );

        p += o;

        return p;
    }

    float absCos(float f) {
        return (cos(f) * .5) + .5;
    }

    void main() {
        vec2 fragCoord = gl_FragCoord.xy;

        float iTime = uTime / 1000.;

        vec2 uv = (fragCoord/max(uRes.x, uRes.y) - .5) * 2.;

        uv *= max(uScale, 0.);

        uv += uTranslate;

        uv = rotate(uv, vec2(uTranslate), uRot);

        vec2 z = uv;// = uv;
        
        float iters;
        vec3 col = vec3(0,0,0);

        for(float iter = 0.; iter < iterations; iter++) {
            z = vec2(z.x*z.x-z.y*z.y,z.x*z.y+z.y*z.x) + vec2(0.285, 0.01);
            float m = dot(z, z);

            if(m > 4.) {
                iters = iter;
                break;
            }
        }
        
        //vec3 col;
        col += pow(iters / iterations, .9);

        
        gl_FragColor = vec4(col, 1.0);
    }
`

export class Fractal extends ShaderSprite2DRenderer {
    tlX = 0;
    tlY = 0;
    scale = 1;
    rot = 0.7;

    tlLoc;
    scaleLoc;
    uRot;

    constructor(shader) {
        super(getGL(), getCanvas(), null, shader);
        this.scaleLoc = this.getUniformLocation('uScale');
        this.tlLoc = this.getUniformLocation('uTranslate');
        this.rotLoc = this.getULoc('uRot');
    }

    update(tlX, tlY, scale, rot) {
        this.tlX = tlX;
        this.tlY = tlY;
        this.scale = scale;
        this.rot = rot;
    }

    setUniforms(gl) {
        this.setVec2(this.tlLoc, this.tlX, this.tlY);
        this.setFloat(this.scaleLoc, this.scale);
        this.setFloat(this.rotLoc, this.rot);
    }
}

export class Mandelbrot extends Fractal {
    constructor() {
        super(mandelbrot);
    }
}

export class Julia extends Fractal {
    constructor() {
        super(julia);
    }
}
