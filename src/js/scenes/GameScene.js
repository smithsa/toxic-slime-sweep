import {CONST} from "../constants";
import BaseScene from "./BaseScene";
import slimeCoordinates from "../../data/slime_coordinates.json";
import questions from "../../data/questions.json";
import HTMLElementBuilder from "../utils/HTMLElementBuilder";

export default class GameScene extends BaseScene {
  constructor() {
    super({
      key: CONST.SCENES.GAME
    });

    this.slime = slimeCoordinates;
    this.slimeQueue = Object.keys(slimeCoordinates);
    this.slimeOnScreen = [];
    this.questionBank = questions;
    this.questions = this.questionsGenerator();
    this.currentQuestion = null;
  }

  preload() {
    this.load.path = './img/';
    this.load.multiatlas("slimeatlas", "./slimeatlas.json");
  }

  create() {
    this.slimeQueue.sort(this.randomArrSort);
    this.questionBank.sort(this.randomArrSort);
    this.addGameBackground();

    this.addSlime(5);
    this.removeSlime();
    this.addNextQuestion();

    this.addOptionsSettings();
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

  addNextQuestion() {
    if (this.currentQuestion != null) {
      this.currentQuestion.destroy();
    }

    let {value} = this.questions.next();
    let questionElementBuilder = new HTMLElementBuilder("div", value.stem)
      .addAttributes({class: "question__stem"});
    this.currentQuestion = this.add.dom(895, 250, questionElementBuilder.element);
    this.currentQuestion.setSkew(0, -0.15).setDepth(0);
  }

  * questionsGenerator () {
    for(let question in this.questionBank) {
      yield this.questionBank[question];
    }

    return;
  }
}
