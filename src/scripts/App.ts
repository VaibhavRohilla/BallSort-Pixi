import * as PIXI from "pixi.js";
import { CalculateScaleFactor, config } from "./appConfig";

// import { onResizeFunction } from "./HtmlHandler";
import { Loader } from "./Loader";
import { MainScene } from "./MainScene";
import { MyEmitter } from "./MyEmitter";
import { SceneManager } from "./SceneManager";

import { log } from "console";
import { Globals } from "./Globals";
import { Engine, Runner, World } from "matter-js";
// import { Loader } from "./Loader";
// import { SceneManager } from "./SceneManager";
// import { MainScene } from "./MainScene";

export class App {

    app: PIXI.Application;


    isDeviceLandscape!: boolean;

    isDeviceOrientationChanged: boolean = false;

    constructor() {
        // create canvas

        PIXI.settings.RESOLUTION = window.devicePixelRatio || 1;

        this.app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight, antialias: true });
        // this.app = new PIXI.Application({width : window.innerWidth, height : window.innerHeight});
        document.body.appendChild(this.app.view);
        // document.body.appendChild( Globals.fpsStats.dom );
        // document.body.appendChild( Globals.stats.dom );
        Globals.physixengine = Engine.create(),
        Globals.World = Globals.physixengine.world;
        var runner = Runner.create();
        Runner.run(runner, Globals.physixengine );

		Runner.run(Globals.physixengine)
        CalculateScaleFactor();

        this.app.renderer.view.style.width = `${window.innerWidth}px`;
        this.app.renderer.view.style.height = `${window.innerHeight}px`;
        this.app.renderer.resize(window.innerWidth, window.innerHeight);

        this.app.view.oncontextmenu = (e) => {
            e.preventDefault();

        };
      
        //Setting Up Window On Resize Callback
        window.onresize = (e) => {
			
			CalculateScaleFactor();
			this.app.renderer.resize(window.innerWidth, window.innerHeight);
			
			this.app.renderer.view.style.width = `${window.innerWidth}px`;
			this.app.renderer.view.style.height = `${window.innerHeight}px`;
			SceneManager.instance!.resize();
		};


        //Created Emitter
        Globals.emitter = new MyEmitter();

        //Create Scene Manager
        new SceneManager();

        this.app.stage.addChild(SceneManager.instance.container);
        this.app.ticker.add(dt => SceneManager.instance!.update(dt));


        // loader for loading data
        const loaderContainer = new PIXI.Container();
        this.app.stage.addChild(loaderContainer);

        const loader = new Loader(this.app.loader, loaderContainer);

        loader.preload().then(() => {

			loader.preloadSounds(() => {

				setTimeout(() => {
					loaderContainer.destroy();
					// SceneManager.instance!.start(new MainScene());
					SceneManager.instance!.start(new MainScene());
					window.dispatchEvent(new Event('resize'));
				}, 1000);
			});
		});


       
    }

    tabChange() {
        document.addEventListener("visibilitychange", event => {
            if (document.visibilityState === "visible") {
                Globals.emitter?.Call("resume", true)
                console.log("tab active");
            } else {
                Globals.emitter?.Call("resume", false)
                console.log("tab inactive");
            }
        })
    }
    checkIfDeviceRotated() {
        if (window.innerWidth > window.innerHeight) {
            if (!this.isDeviceLandscape) {
                this.isDeviceOrientationChanged = true;
            }

            //landscape
        } else {
            if (!this.isDeviceLandscape) {
                this.isDeviceOrientationChanged = true;
            }
            //portrait
        }
    }

}