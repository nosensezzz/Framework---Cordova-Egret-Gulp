var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.row = [];
        var WIDTH = 20, HEIGHT = 20;
        for (var i = 0; i < HEIGHT; i++) {
            var newRow = [];
            for (var j = 0; j < WIDTH; j++) {
                var r = new Rect(i, j);
                newRow.push(r);
                this.addChild(r);
            }
            this.row.push(newRow);
        }
        var lb = new LeftButton(), rb = new RightButton();
        this.addChild(lb);
        this.addChild(rb);
        lb.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
        rb.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
        // start game here
        var posX = Math.round(Math.random(10, 13) * (3) + 10), posY = Math.round(Math.random(10, 13) * (3) + 10), Direction = "right";
        var snake = new Snake(posX, posY, Direction, this.row);
        // add listener
        setInterval(function () {
            snake.update();
        }, 1000);
    }
    Main.prototype.onButtonClick = function (evt) {
        console.log(evt.target);
        evt.target.onClick();
    };
    return Main;
}(egret.DisplayObjectContainer));
var Snake = (function () {
    function Snake(x, y, d, row) {
        this._x = 0;
        this._y = 0;
        this._d = '';
        this.tail = [];
        this._x = x;
        this._y = y;
        this._d = d;
        this.row = row;
        this.head = row[this._x][this._y];
        this.head.ToHead();
        for (var i = 2; i > 0; i--) {
            row[this._x][this._y - i].ToTail();
            this.tail.unshift(row[this._x][this._y - i]);
        }
        this.lastTail = this.tail[this.tail.length - 1];
    }
    Snake.prototype.update = function () {
        this.lastTail.ToNull();
        this.tail.pop();
        this.lastTail = this.tail[this.tail.length - 1];
        this.head.ToTail();
        this.tail.unshift(this.head);
        switch (this._d) {
            case "right":
                this._y++;
                this.head = this.row[this._x][this._y];
                this.head.ToHead();
                break;
            default: break;
        }
    };
    return Snake;
}());
var Rect = (function (_super) {
    __extends(Rect, _super);
    function Rect(i, j) {
        _super.call(this);
        this._row = 0;
        this._col = 0;
        this.colorType = [0xffffff, 0x888eee, 0xff1111];
        this._color = this.colorType[0];
        this._row = i;
        this._col = j;
        this.draw(i, j);
    }
    Rect.prototype.draw = function (i, j) {
        this.width = egret.MainContext.instance.stage.stageWidth / 20;
        this.height = egret.MainContext.instance.stage.stageWidth / 20;
        this.graphics.lineStyle(1, 0xff1111);
        this.graphics.beginFill(this._color);
        this.graphics.drawRect(j * this.width, i * this.height, this.width, this.height);
        this.graphics.endFill();
    };
    Rect.prototype.ToTail = function () {
        this._color = this.colorType[1];
        this.draw(this._row, this._col);
    };
    Rect.prototype.ToHead = function () {
        this._color = this.colorType[2];
        this.draw(this._row, this._col);
    };
    Rect.prototype.ToNull = function () {
        this._color = this.colorType[0];
        this.draw(this._row, this._col);
    };
    return Rect;
}(egret.Sprite));
var LeftButton = (function (_super) {
    __extends(LeftButton, _super);
    function LeftButton() {
        _super.call(this);
        this.draw();
    }
    LeftButton.prototype.draw = function () {
        this.width = egret.MainContext.instance.stage.stageWidth / 2;
        this.height = egret.MainContext.instance.stage.stageWidth / 2;
        this.graphics.lineStyle(5, 0xff1111);
        this.graphics.beginFill(0xeeeeee);
        this.graphics.drawRect(0, egret.MainContext.instance.stage.stageWidth, this.width, this.height);
        this.graphics.endFill();
    };
    LeftButton.prototype.onClick = function () {
        console.log("left");
        this.dispatchEventWith("left");
    };
    return LeftButton;
}(egret.Sprite));
var RightButton = (function (_super) {
    __extends(RightButton, _super);
    function RightButton() {
        _super.call(this);
        this.draw();
    }
    RightButton.prototype.draw = function () {
        this.width = egret.MainContext.instance.stage.stageWidth / 2;
        this.height = egret.MainContext.instance.stage.stageWidth / 2;
        this.graphics.lineStyle(5, 0xff1111);
        this.graphics.beginFill(0xeeeeee);
        this.graphics.drawRect(egret.MainContext.instance.stage.stageWidth / 2, egret.MainContext.instance.stage.stageWidth, this.width, this.height);
        this.graphics.endFill();
    };
    RightButton.prototype.onClick = function () {
        console.log("right");
        this.dispatchEventWith("right");
    };
    return RightButton;
}(egret.Sprite));
