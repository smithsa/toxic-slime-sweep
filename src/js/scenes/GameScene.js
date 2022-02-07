import {CONST} from "../constants";
import BaseScene from "./BaseScene";
import slimeCoordinates from "../../data/slime_coordinates.json";
import questions from "../../data/questions.json";

export default class GameScene extends BaseScene {
  constructor() {
    super({
      key: CONST.SCENES.GAME
    });

    this.slime = slimeCoordinates;
    this.slimeQueue = Object.keys(slimeCoordinates);
    this.slimeOnScreen = [];
    this.questions = this.questionGenerator()
  }

  preload() {
    this.load.path = './img/';
    this.load.multiatlas("slimeatlas", "./slimeatlas.json");
  }

  create() {
    this.slimeQueue.sort(this.randomArrSort);
    this.addGameBackground();
    this.addSlime(5);
    this.removeSlime();
  }

  addSlime(count=1) {
    for (let i = 0; i < count; i++) {
      let slimeKey = this.slimeQueue.pop();
      this.slimeOnScreen.push(slimeKey);
      this.slime[slimeKey]["object"] =
        this.add.image(this.slime[slimeKey]["x"],
          this.slime[slimeKey]["y"],
          "slimeatlas", `${slimeKey}.png`);
    }
  }

  removeSlime(count=1) {
    for (let i = 0; i < count; i++) {
      let slimeKey = this.slimeOnScreen.pop();
      this.slimeQueue.push(slimeKey);
      this.slime[slimeKey]["object"].destroy();
    }
  }

  * questionGenerator () {
    for(let question in questions) {
      yield questions[question];
    }

    return;
  }
}
