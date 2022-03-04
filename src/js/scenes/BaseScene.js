import {Scene} from "phaser";

export default class BaseScene extends Scene {
  constructor(key) {
    super(key);
  }

  setSlimeState(slimeConfig) {
    this.game.registry.set("slime", slimeConfig.slime);
    this.game.registry.set("slimeQueue", slimeConfig.slimeQueue);
    this.game.registry.set("slimeOnScreen", slimeConfig.slimeOnScreen);
  }

  getSlimeState() {
    let slime = this.game.registry.get("slime");
    let slimeQueue = this.game.registry.get("slimeQueue");
    let slimeOnScreen = this.game.registry.get("slimeOnScreen");
    return {slime, slimeQueue, slimeOnScreen};
  }

  addGameBackground () {
    this.add.sprite(800, 450,'background').setOrigin(0.5).setScale(1.05,1);
  }
}
