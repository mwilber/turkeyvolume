function TurkeyVol(options){

    this.EXTRUDE_MULTIPLIER = options.extrude_multiplier;
    this.OUTER_MARGIN = 10;
    this.LINE_SIZE = options.line_size;
    this.COPY_MARGIN = options.copy_margin;
    this.DOT_SIZE = options.dot_size;
    this.FONT_STYLE = "30px Anton";
    this.FONT_COLOR = "#FFFFFF";
    this.FONT_SHADOW_COLOR = "#000000";
    this.BKG_COLOR = "#9999AA";
    this.F_COLOR = "#FFFFFF";
    this.M_COLOR = "#EEEEEE";
    this.B_COLOR = "#CCCCCC";
    this.DOT_COLOR = "rgba(0,255,0,0.6)";
    this.TAB_COLOR = "rgba(255,255,255,0.8)";
    this.TAB_RADIUS = options.tab_radius;
    this.START_RECT = options.start_rect;
    this.VEGAN_MODE = options.vegan_mode;
    if(this.VEGAN_MODE){
        this.TURKEY_SPACE = 1.3;
        this.TURKEY_SIZE = 1.1;
        this.TURKEY_H_SCALE = 1.2;
    }else{
        this.TURKEY_SPACE = 1.2;
        this.TURKEY_SIZE = 1.5;
        this.TURKEY_H_SCALE = 1.1;
    }
    this.canvas = options.element;
    this.realsize = {
        height:null,
        width:null,
        depth:null,
        unit:"f",
    };
    this.tkytly = {
        tile: {
            h: 0,
            v: 0,
            d: 0,
        },
        actual: {
            h: 0,
            v: 0,
            d: 0,
            vol: 0,
        },
        renderct: 0,
        xoffset: 0,
        yoffset: 0,
        ddx: 0,
        arc: 20,
    };


    this.stage; this.imgtky; this.imgdot; this.imgbkg; this.bitmap; this.background;
    this.mouseTarget;	// the display object currently under the mouse, or being dragged
    this.dragStarted;	// indicates whether we are currently in a drag operation
    this.offset;
    this.update = true;

    this.fface; this.bface; this.mface; this.tabh; this.tabw; this.tabd; this.tabp;
    this.dscale = 0.75;


    this.stage = new createjs.Stage(this.canvas.id);
    this.stage.setBounds(0,0,this.canvas.width, this.canvas.height)

	// enable touch interactions if supported on the current device:
	createjs.Touch.enable(this.stage);

	// enabled mouse over / out events
	this.stage.enableMouseOver(10);
	this.stage.mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas

    this.background = new createjs.Shape();
    this.background.x = 0;
    this.background.y = 0;
    // only the drawPolyStar call is needed for the mask to work:
    this.background.graphics.beginFill(this.BKG_COLOR).drawRect(0,0,this.stage.getBounds().width,this.stage.getBounds().height).closePath();
    this.stage.addChild(this.background);

    this.SetBackground(options.backgroundData);

    // load the source image:
    imageb = new Image();
	imageb.src = "img/dot.png";
	imageb.onload = function(self){
        return function(event){
            self.imgdot = event.target;
        };
    }(this);

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

    var text = new createjs.Text("...", "bold 30px Anton", "#ffffff");
    text.x = this.COPY_MARGIN;
    text.y = this.stage.getBounds().height-this.COPY_MARGIN;
    text.textBaseline = "alphabetic";
    this.stage.addChild(text);

    var subtext = new createjs.Text("...", "bold 30px FontAwesome", "#ffffff");
    subtext.x = this.COPY_MARGIN;
    subtext.y = this.stage.getBounds().height-this.COPY_MARGIN;
    subtext.textBaseline = "alphabetic";
    this.stage.addChild(subtext);

    this.stage.update();

    this.stage.removeChild(text);
    this.stage.removeChild(subtext);

    this.stage.update();

    this.UpdateCubeD();

};

TurkeyVol.prototype.InitDim = function(pDim, pVal, pUnit){
    console.log('InitDim');
    this.realsize.unit = pUnit;
    switch(pDim){
        case 'h':
            this.SetDim('h',pVal);
            this.SetDim('w',this._CalcWidth(pVal));
            this.SetDim('d',this._CalcDepth(pVal, this._CalcWidth(pVal)));
            break;
        case 'w':
            this.SetDim('w',pVal);
            this.SetDim('h',this._CalcHeight(pVal));
            this.SetDim('d',this._CalcDepth(this._CalcHeight(pVal), pVal));
            break;
        case 'd':
            break;
    }
};

