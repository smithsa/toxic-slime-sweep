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
    this.questionAnsweredCorrectly = false;
    this.maxAttempts = 2;
    this.winningSound = null;
    this.losingSound = null;
    this.fewSLimeLeft = null;
    this.isGameEnded = false;
  }

  preload() {
    this.winningSound = this.SoundA11yPluginPlugin.add('voice', 'complete');
    this.losingSound = this.SoundA11yPluginPlugin.add('voice', 'takenOver');
    this.instructionsSound = this.SoundA11yPluginPlugin.add('voice', 'instructions');
    this.fewSLimeLeft = this.SoundA11yPluginPlugin.add('voice', 'fewLeft');
    this.addEventHandlersToSlime();
  }

  async create() {
    // sort and get the first 10 questions
    this.questionBank.sort(() => {
      return 0.5 - Math.random()
    });

    this.questionBank = this.questionBank.splice(0, CONST.QUESTION_COUNT);

    const instructionsButtonHtmlBuilder = new ButtonImage("Replay Instructions", "./img/btn_sound.png", "sound__btn");
    instructionsButtonHtmlBuilder.element.addEventListener("click", this.playInstructions.bind(this));

    this.instructionsSound.addMarker({name: "instruct_look", start: 0, duration: 2.5});
    this.instructionsSound.addMarker({name: "instruct_answer_quickly", start: 2.6, duration: 3});
    this.loadAnswerChoiceResponseSounds();

    let {value} = this.questions.next();
    this.currentAnswer = value.answer;
    await this.addQuestionStem(value.stem);

    const instructionsSoundTimedEvent = this.time.delayedCall(1000, () => {
      this.playInstructions().finally(function () {
        this.loadAnswerChoiceButtons(value.answerChoices);
        this.add.dom(1390, 100, instructionsButtonHtmlBuilder.element);
      }.bind(this));

      instructionsSoundTimedEvent.destroy();
    }, [], this);

  }

  delayedNextQuestion(delay) {
    const nextQuestionTimedEvent = this.time.delayedCall(delay, function() {
      this.nextQuestion();
      nextQuestionTimedEvent.destroy();
      this.currentQuestionAttempts = 0;
      this.questionAnsweredCorrectly = false;
    }, [], this);
  }

  async nextQuestion() {
    this.resetCorrectAttributeValueOnButtons();
    let {value, done} = this.questions.next();
    if(done) {
      this.isGameEnded = true;
      console.warn("No more questions exist to continue");
      this.endGameInLosingState();
      return;
    }

    this.currentAnswer = value.answer;
    this.addNewAnswerChoices(value.answerChoices);
    await this.addQuestionStem(value.stem);
  }

  // TODO WRONG AND RIGHT NEED TO BE FIXED
  async validateAnswerChoice(event) {
    this.currentQuestionAttempts++;

    if(this.currentQuestionAttempts > 2 || this.questionAnsweredCorrectly) {
      event.preventDefault();
      return;
    }

    this.resetCorrectAttributeValueOnButtons();

    if(event.target.dataset.value == this.currentAnswer) {
      this.questionAnsweredCorrectly = true;
      event.target.dataset.correct = true;
      // this.currentQuestionAttempts = 0;
      await this.removeSlime();
      let winState = this.checkForWinningGameState();
      this.delayedNextQuestion(2000);
      await this.playRandomSound(this.correctSounds);
    } else {
      this.shakeAnswerChoices();
      event.target.dataset.correct = false;

      if(this.currentQuestionAttempts === this.maxAttempts) {
        // this.currentQuestionAttempts = 0;
        this.playRandomSound(this.solutionsSounds);
        this.revealCorrectAnswer();
        this.startLosingGameStateIfEligible().then(function(isLosingGame){
          if(!isLosingGame) {
            this.delayedNextQuestion(3000);
          }
        }.bind(this));

        return;
      };


      await this.playRandomSound(this.wrongSounds);
      await this.addSlime();
      // this.resetCorrectAttributeValueOnButtons();
    }
  }

  async checkForWinningGameState() {
    let {slimeOnScreen} = this.getSlimeState();
    if(slimeOnScreen.length === 0) {
      await this.SoundA11yPlugin.play(this.winningSound);
      this.hideQuestionStemAndAnswerChoices();
      return true;
    }

    return false;
  }

  async startLosingGameStateIfEligible() {
    let {slime, slimeOnScreen} = this.getSlimeState();
    if (slimeOnScreen.length === 10) {
      this.hideQuestionStemAndAnswerChoices();
      for(let slimeKey in slime) {
        slime[slimeKey]["object"].setInteractive();
      }
      await this.SoundA11yPlugin.play(this.losingSound);
      return true;
    }

    return false;
  }

  endGameInLosingState() {
    let {slime, slimeOnScreen} = this.getSlimeState();
    this.hideQuestionStemAndAnswerChoices();
    this.SoundA11yPlugin.play(this.fewSLimeLeft);
    for(let slimeKey in slime) {
      slime[slimeKey]["object"].setInteractive();
    }
  }

  returnBackToGameFromLosingState() {
    this.delayedNextQuestion(0);
    let {slime} = this.getSlimeState();
    for(let slimeKey in slime) {
      slime[slimeKey]["object"].disableInteractive();
    }
    this.showQuestionStemAndAnswerChoices();
    this.SoundA11yPlugin.play(this.fewSLimeLeft);
  }

  addEventHandlersToSlime() {
    let {slime} = this.getSlimeState();

    for(let slimeKey in slime) {
      slime[slimeKey]["object"].on("pointerdown", function() {
        let {slimeOnScreen} = this.getSlimeState();

        if(!this.isGameEnded && slimeOnScreen.length <= 7) {
          this.returnBackToGameFromLosingState();
          return;
        }

        if(this.isGameEnded && slimeOnScreen.length === 1) {
          // TODO end the game here and show the replay button
          this.SoundA11yPlugin.play(this.winningSound);
        }

        this.removeSlimeByKey(slimeKey);
      }.bind(this));
    }
  }

  // TODO PUT GUARDS ON POPPING
  addSlime() {
    return new Promise(function(resolve, reject) {
      try {
        let {slime, slimeQueue, slimeOnScreen} = this.getSlimeState();
        let slimeKey = slimeQueue.pop();

        if(slimeKey == null) {
          console.warn("Slime Key is Null");
        }

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

  async removeSlime() {
    let {slime, slimeQueue, slimeOnScreen} = this.getSlimeState();
    let slimeKey = slimeOnScreen[slimeOnScreen.length - 1];

    if(slimeKey == null) {
      console.warn("Slime Key is Null");
    }
    await this.removeSlimeByKey(slimeKey);
  }

  removeSlimeByKey(slimeKey) {
    return new Promise(function(resolve, reject) {
      try {
        let {slime, slimeQueue, slimeOnScreen} = this.getSlimeState();
        let indexAt = slimeOnScreen.indexOf(slimeKey);
        slimeOnScreen.splice(indexAt, 1);
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
    return this.SoundA11yPlugin.play(this.instructionsSound);
  }

  playRandomSound(soundList) {
    let randInt = this.getRandomIntInclusive(0, soundList.length-1);
    this.SoundA11yPlugin.play(soundList[randInt]);
  }

  addNewAnswerChoices (answerChoicesList) {
    answerChoicesList.forEach((answerChoice, index) => {
      this.buttons[index].textContent = answerChoice;
      this.buttons[index].dataset.value = answerChoice;
    });
  }

  loadAnswerChoiceResponseSounds() {
    for(let i=1; i < 6; i++) {
      this.correctSounds.push(this.SoundA11yPlugin.add('voice', `correct${i}`));
    }

    for(let i=1; i < 4; i++) {
      this.wrongSounds.push(this.SoundA11yPlugin.add('voice', `wrong${i}`));
    }

    for(let i=1; i < 3; i++) {
      this.solutionsSounds.push(this.SoundA11yPlugin.add('voice', `solution${i}`));
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

  hideQuestionStemAndAnswerChoices() {
    this.currentQuestionStemElement.setVisible(false);
    this.buttonsContainerElement.style.visibility = "hidden";
  }

  showQuestionStemAndAnswerChoices() {
    this.currentQuestionStemElement.setVisible(true);
    this.buttonsContainerElement.style.visibility = "visible";
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
