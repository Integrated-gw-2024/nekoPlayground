import { ComponentRegistry } from "./componentRegistry";
import { Position } from "../components/position";
import { Shape } from "../components/shape";
import { TimeLine } from "../components/timeLine";

export class Entity {
  components;

  constructor({
    x: x = 0,
    y: y = 0,
    shapeFunction: shapeFunction = () => {},
  }) {
    this.components = new ComponentRegistry({})
    
    const position = new Position(x, y, this.components);
    const shape = new Shape(shapeFunction, this.components);

    this.components.position = position;
    this.components.shape = shape;
  }

  update() {
    this.components.map.forEach((component) => {
      if (component === null) return;
      component.update();
    })
  }
}