function TurkeyVol(options){

    this.EXTRUDE_MULTIPLIER = 50;
    this.OUTER_MARGIN = 10;
    this.COPY_MARGIN = options.copy_margin;
    this.DOT_SIZE = 2;
    this.FONT_STYLE = "30px Anton";
    this.FONT_COLOR = "#FFFFFF";
    this.FONT_SHADOW_COLOR = "#000000";
    this.BKG_COLOR = "#9999AA";
    this.F_COLOR = "#FFFFFF";
    this.M_COLOR = "#EEEEEE";
    this.B_COLOR = "#CCCCCC";
    this.DOT_COLOR = "rgba(0,255,0,0.6)";
    this.TAB_COLOR = "#CCCCDD";
    this.TAB_RADIUS = 25;
    this.TURKEY_SPACE = 1.25;
    this.TURKEY_SIZE = 1.5;
    this.START_RECT = options.start_rect;
    this.canvas = options.element;
    this.realsize = {
        height:null,
        width:null,
        depth:null,
    }


    this.stage; this.imgtky; this.imgbkg; this.bitmap; this.background;
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
	var image = new Image();
	image.src = "img/roast_turkey.png";
	image.onload = function(self){
        return function(event){
            self.imgtky = event.target;
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

    this.stage.update();

    this.stage.removeChild(text);

    this.stage.update();

    this.UpdateCubeD();

};

TurkeyVol.prototype.InitDim = function(pDim, pVal){
    console.log('InitDim');
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
    this.bface.graphics.beginStroke(this.B_COLOR).drawRect(0, 0, this.START_RECT.width, this.START_RECT.height);
    this.bface.setBounds(0,0,this.START_RECT.width,this.START_RECT.height);
    this.bface.x = this.START_RECT.x;
    this.bface.y = this.START_RECT.y;

    this.stage.addChild(this.bface);

    this.stage.update();

};

TurkeyVol.prototype.FaceInitF = function(){

    this.fface = new createjs.Shape();
    this.fface.graphics.beginStroke(this.F_COLOR).drawRect(0, 0, this.START_RECT.width, this.START_RECT.height);
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
    this.tabd.x = this.START_RECT.x+(this.START_RECT.width-(this.START_RECT.width/4));
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

    if( this.GetDim('h') != null ){
        this.SetDim('h',this._CalcHeight(this.GetDim('w')));
    }

    this.UpdateCubeP();
};

TurkeyVol.prototype.UpdateCubeW = function(){

    this.fface.scaleX = (((this.fface.x+(this.fface.getTransformedBounds().width/2))-this.tabw.x)/(this.fface.getBounds().width/2));
    this.bface.scaleX = (this.fface.scaleX)/(1-( (this.tabd.x-(this.fface.x+this.fface.getTransformedBounds().width))/(this.fface.getBounds().width)));

    if( this.GetDim('w') != null ){
        this.SetDim('w',this._CalcWidth(this.GetDim('h')));
    }

    this.UpdateCubeP();
};

TurkeyVol.prototype.UpdateCubeD = function(){

    this.dscale = ( ((this.tabd.x-(this.fface.x+this.fface.getTransformedBounds().width))/(this.fface.getTransformedBounds().width))+1 );
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
    if( this.CheckDim() ){

        var bdot = new createjs.Shape();
        bdot.graphics.clear().setStrokeStyle(this.DOT_SIZE).beginStroke(this.DOT_COLOR).drawRect(this.bface.x, this.bface.y, this.bface.getTransformedBounds().width, this.bface.getTransformedBounds().height);
        this.stage.addChild(bdot);

        // Draw out the connecting lines
        var mdot = new createjs.Shape();
        mdot.graphics.clear().setStrokeStyle(this.DOT_SIZE).beginStroke(this.DOT_COLOR)
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
            hct = (parseFloat(this.realsize.width)*ddx)/(this.TURKEY_SIZE*ddx);
            if(hct%1 > .5){
                hct = Math.floor(hct);
            }else{
                hct = Math.ceil(hct);
            }
            vct = (this.fface.getTransformedBounds().height*ddx)/(this.TURKEY_SPACE*ddx);
            vct = (parseFloat(this.realsize.height)*ddx)/(this.TURKEY_SIZE*ddx);
            if(vct%1 > .5){
                vct = Math.floor(vct);
            }else{
                vct = Math.ceil(vct);
            }

            for(var idx=0; idx<hct; idx++){

                for(var jdx=0; jdx<vct; jdx++){
                    this.bitmap = new createjs.Bitmap(this.imgtky);
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
        hct = (parseFloat(this.realsize.width)*ddx)/(this.TURKEY_SIZE*ddx);
        if(hct%1 > .5){
            hct = Math.floor(hct);
        }else{
            hct = Math.ceil(hct);
        }
        vct = (this.fface.getTransformedBounds().height*ddx)/(this.TURKEY_SIZE*ddx);
        vct = (parseFloat(this.realsize.height)*ddx)/(this.TURKEY_SIZE*ddx);
        if(vct%1 > .5){
            vct = Math.floor(vct);
        }else{
            vct = Math.ceil(vct);
        }

        for(var idx=0; idx<hct; idx++){
            for(var jdx=0; jdx<vct; jdx++){
                this.bitmap = new createjs.Bitmap(this.imgtky);
                this.stage.addChild(this.bitmap);
                this.bitmap.rotation = Math.floor((Math.random() * 20) -10);
                this.bitmap.x = this.fface.x + ((this.fface.getTransformedBounds().width*ddx)/hct)*idx - 5;
                this.bitmap.y = this.fface.y + ((this.fface.getTransformedBounds().height*ddx)/vct)*jdx - 5;
                this.bitmap.scaleX = (((this.fface.getTransformedBounds().width*ddx)/hct)/this.bitmap.image.width)*this.TURKEY_SPACE;
                this.bitmap.scaleY = (((this.fface.getTransformedBounds().height*ddx)/vct)/this.bitmap.image.height)*this.TURKEY_SPACE;
            }
        }

        var fdot = new createjs.Shape();
        fdot.graphics.clear().setStrokeStyle(this.DOT_SIZE).beginStroke(this.DOT_COLOR).drawRect(this.fface.x, this.fface.y, this.fface.getTransformedBounds().width, this.fface.getTransformedBounds().height);
        fdot.shadow = new createjs.Shadow("#FFFFFF", 0, 0, 5);
        this.stage.addChild(fdot);

        dct = (parseFloat(this.realsize.depth))/(this.TURKEY_SIZE);
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

        // var textshadow = new createjs.Text(tvol+" TURKEYS", this.FONT_SHADOW_STYLE, this.FONT_SHADOW_COLOR);
        // textshadow.x = this.COPY_MARGIN-2;
        // textshadow.y = this.stage.getBounds().height-this.COPY_MARGIN+2;
        // textshadow.textBaseline = "alphabetic";
        // this.stage.addChild(textshadow);
        // textshadow.scaleX = (this.stage.getBounds().width-(this.COPY_MARGIN*2-4))/textshadow.getBounds().width;
        // textshadow.scaleY = (this.stage.getBounds().width-(this.COPY_MARGIN*2-16))/textshadow.getBounds().width;

        var text = new createjs.Text(tvol+" TURKEYS", this.FONT_STYLE, this.FONT_COLOR);
        text.x = this.COPY_MARGIN;
        text.y = this.stage.getBounds().height-(this.COPY_MARGIN/2);
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

        this.stage.update();
    }
};