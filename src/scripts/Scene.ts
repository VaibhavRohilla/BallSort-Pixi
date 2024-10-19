import { Container, DisplayObject, Graphics, Resource, Texture } from "pixi.js";
import { config } from "./appConfig";
import { BackgroundGraphic, BackgroundSprite } from "./Background";

export abstract class Scene {


    private sceneContainer: Container;
    private fullBackground: BackgroundGraphic | BackgroundSprite | any;


    mainContainer: Container;
    private mainBackground: BackgroundGraphic | BackgroundSprite | any;


    constructor(mainBackgroundColor: number | Texture<Resource> | undefined, fullBackgroundColor: number | Texture<Resource> | undefined = 0x90d0f7) {
        this.sceneContainer = new Container();


        if (typeof fullBackgroundColor === "number") {
            this.fullBackground = new BackgroundGraphic(window.innerWidth, window.innerHeight, fullBackgroundColor);
        } else {
            this.fullBackground = new BackgroundSprite(fullBackgroundColor, window.innerWidth, window.innerHeight);
        }

        this.sceneContainer.addChild(this.fullBackground);

        this.mainContainer = new Container();

        this.resetMainContainer();

        this.sceneContainer.addChild(this.mainContainer);



        if (typeof mainBackgroundColor === "number") {
            this.mainBackground = new BackgroundGraphic(config.logicalWidth, config.logicalHeight, mainBackgroundColor);
        } else {
            this.mainBackground = new BackgroundSprite(mainBackgroundColor, config.logicalWidth, config.logicalHeight);
        }

        this.mainContainer.addChild(this.mainBackground);


    }

    addToScene(obj: DisplayObject) {
        this.sceneContainer.addChild(obj);
    }

    resetMainContainer() {
            this.mainContainer.x = config.minLeftX;
            this.mainContainer.y = config.minTopY;
            
            this.mainContainer.scale.set(config.minScaleFactor);
        }

    resize(): void {
        this.fullBackground.resetBg(window.innerWidth, window.innerHeight);
        this.resetMainContainer();
    }

    initScene(container: Container) {
        container.addChild(this.sceneContainer);
    }
    destroyScene() {
        this.sceneContainer.destroy();
    }

    abstract update(dt: number): void;

    abstract recievedMessage(msgType: string, msgParams: any): void;
}