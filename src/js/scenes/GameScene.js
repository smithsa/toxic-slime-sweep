import {CONST} from "../constants";
import BaseScene from "./BaseScene";
import questions from "../../data/questions.json";
import HTMLElementBuilder from "../utils/HTMLElementBuilder";
import ButtonImage from "../components/ButtonImage";

export default class GameScene extends BaseScene {
  constructor() {
    super({
      key: CONST.SCENES.GAME
    });

    this.questionBank = questions;
    this.questions = this.questionsGenerator();
    this.currentQuestionStemElement = null;
    this.currentAnswerChoicesElement = null;
    this.buttons = null;
    this.instructionsSound = null;
    this.currentAnswer = null;
  }

  preload() {
  }

  async create() {
    // TODO only take 10 from the bank
    this.questionBank.sort(() => {
      return 0.5 - Math.random()
    });

    const instructionsButtonHtmlBuilder = new ButtonImage("Replay Instructions", "./img/btn_sound.png", "sound__btn");
    instructionsButtonHtmlBuilder.element.addEventListener("click", this.playInstructions.bind(this));

    this.instructionsSound = this.game.sound.voice.add('instructions');
    this.instructionsSound.addMarker({name: "instruct_look", start: 0, duration: 2.5});
    this.instructionsSound.addMarker({name: "instruct_answer_quickly", start: 2.6, duration: 3});

    let {value} = this.questions.next();
    this.currentAnswer = value.answer;
    await this.addQuestionStem(value.stem);

    const instructionsSoundTimedEvent = this.time.delayedCall(1000, () => {
      this.playInstructions().finally(function () {
        this.loadAnswerChoiceButtons(value.answerChoices);
        this.add.dom(1380, 105, instructionsButtonHtmlBuilder.element);
      }.bind(this));

      instructionsSoundTimedEvent.destroy();
    }, [], this);

  }

  playInstructions() {
    return this.play(this.instructionsSound);
  }

  // nextQuestion() {
  //   let {value} = this.questions.next();
  //   this.loadAnswerChoiceButtons(value.answerChoices);
  //   // await this.addQuestionStem(value.stem);
  //
  // }

  // removeSlime(count=1) {
  //   for (let i = 0; i < count; i++) {
  //     let slimeKey = this.slimeOnScreen.pop();
  //     this.slimeQueue.push(slimeKey);
  //     this.slime[slimeKey]["object"].alpha = 0;
  //   }
  // }

  validateAnswerChoice(event) {
    if(event.target.dataset.value == this.currentAnswer) {
      console.log("correct!");
    } else {
      console.log("wrong!");
    }
  }

  addNewAnswerChoices (answerChoicesList) {
    answerChoicesList.forEach((answerChoice, index) => {
      this.buttons[index].textContent = answerChoice;
      this.buttons[index].dataset = answerChoice;
    });
  }

  loadAnswerChoiceButtons(answerChoicesList) {
    if (this.currentAnswerChoicesElement != null) {
      this.currentAnswerChoicesElement.destroy();
    }

    let buttonElements = [];
    for(let i =0; i < answerChoicesList.length; i++) {
      const buttonHtmlBuilder = new HTMLElementBuilder("button", `${answerChoicesList[i]}`);
      buttonHtmlBuilder.addAttributes({
        "class": "question__answer-choice",
        "data-value": `${answerChoicesList[i]}`
      });

      buttonHtmlBuilder.element.addEventListener("click", this.validateAnswerChoice.bind(this));
      buttonElements.push(buttonHtmlBuilder.element);
    }

    const buttonsContainer = new HTMLElementBuilder("div")
      .addAttributes({class: "question__answer-choices", style: "opacity: 0"});
    buttonsContainer.appendElements(buttonElements);

    this.buttons = buttonsContainer.element;

    this.currentAnswerChoicesElement = this.add.dom(800, 560, buttonsContainer.element);
  }

  addQuestionStem(questionStem) {
    return new Promise((function(resolve, reject){
      let swapQuestionDelay = 300;
      try {
        if (this.currentQuestionStemElement != null) {
          this.tweens.add({
            targets: this.currentQuestionStemElement,
            alpha: { from: 1, to: 0 },
            duration: swapQuestionDelay
          });
          this.currentQuestionStemElement.destroy();
        }

        let questionElementBuilder = new HTMLElementBuilder("div", questionStem)
          .addAttributes({class: "question__stem"});
        this.currentQuestionStemElement = this.add.dom(895, 250, questionElementBuilder.element);
        this.currentQuestionStemElement.setSkew(0, -0.15).setDepth(-1).setAlpha(0);
        this.tweens.add({
          targets: this.currentQuestionStemElement,
          alpha: { from: 0, to: 1 },
          duration: 500,
          delay: swapQuestionDelay + 100,
          onComplete: () => {
            resolve(true);
          }
        });
      } catch (error) {
        reject(error);
      }
    }).bind(this));
  }

  * questionsGenerator() {
    for(let question in this.questionBank) {
      yield this.questionBank[question];
    }

    return;
  }
}
