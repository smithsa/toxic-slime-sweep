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

    this.correctSounds = [];
    this.wrongSounds = [];
    this.solutionsSounds = [];
    this.questionBank = questions;
    this.questions = this.questionsGenerator();
    this.currentQuestionStemElement = null;
    this.currentAnswerChoicesElement = null;
    this.buttons = null;
    this.instructionsSound = null;
    this.currentAnswer = null;
    this.currentQuestionAttempts = 0;
    this.maxAttempts = 2;
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
    this.loadAnswerChoiceResponseSounds();

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

  delayedNextQuestion(delay) {
    const nextQuestionTimedEvent = this.time.delayedCall(delay, function() {
      this.nextQuestion();
      nextQuestionTimedEvent.destroy();
    }, [], this);
  }

  async nextQuestion() {
    this.resetCorrectAttributeValueOnButtons();
    let {value, done} = this.questions.next();
    if(done) {
      console.warn("No more questions exist to continue");
      return;
    }

    this.currentAnswer = value.answer;
    this.addNewAnswerChoices(value.answerChoices);
    await this.addQuestionStem(value.stem);
  }

  async validateAnswerChoice(event) {
    this.resetCorrectAttributeValueOnButtons();

    if(event.target.dataset.value == this.currentAnswer) {
      event.target.dataset.correct = true;
      this.currentQuestionAttempts = 0;
      this.playRandomSound(this.correctSounds);
      await this.removeSlime();
      this.delayedNextQuestion(2000);
    } else {
      this.shakeAnswerChoices();

      event.target.dataset.correct = false;

      if(this.currentQuestionAttempts === (this.maxAttempts - 1)) {
        this.currentQuestionAttempts = 0;
        this.playRandomSound(this.solutionsSounds);
        this.revealCorrectAnswer();
        this.delayedNextQuestion(3000);
        return;
      };

      this.currentQuestionAttempts++;
      await this.playRandomSound(this.wrongSounds);
      await this.addSlime();
      this.resetCorrectAttributeValueOnButtons();
    }
  }

  addSlime() {
    return new Promise(function(resolve, reject) {
      try {
        let {slime, slimeQueue, slimeOnScreen} = this.getSlimeState();
        let slimeKey = slimeQueue.pop();
        slimeOnScreen.push(slimeKey);
        const slimeToAdd = slime[slimeKey]["object"];

        this.tweens.add({
          targets: slimeToAdd,
          loop: 0,
          duration: 1500,
          scaleX: {from: 0, to: 1},
          scaleY: {from: 0, to: 1},
          alpha: {from: 0, to: 1},
          ease: "Linear",
          onComplete: () => {
            resolve(true);
          }
        });

        this.setSlimeState({slime, slimeQueue, slimeOnScreen});
      } catch (error) {
        reject(error);
      }
    }.bind(this));
  }

  removeSlime() {
    return new Promise(function(resolve, reject) {
      try {
        let {slime, slimeQueue, slimeOnScreen} = this.getSlimeState();
        let slimeKey = slimeOnScreen.pop();
        slimeQueue.push(slimeKey);
        const slimeToRemove = slime[slimeKey]["object"];

        this.tweens.add({
          targets: slimeToRemove,
          loop: 0,
          duration: 1000,
          scaleX: {from: 1, to: 0},
          scaleY: {from: 1, to: 0},
          alpha: {from: 1, to: 0},
          ease: "Linear",
          onComplete: () => {
            resolve(true);
          }
        });

        this.setSlimeState({slime, slimeQueue, slimeOnScreen});
      } catch (error) {
        reject(error);
      }
    }.bind(this));
  }

  playInstructions() {
    return this.play(this.instructionsSound);
  }

  playRandomSound(soundList) {
    let randInt = this.getRandomIntInclusive(0, soundList.length-1);
    this.play(soundList[randInt]);
  }

  addNewAnswerChoices (answerChoicesList) {
    answerChoicesList.forEach((answerChoice, index) => {
      this.buttons[index].textContent = answerChoice;
      this.buttons[index].dataset.value = answerChoice;
    });
  }

  loadAnswerChoiceResponseSounds() {
    for(let i=1; i < 6; i++) {
      this.correctSounds.push(this.game.sound.voice.add(`correct${i}`));
    }

    for(let i=1; i < 4; i++) {
      this.wrongSounds.push(this.game.sound.voice.add(`wrong${i}`));
    }

    for(let i=1; i < 3; i++) {
      this.solutionsSounds.push(this.game.sound.voice.add(`solution${i}`));
    }
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

      buttonHtmlBuilder.element.addEventListener("click", this.validateAnswerChoice.bind(this), true);
      buttonElements.push(buttonHtmlBuilder.element);
    }

    this.buttons = buttonElements;

    const buttonsContainer = new HTMLElementBuilder("div")
      .addAttributes({class: "question__answer-choices", style: "opacity: 0"});
    buttonsContainer.appendElements(buttonElements);

    this.buttonsContainerElement = buttonsContainer.element;
    this.currentAnswerChoicesElement = this.add.dom(800, 560, buttonsContainer.element).setDepth(-1);
  }

  addQuestionStem(questionStem) {
    return new Promise((function(resolve, reject){
      let swapQuestionDelay = 300;
      try {
        if (this.currentQuestionStemElement != null) {
          this.currentQuestionStemElement.setAlpha(0);
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
          delay: swapQuestionDelay + 200,
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

  getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  resetCorrectAttributeValueOnButtons() {
    this.buttons.forEach((button) => button.dataset.correct = "");
  }

  revealCorrectAnswer() {
    for(let i = 0; i < this.buttons.length; i++) {
      if(this.currentAnswer == this.buttons[i].textContent) {
        this.buttons[i].dataset.correct="true";
        return;
      }
    }
  }

  shakeAnswerChoices() {
    this.tweens.add({
      targets: this.currentAnswerChoicesElement,
      loop: 1,
      duration: 100,
      x: {from: this.currentAnswerChoicesElement.x - 3, to: this.currentAnswerChoicesElement.x + 3},
      ease: "Quad.easeInOut",
      yoyo: true
    });
  }
}