TurkeyVol.prototype.SetDim = function(pDim, pVal){
    switch(pDim){
        case 'h':
            this.realsize.height = pVal;
            $(document).trigger("seth");
            break;
        case 'w':
            this.realsize.width = pVal;
            $(document).trigger("setw");
            break;
        case 'd':
            this.realsize.depth = pVal;
            $(document).trigger("setd");
            break;
    }
};

TurkeyVol.prototype.GetDim = function(pDim){
    switch(pDim){
        case 'h':
            return this.realsize.height;
            break;
        case 'w':
            return this.realsize.width;
            break;
        case 'd':
            return this.realsize.depth;
            break;
    }
};

TurkeyVol.prototype.GetUnit = function(){
    if( this.realsize.unit == "m" ){
        return "meters";
    }else{
        return "feet";
    }
};

TurkeyVol.prototype.CheckDim = function(){
    return (!isNaN(parseFloat(this.realsize.height)) && isFinite(this.realsize.height)) && (!isNaN(parseFloat(this.realsize.width)) && isFinite(this.realsize.width)) && (!isNaN(parseFloat(this.realsize.depth)) && isFinite(this.realsize.depth));
}

TurkeyVol.prototype._CalcHeight = function(pW){
    return (pW/this.fface.scaleX)*this.fface.scaleY;
};

TurkeyVol.prototype._CalcWidth = function(pH){
    return (pH/this.fface.scaleY)*this.fface.scaleX;
};

TurkeyVol.prototype._CalcDepth = function(pH, pW){
    console.log(pH, pW, ((parseFloat(pH)+parseFloat(pW))/2),this.dscale);
    return ((parseFloat(pH)+parseFloat(pW))/2)*((1-this.dscale)*2);
};



TurkeyVol.prototype.SetBackground = function(pImg){

    var tmpbkg = new createjs.Bitmap(pImg);
    tmpbkg.x = 0;
    tmpbkg.y = 0;
    tmpbkg.rotation = 0;

    if( tmpbkg.getBounds() ){
        if( tmpbkg.getBounds().width > tmpbkg.getBounds().height ){
            tmpbkg.scaleX = this.stage.getBounds().height/tmpbkg.getBounds().height;
            tmpbkg.scaleY = this.stage.getBounds().height/tmpbkg.getBounds().height;
            tmpbkg.x = (this.stage.getBounds().width-tmpbkg.getTransformedBounds().width)/2
        }else{
            tmpbkg.scaleX = this.stage.getBounds().width/tmpbkg.getBounds().width;
            tmpbkg.scaleY = this.stage.getBounds().width/tmpbkg.getBounds().width;
            tmpbkg.y = (this.stage.getBounds().height-tmpbkg.getTransformedBounds().height)/2
        }
    }

    this.stage.addChild(tmpbkg);
};

TurkeyVol.prototype.FaceInitB = function(){

    this.bface = new createjs.Shape();
    this.bface.graphics.setStrokeStyle(this.LINE_SIZE).beginStroke(this.B_COLOR).drawRect(0, 0, this.START_RECT.width, this.START_RECT.height);
    this.bface.setBounds(0,0,this.START_RECT.width,this.START_RECT.height);
    this.bface.x = this.START_RECT.x;
    this.bface.y = this.START_RECT.y;

    this.stage.addChild(this.bface);

    this.stage.update();

};

TurkeyVol.prototype.FaceInitF = function(){

    this.fface = new createjs.Shape();
    this.fface.graphics.setStrokeStyle(this.LINE_SIZE).beginStroke(this.F_COLOR).drawRect(0, 0, this.START_RECT.width, this.START_RECT.height);
    this.fface.setBounds(0,0,this.START_RECT.width,this.START_RECT.height);
    this.fface.x = this.START_RECT.x;
    this.fface.y = this.START_RECT.y;

    this.stage.addChild(this.fface);

    this.stage.update();

};

