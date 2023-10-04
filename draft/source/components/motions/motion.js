import { Component } from "../component";

export class Motion {
  frameTotal;
  frameCurrent;
  frameStart;
  frameEnd;
  position;

  constructor() {
  }

  isCompleat() {
    if (this.frameCurrent >= this.frameTotal) return true;

    return false
  }

  reset() {
    this.frameCurrent = 0;
  }

  update() {}
}
