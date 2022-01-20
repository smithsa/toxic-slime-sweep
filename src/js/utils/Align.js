export default class Align {
  constructor(game) {
    this.game = game;
  }
  scaleToGame(obj, percentageOfGameWidth) {
    obj.displayWidth = this.game.config.width * percentageOfGameWidth;
    obj.scaleY = obj.scaleX;
  }

  centerX(obj) {
    obj.x = this.game.config.width/2 - obj.displayWidth/2
  }

  centerY(obj) {
    obj.y = this.game.config.height/2 - obj.displayHeight/2
  }

  center(obj) {
    obj.y = this.game.config.height/2;
    obj.x = this.game.config.width/2;
  }
}
