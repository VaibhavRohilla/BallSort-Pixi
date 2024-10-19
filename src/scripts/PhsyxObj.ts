import { Bodies } from "matter-js";
import { Graphics, Sprite } from "pixi.js";
import { Globals } from "./Globals";
import { Scene } from "./Scene";

export class planes {
    grapics: Graphics;
    physicsBody: any;
    constructor(
        Container: Scene,
        Positions: { x: number; y: number },
        scale: { x: number; y: number },
        color: number = 0x90d0f7
    ) {

        this.grapics = new Graphics();
        this.grapics.beginFill(0x90d0f7, 0.1);
        this.grapics.drawRoundedRect(
            0, 0,
            scale.x,
            scale.y,
            20
        );

        this.physicsBody = Bodies.rectangle(
            Positions.x,
            Positions.y,
            scale.x,
            scale.y,
            { isStatic: true, restitution: 0.1, density: 1, mass: 1 }
        );
        console.log(this.physicsBody.position);
        this.grapics.position.set(this.physicsBody.position.x, this.physicsBody.position.y);
        this.grapics.endFill();

        return this;
    }

}

export class PhysxObject {
    graphics: Sprite;
    index: number = -1;
    constructor(
        container: Scene,
        Positions: { x: number; y: number },
        index: number,
        emojiChoice: string
    ) {
        let scale = 0.3;

        if (emojiChoice === "moneyBag") {
            scale = 0.7;
        }
        this.graphics = new Sprite(Globals.resources[emojiChoice].texture);
        this.graphics.scale.set(scale);
        this.graphics.anchor.set(0.5);
        this.graphics.x = Positions.x;
        this.graphics.y = Positions.y;
        this.index = index;
        container.mainContainer.addChild(this.graphics);
        return this;
    }

}