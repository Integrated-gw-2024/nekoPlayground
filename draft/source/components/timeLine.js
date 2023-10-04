import { Component } from "./component";
import { Motion } from "./motions/motion";

export class TimeLine extends Component {
  motions;
  motionsIndexCurrent;

  constructor(components) {
    super(components);
    this.motions = [];
    this.motionsIndexCurrent = 0;
  }

  addMotion(motion) {
    motion.position = this.components.position;
    this.motions.push(motion);
  }

  reset() {
    if (this.motions.length < 0) {
      throw new Error("motionsの中身がnullです");
    }

    for (const motion of this.motions) {
      motion.reset();
    }

    this.motionsIndexCurrent = 0;
  }

  isCompleat() {
    if (this.motionsIndexCurrent >= this.motions.length) {
      return true;
    }

    return false;
  }

  update() {
    if (this.motions.length < 0) {
      throw new Error("motionsの中身がnullです");
    }

    if (this.motionsIndexCurrent >= this.motions.length) {
      return;
    }

    if (this.motions[this.motionsIndexCurrent].isCompleat()) {
      this.motionsIndexCurrent++;
      return;
    }

    console.log(this.motionsIndexCurrent)
    this.motions[this.motionsIndexCurrent].update();
  }
}