TurkeyVol.prototype.TabInitH = function(){
    this.tabh = new createjs.Container();
    this.tabh.x = this.START_RECT.x+(this.START_RECT.width/2);
    this.tabh.y = this.START_RECT.y;

    var tabcircle = new createjs.Shape();
    tabcircle.graphics.beginFill(this.TAB_COLOR).drawCircle(0, 0, this.TAB_RADIUS);
    tabcircle.x = 0;
    tabcircle.y = 0;

    this.tabh.addChild(tabcircle);

    var text = new createjs.Text("\uf07d", "60px FontAwesome", "#666666");
    text.x = -(this.TAB_RADIUS*0.25);
    text.y = (this.TAB_RADIUS*0.4);
    text.textBaseline = "alphabetic";
    this.tabh.addChild(text);
    text.scaleX = ((this.TAB_RADIUS*0.5)/text.getBounds().width);
    text.scaleY = ((this.TAB_RADIUS*0.5)/text.getBounds().width);

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

    this.tabw = new createjs.Container();
    this.tabw.x = this.START_RECT.x;
    this.tabw.y = this.START_RECT.y+(this.START_RECT.height/2);

    var tabcircle = new createjs.Shape();
    tabcircle.graphics.beginFill(this.TAB_COLOR).drawCircle(0, 0, this.TAB_RADIUS);
    tabcircle.x = 0;
    tabcircle.y = 0;

    this.tabw.addChild(tabcircle);

    var text = new createjs.Text("\uf07e", "60px FontAwesome", "#666666");
    text.x = -(this.TAB_RADIUS*0.6);
    text.y = (this.TAB_RADIUS*0.4);
    text.textBaseline = "alphabetic";
    this.tabw.addChild(text);
    text.scaleX = ((this.TAB_RADIUS*1.25)/text.getBounds().height);
    text.scaleY = ((this.TAB_RADIUS*1.25)/text.getBounds().height);

    this.stage.addChild(this.tabw);

    this.tabw.on("mousedown", function(self) {
        return function(evt){
    		this.offset = {x: this.x - evt.stageX, y: this.y};
        };
	}(this));


    this.tabw.on("pressmove", function (self) {
        return function(evt){
            this.x = evt.stageX + this.offset.x;
    		// indicate that the stage should be updated on the next tick:
    		self.update = true;

            self.UpdateCubeW();
        };
	}(this));
};

TurkeyVol.prototype.TabInitD = function(){

    this.tabd = new createjs.Container();
    this.tabd.x = this.START_RECT.x+(this.START_RECT.width-(this.START_RECT.width/4));
    this.tabd.y = this.START_RECT.y+(this.START_RECT.height);

    var tabcircle = new createjs.Shape();
    tabcircle.graphics.beginFill(this.TAB_COLOR).drawCircle(0, 0, this.TAB_RADIUS);
    tabcircle.x = 0;
    tabcircle.y = 0;

    this.tabd.addChild(tabcircle);

    var text = new createjs.Text("\uf065", "60px FontAwesome", "#666666");
    text.x = (this.TAB_RADIUS*0.5);
    text.y = (this.TAB_RADIUS*0.4);
    text.textBaseline = "alphabetic";
    this.tabd.addChild(text);
    text.scaleX = -((this.TAB_RADIUS*1.25)/text.getBounds().height);
    text.scaleY = ((this.TAB_RADIUS*1.25)/text.getBounds().height);




    this.stage.addChild(this.tabd);

    this.tabd.on("mousedown", function(self) {
        return function(evt){
            this.offset = {x: this.x - evt.stageX, y: this.y};
        };
	}(this));


    this.tabd.on("pressmove", function (self) {
        return function(evt){
            this.x = evt.stageX + this.offset.x;
    		// indicate that the stage should be updated on the next tick:
    		self.update = true;

            self.UpdateCubeD();
        };
	}(this));
};

