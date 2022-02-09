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
    this.currentQuestionStemElement = null;
    this.currentAnswerChoicesElement = null;
  }

  preload() {
    this.load.path = './img/';
    this.load.multiatlas("slime", "./slime_atlas.json");
  }

  create() {
    this.slimeQueue.sort(this.randomArrSort);
    this.questionBank.sort(this.randomArrSort);
    this.addGameBackground();

    this.addSlime(4);
    // this.removeSlime();
    this.nextQuestion();

    this.addOptionsSettings();
  }

  addSlime(count=1) {
    for (let i = 0; i < count; i++) {
      let slimeKey = this.slimeQueue.pop();
      this.slimeOnScreen.push(slimeKey);
      this.slime[slimeKey]["object"] =
        this.add.image(this.slime[slimeKey]["x"],
          this.slime[slimeKey]["y"],
          "slime", `${slimeKey}.png`);
    }
  }

  removeSlime(count=1) {
    for (let i = 0; i < count; i++) {
      let slimeKey = this.slimeOnScreen.pop();
      this.slimeQueue.push(slimeKey);
      this.slime[slimeKey]["object"].destroy();
    }
  }

  nextQuestion() {
    let {value} = this.questions.next();
    this.addAnswerChoices(value.answerChoices);
    this.addQuestionStem(value.stem)
  }

  addAnswerChoices(answerChoicesList) {
    if (this.currentAnswerChoicesElement != null) {
      this.currentAnswerChoicesElement.destroy();
    }

    let buttonElements = [];
    for(let i =0; i < answerChoicesList.length; i++) {
      const buttonHtmlBuilder = new HTMLElementBuilder("button", `${answerChoicesList[i]}`);
      buttonHtmlBuilder.addAttributes({
        "class": "question__answer-choice",
        "data-src": `${answerChoicesList[i]}`
      });
      buttonElements.push(buttonHtmlBuilder.element);
    }

    const buttonsContainer = new HTMLElementBuilder("div")
      .addAttributes({class: "question__answer-choices"});
    buttonsContainer.appendElements(buttonElements);

    this.currentAnswerChoicesElement = this.add.dom(800, 560, buttonsContainer.element);
  }

  addQuestionStem(questionStem) {
    if (this.currentQuestionStemElement != null) {
      this.currentQuestionStemElement.destroy();
    }

    let questionElementBuilder = new HTMLElementBuilder("div", questionStem)
      .addAttributes({class: "question__stem"});
    this.currentQuestionStemElement = this.add.dom(895, 250, questionElementBuilder.element);
    this.currentQuestionStemElement.setSkew(0, -0.15).setDepth(0);
  }

  * questionsGenerator() {
    for(let question in this.questionBank) {
      yield this.questionBank[question];
    }

    return;
  }
}
