import { Tween, Easing } from "@tweenjs/tween.js";
import Matter, { Bodies, Composite, Body } from "matter-js";
import { Sprite } from "pixi.js";
import { config } from "./appConfig";
import { Globals } from "./Globals";
import { MainScene, poolObject } from "./MainScene";

export class clawInit {
    clawBody!: Sprite;
    clawRightArm!: Sprite;
    clawLeftArm!: Sprite;
    armLBody!: Matter.Body;
    armRBody!: Matter.Body;
    isGrabbing: boolean = false;
    autoMove: boolean = false;
    dropPos: number = 0;


    constructor(public container: MainScene) {
        if (Globals.physixengine) {

            // const render = Matter.Render.create({
            //     element: document.body,
            //     engine: Globals.physixengine,
            //     options: {
            //         width: window.innerWidth,
            //         height: window.innerHeight,
            //         wireframes: true,
            //     },
            // });

            // Matter.Render.run(render);
        }
        // Setup claw visuals (Pixi.js)
        this.clawBody = new Sprite(Globals.resources.clawBody.texture);
        this.clawBody.anchor.set(0.5);
        this.clawBody.scale.set(0.2);
        this.clawBody.position.set(config.logicalWidth / 2 - this.clawBody.width / 2, this.clawBody.height * 1.8);

        const clawWire = new Sprite(Globals.resources.clawCable.texture);
        clawWire.anchor.set(0.5, 1);
        clawWire.scale.set(1, 10);
        clawWire.position.set(0, -this.clawBody.height);
        this.clawBody.addChild(clawWire);
        container.mainContainer.addChild(this.clawBody);

        this.clawLeftArm = new Sprite(Globals.resources.clawArm.texture);
        this.clawLeftArm.anchor.set(0);
        this.clawLeftArm.pivot.set(this.clawLeftArm.width / 2, 0);
        this.clawLeftArm.scale.set(0.2);
        this.clawLeftArm.rotation = Math.PI / 2;
        this.clawLeftArm.position.set(this.clawBody.position.x - this.clawLeftArm.width / 3, this.clawBody.position.y + this.clawLeftArm.height / 2 - 40);

        this.clawRightArm = new Sprite(Globals.resources.clawArm.texture);
        this.clawRightArm.anchor.set(0);
        this.clawRightArm.pivot.set(this.clawRightArm.width / 2, 0);
        this.clawRightArm.scale.set(-0.2, 0.2);
        this.clawRightArm.rotation = -Math.PI / 2;
        this.clawRightArm.position.set(this.clawBody.position.x + this.clawRightArm.width / 3, this.clawBody.position.y + this.clawRightArm.height / 2 - 40);

        container.mainContainer.addChild(this.clawLeftArm);
        container.mainContainer.addChild(this.clawRightArm);

        // Setup physics (Matter.js)
        this.setupClawPhysics();
    }

    setupClawPhysics() {

        this.setupLeftClaw();
        this.setupRightClaw();
        this.rotateHandle(this.clawLeftArm);
        this.setClawPosition()

        // Add the compound body to the world
        if (Globals.World) {
            Composite.add(Globals.World, [this.armLBody, this.armRBody]);
        }
    }
    setupLeftClaw() {
        const armLVertices = [
            { x: 40, y: 100 },
            { x: 20, y: 100 },
            { x: -20, y: 180 },
            { x: -10, y: 180 },
        ];
        const armLBody0 = Bodies.fromVertices(350, 180, armLVertices as any, { density: 1, friction: 0, mass: 10 });
        const armLVertices1 = [
            { x: -90, y: 200 },
            { x: -80, y: 200 },
            { x: -50, y: 300 },
            { x: -40, y: 300 },
        ];

        const armLBody1 = Bodies.fromVertices(345, 275, armLVertices1 as any, { density: 1, friction: 0, mass: 10 });

        const armLVertices2 = [
            { x: -110, y: 200 },
            { x: -80, y: 200 },
            { x: -20, y: 230 },
            { x: -10, y: 230 },
        ];

        // Create the left arm using the vertices (it will be in the shape of an "L")
        const armLBody2 = Bodies.fromVertices(395, 335, armLVertices2 as any, { density: 1, friction: 0, mass: 10 });

        this.armLBody = Matter.Body.create({
            parts: [armLBody0, armLBody1, armLBody2,],
            isStatic: true
        })
    }