TurkeyVol.prototype.TabInitP = function(){
    this.tabp = new createjs.Shape();
    this.tabp.graphics.beginFill(this.TAB_COLOR).drawCircle(0, 0, this.TAB_RADIUS);
    this.tabp.x = this.START_RECT.x+(this.START_RECT.width/2);
    this.tabp.y = this.START_RECT.y+(this.START_RECT.height/2);

    this.stage.addChild(this.tabp);

    this.tabp.on("mousedown", function(self) {
        return function(evt){
            this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
        };
	}(this));


    this.tabp.on("pressmove", function (self) {
        return function(evt){
            if( (evt.stageX + this.offset.x) > (self.stage.getBounds().x+(self.fface.getBounds().x+(self.fface.getTransformedBounds().width/2))+self.OUTER_MARGIN) &&
                (evt.stageX + this.offset.x) < (self.stage.getBounds().width-(self.fface.getBounds().x+(self.fface.getTransformedBounds().width/2))-self.OUTER_MARGIN)
            ){
        		this.x = evt.stageX + this.offset.x;
            }
            if( (evt.stageY + this.offset.y) > (self.stage.getBounds().y+(self.fface.getBounds().y+(self.fface.getTransformedBounds().height/2))+self.OUTER_MARGIN) &&
                (evt.stageY + this.offset.y) < (self.stage.getBounds().height-(self.fface.getBounds().y+(self.fface.getTransformedBounds().height/2))-self.OUTER_MARGIN)
            ){
                this.y = evt.stageY + this.offset.y;
            }
    		// indicate that the stage should be updated on the next tick:
            self.update = true;

            self.UpdateCubeP({x:this.x,y:this.y});
        };
	}(this));
};




TurkeyVol.prototype.UpdateCubeH = function(){


    if( (this.tabp.y - this.tabh.y) > this.TAB_RADIUS && this.tabh.y > (this.TAB_RADIUS) ){

        this.fface.scaleY = (((this.fface.y+(this.fface.getTransformedBounds().height/2))-this.tabh.y)/(this.fface.getBounds().height/2));
        this.bface.scaleY = (this.fface.scaleY)/(1-( (this.tabd.x-(this.fface.x+this.fface.getTransformedBounds().width))/(this.fface.getBounds().width)));

        if( this.GetDim('h') != null ){
            this.SetDim('h',this._CalcHeight(this.GetDim('w')));
        }

    }

    this.UpdateCubeP();
};

TurkeyVol.prototype.UpdateCubeW = function(){

    if( (this.tabp.x - this.tabw.x) > this.TAB_RADIUS && this.tabw.x > (this.TAB_RADIUS) ){

    this.fface.scaleX = (((this.fface.x+(this.fface.getTransformedBounds().width/2))-this.tabw.x)/(this.fface.getBounds().width/2));
    this.bface.scaleX = (this.fface.scaleX)/(1-( (this.tabd.x-(this.fface.x+this.fface.getTransformedBounds().width))/(this.fface.getBounds().width)));

    if( this.GetDim('w') != null ){
        this.SetDim('w',this._CalcWidth(this.GetDim('h')));
    }

    }

    this.UpdateCubeP();
};

TurkeyVol.prototype.UpdateCubeD = function(){

    this.dscale = ( ((this.tabd.x-(this.fface.x+this.fface.getTransformedBounds().width))/(this.fface.getTransformedBounds().width))+1 );
    if(this.dscale < 0.1 ){
        this.dscale = 0.1;
    }
    if(this.dscale > 1){
        this.dscale = 1;
    }
    this.bface.scaleX = (this.fface.scaleX)*this.dscale;
    this.bface.scaleY = (this.fface.scaleY)*this.dscale;

    if( this.GetDim('d') != null ){
        this.SetDim('d',this._CalcDepth(this.GetDim('h'), this._CalcWidth(this.GetDim('h'))));
    }

    this.UpdateCubeP();
};

