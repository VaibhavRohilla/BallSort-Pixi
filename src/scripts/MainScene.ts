import Matter, { Composite, Composites, Bodies, Contact } from "matter-js";
import { Graphics, isMobile, Sprite, TextureLoader } from "pixi.js";
import { config } from "./appConfig";
import { clawInit } from "./Claw";
import { getRandomChoice, Globals } from "./Globals";
import { Scene } from "./Scene";
import { TextLabel } from "./TextLabel";
import { fetchGlobalPosition } from "./Utilities";
import { copyFile } from "fs";
import { clear } from "console";
import { PhysxObject, planes } from "./PhsyxObj";
import { UI } from "./UI";

export const poolObject: Graphics = new Graphics();
export const poolPrize: Graphics = new Graphics();

export class MainScene extends Scene {
  physxObjects: PhysxObject[] = [];

  claw: clawInit;
  UI: UI;
  interactiveLayer: Graphics;
  phsyxBodystack: any;
  constructor() {
    super(0x90d0f7);
    this.interactiveLayer = this.interactiveLayerInit();
    this.walls();
    this.addEmojis();
    this.prizePool();
    this.claw = new clawInit(this);


    this.UI = new UI(this);
  }
  onPointerDown(e: any) {
    this.callMoveClaw(e);
  }
  resize(): void {
    super.resize();
    this.interactiveLayer.clear();
    this.interactiveLayer.beginFill(0x000000, 0.1);
    this.interactiveLayer.drawRect(0, 0, window.innerWidth , config.logicalHeight * 2);
    this.interactiveLayer.endFill();

    this.UI.resize();
    
    poolObject.clear();
    poolObject.lineStyle(1, 0x000000, 1);
    poolObject.beginFill(0xD4D5D5);
    poolObject.drawRect(
      0,
      0,
      400 *config.minScaleFactor,
      1000*config.minScaleFactor
    );
    poolObject.endFill();
    poolObject.position.set(window.innerWidth - 400*config.minScaleFactor, window.innerHeight - poolObject.height);
    poolPrize.clear();
    poolPrize.lineStyle(1, 0x000000, 1);

    poolPrize.beginFill(0xD4D5D5);
    poolPrize.drawRect(
      0,
      0,
      400 * config.minScaleFactor,
      200 * config.minScaleFactor
    );
    poolPrize.endFill();

    poolPrize.children[0].scale.set(2*config.minScaleFactor);
    poolPrize.children[0].position.set(
      poolPrize.width / 2 ,
      poolPrize.height / 2
    )

  }

  
  interactiveLayerInit() {
    this.interactiveLayer = new Graphics();
    this.interactiveLayer.beginFill(0x90d0f7, 0.1);
    this.interactiveLayer.drawRect(0, 0, window.innerWidth, config.logicalHeight * 2);
    this.interactiveLayer.endFill();
    this.interactiveLayer.buttonMode = true;
    this.interactiveLayer.interactive = true;
    this.interactiveLayer.on("pointermove", (e) => {
      this.claw.moveClawOnMouse(e.data.global);
    });
    this.interactiveLayer.on("pointerdown", (e) => {
      this.callMoveClaw(e)
    });

    this.addToScene(this.interactiveLayer);
    return this.interactiveLayer;;
  }

  prizePool() {
    poolObject.lineStyle(1, 0x000000, 1);
    poolObject.beginFill(0xD4D5D5);
    poolObject.drawRect(
      0,
      0,
      400 * config.minScaleFactor,
      1000 * config.minScaleFactor
    );
    poolObject.endFill();
    this.interactiveLayer.addChild(poolObject);

    poolPrize.lineStyle(1, 0x000000, 1);

    poolPrize.beginFill(0xD4D5D5);
    poolPrize.drawRect(
      0,
      0,
      400 * config.minScaleFactor,
      200 * config.minScaleFactor
    );
    poolPrize.endFill();
    poolPrize.position.set(0,0);
    poolObject.addChild(poolPrize);

    poolPrize.addChild(
      new TextLabel(poolPrize.width / 2, poolPrize.height / 2, 0.5, "Prize", 20, 0x000000)
    );
 
    poolObject.position.set(window.innerWidth - 400*config.minScaleFactor, window.innerHeight - poolObject.height);
}

  addEmojis() {
    this.phsyxBodystack = Composites.stack(
      -500,
      0,
      20,
      25,
      1,
      1,
      function (x: any, y: any) {
      const emojiType = getRandomChoice();
        if(emojiType === "moneyBag")
        return Bodies.circle(x, y, 60, {
          label: emojiType,
          density: 1,
          mass: 1,
          isSensor : true,
        });
        else
        return Bodies.circle(x, y, 30, {
          label: emojiType,
          density: 1,
          mass: 1,
          isSensor : true
        });
      
      }
    );
      
    this.phsyxBodystack.bodies.forEach((element: any, index: number) => {
      setTimeout(()=>{element.isSensor = false;},1500);
      this.physxObjects.push(
        new PhysxObject(
          this,
          { x: element.position.x, y: element.position.y },
          index,element.label
        )
      );

    });

    if (Globals.World) Composite.add(Globals.World, this.phsyxBodystack);


    let timeoutValue = isMobile ? 2000 : 500;
    setInterval(() => {
      for (let i = 0; i < 5; i++) {
        const randomValue = Math.random() * config.logicalWidth - 400;
        const circle = Bodies.circle(randomValue, 0, 35, {
          label: "Emojis",
          density: 1,
          mass: 1,
          restitution: 0.8,  // Bounce
          friction: 0.1, // Friction
          isSensor : true
        });
        setTimeout(()=>{circle.isSensor = false;},1500)
        const emojiType = getRandomChoice();
        this.physxObjects.push(
          new PhysxObject(
            this,
            { x: circle.position.x, y: circle.position.y },
            this.physxObjects.length - 1,emojiType
          )
        );
        if(emojiType === "moneyBag")
        circle.circleRadius = 50;
        circle.collisionFilter
      
       
        Composite.add(this.phsyxBodystack, circle);
      }
    }, timeoutValue);

  }
   
  
  // Usage: Call this function on your circle body for 1000 milliseconds (1 second)
  walls() {
    const plane2 = new planes(
      this,
      { x: - config.leftX * 2, y: config.logicalHeight * 1.1 },
      { x: config.logicalWidth * 6, y: 40 }
    );
  
    this.interactiveLayer.addChild(plane2.grapics);
    if (Globals.World)
      Composite.add(Globals.World, [
        plane2.physicsBody as any,
      ]);
  }
  getPool() {
    return poolObject;
  }
  update(dt: number): void {
    this.physxObjects.forEach((element) => {
      if (Globals.World && element) {
        element.graphics.position.x =
          Globals.World.composites[0].bodies[element.index].position.x;
        element.graphics.position.y =
          Globals.World.composites[0].bodies[element.index].position.y;
      }
    });
  }

  callMoveClaw(e: any) {
    this.claw.moveClaw(this.mainContainer.toLocal(e.data.global), true, (poolObject.position.x + poolObject.width));
  }
  recievedMessage(msgType: string, msgParams: any): void {
    if (msgType === "removeBody") {
     
        setTimeout(() => {
        Globals.soundResources.cash?.play();
        Globals.soundResources.cash.volume(0.7);
        }, 1000)
    }
  }
}

export const collisionFilter =   {
  category: 1,
  group: 0,
  mask: 4294967295 // Collides with everything
}
