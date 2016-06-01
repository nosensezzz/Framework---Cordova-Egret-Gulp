var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.BoardWidth = 30;
        this.BoardHeight = 30;
        this.Speed = 1000 / 20;
        this.row = [];
        this.snake = null;
        var self = this;
        WIDTH = this.BoardWidth,
            HEIGHT = this.BoardHeight;
        for (var i = 0; i < HEIGHT; i++) {
            var newRow = [];
            for (var j = 0; j < WIDTH; j++) {
                var r = new Rect(i, j, this.BoardWidth, this.BoardHeight);
                newRow.push(r);
                this.addChild(r);
            }
            this.row.push(newRow);
        }
        // start game here
        var snake = new Snake(this.row, this.BoardHeight, this.BoardWidth);
        this.snake = snake;
        // add listener
        var lb = new LeftButton(), rb = new RightButton(), restartBtn = new RestartBtn();
        lb.touchEnabled = true;
        this.addChild(lb);
        lb.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick.bind(null, this.snake), this);
        rb.touchEnabled = true;
        this.addChild(rb);
        rb.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick.bind(null, this.snake), this);
        restartBtn.touchEnabled = true;
        this.addChild(restartBtn);
        restartBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.restart, this);
        this.interval = setInterval(function () {
            if (!self.snake.update()) {
                self.gameover();
            }
        }, this.Speed);
        this.addEventListener("gameover", this.gameover, this);
    }
    Main.prototype.onButtonClick = function (snake, evt) {
        evt.target.onClick(snake);
    };
    Main.prototype.gameover = function () {
        clearInterval(this.interval);
    };
    Main.prototype.restart = function () {
        var self = this;
        clearInterval(this.interval);
        this.snake.reborn(this.row, this.BoardHeight, this.BoardWidth);
        this.interval = setInterval(function () {
            if (!self.snake.update()) {
                self.gameover();
            }
        }, this.Speed);
    };
    return Main;
}(egret.DisplayObjectContainer));
var Snake = (function () {
    function Snake(row, maxY, maxX) {
        this.maxX = 0;
        this.maxY = 0;
        this._x = 0;
        this._y = 0;
        this._d = '';
        this.lastAbandonedTail = null;
        this.tail = [];
        this.apple = null;
        x = Math.round(Math.random(10, 13) * (3) + 10),
            y = Math.round(Math.random(10, 13) * (3) + 10),
            d = "right";
        this._x = x;
        this._y = y;
        this.maxX = maxX;
        this.maxY = maxY;
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
    Snake.prototype.reborn = function (row, maxY, maxX) {
        for (var i = 0; i < this.tail.length - 1; i++) {
            this.tail[i] ? this.tail[i].ToNull() : null;
        }
        this.lastTail ? this.lastTail.ToNull() : null;
        this.head ? this.head.ToNull() : null;
        var x = Math.round(Math.random(10, 13) * (3) + 10), y = Math.round(Math.random(10, 13) * (3) + 10), d = "right";
        this._x = x;
        this._y = y;
        this.maxX = maxX;
        this.maxY = maxY;
        this._d = d;
        this.row = row;
        this.tail = [];
        this.head = row[this._x][this._y];
        this.head.ToHead();
        for (var i = 2; i > 0; i--) {
            row[this._x][this._y - i].ToTail();
            this.tail.unshift(row[this._x][this._y - i]);
        }
        this.lastTail = this.tail[this.tail.length - 1];
    };
    Snake.prototype.update = function () {
        if (!this.apple) {
            var x = Math.round(Math.random(0, this.maxX) * (this.maxX) + 0), y = Math.round(Math.random(0, this.maxY) * (this.maxY) + 0);
            if (this.row[x][y].isNull) {
                this.row[x][y].ToApple();
            }
            this.apple = this.row[x][y];
        }
        this.lastTail.ToNull();
        this.lastAbandonedTail = this.tail.pop();
        this.lastTail = this.tail[this.tail.length - 1];
        this.head.ToTail();
        this.tail.unshift(this.head);
        switch (this._d) {
            case "right":
                this._y++;
                break;
            case "up":
                this._x++;
                break;
            case "left":
                this._y--;
                break;
            case "down":
                this._x--;
                break;
            default: break;
        }
        if (!this.row[this._x] || !this.row[this._x][this._y]) {
            return false;
        }
        else {
            this.head = this.row[this._x][this._y];
            this.head.ToHead();
            if (this.head == this.apple) {
                this.tail.push(this.lastAbandonedTail);
                this.apple = null;
            }
            return true;
        }
    };
    Snake.prototype.setLeft = function () {
        switch (this._d) {
            case "right":
                this._d = "up";
                break;
            case "up":
                this._d = "left";
                break;
            case "left":
                this._d = "down";
                break;
            case "down":
                this._d = "right";
                break;
            default: break;
        }
    };
    Snake.prototype.setRight = function () {
        switch (this._d) {
            case "right":
                this._d = "down";
                break;
            case "down":
                this._d = "left";
                break;
            case "left":
                this._d = "up";
                break;
            case "up":
                this._d = "right";
                break;
            default: break;
        }
    };
    return Snake;
}());
var Rect = (function (_super) {
    __extends(Rect, _super);
    function Rect(i, j, maxX, maxY) {
        _super.call(this);
        this._row = 0;
        this._col = 0;
        this.maxX = 0;
        this.maxY = 0;
        this.isNull = true;
        this.colorType = [0xffffff, 0x888eee, 0xff1111, 0x666666];
        this._color = this.colorType[0];
        this._row = i;
        this._col = j;
        this.maxX = maxX;
        this.maxY = maxY;
        this.draw(i, j);
    }
    Rect.prototype.draw = function (i, j) {
        this.width = egret.MainContext.instance.stage.stageWidth / this.maxX;
        this.height = egret.MainContext.instance.stage.stageWidth / this.maxY;
        this.graphics.lineStyle(1, 0xff1111);
        this.graphics.beginFill(this._color);
        this.graphics.drawRect(j * this.width, i * this.height, this.width, this.height);
        this.graphics.endFill();
    };
    Rect.prototype.ToTail = function () {
        this.isNull = false;
        this._color = this.colorType[1];
        this.draw(this._row, this._col);
    };
    Rect.prototype.ToHead = function () {
        this.isNull = false;
        this._color = this.colorType[2];
        this.draw(this._row, this._col);
    };
    Rect.prototype.ToNull = function () {
        this.isNull = true;
        this._color = this.colorType[0];
        this.draw(this._row, this._col);
    };
    Rect.prototype.ToApple = function () {
        this.isNull = false;
        this._color = this.colorType[3];
        this.draw(this._row, this._col);
    };
    return Rect;
}(egret.Sprite));
var LeftButton = (function (_super) {
    __extends(LeftButton, _super);
    function LeftButton() {
        _super.call(this);
        this.color = 0xeeeeee;
        this.draw();
    }
    LeftButton.prototype.draw = function () {
        this.width = egret.MainContext.instance.stage.stageWidth / 2;
        this.height = egret.MainContext.instance.stage.stageWidth / 2;
        this.graphics.lineStyle(5, 0xff1111);
        this.graphics.beginFill(this.color);
        this.graphics.drawRect(0, egret.MainContext.instance.stage.stageWidth, this.width, this.height);
        this.graphics.endFill();
    };
    LeftButton.prototype.onClick = function (snake) {
        snake.setLeft();
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
    RightButton.prototype.onClick = function (snake) {
        snake.setRight();
    };
    return RightButton;
}(egret.Sprite));
var RestartBtn = (function (_super) {
    __extends(RestartBtn, _super);
    function RestartBtn() {
        _super.call(this);
        this.draw();
    }
    RestartBtn.prototype.draw = function () {
        this.width = egret.MainContext.instance.stage.stageWidth;
        this.height = egret.MainContext.instance.stage.stageWidth / 10;
        this.graphics.lineStyle(5, 0xff1111);
        this.graphics.beginFill(0xeeeeee);
        this.graphics.drawRect(0, egret.MainContext.instance.stage.stageWidth * 3 / 2, this.width, this.height);
        this.graphics.endFill();
    };
    return RestartBtn;
}(egret.Sprite));
