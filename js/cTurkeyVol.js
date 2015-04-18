function TurkeyVol(options){

    this.EXTRUDE_MULTIPLIER = 50;
    this.OUTER_MARGIN = 10;
    this.COPY_MARGIN = 25;
    this.F_COLOR = "#000000";
    this.M_COLOR = "#333333";
    this.B_COLOR = "#666666";
    this.DOT_COLOR = "#00FF00";
    this.TAB_COLOR = "#CCCCDD";
    this.TAB_RADIUS = 25;
    this.TURKEY_SPACE = 1.25;
    this.TURKEY_SIZE = 1.5;
    this.START_RECT = {
        width:300,
        height:300,
        x:100,
        y:100,
    };

    this.canvas = $('#volumizer');
    this.extcontrols = {
        height:$('#btn_height'),
        width:$('#btn_width'),
        depth:$('#btn_depth'),
    }


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
	image.onload = function(self){
        return function(event){
            self.image = event.target;
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

    this.stage.update();

};

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
    this.tabh.graphics.beginFill(this.TAB_COLOR).drawCircle(0, 0, this.TAB_RADIUS);
    this.tabh.x = this.START_RECT.x+(this.START_RECT.width/2);
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
    this.tabw = new createjs.Shape();
    this.tabw.graphics.beginFill(this.TAB_COLOR).drawCircle(0, 0, this.TAB_RADIUS);
    this.tabw.x = this.START_RECT.x;
    this.tabw.y = this.START_RECT.y+(this.START_RECT.height/2);

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
    this.tabd = new createjs.Shape();
    this.tabd.graphics.beginFill(this.TAB_COLOR).drawCircle(0, 0, this.TAB_RADIUS);
    this.tabd.x = this.START_RECT.x+(this.START_RECT.width);
    this.tabd.y = this.START_RECT.y+(this.START_RECT.height);

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

    this.fface.scaleY = (((this.fface.y+(this.fface.getTransformedBounds().height/2))-this.tabh.y)/(this.fface.getBounds().height/2));
    this.bface.scaleY = (this.fface.scaleY)/(1-( (this.tabd.x-(this.fface.x+this.fface.getTransformedBounds().width))/(this.fface.getBounds().width)));

    if( isNumeric(this.extcontrols.height.html())){
        var tw = this.extcontrols.width.html();
        this.extcontrols.height.html(this._CalcHeight(tw));
    }

    this.UpdateCubeP();
};

TurkeyVol.prototype.UpdateCubeW = function(){

    this.fface.scaleX = (((this.fface.x+(this.fface.getTransformedBounds().width/2))-this.tabw.x)/(this.fface.getBounds().width/2));
    this.bface.scaleX = (this.fface.scaleX)/(1-( (this.tabd.x-(this.fface.x+this.fface.getTransformedBounds().width))/(this.fface.getBounds().width)));

    if( isNumeric(this.extcontrols.width.html())){
        var th = this.extcontrols.height.html();
        this.extcontrols.width.html(this._CalcWidth(th));
    }

    this.UpdateCubeP();
};

TurkeyVol.prototype.UpdateCubeD = function(){

    this.dscale = ( ((this.tabd.x-(this.fface.x+this.fface.getTransformedBounds().width))/(this.fface.getTransformedBounds().width))+1 );
    this.bface.scaleX = (this.fface.scaleX)*this.dscale;
    this.bface.scaleY = (this.fface.scaleY)*this.dscale;

    if( isNumeric(this.extcontrols.depth.html())){
        var th = this.extcontrols.height.html();
        this.extcontrols.depth.html(this._CalcDepth(th, this._CalcWidth(th)));
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
    this.mface.graphics.clear().beginStroke(this.M_COLOR)
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



TurkeyVol.prototype.Fill = function(){

    // Draw out the connecting lines
    var mdot = this.mface.clone();
    mdot.graphics.clear().beginStroke(this.DOT_COLOR)
        .moveTo(this.fface.x, this.fface.y)
        .lineTo(this.bface.x, this.bface.y)
        .moveTo(this.fface.x+this.fface.getTransformedBounds().width, this.fface.y)
        .lineTo(this.bface.x+this.bface.getTransformedBounds().width, this.bface.y)
        .moveTo(this.fface.x, this.fface.y+this.fface.getTransformedBounds().height)
        .lineTo(this.bface.x, this.bface.y+this.bface.getTransformedBounds().height)
        .moveTo(this.fface.x+this.fface.getTransformedBounds().width, this.fface.y+this.fface.getTransformedBounds().height)
        .lineTo(this.bface.x+this.bface.getTransformedBounds().width, this.bface.y+this.bface.getTransformedBounds().height);

    this.stage.addChild(mdot);


    var xoffset = ((this.stage.getBounds().width/2)-(this.stage.getBounds().width-this.tabp.x))/(this.stage.getBounds().width/2);
    var yoffset = ((this.stage.getBounds().height/2)-(this.stage.getBounds().height-this.tabp.y))/(this.stage.getBounds().height/2);
    var ddx = this.dscale;

    //ddx = 1;

    while(ddx < 1){

        console.log("ddx", ddx);
        console.log("xoffset", (xoffset), "percent", (((1-ddx)*1)/(1-this.dscale)));
        console.log("xoffsetb", (xoffset*(((1-ddx)*1)/(1-this.dscale))));


        hct = (this.fface.getTransformedBounds().width*ddx)/(this.TURKEY_SPACE*ddx);
        hct = (parseFloat(this.extcontrols.width.html())*ddx)/(this.TURKEY_SIZE*ddx);
        if(hct%1 > .5){
            hct = Math.floor(hct);
        }else{
            hct = Math.ceil(hct);
        }
        vct = (this.fface.getTransformedBounds().height*ddx)/(this.TURKEY_SPACE*ddx);
        vct = (parseFloat(this.extcontrols.height.html())*ddx)/(this.TURKEY_SIZE*ddx);
        if(vct%1 > .5){
            vct = Math.floor(vct);
        }else{
            vct = Math.ceil(vct);
        }

        for(var idx=0; idx<hct; idx++){

            for(var jdx=0; jdx<vct; jdx++){
                this.bitmap = new createjs.Bitmap(this.image);
                this.stage.addChild(this.bitmap);
                this.bitmap.rotation = Math.floor((Math.random() * 30) -15);
                this.bitmap.x = (this.fface.x+(this.fface.getTransformedBounds().width/2)-((this.fface.getTransformedBounds().width*ddx)/2)) + (((this.fface.getTransformedBounds().width*ddx)/hct)*idx) - ((xoffset*(((1-ddx)*1)/(1-this.dscale)))*this.EXTRUDE_MULTIPLIER) -5;
                this.bitmap.y = (this.fface.y+(this.fface.getTransformedBounds().height/2)-((this.fface.getTransformedBounds().height*ddx)/2)) + (((this.fface.getTransformedBounds().height*ddx)/vct)*jdx) - ((yoffset*(((1-ddx)*1)/(1-this.dscale)))*this.EXTRUDE_MULTIPLIER) -5;
                this.bitmap.scaleX = (((this.fface.getTransformedBounds().width*ddx)/hct)/this.bitmap.image.width)*this.TURKEY_SPACE;
                this.bitmap.scaleY = (((this.fface.getTransformedBounds().height*ddx)/vct)/this.bitmap.image.height)*this.TURKEY_SPACE;

            }
        }

        ddx += .1;

    }

    ddx = 1;

    hct = (this.fface.getTransformedBounds().width*ddx)/(this.TURKEY_SIZE*ddx);
    hct = (parseFloat(this.extcontrols.width.html())*ddx)/(this.TURKEY_SIZE*ddx);
    if(hct%1 > .5){
        hct = Math.floor(hct);
    }else{
        hct = Math.ceil(hct);
    }
    vct = (this.fface.getTransformedBounds().height*ddx)/(this.TURKEY_SIZE*ddx);
    vct = (parseFloat(this.extcontrols.height.html())*ddx)/(this.TURKEY_SIZE*ddx);
    if(vct%1 > .5){
        vct = Math.floor(vct);
    }else{
        vct = Math.ceil(vct);
    }

    for(var idx=0; idx<hct; idx++){
        for(var jdx=0; jdx<vct; jdx++){
            this.bitmap = new createjs.Bitmap(this.image);
            this.stage.addChild(this.bitmap);
            this.bitmap.rotation = Math.floor((Math.random() * 20) -10);
            this.bitmap.x = this.fface.x + ((this.fface.getTransformedBounds().width*ddx)/hct)*idx - 10;
            this.bitmap.y = this.fface.y + ((this.fface.getTransformedBounds().height*ddx)/vct)*jdx - 5;
            this.bitmap.scaleX = (((this.fface.getTransformedBounds().width*ddx)/hct)/this.bitmap.image.width)*this.TURKEY_SPACE;
            this.bitmap.scaleY = (((this.fface.getTransformedBounds().height*ddx)/vct)/this.bitmap.image.height)*this.TURKEY_SPACE;
        }
    }

    dct = (parseFloat(this.extcontrols.depth.html()))/(this.TURKEY_SIZE);
    if(dct <= 0){
        dct = 1;
    }
    if(dct%1 > .5){
        dct = Math.floor(dct);
    }else{
        dct = Math.ceil(dct);
    }
    tvol = hct * vct * dct;

    console.log('Turkey Volume', tvol, hct, vct, dct);
    var text = new createjs.Text(tvol+" TURKEYS", "30px Arial", "#ff7700");
    text.x = this.COPY_MARGIN;
    text.y = this.stage.getBounds().height-this.COPY_MARGIN;
    text.textBaseline = "alphabetic";
    this.stage.addChild(text);
    console.log(text.getBounds());
    text.scaleX = (this.stage.getBounds().width-(this.COPY_MARGIN*2))/text.getBounds().width;
    text.scaleY = (this.stage.getBounds().width-(this.COPY_MARGIN*2))/text.getBounds().width;

    var fdot = this.fface.clone();
    fdot.graphics.clear().beginStroke(this.DOT_COLOR).drawRect(0, 0, this.START_RECT.width, this.START_RECT.height);
    this.stage.addChild(fdot);

    //Clear out the cube
    this.stage.removeChild(this.fface);
    this.stage.removeChild(this.mface);
    this.stage.removeChild(this.bface);

    // Remove the control tabs
    this.stage.removeChild(this.tabh);
    this.stage.removeChild(this.tabw);
    this.stage.removeChild(this.tabd);
    this.stage.removeChild(this.tabp);

    this.stage.update();

};
