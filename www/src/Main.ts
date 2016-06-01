class Main extends egret.DisplayObjectContainer 
{
	private BoardWidth:number = 30;
	private BoardHeight:number = 30;
	private Speed = 1000 / 20 ;

    public constructor() {
        super();   

        var 
        self = this;
        WIDTH = this.BoardWidth,
        HEIGHT = this.BoardHeight;


        for(let i = 0; i < HEIGHT; i++){
        	var newRow = [];
        	for(let j = 0; j< WIDTH; j++){
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
        var
        lb = new LeftButton(),
        rb = new RightButton(),
        restartBtn = new RestartBtn();

        lb.touchEnabled = true;
        this.addChild(lb);
        lb.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick.bind(null, this.snake), this);
        rb.touchEnabled = true;
        this.addChild(rb);
        rb.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick.bind(null, this.snake), this);
		
		restartBtn.touchEnabled = true;
        this.addChild(restartBtn);
        restartBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.restart, this);

        this.interval = setInterval(function() {
        	if(!self.snake.update()){ self.gameover(); }
        }, this.Speed);

        this.addEventListener("gameover", this.gameover, this);
    }
    private row: Array<Array> = [];
    private snake: Snake = null;

    public onButtonClick(snake: Snake, evt: egret.TouchEvent)
    {
    	evt.target.onClick(snake);
    }

    public gameover(){
    	clearInterval(this.interval);
    }

    public  restart(){
    	var self = this;
    	clearInterval(this.interval);

    	this.snake.reborn(this.row, this.BoardHeight, this.BoardWidth);
    	this.interval = setInterval(function() {
        	if(!self.snake.update()){ self.gameover(); }
        }, this.Speed);
    }
}

class Snake
{
	public constructor(row, maxY, maxX)
	{
        x = Math.round(Math.random(10,13)*(3)+10),
        y = Math.round(Math.random(10,13)*(3)+10),
        d = "right";
		this._x	= x;
		this._y = y;
		this.maxX = maxX;
		this.maxY = maxY;
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

	public reborn(row, maxY, maxX){
		for(let i=0; i<this.tail.length-1; i++)
		{
			this.tail[i]?this.tail[i].ToNull():null;
		}
		this.lastTail?this.lastTail.ToNull():null;
		this.head?this.head.ToNull():null;

		var
		x = Math.round(Math.random(10,13)*(3)+10),
        y = Math.round(Math.random(10,13)*(3)+10),
        d = "right";

		this._x	= x;
		this._y = y;
		this.maxX = maxX;
		this.maxY = maxY;
		this._d = d;
		this.row = row;

		this.tail = [];
		this.head = row[this._x][this._y];
		this.head.ToHead();
		for(let i=2; i>0; i--)
		{
			row[this._x][this._y - i].ToTail();
			this.tail.unshift(row[this._x][this._y - i]);
		}
		this.lastTail = this.tail[this.tail.length-1];
	}

	private maxX:number = 0;
	private maxY:number = 0;
	private _x:number = 0;
	private _y:number = 0;
	private _d:string = '';
	private row;

	private.head:Rect;
	private.lastTail:Rect;
	private.lastAbandonedTail:Rect = null;
	private.tail:array = [];
	private.apple:Rect = null;

	public update(){
		if(!this.apple)
		{	
			var
			x = Math.round(Math.random(0,this.maxX)*(this.maxX)+0),
        	y = Math.round(Math.random(0,this.maxY)*(this.maxY)+0);

        	if(this.row[x][y].isNull){
        		this.row[x][y].ToApple();
        	}

        	this.apple = this.row[x][y];
		}

		this.lastTail.ToNull();
		this.lastAbandonedTail = this.tail.pop();
		this.lastTail = this.tail[this.tail.length - 1];
		this.head.ToTail();
		this.tail.unshift(this.head);
		switch(this._d)
		{
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
			default:break;
		}

		if(!this.row[this._x] || !this.row[this._x][this._y])
		{
			return false;
		} else {
			this.head = this.row[this._x][this._y];
			this.head.ToHead();
			if(this.head == this.apple){
				this.tail.push(this.lastAbandonedTail);
				this.apple = null;
			}
			return true;
		}	
	}

	public setLeft()
	{
		switch(this._d){
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
			default:break;
		}
	}

	public setRight()
	{
		switch(this._d){
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
			default:break;
		}
	}
}

class Rect extends egret.Sprite
{
	public constructor(i, j, maxX, maxY)
	{
		super();

		this._row = i;
		this._col = j;

		this.maxX = maxX;
		this.maxY = maxY;

		this.draw(i, j);
	}

	private draw(i, j)
	{
		this.width = egret.MainContext.instance.stage.stageWidth / this.maxX;
		this.height = egret.MainContext.instance.stage.stageWidth / this.maxY;
		this.graphics.lineStyle(1, 0xff1111 );
        this.graphics.beginFill( this._color );
        this.graphics.drawRect( j*this.width, i*this.height, this.width, this.height);
        this.graphics.endFill();
	}

	private _row:number = 0;
	private _col:number = 0;

	private maxX:number = 0;
	private maxY:number = 0;

	private isNull:boolean = true;
	private colorType:array = [0xffffff, 0x888eee, 0xff1111, 0x666666];
	private _color = this.colorType[0];

	public ToTail()
	{
		this.isNull = false;
		this._color = this.colorType[1];
		this.draw(this._row, this._col);
	}

	public ToHead()
	{
		this.isNull = false;
		this._color = this.colorType[2];
		this.draw(this._row, this._col);
	}

	public ToNull()
	{
		this.isNull = true;
		this._color = this.colorType[0];
		this.draw(this._row, this._col);
	}

	public ToApple()
	{
		this.isNull = false;
		this._color = this.colorType[3];
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

	public onClick(snake)
	{
		snake.setLeft();
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

	public onClick(snake)
	{
		snake.setRight();
	}
}

class RestartBtn extends egret.Sprite
{
	public constructor()
	{
		super();
		this.draw();
	}

	private draw()
	{
		this.width = egret.MainContext.instance.stage.stageWidth;
		this.height = egret.MainContext.instance.stage.stageWidth / 10;
		this.graphics.lineStyle(5, 0xff1111 );
        this.graphics.beginFill( 0xeeeeee );
        this.graphics.drawRect( 0, egret.MainContext.instance.stage.stageWidth * 3 / 2, this.width, this.height);
        this.graphics.endFill();
	}
}
