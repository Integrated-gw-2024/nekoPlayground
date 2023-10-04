let neko;
(function (neko) {
  class Timer {
    constructor(timer_length, continue_time = 0) {
      this.reverse_mode = false;
      this.running = false;

      this.timer_length = timer_length;
      this.continue_time = continue_time;
      this.start_time = Date.now();
    }

    start() {
      if (this.running) return;
      this.start_time = Date.now();
      this.running = true;
    }

    stop() {
      if (!this.running) return;
      this.continue_time = this.getElapsedTime();
      this.running = false;
    }

    reset() {
      this.start_time = Date.now();
    }

    reverse(clamp = true) {
      this.continue_time = this.getElapsedTime(clamp);
      this.reverse_mode = !this.reverse_mode;
      this.start_time = Date.now();
    }

    setTimerLength(Timer_length) {
      this.timer_length = Timer_length;
    }

    setElapsedTime(Continue_time) {
      this.continue_time = Continue_time;
    }

    getRunning() {
      return this.running;
    }

    getReverse() {
      return this.reverse_mode;
    }

    getCompleat() {
      if (this.reverse_mode) {
        if (this.getElapsedTime() < 0) {
          return true;
        }
      } else {
        if (this.getElapsedTime() > this.timer_length) {
          return true;
        }
      }

      return false;
    }

    getTimerLength() {
      return this.timer_length;
    }

    getElapsedTime(clamp = false) {
      if (!this.running) this.start_time = Date.now();

      if (this.reverse_mode) {
        if (clamp) {
          if (this.continue_time - (Date.now() - this.start_time) < 0) {
            return 0;
          } else {
            return this.continue_time - (Date.now() - this.start_time);
          }
        } else {
          return this.continue_time - (Date.now() - this.start_time);
        }
      } else {
        if (clamp) {
          if (
            Date.now() - this.start_time + this.continue_time >
            this.getTimerLength()
          ) {
            return this.getTimerLength();
          } else {
            return Date.now() - this.start_time + this.continue_time;
          }
        } else {
          return Date.now() - this.start_time + this.continue_time;
        }
      }
    }

    getProgress(clamp = true) {
      let rate = this.getElapsedTime(clamp) / this.getTimerLength();

      return rate;
    }
  }

  class Tween extends Timer {
    constructor(froms, tos, duration, easing = Easing.linear) {
      super(duration);
      
      if (froms.length !== tos.length) {
        throw new Error("引数fromsと引数tosの要素数は同じにしてください");
      }

      if (typeof froms == "number") {
        this.froms = [froms]
        this.tos = [tos]
      } else {
        this.froms = froms;
        this.tos = tos;
      }
      this.easing = easing;
      this.targets = [];
    }
    
    getValue() {
      if (this.getCompleat()) this.stop();
      
      return Math_n.map(this.easing(this.getProgress()), 0, 1, this.froms[0], this.tos[0]);
    }
    
    getValues() {
      if (this.getCompleat()) this.stop();
      
      const result = new Array(this.froms.length);
      for (let i = 0; i < this.froms.length; i++) {
        result[i] = Math_n.map(this.easing(this.getProgress()), 0, 1, this.froms[i], this.tos[i]);
      }
      
      return result;
    }
    
    reverse() {
      super.reverse();   
      super.start();
    }
    
    start() {
      super.start();    
      if (this.getReverse()) this.reverse();
    }
    
    update() {
      if (this.getCompleat()) this.stop();
      
      for (let i = 0; i < this.targets.length; i++) {
        this.targets[i].setValue(Math_n.map(this.easing.get(this.getProgress()), 0, 1, this.froms[i], this.tos[i]));
      }
    }
  }

  class FrameTween {
    constructor(froms, tos, frames, easing = Easing.linear) {
      if (froms.length !== tos.length) {
        throw new Error("引数fromsと引数tosの要素数は同じにしてください");
      }

      if (typeof froms == "number") {
        this.froms = [froms]
        this.tos = [tos]
      } else {
        this.froms = froms;
        this.tos = tos;
      }
      this.frames = frames;
      this.frame = 0;
      this.easing = easing;
    }
    
    getValue() {
      return Math_n.map(this.easing(this.frame / this.frames), 0, 1, this.froms[0], this.tos[0]);
    }
    
    getValues() {
      const result = new Array(this.froms.length);
      for (let i = 0; i < this.froms.length; i++) {
        result[i] = Math_n.map(this.easing(this.frame / this.frames), 0, 1, this.froms[i], this.tos[i]);
      }
      
      return result;
    }
    
    update() {
      if (this.frame < this.frames) {
        this.frame++;
      }
    }
  }

  class Easing {
    static linear(t) {
      return t;
    }
    static easeInQuad(t) {
      return (t /= 1) * t;
    }
    static easeOutQuad(t) {
      return -(t /= 1) * (t - 2);
    }
    static easeInOutQuad(t) {
      if ((t /= 0.5) < 1) return 0.5 * t * t;
      return -0.5 * (--t * (t - 2) - 1);
    }
    static easeInCubic(t) {
      return (t /= 1) * t * t;
    }
    static easeOutCubic(t) {
      return (t = t - 1) * t * t + 1;
    }
    static easeInOutCubic(t) {
      if ((t /= 0.5) < 1) return 0.5 * t * t * t;
      return 0.5 * ((t -= 2) * t * t + 2);
    }
    static easeInQuart(t) {
      return (t /= 1) * t * t * t;
    }
    static easeOutQuart(t) {
      return -((t = t - 1) * t * t * t - 1);
    }
    static easeInOutQuart(t) {
      if ((t /= 0.5) < 1) return 0.5 * t * t * t * t;
      return -0.5 * ((t -= 2) * t * t * t - 2);
    }
    static easeInQuint(t) {
      return (t /= 1) * t * t * t * t;
    }
    static easeOutQuint(t) {
      return (t = t - 1) * t * t * t * t + 1;
    }
    static easeInOutQuint(t) {
      if ((t /= 0.5) < 1) return 0.5 * t * t * t * t * t;
      return 0.5 * ((t -= 2) * t * t * t * t + 2);
    }
    static easeInSine(t) {
      return -Math.cos(t * (Math.PI / 2)) + 1;
    }
    static easeOutSine(t) {
      return Math.sin(t * (Math.PI / 2));
    }
    static easeInOutSine(t) {
      return -0.5 * (Math.cos(Math.PI * t) - 1);
    }
    static easeInExpo(t) {
      if (t == 0) return 0;
      return Math.pow(2, 10 * (t - 1));
    }
    static easeOutExpo(t) {
      if (t == 1) return 1;
      return -Math.pow(2, -10 * t) + 1;
    }
    static easeInOutExpo(t) {
      if (t == 0) return 0;
      if (t == 1) return 1;
      if ((t /= 0.5) < 1) return 0.5 * Math.pow(2, 10 * (t - 1));
      return 0.5 * (-Math.pow(2, -10 * --t) + 2);
    }
    static easeInCirc(t) {
      return -(Math.sqrt(1 - (t /= 1) * t) - 1);
    }
    static easeOutCirc(t) {
      return Math.sqrt(1 - (t = t - 1) * t);
    }
    static easeInOutCirc(t) {
      if ((t /= 0.5) < 1) return -0.5 * (Math.sqrt(1 - t * t) - 1);
      return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
    }
    static createEaseInElastic(s = 1.70158) {
      return function (t) {
        let p = 0;
        let a = 1;
        if (t == 0) return 0;
        if ((t /= 1) == 1) return 1;
        if (p == 0) p = 0.3;
        if (a < 1) {
          a = 1;
          s = p / 4;
        } else {
          s = (p / (2 * Math.PI)) * Math.asin(1 / a);
        }
        return (
          -a *
          Math.pow(2, 10 * (t -= 1)) *
          Math.sin(((t - s) * (2 * Math.PI)) / p)
        );
      };
    }
    static createEaseOutElastic(s = 1.70158) {
      return function (t) {
        let p = 0;
        let a = 1;
        if (t == 0) return 0;
        if ((t /= 1) == 1) return 1;
        if (p == 0) p = 0.3;
        if (a < 1) {
          a = 1;
          s = p / 4;
        } else {
          s = (p / (2 * Math.PI)) * Math.asin(1 / a);
        }
        return (
          a * Math.pow(2, -10 * t) * Math.sin(((t - s) * (2 * Math.PI)) / p) + 1
        );
      };
    }
    static createEaseInOutElastic(s = 1.70158) {
      return function (t) {
        let p = 0;
        let a = 1;
        if (t == 0) return 0;
        if ((t /= 0.5) == 2) return 1;
        if (p == 0) p = 0.3 * 1.5;
        if (a < 1) {
          a = 1;
          s = p / 4;
        } else {
          s = (p / (2 * Math.PI)) * Math.asin(1 / a);
        }
        if (t < 1)
          return (
            -0.5 *
            a *
            Math.pow(2, 10 * (t -= 1)) *
            Math.sin(((t - s) * (2 * Math.PI)) / p)
          );
        return (
          a *
            Math.pow(2, -10 * (t -= 1)) *
            Math.sin(((t - s) * (2 * Math.PI)) / p) *
            0.5 +
          1
        );
      };
    }
    static easeInElastic(t) {
      return Easing.defaultEaseInElastic(t);
    }
    static easeOutElastic(t) {
      return Easing.defaultEaseOutElastic(t);
    }
    static easeInOutElastic(t) {
      return Easing.defaultEaseInOutElastic(t);
    }
    static createEaseInBack(s = 1.70158) {
      return function (t) {
        return (t /= 1) * t * ((s + 1) * t - s);
      };
    }
    static createEaseOutBack(s = 1.70158) {
      return function (t) {
        return (t = t - 1) * t * ((s + 1) * t + s) + 1;
      };
    }
    static createEaseInOutBack(s = 1.70158) {
      return function (t) {
        if ((t /= 0.5) < 1) return 0.5 * t * t * (((s *= 1.525) + 1) * t - s);
        return 0.5 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2);
      };
    }
    static easeInBack(t) {
      return Easing.defaultEaseInBack(t);
    }
    static easeOutBack(t) {
      return Easing.defaultEaseOutBack(t);
    }
    static easeInOutBack(t) {
      return Easing.defaultEaseInOutBack(t);
    }
    static easeInBounce(t) {
      return 1 - Easing.easeOutBounce(1 - t);
    }
    static easeOutBounce(t) {
      if ((t /= 1) < 1 / 2.75) {
        return 7.5625 * t * t;
      } else if (t < 2 / 2.75) {
        return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
      } else if (t < 2.5 / 2.75) {
        return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
      } else {
        return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
      }
    }
    static easeInOutBounce(t) {
      if (t < 0.5) return Easing.easeInBounce(t * 2) * 0.5;
      return Easing.easeOutBounce(t * 2 - 1) * 0.5 + 0.5;
    }
  }
  Easing.defaultEaseInElastic = Easing.createEaseInElastic();
  Easing.defaultEaseOutElastic = Easing.createEaseOutElastic();
  Easing.defaultEaseInOutElastic = Easing.createEaseInOutElastic();
  Easing.defaultEaseInBack = Easing.createEaseInBack();
  Easing.defaultEaseOutBack = Easing.createEaseOutBack();
  Easing.defaultEaseInOutBack = Easing.createEaseInOutBack();

  class Math_n {
    static map(value, srcA, srcB, dstA, dstB, clamp = true) {
      if (srcA === srcB) return dstA;
      if (clamp) {
        if (srcA < srcB) {
          if (value < srcA) value = srcA;
          else if (value > srcB) value = srcB;
        } else {
          if (value < srcB) value = srcB;
          else if (value > srcA) value = srcA;
        }
      }
      return ((value - srcA) * (dstB - dstA)) / (srcB - srcA) + dstA;
    }
  }

  neko.Timer = Timer;
  neko.Tween = Tween;
  neko.FrameTween = FrameTween;
  neko.Easing = Easing;
  neko.Math = Math_n;
})(neko || (neko = {}));
