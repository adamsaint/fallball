import * as PIXI from "pixi.js";
import { Application, BLEND_MODES, Container, Filter, Graphics, Point, Sprite, Texture } from 'pixi.js';
import { AdvancedBloomFilter } from '@pixi/filter-advanced-bloom';
import { BulgePinchFilter, BulgePinchFilterOptions } from '@pixi/filter-bulge-pinch';
import { TwistFilter, TwistFilterOptions } from '@pixi/filter-twist';
import { Color, Light, LightType, LightingEnvironment, StandardMaterial } from 'pixi3d';
import { gsap } from 'gsap';
import { PixiPlugin } from "gsap/PixiPlugin";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const frag = `
uniform vec3      u_resolution;           // viewport resolution (in pixels)
uniform float     u_time;                 // shader playback time (in seconds)
uniform float     iTimeDelta;            // render time (in seconds)
uniform int       iFrame;                // shader playback frame
uniform float     iChannelTime[4];       // channel playback time (in seconds)
uniform vec3      iChannelResolution[4]; // channel resolution (in pixels)
uniform vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
uniform sampler2D   u_image;                 // input channel. XX = 2D/Cube
uniform sampler2D   u_tex;                 // input channel. XX = 2D/Cube
uniform vec4      iDate;                 // (year, month, day, time in seconds)
uniform float     iSampleRate;           // sound sample rate (i.e., 44100)

void main()
{
    vec2 uv = (gl_FragCoord.xy-0.5*u_resolution.xy)/u_resolution.x + vec2(0.2);
    //vec2 mousePos = (iMouse.xy-0.5*u_resolution.xy)/u_resolution.x + vec2(0.5);
    
    // The position of the black hole
    //vec2 pos = vec2(cos(u_time)*0.25+0.5, sin(u_time)*0.1+0.5);
    vec2 pos = vec2(0.03, 0.03);
    //vec2 pos = mousePos;
    
    // The distance of the pixel from the black hole
    float radius = length(uv - pos);
    
    // The angle between the pixel and the black hole
    float angle = atan(uv.y - pos.y, uv.x - pos.x);
    
    // How much the light is bent
    float bend = 0.01 / radius;
    
    // Bend the light towards the black hole
    uv += -bend * vec2(cos(angle), sin(angle));

    // Sample the texture
    vec4 col = texture2D(u_tex, uv);
    
    // The black part of the black hole
    col *= smoothstep(1.0, 0.9, bend);
    
    // A little fade on the right
    col *= smoothstep(1.0, 0.0, uv.x);

    // Output to screen
    gl_FragColor = vec4(col);
}
`;

// const vert = `
// attribute vec2 a_position;
// attribute vec2 a_texCoord;

// varying vec2 v_texCoord;
// void main() {
//   gl_Position = vec4(a_position, 0, 1);
//   v_texCoord = a_texCoord;
// }
// `;

// const uniforms = {
//     time: {
//         type: "f",
//         value: 0.0
//     }
// }

export class Blackhole {
    app: Application;
    velocity: number;
    blackHole: Container;
    outerDebris: Sprite;
    innerDebris: Sprite;
    innerDebrisDark: Sprite;
    lensShader: Filter;
    uniforms:any;
    bloom: AdvancedBloomFilter;
    currentTime: number;
    startTime: number;
    outerDebrisTex: any;
    bulge: BulgePinchFilter;
    twist: TwistFilter;
    bulgeOptions: BulgePinchFilterOptions;
    twistOptions: TwistFilterOptions;
    background: Container;
    nebulae: Sprite;
    hole: any;
    material: StandardMaterial;
    holeColor: Color;

