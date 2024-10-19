  
import { Howl } from 'howler';
import * as PIXI from 'pixi.js';
import { App } from './App';
import { MyEmitter } from './MyEmitter';
import { TextStyle } from 'pixi.js';
import Matter,{ Engine, World } from 'matter-js';

type globalDataType = {
  resources: PIXI.utils.Dict<PIXI.LoaderResource>;
  emitter: MyEmitter | undefined;
  physixengine : Engine | undefined,
  World : World | undefined,
  isMobile: boolean;
  // fpsStats : Stats | undefined,
  soundResources: { [key: string]: Howl };

  App: App | undefined,
}

export const Globals: globalDataType = {
  physixengine :  undefined,
  World :  undefined,
  resources: {},
  emitter: undefined,
  get isMobile() {
    //  return true;
    return PIXI.utils.isMobile.any;
  },
  // fpsStats: undefined,
  App: undefined,
  soundResources: {},
};

export const style = new TextStyle({
  dropShadow: true,
  dropShadowAngle: 1.8,
  dropShadowColor: "#ffffff",
  dropShadowDistance: 1,
  fill: "#4f3130",
  fillGradientStops: [
    0.4
  ],
  fontWeight: "bolder",
  lineJoin: "round",
  miterLimit: 0,
  stroke: "#4f3130",
  strokeThickness: 1.5
});

export function addToWorld(obj : any)
{
  if(Globals.World)	
		Matter.World.add(Globals.World, [obj]);

}
export function getRandomChoice(): string {
  const choices = [
    { item: "blush", weight: 50 },
    { item: "moneyBag", weight: 30 },
    { item: "cart", weight: 20 }
  ];

  const totalWeight = choices.reduce((sum, choice) => sum + choice.weight, 0);
  const randomValue = Math.random() * totalWeight;

  let cumulativeWeight = 0;
  for (const choice of choices) {
    cumulativeWeight += choice.weight;
    if (randomValue < cumulativeWeight) {
      return choice.item;
    }
  }

  // Fallback in case no choice was selected (this shouldn't happen)
  return choices[choices.length - 1].item;
}
