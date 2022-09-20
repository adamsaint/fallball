import { Application, Container, Text } from 'pixi.js';

export class Intro {
    app: Application;
    introContent: Container;
    constructor(app: Application) {
        this.app = app;
        this.introContent = new Container();
        this.introContent.x = 200;
        this.introContent.y = 200;
        this.introContent.skew.set(0.03);
    }

    createIntro() {
        this.app.stage.addChild(this.introContent);
        const headline: Text = new Text('Blaseball is Returning',{fontFamily : 'GT Sectra', fontSize: 94, fontWeight: '900', fill : 0xffffff, align : 'left', wordWrap: true, wordWrapWidth: 700, lineHeight: 86});
        const subtext: Text = new Text('After a long hiatus, or a quantum blip, Blaseball is Returning. Everyone’s favorite massively multiplayer horror Internet Blaseball League returns with a Big Bang. Mere seconds after a Black Hole swallowed the League, the Universe, and everyone we came to love (and loathe), a rift opens up over the Desert. ',{fontFamily : 'GT Sectra', fontSize: 28, fontWeight: 'normal', fill : 0xffffff, align : 'left', wordWrap: true, wordWrapWidth: 700});
        subtext.y = 256;
        this.introContent.addChild(headline);
        this.introContent.addChild(subtext);
    }
}