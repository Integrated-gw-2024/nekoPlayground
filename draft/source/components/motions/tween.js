import { neko } from '../../lib/neko-lib'
import { Motion } from './motion'

export class Tween extends Motion {
  tween;

  constructor(froms, tos, frames, easing = neko.Easing.linear) {
    super();
    this.frameTotal = frames;
    this.frameCurrent = 0;
    this.tween = new neko.FrameTween(froms, tos, frames, easing);
  }

  reset() {
    super.reset();
    this.tween.frame = 0;
  }

  update() {
    this.tween.update();
    this.frameCurrent = this.tween.frame;
    this.position.x = this.tween.getValues()[0];
    this.position.y = this.tween.getValues()[1];
    console.log(this.tween.getValues());
    console.log(this.frameCurrent);
  }
}
