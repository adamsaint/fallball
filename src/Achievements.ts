import { Application, Container, Sprite, Text } from 'pixi.js';


export class Achievements {
    app: Application;
    halo: Sprite;
    achievements: Container;
    background: Container;
    constructor(app: Application, background: Container) {
        this.app = app;
        this.background = background;
        this.achievements = new Container();
        this.achievements.x = this.app.screen.width / 1 * 2.2;
        this.achievements.y = 600;
        this.halo = Sprite.from("halo.png");
    }

    createAchievements() {
        this.achievements.scale.set(0.5);
        const tierOne = new Container();
        const tierTwo = new Container();
        const tierThree = new Container();
        const tierFour = new Container();

        const tierOneSprite = Sprite.from("tier_diamond.png");
        const tierTwoSprite = Sprite.from("tier_diamond.png");
        const tierThreeSprite = Sprite.from("tier_diamond.png");
        const tierFourSprite = Sprite.from("tier_diamond.png");

        const tierOneAmount = new Text('#', {
            fontFamily : 'Sneak',
            fontSize: 84,
            fontWeight: '900',
            fill : 0xffffff,
            align : 'center',
          });
        tierOneAmount.x = 75;
        tierOneAmount.y = 45;

        const tierOneHeader = new Text('Tier 1', {
            fontFamily : 'GT Sectra',
            fontSize: 64,
            fontWeight: '900',
            fill : 0xffffff,
            align : 'center',
          });
        tierOneHeader.x = 0;
        tierOneHeader.y = 208;

        const tierTwoAmount = new Text('#', {
            fontFamily : 'Sneak',
            fontSize: 84,
            fontWeight: '900',
            fill : 0xffffff,
            align : 'center',
          });
        tierTwoAmount.x = 75;
        tierTwoAmount.y = 45;

        const tierTwoHeader = new Text('Tier 2', {
            fontFamily : 'GT Sectra',
            fontSize: 64,
            fontWeight: '900',
            fill : 0xffffff,
            align : 'center',
          });
        tierTwoHeader.x = 0;
        tierTwoHeader.y = 208;

        const tierThreeAmount = new Text('#', {
            fontFamily : 'Sneak',
            fontSize: 84,
            fontWeight: '900',
            fill : 0xffffff,
            align : 'center',
          });
        tierThreeAmount.x = 75;
        tierThreeAmount.y = 45;

        const tierThreeHeader = new Text('Tier 3', {
            fontFamily : 'GT Sectra',
            fontSize: 64,
            fontWeight: '900',
            fill : 0xffffff,
            align : 'center',
          });
        tierThreeHeader.x = 0;
        tierThreeHeader.y = 208;

        const tierFourAmount = new Text('#', {
            fontFamily : 'Sneak',
            fontSize: 84,
            fontWeight: '900',
            fill : 0xffffff,
            align : 'center',
          });
        tierFourAmount.x = 75;
        tierFourAmount.y = 45;

        const tierFourHeader = new Text('Tier 4', {
            fontFamily : 'GT Sectra',
            fontSize: 64,
            fontWeight: '900',
            fill : 0xffffff,
            align : 'center',
          });
        tierFourHeader.x = 0;
        tierFourHeader.y = 208;

        tierOne.addChild(tierOneSprite);
        tierOne.addChild(tierOneAmount);
        tierOne.addChild(tierOneHeader);
        tierTwo.addChild(tierTwoSprite);
        tierTwo.addChild(tierTwoAmount);
        tierTwo.addChild(tierTwoHeader);
        tierThree.addChild(tierThreeSprite);
        tierThree.addChild(tierThreeAmount);
        tierThree.addChild(tierThreeHeader);
        tierFour.addChild(tierFourSprite);
        tierFour.addChild(tierFourAmount);
        tierFour.addChild(tierFourHeader);

        tierOne.scale.set(0.8);
        tierOne.x = -750;
        tierOne.y = -70;
        tierTwo.scale.set(0.8);
        tierTwo.x = -400;
        tierTwo.y = 100;
        tierThree.scale.set(0.8);
        tierThree.x = 100;
        tierThree.y = 100;
        tierFour.scale.set(0.8);
        tierFour.x = 550;
        tierFour.y = -70;
        this.app.stage.addChild(this.achievements);
        this.halo.pivot.set(682, 234);
        // this.halo.x = 1500;
        this.achievements.addChild(this.halo);
        this.achievements.addChild(tierOne);
        this.achievements.addChild(tierTwo);
        this.achievements.addChild(tierThree);
        this.achievements.addChild(tierFour);
    }

    update(deltaTime: number) {
        console.log(deltaTime);
        this.achievements.x = this.app.screen.width / 2 + 325; 
        // this.twist.uniforms.offset = new Point(this.blackHole.x,400);
        // this.bulge.uniforms.center = new Point(this.blackHole.x, 400);
        // this.background.filters
        // this.outerDebris.rotation = this.outerDebris.rotation + this.velocity * deltaTime;
        // this.outerDebrisTex.rotation = this.outerDebris.rotation + this.velocity * deltaTime;
        // this.innerDebris.rotation = this.innerDebris.rotation + this.velocity * 3 * deltaTime;
        // this.innerDebrisDark.rotation = this.innerDebrisDark.rotation + this.velocity * deltaTime;
        // console.log(this.uniforms.time.value);
    }
}