TurkeyVol.prototype.UpdateCubeP = function(){

    // Set the face positions
    var xoffset = ((this.stage.getBounds().width/2)-(this.stage.getBounds().width-this.tabp.x))/(this.stage.getBounds().width/2);
    var yoffset = ((this.stage.getBounds().height/2)-(this.stage.getBounds().height-this.tabp.y))/(this.stage.getBounds().height/2);
    //console.log('xoffset',xoffset);
    //console.log(fface.graphics.getBounds().width);
    var fb = this.fface.getTransformedBounds();
    var bb = this.bface.getTransformedBounds();

    this.fface.x = this.tabp.x - (fb.width/2);
    this.fface.y = this.tabp.y - (fb.height/2);

    this.bface.x = this.tabp.x - (bb.width/2) - (xoffset*this.EXTRUDE_MULTIPLIER);
    this.bface.y = this.tabp.y - (bb.height/2) - (yoffset*this.EXTRUDE_MULTIPLIER);

    // Draw out the connecting lines
    this.mface.graphics.clear().setStrokeStyle(this.LINE_SIZE).beginStroke(this.M_COLOR)
        .moveTo(this.fface.x, this.fface.y)
        .lineTo(this.bface.x, this.bface.y)
        .moveTo(this.fface.x+this.fface.getTransformedBounds().width, this.fface.y)
        .lineTo(this.bface.x+this.bface.getTransformedBounds().width, this.bface.y)
        .moveTo(this.fface.x, this.fface.y+this.fface.getTransformedBounds().height)
        .lineTo(this.bface.x, this.bface.y+this.bface.getTransformedBounds().height)
        .moveTo(this.fface.x+this.fface.getTransformedBounds().width, this.fface.y+this.fface.getTransformedBounds().height)
        .lineTo(this.bface.x+this.bface.getTransformedBounds().width, this.bface.y+this.bface.getTransformedBounds().height);

    // Position the control tabs
    this.tabh.x = this.fface.x + (fb.width/2);
    this.tabh.y = this.fface.y;

    this.tabw.x = this.fface.x;
    this.tabw.y = this.fface.y + (fb.height/2);

    console.log((this.dscale));

    //tabd.x = fface.x + fb.width - ((fb.width)*(1-dscale));// + ( (fface.x + fb.width) - ((fface.x + fb.width)*dscale));
    this.tabd.x = this.fface.x + (fb.width*this.dscale);
    this.tabd.y = this.fface.y + (fb.height);
};

TurkeyVol.prototype.Truss = function(){
    var bdot = new createjs.Shape();
    bdot.graphics.clear().setStrokeStyle(this.DOT_SIZE).beginBitmapStroke(this.imgdot).drawRect(this.bface.x, this.bface.y, this.bface.getTransformedBounds().width, this.bface.getTransformedBounds().height);
    this.stage.addChild(bdot);

    // Draw out the connecting lines
    var mdot = new createjs.Shape();
    mdot.graphics.clear().setStrokeStyle(this.DOT_SIZE).beginBitmapStroke(this.imgdot)
        .moveTo(this.fface.x, this.fface.y)
        .lineTo(this.bface.x, this.bface.y)
        .moveTo(this.fface.x+this.fface.getTransformedBounds().width, this.fface.y)
        .lineTo(this.bface.x+this.bface.getTransformedBounds().width, this.bface.y)
        .moveTo(this.fface.x, this.fface.y+this.fface.getTransformedBounds().height)
        .lineTo(this.bface.x, this.bface.y+this.bface.getTransformedBounds().height)
        .moveTo(this.fface.x+this.fface.getTransformedBounds().width, this.fface.y+this.fface.getTransformedBounds().height)
        .lineTo(this.bface.x+this.bface.getTransformedBounds().width, this.bface.y+this.bface.getTransformedBounds().height);

    this.stage.addChild(mdot);
};

