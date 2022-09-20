import { Application, Container, Sprite, Resource, Texture } from 'pixi.js'

type Star = {
	sprite: Sprite,
	z: number,
	x: number,
	y: number,
}

export class Starfield {
    starTexture: Texture<Resource> | undefined;
    stars: Star[];
    starAmount: number;
    cameraZ: number;
    fov: number;
    baseSpeed: number;
    speed: number;
    warpSpeed: number;
    starStretch: number;
    starBaseSize: number;
    app: Application;
    background: Container;

    constructor(app: Application, background: Container) {
        this.app = app;
        this.background = background;
        this.stars = <Star[]>[];
        this.starTexture = Texture.from('star.png');
        this.starAmount = 600;
        this.cameraZ = 0;
        this.fov = 20;
        this.baseSpeed = 0.015;
        this.speed = 0;
        this.warpSpeed = 0;
        this.starStretch = 5;
        this.starBaseSize = 0.2;
    }

    createStars() {
        for (let i = 0; i < this.starAmount; i++) {
            const star = {
                sprite: new Sprite(this.starTexture),
                z: 0,
                x: 0,
                y: 0,
            };
            star.sprite.anchor.x = 0.5;
            star.sprite.anchor.y = 0.7;
            // star.sprite.blendMode = BLEND_MODES.EXCLUSION;
            this.randomizeStar(star, true);
            this.background.addChild(star.sprite);
            this.stars.push(star);
        }
    }

    randomizeStar(star: Star, initial?: boolean) {
        star.z = initial ? Math.random() * 2000 : this.cameraZ + Math.random() * 1000 + 2000;

        // Calculate star positions with radial random coordinate so no star hits the camera.
        const deg = Math.random() * Math.PI * 2;
        const distance = Math.random() * 50 + 1;
        star.x = Math.cos(deg) * distance;
        star.y = Math.sin(deg) * distance;
    }

    update(deltaTime: number) {
        this.speed += (this.warpSpeed - this.speed) / 20;
        this.cameraZ += deltaTime * 10 * (this.speed + this.baseSpeed);
        for (let i = 0; i < this.starAmount; i++) {
            const star = this.stars[i];
            if (star.z < this.cameraZ) this.randomizeStar(star);
    
            // Map star 3d position to 2d with really simple projection
            const z = star.z - this.cameraZ;
            star.sprite.x = star.x * (this.fov / z) * this.app.renderer.screen.width + this.app.renderer.screen.width / 2;
            star.sprite.y = star.y * (this.fov / z) * this.app.renderer.screen.width + this.app.renderer.screen.height / 2;
    
            // Calculate star scale & rotation.
            const dxCenter = star.sprite.x - this.app.renderer.screen.width / 2;
            const dyCenter = star.sprite.y - this.app.renderer.screen.height / 2;
            const distanceCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
            const distanceScale = Math.max(0, (2000 - z) / 2000);
            star.sprite.scale.x = distanceScale * this.starBaseSize;
            // Star is looking towards center so that y axis is towards center.
            // Scale the star depending on how fast we are moving, what the stretchfactor is and depending on how far away it is from the center.
            star.sprite.scale.y = distanceScale * this.starBaseSize + distanceScale * this.speed * this.starStretch * distanceCenter / this.app.renderer.screen.width;
            star.sprite.rotation = Math.atan2(dyCenter, dxCenter) + Math.PI / 2;
        }
    }
}