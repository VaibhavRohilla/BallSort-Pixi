import { GLProgram, Graphics, Sprite } from "pixi.js";
import { config } from "./appConfig";
import { Globals } from "./Globals";
import { MainScene, poolObject } from "./MainScene";
import { TextLabel } from "./TextLabel";
import { MixBlend } from "pixi-spine";
import { Easing, Tween } from "@tweenjs/tween.js";
import { text } from "stream/consumers";

export class UI {
    uiOverlay!: Graphics;
    toggleSwitch!: Graphics;
    fullScreenBtn!: Sprite;
    headingText!: TextLabel;
    secondLabel!: Graphics;
    smileyText !: TextLabel;
    cartText !: TextLabel;
    moneyBagText !: TextLabel;
    cashText !: TextLabel;
    cartCount : number = 0;
    ordersCount : number = 0;
    siteVisitorCount : number = 0
    cashCount : number = 0;
    
    switchWidth = 40;
    switchHeight = 20;
    switchRadius = this.switchHeight / 2;
    autoToggleText!: TextLabel;
    constructor(public mainContainer: MainScene) {
       this.makeFirstUiOverlay();
       this.makeSecondUiOverlay();
    }
    resize() {
        this.uiOverlay.clear();
        this.uiOverlay.beginFill(0xffffff);
        this.uiOverlay.drawRect(0, 0, window.innerWidth, 110* config.minScaleFactor);
        this.uiOverlay.endFill();

        this.toggleSwitch.clear();
        this.toggleSwitch.beginFill(0x555555); // Dark gray
        this.toggleSwitch.drawRoundedRect(0, 0, this.switchWidth, this.switchHeight, this.switchRadius);
        this.toggleSwitch.endFill();
        this.toggleSwitch.scale.set(2 * config.minScaleFactor);
        this.toggleSwitch.position.set(config.rightX*0.04, (110* config.minScaleFactor)/2);
        this.autoToggleText.scale.set(2*config.minScaleFactor);
        this.autoToggleText.position.set( this.toggleSwitch.position.x+ this.autoToggleText.width/4, (110* config.minScaleFactor)/2 - this.toggleSwitch.height/2)

        this.headingText.scale.set(2 * config.minScaleFactor);
        this.headingText.position.set(config.rightX/2,  (110* config.minScaleFactor)/2)
        this.fullScreenBtn.scale.set(0.2 * config.minScaleFactor);
        this.fullScreenBtn.position.set(
            config.rightX-  this.fullScreenBtn.width,
            (110* config.minScaleFactor)/2
        );

        this.secondLabel.clear();
        this.secondLabel.beginFill(0x000000)
        this.secondLabel.drawRect(0, 0, window.innerWidth,110* config.minScaleFactor)
        this.secondLabel.endFill();
        this.secondLabel.position.set(0,110* config.minScaleFactor);

        this.smileyText.scale.set(1*config.scaleFactor);
        this.cartText  .scale.set(1*config.scaleFactor);
        this.moneyBagText.scale.set(1*config.scaleFactor);
        this.cashText.scale.set(1*config.scaleFactor);
        this.cartText.position.set(config.rightX*0.13, this.secondLabel.height/2);
        this.moneyBagText.position.set(config.rightX*0.38 ,this.secondLabel.height/2);
        this.smileyText.position.set(config.rightX*0.7, this.secondLabel.height/2);
        this.cashText.position.set(config.rightX*0.95,  this.secondLabel.height/2);

        
    }
    makeFirstUiOverlay()
    {
        this.uiOverlay = new Graphics();
        this.uiOverlay.beginFill(0xffffff);
        this.uiOverlay.drawRect(0, 0, window.innerWidth, 110* config.minScaleFactor);
        this.uiOverlay.endFill();
        this.uiOverlay.interactive = true;
        this.uiOverlay.buttonMode = true;
        this.mainContainer.interactiveLayer.addChild(this.uiOverlay);
        this.headingText = new TextLabel(
            this.uiOverlay.width / 2,
            this.uiOverlay.height / 2,
            0.5,
            "Maculeye Analytics",
            30,
            0x000000
        );
        this.uiOverlay.addChild(this.headingText);
        this.toggleSwitch = new Graphics();


        this.fullScreenBtn = new Sprite(Globals.resources.fullscreen.texture);
        this.fullScreenBtn.anchor.set(0.5);
        this.fullScreenBtn.scale.set(0.2 * config.minScaleFactor);
        this.fullScreenBtn.position.set(
            this.uiOverlay.width - this.fullScreenBtn.width,
            this.uiOverlay.height / 2
        );


        this.mainContainer.interactiveLayer.addChild(this.fullScreenBtn);
        this.fullScreenBtn.buttonMode = true;
        this.fullScreenBtn.interactive = true;

        this.fullScreenBtn.on("pointerdown", () => {
            this.toggleFullScreen();
        });

        // Draw the background of the switch
        this.toggleSwitch.beginFill(0x555555); // Dark gray
        this.toggleSwitch.drawRoundedRect(0, 0, this.switchWidth, this.switchHeight, this.switchRadius);
        this.toggleSwitch.endFill();

        // Draw the toggle button
        const toggleButton = new Graphics();
        toggleButton.beginFill(0xffffff); // White color
        toggleButton.drawCircle(
            this.switchHeight / 2,
            this.switchHeight / 2,
            this.switchHeight / 2 - 2
        ); // Slightly smaller circle
        toggleButton.endFill();

        // Position the toggle button
        toggleButton.x = this.mainContainer.claw.autoMove ? this.switchWidth - this.switchHeight : 0; // Initially positioned to the left
        this.toggleSwitch.y = this.uiOverlay.height / 2 - this.toggleSwitch.height / 2 + 10;
        this.toggleSwitch.x = this.toggleSwitch.width / 2;

        // Make the toggle switch interactive
        this.toggleSwitch.interactive = true;
        this.toggleSwitch.buttonMode = true;

        // Add event listener for the toggle switch
        this.toggleSwitch.on("pointerdown", () => {
            this.mainContainer.claw.autoMove = !this.mainContainer.claw.autoMove;

            toggleButton.x = this.mainContainer.claw.autoMove ? this.switchWidth - this.switchHeight : 0;
            this.mainContainer.claw.moveClaw({ x: 0, y: config.logicalHeight - 200 },
                true,
                (poolObject.position.x + poolObject.scale.x / 2)
            );
        });
        this.autoToggleText = new TextLabel(
            this.toggleSwitch.width * 1.2,
            this.toggleSwitch.height / 2,
            0.5,
            "Auto Move",
            30 * config.minScaleFactor,
            0x000000
        );
        this.uiOverlay.addChild(this.autoToggleText);
        // Add the switch background and button to the stage
        this.uiOverlay.addChild(this.toggleSwitch);
        this.toggleSwitch.addChild(toggleButton);
    }
    makeSecondUiOverlay()
    {
        this.secondLabel = new Graphics();
        this.secondLabel.beginFill(0x000000)
        this.secondLabel.drawRect(0, 0, window.innerWidth,110* config.minScaleFactor)
        this.secondLabel.endFill();
        this.secondLabel.position.set(0,110* config.minScaleFactor);
        this.uiOverlay.addChild(this.secondLabel);
        

        this.cartText = new TextLabel(0, 0,0.5,`🛒    ${this.cartCount} Abandoned Carts`, 20, 0xFFFFFF);
        this.secondLabel.addChild(this.cartText);
        
        this.moneyBagText = new TextLabel(0, 0,0.5,`💰    ${this.ordersCount}  Orders`, 20, 0xFFFFFF);
        this.secondLabel.addChild(this.moneyBagText);
        
        this.smileyText = new TextLabel(0, 0,0.5,`😊    ${this.siteVisitorCount}  Site Visitors`, 20, 0xFFFFFF);
        this.secondLabel.addChild(this.smileyText);
        
        this.cashText = new TextLabel(0, 0,0.5,`$ ${this.cashCount}`,20, 0x4daf51);
        this.secondLabel.addChild(this.cashText);
        
        this.smileyText.scale.set(2*config.minScaleFactor);
        this.cartText  .scale.set(2*config.minScaleFactor);
        this.moneyBagText.scale.set(2*config.minScaleFactor);
        this.cashText.scale.set(2*config.minScaleFactor);
        this.cartText.position.set(200*config.minScaleFactor  +  this.cartText.width/2 , this.secondLabel.position.y -  this.cartText.height*0.8);
        this.moneyBagText.position.set(config.rightX/2 - 600*config.minScaleFactor  - this.moneyBagText.width/2, this.secondLabel.position.y -  this.cartText.height*0.8);
        this.smileyText.position.set(config.rightX/2 + 600*config.minScaleFactor - this.smileyText.width, this.secondLabel.position.y -  this.cartText.height*0.8);
        this.cashText.position.set(config.rightX - 400*config.minScaleFactor - this.cashText.width , this.secondLabel.position.y -  this.cartText.height*0.8);

        this.updateNumber(this.cartCount,this.updateCarts.bind(this));
        this.updateNumber(this.ordersCount,this.updateOrders.bind(this));
        this.updateNumber(this.siteVisitorCount,this.updateVisitors.bind(this));
        this.updateNumber(this.cashCount,this.updateCash.bind(this));
    }
    updateCash() {
        const currentCashTextValue = this.cashCount;
        new Tween({ text: currentCashTextValue })
        .to({ text: this.cashCount + 39}, 1000)
        .easing(Easing.Cubic.InOut)
        .onUpdate((object: any) => {
          this.cashCount = object.text;
          this.cashText.upadteLabelText(`$ ${object.text.toFixed(2)}`);
        })
        .start();
    }
    updateOrders(toUpdate : number) {
        this.ordersCount = toUpdate;
        this.moneyBagText.upadteLabelText(`💰    ${this.ordersCount}  Orders`) ;
    }   
     updateVisitors(toUpdate : number) {
        this.siteVisitorCount = toUpdate;
        this.smileyText.upadteLabelText(`😊    ${this.siteVisitorCount}  Site Visitors`) ;
    }   
     updateCarts(toUpdate : number) {
        this.cartCount = toUpdate;
        this.cartText.upadteLabelText(`🛒    ${this.cartCount} Abandoned Carts`);
    }


     updateNumber(toUpdate : number,callback?: UpdateCallback) {
        // Increment the number
        toUpdate++;
    
      // Generate a random delay between 1 and 5 seconds (1000 to 5000 ms)
      const randomDelay: number = Math.floor(Math.random() * (3000 - 1000 + 1)) + 100;

        if (callback) {
            callback(toUpdate);
        }
        // Recursively call updateNumber after the random delay
        setTimeout(()=>{this.updateNumber(toUpdate,callback)}, randomDelay);
    }
    toggleFullScreen() {
        if (!document.fullscreenElement) {
            // Request full-screen
            Globals.App!.app.view.requestFullscreen().catch((err) => {
                console.error(
                    `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
                );
            });
        } else {
            // Exit full-screen
            document.exitFullscreen();
        }
    }
}
type UpdateCallback = (count: number) => void;