TurkeyVol.prototype.Roast = function(){
    if( this.realsize.unit == "m" ){
        console.log("converting meters to feet");
        this.realsize.height *= 3.28084;
        this.realsize.width *= 3.28084;
        this.realsize.depth *= 3.28084;
    }

    this.tkytly.renderct = 0;

    this.tkytly.xoffset = ((this.stage.getBounds().width/2)-(this.stage.getBounds().width-this.tabp.x))/(this.stage.getBounds().width/2);
    this.tkytly.yoffset = ((this.stage.getBounds().height/2)-(this.stage.getBounds().height-this.tabp.y))/(this.stage.getBounds().height/2);
    this.tkytly.ddx = this.dscale;

    //hct = (this.fface.getTransformedBounds().width)/(this.TURKEY_SIZE);
    this.tkytly.tile.h = (parseFloat(this.realsize.width))/(this.TURKEY_SIZE);
    // Store the decimal for the numeric output
    this.tkytly.actual.h = this.tkytly.tile.h;
    if(this.tkytly.tile.h%1 > .5){
        // console.log('hct - 1a',hct);
        this.tkytly.tile.h = Math.ceil(this.tkytly.tile.h);
    }else{
        // console.log('hct - 1b',hct);
        this.tkytly.tile.h = Math.floor(this.tkytly.tile.h);
    }
    //if( hct == 0 ) hct = 1;
    console.log('hct - 2',this.tkytly.tile.h);
    //vct = (this.fface.getTransformedBounds().height)/(this.TURKEY_SIZE);
    this.tkytly.tile.v = (parseFloat(this.realsize.height))/(this.TURKEY_SIZE*0.66);
    // Store the decimal for the numeric output
    this.tkytly.actual.v = this.tkytly.tile.v;
     if(this.tkytly.tile.v%1 > .5){
      this.tkytly.tile.v = Math.ceil(this.tkytly.tile.v);
     }else{
      this.tkytly.tile.v = Math.floor(this.tkytly.tile.v);
    }

    this.tkytly.tile.d = (parseFloat(this.realsize.depth))/(this.TURKEY_SIZE);
    if(this.tkytly.tile.d <= 1){
        this.tkytly.tile.d = 1;
    }
    // Store the decimal for the numeric output
    this.tkytly.actual.d = this.tkytly.tile.d;
    // if(dct%1 > .5){
    //  dct = Math.floor(dct);
    // }else{
    //  dct = Math.ceil(dct);
    // }
    this.tkytly.actual.vol = this.tkytly.actual.h * this.tkytly.actual.v * this.tkytly.actual.d;

    console.log('Turkey Volume', this.tkytly.actual.vol, this.tkytly.actual.h, this.tkytly.actual.v, this.tkytly.actual.d);
    console.log('Display Volume', this.tkytly.actual.vol, this.tkytly.tile.h, this.tkytly.tile.v, this.tkytly.tile.d);

    var tmprnd = 1 || 10;
    this.tkytly.actual.vol = parseFloat( this.tkytly.actual.vol.toFixed(tmprnd) );
};

