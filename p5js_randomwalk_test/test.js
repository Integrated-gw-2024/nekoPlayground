
function setup() {
    createCanvas(800, 800);
    //ToMove(startX, startY, endX, endY, frame数, 揺れ, easing)
    /*
    イージングでoutを掛けてあげると終点近くでまとまるので最後のずれの問題が収まりやすい。
    InOutでも可
    */
    testToMove = new ToMove(300, 300, 300, 300, 600, 5, neko.Easing.easeOutSine);
    //簡易: Ball(easing, ToMoveクラス)
    //詳細: Ball(どれくらい動きやすくするか(1に近いほど早い), ToMoveクラスのインスタンス)
    test = new Ball(0.02, testToMove);
}

function draw() {
    background(200);
    //updateでフレームを管理するので必須。
    test.update();

    fill(100);
    //displayで表示fillは特に指定していないので直前にfillしてください。
    testToMove.display();
    fill(0);
    test.display();
}

class Ball {
    constructor(easing, toMove) {
        this.position = {
            x: toMove.fromPosition.x,
            y: toMove.fromPosition.y
        }

        this.targetPosition = {
            x: toMove.position.x,
            y: toMove.position.y,
        }

        console.log(toMove.position);

        this.easing = easing;
        this.toMove = toMove;
    }

    update() {
        this.toMove.update();
        this.targetPosition = {
            x: this.toMove.position.x,
            y: this.toMove.position.y
        }
        this.position.x = this.position.x + ((this.targetPosition.x - this.position.x) * this.easing);
        this.position.y = this.position.y + ((this.targetPosition.y - this.position.y) * this.easing);
    }

    display() {
        circle(this.position.x, this.position.y, 10);
    }
}

class ToMove {
    constructor(fromX, fromY, toX, toY, frame, swingRange, easing) {
        //randomwalk部分
        this.prepareFrame = Math.trunc(frame / 2);
        this.countFrame = 0;
        this.swingRange = swingRange;

        this.fromPosition = {
            x: fromX,
            y: fromY,
        }

        this.toPosition = {
            x: toX,
            y: toY,
        }

        //globalは普通に座標を
        this.globalPosition = {
            x: 0,
            y: 0,
        }

        //localはランダムウォークを管理
        this.localPosition = {
            x: 0,
            y: 0,
        }

        //globalとlocalの合計値
        this.position = {
            x: 0,
            y: 0,
        }

        this.tween = new neko.FrameTween([fromX, fromY], [toX, toY], frame, easing);
        this.shuffleArray = {
            x: this.setupRandomWalkArray(),
            y: this.setupRandomWalkArray(),
        };
    }

    setupRandomWalkArray() {
        // ランダム数値配列（mapを有効にするため一旦0で初期化）
        const deltaXArr = (new Array(this.prepareFrame)).fill(0).map(() => {
            return Math.random() * this.swingRange;
        });
        const deltaXArr2 = this.double(deltaXArr);
        const result = this.shuffle(deltaXArr2);

        return result
    }

    update() {
        this.tween.update();
        this.globalPosition.x = this.tween.getValues()[0];
        this.globalPosition.y = this.tween.getValues()[1];
        if (this.countFrame < this.shuffleArray.x.length) {
            this.localPosition.x += this.shuffleArray.x[this.countFrame];
            this.localPosition.y += this.shuffleArray.y[this.countFrame];
            this.countFrame++;
        }

        this.position.x = this.globalPosition.x + this.localPosition.x;
        this.position.y = this.globalPosition.y + this.localPosition.y;
    }

    display() {
        circle(this.position.x, this.position.y, 10);
    }

    double(arr) {
        let ret = [];
    
        arr.forEach((num) => {
            ret.push(num);
            ret.push(-num);
        });
    
        return ret;
    }
    
    // Fisher–Yatesアルゴリズムによる配列シャッフル
    shuffle(arr) {
        let ret = [].concat(arr);
    
        for (let i = ret.length - 1; i > 0; i--) {
            let r = Math.floor(Math.random() * (i + 1));
            let tmp = ret[i];
            ret[i] = ret[r];
            ret[r] = tmp;
        }
    
        return ret;
    }
}

/*
タイマー版
class ToMove {
    constructor(fromX, fromY, toX, toY, duration, easing, swingRange) {
        //randomwalk部分
        //60fpsの場合1fps = 16.6666...millis
        this.oneFrameMillis = 16.666;
        this.prepareFrame = Math.trunc(duration / this.oneFrameMillis / 2);
        this.countFrame = 0;
        this.swingRange = swingRange;

        //globalは普通に座標を
        this.globalPosition = {
            x: 0,
            y: 0,
        }

        //localはランダムウォークを管理
        this.localPosition = {
            x: 0,
            y: 0,
        }

        //globalとlocalの合計値
        this.position = {
            x: 0,
            y: 0,
        }

        this.tween = new neko.Tween([fromX, fromY], [toX, toY], duration, easing);
        this.shuffleArray = {
            x: this.setupRandomWalkArray(),
            y: this.setupRandomWalkArray(),
        };
    }

    setupRandomWalkArray() {
        // ランダム数値配列（mapを有効にするため一旦0で初期化）
        const deltaXArr = (new Array(this.prepareFrame)).fill(0).map(() => {
            return Math.random() * this.swingRange;
        });
        const deltaXArr2 = this.double(deltaXArr);
        const result = this.shuffle(deltaXArr2);

        return result
    }

    start() {
        this.tween.start();
    }

    update() {
        this.globalPosition.x = this.tween.getValues()[0];
        this.globalPosition.y = this.tween.getValues()[1];
        if (this.countFrame < this.shuffleArray.x.length) {
            this.localPosition.x += this.shuffleArray.x[this.countFrame];
            this.localPosition.y += this.shuffleArray.y[this.countFrame];
            this.countFrame++;
        }

        this.position.x = this.globalPosition.x + this.localPosition.x;
        this.position.y = this.globalPosition.y + this.localPosition.y;
    }

    display() {
        console.log(this.position);
        circle(this.position.x, this.position.y, 10);
    }

    double(arr) {
        let ret = [];
    
        arr.forEach((num) => {
            ret.push(num);
            ret.push(-num);
        });
    
        return ret;
    }
    
    // Fisher–Yatesアルゴリズムによる配列シャッフル
    shuffle(arr) {
        let ret = [].concat(arr);
    
        for (let i = ret.length - 1; i > 0; i--) {
            let r = Math.floor(Math.random() * (i + 1));
            let tmp = ret[i];
            ret[i] = ret[r];
            ret[r] = tmp;
        }
    
        return ret;
    }
}
*/
