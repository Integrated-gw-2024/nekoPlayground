import { neko } from './lib/neko-lib'
import { Entity } from './core/entity';
import { Tween } from './components/motions/tween.js';

export const sketch = (p) => {
  let entity;
  let motion;
  let motion2;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    console.log("hi")

    entity = new Entity({
      shapeFunction: (x, y) => {
        p.circle(x, y, 20);
      }
    })

    motion = new Tween (
      [20, 40], [200, 200], 50, neko.Easing.easeInOutQuad
    );

    motion2 = new Tween (
      [200, 200], [400, 60], 50, neko.Easing.easeInOutQuad
    );

    const motion3 = new Tween (
      [400, 60], [300, 300], 40, neko.Easing.easeInOutQuad
    )

    const motion4 = new Tween (
      [300, 300], [50, 300], 50, neko.Easing.easeInOutQuad
    )

    entity.components.timeline.addMotion(motion);
    entity.components.timeline.addMotion(motion2);
    entity.components.timeline.addMotion(motion3);
    entity.components.timeline.addMotion(motion4);
  }

  p.draw = () => {
    p.background('#0f2350');
    p.noStroke();
    p.fill(255);
    entity.components.shape.display();
    entity.update();

    if (entity.components.timeline.isCompleat()) entity.components.timeline.reset();
  }
};