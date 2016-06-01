class Main extends egret.DisplayObjectContainer 
{
    public constructor() {
        super();   

        var 
        WIDTH = 20,
        HEIGHT = 20,


        for(let i = 0; i < HEIGHT; i++){
        	var newRow = [];
        	for(let j = 0; j< WIDTH; j++){
        		var r = new Rect(i, j);
        		newRow.push(r);
        		this.addChild(r);
        	}
        	this.row.push(newRow);
        }

        var
        lb = new LeftButton(),
        rb = new RightButton();

        this.addChild(lb);
        lb.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);

        this.addChild(rb);
        rb.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
        // start game here

        var
        posX = Math.round(Math.random(10,13)*(3)+10),
        posY = Math.round(Math.random(10,13)*(3)+10),
        Direction = "right";

        // var snake = new Snake(posX, posY, Direction, this.row);
        // // add listener
        // setInterval(function() {
        // 	snake.update();
        // }, 1000);
    }
    private row: Array<Array> = [];

    public onButtonClick(evt: egret.TouchEvent)
    {
    	console.log(evt.target);
    	evt.target.onClick();
    }
}

class Snake
{
	public constructor(x, y, d, row)
	{
		this._x	= x;
		this._y = y;
		this._d = d;
		this.row = row;

		this.head = row[this._x][this._y];
		this.head.ToHead();
		for(let i=2; i>0; i--)
		{
			row[this._x][this._y - i].ToTail();
			this.tail.unshift(row[this._x][this._y - i]);
		}
		this.lastTail = this.tail[this.tail.length-1];
	}

	private _x:number = 0;
	private _y:number = 0;
	private _d:string = '';
	private row;

	private.head:Rect;
	private.lastTail:Rect;
	private.tail:array = [];

	public update(){
		this.lastTail.ToNull();
		this.tail.pop();
		this.lastTail = this.tail[this.tail.length - 1];
		this.head.ToTail();
		this.tail.unshift(this.head);
		switch(this._d)
		{
			case "right":
			this._y++;
			this.head = this.row[this._x][this._y];
			this.head.ToHead();
			break;
			default: break;
		}
	}
}

class Rect extends egret.Sprite
{
	public constructor(i, j)
	{
		super();

		this._row = i;
		this._col = j;

		this.draw(i, j);
	}

	private draw(i, j)
	{
		this.width = egret.MainContext.instance.stage.stageWidth / 20;
		this.height = egret.MainContext.instance.stage.stageWidth / 20;
		this.graphics.lineStyle(1, 0xff1111 );
        this.graphics.beginFill( this._color );
        this.graphics.drawRect( j*this.width, i*this.height, this.width, this.height);
        this.graphics.endFill();
	}

	private _row:number = 0;
	private _col:number = 0;
	private colorType:array = [0xffffff, 0x888eee, 0xff1111];
	private _color = this.colorType[0];

	public ToTail()
	{
		this._color = this.colorType[1];
		this.draw(this._row, this._col);
	}

	public ToHead()
	{
		this._color = this.colorType[2];
		this.draw(this._row, this._col);
	}

	public ToNull()
	{
		this._color = this.colorType[0];
		this.draw(this._row, this._col);
	}
}

class LeftButton extends egret.Sprite
{
	public constructor()
	{
		super();
		this.draw();
	}

	private draw()
	{
		this.width = egret.MainContext.instance.stage.stageWidth / 2;
		this.height = egret.MainContext.instance.stage.stageWidth / 2;
		this.graphics.lineStyle(5, 0xff1111 );
        this.graphics.beginFill( this.color );
        this.graphics.drawRect( 0, egret.MainContext.instance.stage.stageWidth, this.width, this.height);
        this.graphics.endFill();
	}

	private color = 0xeeeeee;

	public onClick()
	{
		this.color = 0xffffff;
		this.draw();
		console.log("left");
		this.dispatchEventWith("left");
	}
}

class RightButton extends egret.Sprite
{
	public constructor()
	{
		super();
		this.draw();
	}

	private draw()
	{
		this.width = egret.MainContext.instance.stage.stageWidth / 2;
		this.height = egret.MainContext.instance.stage.stageWidth / 2;
		this.graphics.lineStyle(5, 0xff1111 );
        this.graphics.beginFill( 0xeeeeee );
        this.graphics.drawRect( egret.MainContext.instance.stage.stageWidth / 2, egret.MainContext.instance.stage.stageWidth, this.width, this.height);
        this.graphics.endFill();
	}

	public onClick()
	{
		console.log("right");
		this.dispatchEventWith("right");
	}
}
