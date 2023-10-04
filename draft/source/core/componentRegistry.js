import { Position } from "../components/position";
import { Shape } from "../components/shape";
import { TimeLine } from "../components/timeLine";

export class ComponentRegistry {
  position;
  shape;
  timeline;

  map;

  constructor({
    position: position = new Position(0, 0, this),
    shape: shape = new Shape(() => {}, this),
  }) {
    this.position = position;
    this.shape = shape;
    this.timeline = new TimeLine(this);

    this.map = new Map();

    this.map.set("position", this.position);
    this.map.set("shape", this.shape);
    this.map.set("timeline", this.timeline);
  }
}
