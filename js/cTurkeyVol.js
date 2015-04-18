function TurkeyVol(options){

    this.EXTRUDE_MULTIPLIER = 50;
    this.OUTER_MARGIN = 10;
    this.COPY_MARGIN = 25;
    this.F_COLOR = "#000000";
    this.M_COLOR = "#333333";
    this.B_COLOR = "#666666";
    this.DOT_COLOR = "#00FF00";
    this.TURKEY_SPACE = 1.25;
    this.TURKEY_SIZE = 1.5;
    this.canvas = $('#volumizer');
    this.START_RECT = {
        width:300,
        height:300,
        x:100,
        y:100,
    };


    this.stage; this.image; this.bitmap;
    this.mouseTarget;	// the display object currently under the mouse, or being dragged
    this.dragStarted;	// indicates whether we are currently in a drag operation
    this.offset;
    this.update = true;

    this.fface; this.bface; this.mface; this.tabh; this.tabw; this.tabd; this.tabp;
    this.dscale = 1;


    this.stage = new createjs.Stage(this.canvas.attr("id"));
    this.stage.setBounds(0,0,this.canvas.width(), this.canvas.height())

	// enable touch interactions if supported on the current device:
	createjs.Touch.enable(this.stage);

	// enabled mouse over / out events
	this.stage.enableMouseOver(10);
	this.stage.mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas

    // load the source image:
	var image = new Image();
	image.src = "img/roast_turkey.png";
	image.onload = this.handleImageLoad;

    this.FaceInitB();

    this.mface = new createjs.Shape();
    this.mface.x = 0;
    this.mface.y = 0;

    this.stage.addChild(this.mface);

    this.FaceInitF();
    this.TabInitH();
    this.TabInitW();
    this.TabInitP();
    this.TabInitD();



    createjs.Ticker.addEventListener("tick", function(self){
        return function(event){
            // this set makes it so the stage only re-renders when an event handler indicates a change has happened.
        	if (self.update) {
        		self.update = false; // only update once
        		self.stage.update(event);
        	}
        };
    }(this));

    this.stage.update();

};

TurkeyVol.prototype.FaceInitB = function(){

    this.bface = new createjs.Shape();
    this.bface.graphics.beginStroke(this.B_COLOR).drawRect(0, 0, this.START_RECT.width, this.START_RECT.height);
    this.bface.setBounds(0,0,this.START_RECT.width,this.START_RECT.height);
    this.bface.x = this.START_RECT.x;
    this.bface.y = this.START_RECT.y;

    this.stage.addChild(this.bface);

    this.stage.update();

};

TurkeyVol.prototype.FaceInitF = function(){

    this.fface = new createjs.Shape();
    this.fface.graphics.beginStroke(this.B_COLOR).drawRect(0, 0, this.START_RECT.width, this.START_RECT.height);
    this.fface.setBounds(0,0,this.START_RECT.width,this.START_RECT.height);
    this.fface.x = this.START_RECT.x;
    this.fface.y = this.START_RECT.y;

    this.stage.addChild(this.fface);

    this.stage.update();

};

TurkeyVol.prototype.TabInitH = function(){
    this.tabh = new createjs.Shape();
    this.tabh.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 25);
    this.tabh.x = this.START_RECT.x;
    this.tabh.y = this.START_RECT.y;

    this.stage.addChild(this.tabh);

    this.tabh.on("mousedown", function(self) {
        return function(evt){
    		this.offset = {x: this.x, y: this.y - evt.stageY};
        };
	}(this));


    this.tabh.on("pressmove", function (self) {
        return function(evt){
    		this.y = evt.stageY + this.offset.y;
    		// indicate that the stage should be updated on the next tick:
    		self.update = true;

            self.UpdateCubeH();
        };
	}(this));
};

TurkeyVol.prototype.TabInitW = function(){

};

TurkeyVol.prototype.TabInitP = function(){

};

TurkeyVol.prototype.TabInitD = function(){

};




TurkeyVol.prototype.UpdateCubeH = function(){

    this.fface.scaleY = (((this.fface.y+(this.fface.getTransformedBounds().height/2))-this.tabh.y)/(this.fface.getBounds().height/2));
    this.bface.scaleY = (this.fface.scaleY)/(1-( (this.tabd.x-(this.fface.x+this.fface.getTransformedBounds().width))/(this.fface.getBounds().width)));

    if( isNumeric($('#btn_height').html())){
        var tw = $('#btn_width').html();
        $('#btn_height').html(CalcHeight(tw));
    }

    UpdateCubeP();
};