TurkeyVol.prototype.Carve = function(){
    // Turn off sub-layers
    //this.tkytly.ddx = 1;
    if( this.tkytly.ddx < .7 ) this.tkytly.ddx = .7;

    while(this.tkytly.ddx < 1){
        for(var idx=0; idx<this.tkytly.tile.h; idx++){
            for(var jdx=0; jdx<this.tkytly.tile.v; jdx++){
                if( this.tkytly.renderct < (this.tkytly.actual.vol-(this.tkytly.tile.h*this.tkytly.tile.v)) ){
                    this.tkytly.renderct++;
                    this.bitmap = new createjs.Bitmap(this.imgtky);
                    this.stage.addChild(this.bitmap);
                    this.bitmap.rotation = Math.floor((Math.random() * this.tkytly.arc) -(this.tkytly.arc/2));
                    this.bitmap.x = (this.fface.x+(this.fface.getTransformedBounds().width/2)-((this.fface.getTransformedBounds().width*this.tkytly.ddx)/2)) + (((this.fface.getTransformedBounds().width*this.tkytly.ddx)/this.tkytly.tile.h)*idx) - ((this.tkytly.xoffset*(((1-this.tkytly.ddx)*1)/(1-this.dscale)))*this.EXTRUDE_MULTIPLIER) -0;
                    this.bitmap.y = (this.fface.y+(this.fface.getTransformedBounds().height/2)-((this.fface.getTransformedBounds().height*this.tkytly.ddx)/2)) + (((this.fface.getTransformedBounds().height*this.tkytly.ddx)/this.tkytly.tile.v)*jdx) - ((this.tkytly.yoffset*(((1-this.tkytly.ddx)*1)/(1-this.dscale)))*this.EXTRUDE_MULTIPLIER) -0;
                    if( this.fface.getTransformedBounds().height > this.fface.getTransformedBounds().width ){
                        this.bitmap.scaleX = (((this.fface.getTransformedBounds().width*this.tkytly.ddx)/this.tkytly.tile.h)/this.bitmap.image.width)*this.TURKEY_SPACE;
                        this.bitmap.scaleY = (((this.fface.getTransformedBounds().height*this.tkytly.ddx)/this.tkytly.tile.v)/(this.bitmap.image.height)*this.TURKEY_H_SCALE)*this.TURKEY_SPACE;
                    }else{
                        this.bitmap.scaleY = (((this.fface.getTransformedBounds().height*this.tkytly.ddx)/this.tkytly.tile.v)/(this.bitmap.image.height)*this.TURKEY_H_SCALE)*this.TURKEY_SPACE;
                        this.bitmap.scaleX = (((this.fface.getTransformedBounds().width*this.tkytly.ddx)/this.tkytly.tile.h)/this.bitmap.image.width)*this.TURKEY_SPACE;
                    }
                }
            }
        }
        console.log('rendering sub layer',this.tkytly.ddx,this.tkytly.renderct);
        this.tkytly.ddx += .1;
    }

    console.log('!!!entering TOP TURKEY!!!',this.tkytly.renderct);

    this.tkytly.ddx = 1;
    var reserve = [];
    //if( vct == 0 ) vct = 1;
    for(var idx=0; idx<this.tkytly.tile.h; idx++){
        for(var jdx=0; jdx<this.tkytly.tile.v; jdx++){
            if( this.tkytly.renderct < (this.tkytly.actual.vol) ){
                console.log('!!!TOP TURKEY!!!',this.tkytly.renderct);
                this.tkytly.renderct++;
                if( Math.random()*100 < 50 ){
                    reserve.push([idx,jdx]);
                }else{
                    this.bitmap = new createjs.Bitmap(this.imgtky);
                    this.stage.addChild(this.bitmap);
                    this.bitmap.rotation = Math.floor((Math.random() * this.tkytly.arc) -(this.tkytly.arc/2));
                    this.bitmap.x = this.fface.x + ((this.fface.getTransformedBounds().width*this.tkytly.ddx)/this.tkytly.tile.h)*idx - 0;
                    this.bitmap.y = this.fface.y + ((this.fface.getTransformedBounds().height*this.tkytly.ddx)/this.tkytly.tile.v)*jdx - 0;
                    if( this.fface.getTransformedBounds().height > this.fface.getTransformedBounds().width ){
                        this.bitmap.scaleX = (((this.fface.getTransformedBounds().width*this.tkytly.ddx)/this.tkytly.tile.h)/this.bitmap.image.width)*this.TURKEY_SPACE;
                        this.bitmap.scaleY = (((this.fface.getTransformedBounds().height*this.tkytly.ddx)/this.tkytly.tile.v)/(this.bitmap.image.height)*this.TURKEY_H_SCALE)*this.TURKEY_SPACE;
                    }else{
                        this.bitmap.scaleY = (((this.fface.getTransformedBounds().height*this.tkytly.ddx)/this.tkytly.tile.v)/(this.bitmap.image.height)*this.TURKEY_H_SCALE)*this.TURKEY_SPACE;
                        this.bitmap.scaleX = (((this.fface.getTransformedBounds().width*this.tkytly.ddx)/this.tkytly.tile.h)/this.bitmap.image.width)*this.TURKEY_SPACE;
                    }
                }
            }
        }
    }
    console.log('reserve', reserve);
    for(var rdx in reserve){
        idx=reserve[rdx][0];
        jdx=reserve[rdx][1];

        this.bitmap = new createjs.Bitmap(this.imgtky);
        this.stage.addChild(this.bitmap);
        this.bitmap.rotation = Math.floor((Math.random() * this.tkytly.arc) -(this.tkytly.arc/2));
        this.bitmap.x = this.fface.x + ((this.fface.getTransformedBounds().width*this.tkytly.ddx)/this.tkytly.tile.h)*idx - 0;
        this.bitmap.y = this.fface.y + ((this.fface.getTransformedBounds().height*this.tkytly.ddx)/this.tkytly.tile.v)*jdx - 0;
        if( this.fface.getTransformedBounds().height > this.fface.getTransformedBounds().width ){
            this.bitmap.scaleX = (((this.fface.getTransformedBounds().width*this.tkytly.ddx)/this.tkytly.tile.h)/this.bitmap.image.width)*this.TURKEY_SPACE;
            this.bitmap.scaleY = (((this.fface.getTransformedBounds().height*this.tkytly.ddx)/this.tkytly.tile.v)/(this.bitmap.image.height)*this.TURKEY_H_SCALE)*this.TURKEY_SPACE;
        }else{
            this.bitmap.scaleY = (((this.fface.getTransformedBounds().height*this.tkytly.ddx)/this.tkytly.tile.v)/(this.bitmap.image.height)*this.TURKEY_H_SCALE)*this.TURKEY_SPACE;
            this.bitmap.scaleX = (((this.fface.getTransformedBounds().width*this.tkytly.ddx)/this.tkytly.tile.h)/this.bitmap.image.width)*this.TURKEY_SPACE;
        }
    }
};

