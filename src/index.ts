import * as PIXI from "pixi.js";
import { Application, Container, Sprite, WRAP_MODES } from 'pixi.js';
import { gsap } from 'gsap';
import { PixiPlugin } from "gsap/PixiPlugin";

import { Starfield } from './Starfield';
import { Blackhole } from './Blackhole';
import {Achievements} from './Achievements';
// import { Intro } from './Intro';

let count = 0;
gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x000000,
	backgroundAlpha: 1,
	antialias: true,
	width: document.body.clientWidth,
	height: 1200,
});

function introAnim() {
	const heroContainer = document.getElementsByClassName('hero-container');
	gsap.to(heroContainer, {opacity: 1, transform: "perspective(1000px) rotateY(15deg)", duration: 2, ease: 'circ'});
}

function handleHeroCTAClick() {
	const signUp = document.getElementById('sign-up');
	const intro = document.getElementsByClassName('intro');
	const heroContainer = document.getElementsByClassName('hero-container');
	blackhole.grow(1.4);
	gsap.to(intro, {display: 'block', transform: "scale(0.75)", opacity: 0, duration: 0.5, ease: 'circ'});
	gsap.to(signUp, {display: 'flex', transform: "scale(1)", opacity: 1, duration: 0.5, ease: 'circ'});
	gsap.to(heroContainer, {transform: "perspective(1000px) rotateY(10deg)", duration: 2, ease: 'circ'});
};

function handleSignUpClick() {
	const heroContainer = document.getElementsByClassName('hero-container');
	blackhole.grow(0.75);
	gsap.to(heroContainer, {opacity: 0, transform: "perspective(1000px) rotateY(15deg)", duration: 1, ease: 'circ'});
	gsap.to(background, {pixi:{scale: 0.98, alpha: 0.05}, ease: 'slow', duration: 2});
	gsap.to(achievements.achievements, {pixi:{scale: 0.8, alpha: 0.0}, ease: 'slow', duration: 2});
};


function setup() {
	const cta = document.getElementById('cta-hero');
	const teamUp = document.getElementById('sign-up-submit');

	cta?.addEventListener("click", handleHeroCTAClick, false);
	teamUp?.addEventListener("click", handleSignUpClick, false);
}

const background = new Container();
app.stage.addChild(background);
const starfield = new Starfield(app, background);
const blackhole = new Blackhole(app, background);
const achievements = new Achievements(app, background);
// const intro = new Intro(app);
achievements.createAchievements();
starfield.createStars();
blackhole.createBlackhole();
setup();
introAnim();
blackhole.grow(1.2);
// intro.createIntro();

// Listen for animate update
app.ticker.add((delta) => {
	app.renderer.resize(document.body.clientWidth, 1200);
	achievements.update(delta);
	blackhole.update(delta);
	starfield.update(delta);
	blackhole.update(delta);
	app.render();

	displacementSprite.x = count*0;
	displacementSprite.y = count*0;

	count += 0.05;
	
	// mesh.rotationQuaternion.setEulerAngles(0, rotation++, 0)
});

let displacementSprite = Sprite.from('noise_map3.png');
displacementSprite.texture.baseTexture.wrapMode = WRAP_MODES.MIRRORED_REPEAT;
// let displacementFilter = new filters.DisplacementFilter(displacementSprite)

displacementSprite.scale.y = 0.1;
displacementSprite.scale.x = 0.1;
displacementSprite.y = 30;
displacementSprite.x = 50;
// app.stage.addChild(displacementSprite);