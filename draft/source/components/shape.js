import { Component } from "./component";

export class Shape extends Component {
  shapeFunction;

  constructor(shapeFunction = (x, y) => {}, components) {
    super(components);
    this.shapeFunction = shapeFunction;
  }

  display() {
    this.shapeFunction(this.components.position.x, this.components.position.y);
  }
}