TurkeyVol.prototype.Serve = function(){
    var fdot = new createjs.Shape();
    fdot.graphics.clear().setStrokeStyle(this.DOT_SIZE).beginBitmapStroke(this.imgdot).drawRect(this.fface.x, this.fface.y, this.fface.getTransformedBounds().width, this.fface.getTransformedBounds().height);
    fdot.shadow = new createjs.Shadow("#FFFFFF", 0, 0, 5);
    this.stage.addChild(fdot);
    fdot.scaleX = 1;
    fdot.scaleY = 1;

    var txtout = " TURKEY";
    if(this.VEGAN_MODE){
        txtout = " TOFU TURKEY";
    }
    if( this.tkytly.actual.vol != 1 ) txtout += "S";

    var subtext = new createjs.Text("WILL FIT IN THIS SPACE", this.FONT_STYLE, this.FONT_COLOR);
    subtext.x = this.COPY_MARGIN;
    subtext.y = this.stage.getBounds().height-(this.COPY_MARGIN/2);
    subtext.textBaseline = "alphabetic";
    subtext.shadow = new createjs.Shadow(this.FONT_SHADOW_COLOR, 0, 0, 5);
    this.stage.addChild(subtext);
    subtext.scaleX = (this.stage.getBounds().width-(this.COPY_MARGIN*2))/subtext.getBounds().width;
    subtext.scaleY = (this.stage.getBounds().width-(this.COPY_MARGIN*2))/subtext.getBounds().width;


    var text = new createjs.Text(this.tkytly.actual.vol+txtout, this.FONT_STYLE, this.FONT_COLOR);
    text.x = this.COPY_MARGIN;
    text.y = this.stage.getBounds().height-subtext.getTransformedBounds().height-(this.COPY_MARGIN/2);
    text.textBaseline = "alphabetic";
    text.shadow = new createjs.Shadow(this.FONT_SHADOW_COLOR, 0, 0, 5);
    this.stage.addChild(text);
    console.log(text.getBounds());
    text.scaleX = (this.stage.getBounds().width-(this.COPY_MARGIN*2))/text.getBounds().width;
    text.scaleY = (this.stage.getBounds().width-(this.COPY_MARGIN*2))/text.getBounds().width;

    //Clear out the cube
    this.stage.removeChild(this.fface);
    this.stage.removeChild(this.mface);
    this.stage.removeChild(this.bface);

    // Remove the control tabs
    this.stage.removeChild(this.tabh);
    this.stage.removeChild(this.tabw);
    this.stage.removeChild(this.tabd);
    this.stage.removeChild(this.tabp);
};

TurkeyVol.prototype.Fill = function(){
    if( this.CheckDim() ){

        this.Truss();
        this.Roast();

        var imgsfx = "";
        if( (this.tkytly.tile.h * this.tkytly.tile.v) > 10000 ){
            imgsfx = "_25x";
            this.tkytly.tile.h = Math.floor(this.tkytly.tile.h/25);
            this.tkytly.tile.v = Math.floor(this.tkytly.tile.v/25);
            this.tkytly.arc = 6;
        }else if( (this.tkytly.tile.h * this.tkytly.tile.v) > 400 ){
            imgsfx = "_5x";
            this.tkytly.tile.h = Math.floor(this.tkytly.tile.h/5);
            this.tkytly.tile.v = Math.floor(this.tkytly.tile.v/5);
            this.tkytly.arc = 6;
        }

        //After 20 tiles, the turkeys start to meld together. Let's save some resources
        if( this.tkytly.tile.h > 20 ){
            this.tkytly.tile.h = 19;
        }
        if( this.tkytly.tile.v > 20 ){
            this.tkytly.tile.v = 19;
        }

        console.log(this.tkytly);
        // load the source image:
    	var image = new Image();
        if(this.VEGAN_MODE){
            image.src = "img/tofurky"+imgsfx+".png";
        }else{
    	    image.src = "img/roast_turkey"+imgsfx+".png";
        }
        console.log("IMAGE LOADING", image.src);
    	image.onload = function(self){
            return function(event){

                self.imgtky = event.target;
                self.Carve();
                self.Serve();
                self.stage.update();
            };
        }(this);




        return this.tkytly.actual.vol;
    }
};