    setupRightClaw() {
        const armRVertices = [
            { x: -60, y: 100 },
            { x: -40, y: 100 },
            { x: 0, y: 180 },
            { x: -10, y: 180 },
        ];
        const armRBody0 = Bodies.fromVertices(340, 180, armRVertices as any, { density: 1, friction: 0, mass: 10 });
        const armRVertices1 = [
            { x: 90, y: 200 },
            { x: 80, y: 200 },
            { x: 50, y: 300 },
            { x: 40, y: 300 },
        ];
        const armRBody1 = Bodies.fromVertices(345, 275, armRVertices1 as any, { density: 1, friction: 0, mass: 10 });

        const armRVertices2 = [
            { x: 110, y: 200 },
            { x: 90, y: 200 },
            { x: 20, y: 230 },
            { x: 10, y: 230 },
        ];
        // Create the left arm using the vertices (it will be in the shape of an "L")
        const armRBody2 = Bodies.fromVertices(290, 335, armRVertices2 as any, { density: 1, friction: 0, mass: 10 });

        this.armRBody = Matter.Body.create({
            parts: [armRBody0, armRBody1, armRBody2,],
            isStatic: true
        })
    }
    moveClaw(position: { x: number, y: number }, shouldGoDown: boolean, dropPos: number) {
        this.dropPos = dropPos;
        let targetY = shouldGoDown ? config.logicalHeight - 500 : this.clawBody.height * 1.8;
        if (shouldGoDown) {
            if (this.isGrabbing) return;

            this.isGrabbing = true;

            new Tween(this.clawBody.position)
                .to({ x: position.x, y: position.y }, 1000)
                .easing(Easing.Linear.None)
                .onUpdate(() => {
                    this.setClawPosition();
                })
                .onComplete(() => {
                    this.rotateClaw(true); // Close claw
                })
                .start();
        }
        else {
            new Tween(this.clawBody.position)
                .to({ x: this.container.mainContainer.toLocal(poolObject.position).x + poolObject.width, y: targetY }, 3000)
                .easing(Easing.Linear.None)
                .onUpdate(() => {
                    this.setClawPosition();
                })
                .onComplete(() => {
                    this.rotateClaw(false);
                })
                .start();
        }
    }
    moveClawOnMouse(points: { x: number, y: number }) {
        if (this.isGrabbing) return;
        this.clawBody.position.set(this.container.mainContainer.toLocal(points).x, this.clawBody.height * 1.8);
        this.setClawPosition();
    }

    moveToPool() {

        return new Tween(this.clawBody.position)
            .to({ x: window.innerWidth / 2 - this.clawBody.width / 2 }, 1000)
            .easing(Easing.Linear.None)
            .onUpdate(() => {
                this.setClawPosition();
            })
            .onComplete(() => {
                this.isGrabbing = false;
                if (this.autoMove) this.chooseRandomPositions();
            })
            .start();

    }

    setClawPosition() {
        // Sync Pixi.js sprite positions with Matter.js bodies
        this.clawLeftArm.position.set(this.clawBody.position.x - this.clawLeftArm.width / 3, this.clawBody.position.y + this.clawLeftArm.height / 2 - 40);
        this.clawRightArm.position.set(this.clawBody.position.x + this.clawRightArm.width / 3, this.clawBody.position.y + this.clawRightArm.height / 2 - 40);


        Body.setPosition(this.armRBody, { x: this.clawRightArm.position.x, y: this.clawRightArm.position.y + 100 });
        Body.setPosition(this.armLBody, { x: this.clawLeftArm.position.x, y: this.clawLeftArm.position.y + 100 });
    }

    rotateClaw(isClosing: boolean) {
        const targetRotation = isClosing ? 0.1 : Math.PI / 2;
        if (isClosing)
            new Tween({ rotation: this.clawLeftArm.rotation })
                .to({ rotation: targetRotation }, 1000)
                .easing(Easing.Linear.None)
                .onUpdate((object: any) => {
                    this.rotateHandle(object);
                })
                .onComplete(() => {
                    this.moveClaw({ x: 0, y: 0 }, false, this.dropPos);
                })
                .start();
        else {

            new Tween({ rotation: this.clawLeftArm.rotation })
                .to({ rotation: targetRotation }, 1000)
                .easing(Easing.Cubic.InOut)
                .onUpdate((object: any) => {
                    this.rotateHandle(object);
                })
                .onComplete(() => {
                    Globals.emitter?.Call("removeBody");
                    this.moveToPool();
                })
                .start();
        }
    }

    rotateHandle(object: any) {
        this.clawLeftArm.rotation = object.rotation;
        this.clawRightArm.rotation = -object.rotation;

        Matter.Body.setAngle(this.armLBody, object.rotation);
        Matter.Body.setAngle(this.armRBody, -object.rotation);
    }

    chooseRandomPositions() {
        const upperLimit = config.logicalWidth - 400;
        const randomValue = Math.random() * upperLimit;
        this.moveClaw({ x: randomValue, y: config.logicalHeight - 400 }, true, poolObject.position.x + poolObject.width)
    }
}