    constructor(app: Application, background: Container) {
        this.app = app;
        this.background = background;
        this.velocity = 0.0001;
        this.startTime = new Date().getTime();
        this.currentTime = new Date().getTime();
        this.holeColor = Color.fromHex("#111111");
        this.material = new StandardMaterial();
        this.hole = new Graphics();
        this.blackHole = new Container();
        this.blackHole.x = this.app.screen.width / 3 * 2.5;
        this.blackHole.y = 200;
        this.outerDebris = Sprite.from("outer_debris.png");
        this.outerDebrisTex = Texture.from("outer_debris.png");
        this.innerDebris = Sprite.from("inner_debris.png");
        this.innerDebrisDark = Sprite.from("inner_debris_dark.png");
        this.nebulae = Sprite.from("nebulae.png");
        this.uniforms = {
            u_time: 0.0,
            u_resolution: [this.app.screen.width*2, this.app.screen.height*2],
            u_mouse: [50.0,50.0,50.0],
            u_tex: null,
        }
        this.lensShader = new Filter('', frag, this.uniforms);
        this.bulgeOptions = {radius: 300, strength: 1, center: new Point(this.blackHole.x,400)};
        this.twistOptions = {angle: 10, radius: 300, padding: 0, offset: new Point(this.blackHole.x,400)};
        this.bloom = new AdvancedBloomFilter();
        this.bulge = new BulgePinchFilter(this.bulgeOptions);
        this.twist = new TwistFilter(this.twistOptions);
    }

    createBlackhole() {
        this.blackHole.scale.set(0.5);
        this.background.addChild(this.blackHole);

        this.outerDebris.pivot.set(985, 949);
        this.innerDebris.pivot.set(700,700);
        this.innerDebrisDark.pivot.set(700,700);
        this.innerDebrisDark.scale.set(0.7);
        this.nebulae.position.x = -1200;
        this.nebulae.scale.set(1.2);

        this.blackHole.addChild(this.nebulae);
        this.blackHole.addChild(this.outerDebris);
        this.blackHole.addChild(this.innerDebris);
        // this.blackHole.addChild(this.innerDebrisDark);

        // material.baseColor = Color.fromHex("#111111");
        // material.roughness = 1;
        // let mesh = Mesh3D.createSphere(material);
        // this.hole.position.x = 1.5;
        // this.hole.position.y = 1;
        // this.hole.scale.set(1.3);
        // mesh.material.baseColor = Color.fromHex("#ffefd5");
        LightingEnvironment.main.lights.push(
            Object.assign(new Light(), { type: LightType.directional, intensity: 2000, range: 500, x: 0, z: -20 }))
        // let rotation: number = 0;
        // this.app.stage.addChild(this.hole);
        this.background.filters = [this.bloom, this.bulge, this.twist];

        // this.hole.position.x = this.blackHole.x;
        this.hole.position.y = 350;
        // Add a circle
        this.hole.lineStyle(5, 0xffffff, 1);
        this.hole.beginFill(0x000000, 1);
        this.hole.drawEllipse(0, 0, 175, 175);
        this.hole.blendMode = BLEND_MODES.MULTIPLY;
        this.hole.endFill();
        this.app.stage.addChild(this.hole);
    }

    grow(amount: number) {
        gsap.to(this.hole, {pixi:{scale: amount}, ease: 'slow', duration: 5});
    }

    update(deltaTime: number) {
        this.blackHole.x = this.app.screen.width / 2 + 325;
        this.hole.position.x = this.blackHole.x;
        this.twist.uniforms.offset = new Point(this.blackHole.x,400);
        this.bulge.uniforms.center = new Point(this.blackHole.x, 400);
        this.background.filters
        this.outerDebris.rotation = this.outerDebris.rotation + this.velocity * deltaTime;
        this.outerDebrisTex.rotation = this.outerDebris.rotation + this.velocity * deltaTime;
        this.innerDebris.rotation = this.innerDebris.rotation + this.velocity * 2 * deltaTime;
        this.innerDebrisDark.rotation = this.innerDebrisDark.rotation + this.velocity * deltaTime;
        // console.log(this.uniforms.time.value);
    }
}