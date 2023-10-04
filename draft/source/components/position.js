import { Component } from "./component";

export class Position extends Component {
  x;
  y;

  constructor(x, y, components) {
    super(components);
    this.x = x;
    this.y = y;
  }
}
