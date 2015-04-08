var EXTRUDE_MULTIPLIER = 50;
var OUTER_MARGIN = 10;
var F_COLOR = "#000000";
var M_COLOR = "#333333";
var B_COLOR = "#666666";

var canvas, stage;

var mouseTarget;	// the display object currently under the mouse, or being dragged
var dragStarted;	// indicates whether we are currently in a drag operation
var offset;
var update = true;

var fface, bface, mface, tabh, tabw, tabd, tabp;
var dscale = 1;

$(document).ready(function(){

    stage = new createjs.Stage("volumizer");
    stage.setBounds(0,0,$('#volumizer').width(), $('#volumizer').height())

	// enable touch interactions if supported on the current device:
	createjs.Touch.enable(stage);

	// enabled mouse over / out events
	stage.enableMouseOver(10);
	stage.mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas

    FaceInitB();

    mface = new createjs.Shape();
    mface.x = 0;
    mface.y = 0;

    stage.addChild(mface);

    FaceInitF();
    TabInitH();
    TabInitW();
    TabInitP();
    TabInitD();



    createjs.Ticker.addEventListener("tick", tick);

    stage.update();

});

function FaceInitF(){
    fface = new createjs.Shape();
    fface.graphics.beginStroke(F_COLOR).drawRect(0, 0, 300, 300);
    fface.setBounds(0,0,300,300);
    fface.x = 100;
    fface.y = 100;

    stage.addChild(fface);

    stage.update();
}

function FaceInitB(){
    bface = new createjs.Shape();
    bface.graphics.beginStroke(B_COLOR).drawRect(0, 0, 300, 300);
    bface.setBounds(0,0,300,300);
    bface.x = 100;
    bface.y = 100;

    stage.addChild(bface);

    stage.update();
}

function UpdateCubeP(){

    // Set the face positions
    var xoffset = ((stage.getBounds().width/2)-(stage.getBounds().width-tabp.x))/(stage.getBounds().width/2);
    var yoffset = ((stage.getBounds().height/2)-(stage.getBounds().height-tabp.y))/(stage.getBounds().height/2);
    //console.log('xoffset',xoffset);
    //console.log(fface.graphics.getBounds().width);
    var fb = fface.getTransformedBounds();
    var bb = bface.getTransformedBounds();

    fface.x = tabp.x - (fb.width/2);
    fface.y = tabp.y - (fb.height/2);

    bface.x = tabp.x - (bb.width/2) - (xoffset*EXTRUDE_MULTIPLIER);
    bface.y = tabp.y - (bb.height/2) - (yoffset*EXTRUDE_MULTIPLIER);

    // Draw out the connecting lines
    mface.graphics.clear().beginStroke(M_COLOR)
        .moveTo(fface.x, fface.y)
        .lineTo(bface.x, bface.y)
        .moveTo(fface.x+fface.getTransformedBounds().width, fface.y)
        .lineTo(bface.x+bface.getTransformedBounds().width, bface.y)
        .moveTo(fface.x, fface.y+fface.getTransformedBounds().height)
        .lineTo(bface.x, bface.y+bface.getTransformedBounds().height)
        .moveTo(fface.x+fface.getTransformedBounds().width, fface.y+fface.getTransformedBounds().height)
        .lineTo(bface.x+bface.getTransformedBounds().width, bface.y+bface.getTransformedBounds().height);

    // Position the control tabs
    tabh.x = fface.x + (fb.width/2);
    tabh.y = fface.y;

    tabw.x = fface.x;
    tabw.y = fface.y + (fb.height/2);

    console.log((dscale));

    //tabd.x = fface.x + fb.width - ((fb.width)*(1-dscale));// + ( (fface.x + fb.width) - ((fface.x + fb.width)*dscale));
    tabd.x = fface.x + (fb.width*dscale);
    tabd.y = fface.y + (fb.height);

}

function UpdateCubeH(){
    //console.log( ((fface.y+(fface.getTransformedBounds().height/2))-this.y)/(fface.getBounds().height/2) );
    fface.scaleY = (((fface.y+(fface.getTransformedBounds().height/2))-tabh.y)/(fface.getBounds().height/2));
    bface.scaleY = (fface.scaleY)/(1-( (tabd.x-(fface.x+fface.getTransformedBounds().width))/(fface.getBounds().width)));
    //console.log(fface.getBounds().height);
    //console.log((((fface.y+(fface.getTransformedBounds().height/2))-tabh.y)/(fface.getBounds().height/2)));

    UpdateCubeP();
}

function UpdateCubeW(){
    fface.scaleX = (((fface.x+(fface.getTransformedBounds().width/2))-tabw.x)/(fface.getBounds().width/2));
    bface.scaleX = (fface.scaleX)/(1-( (tabd.x-(fface.x+fface.getTransformedBounds().width))/(fface.getBounds().width)));
    UpdateCubeP();
}

function UpdateCubeD(){
    //console.log(fface.x, (fface.getTransformedBounds().width),  tabd.x, (fface.getBounds().width/2));
    //console.log( 1-( (tabd.x-(fface.x+fface.getTransformedBounds().width))/(fface.getBounds().width/2)) );
    //console.log( ( (tabd.x-(fface.x+fface.getTransformedBounds().width))/(fface.getBounds().width/2))+1 );



    //dscale = (1-( (tabd.x-(fface.x+fface.getTransformedBounds().width))/(fface.getBounds().width)));
    dscale = ( ((tabd.x-(fface.x+fface.getTransformedBounds().width))/(fface.getTransformedBounds().width))+1 );
    //console.log(dscale);
    bface.scaleX = (fface.scaleX)*dscale;
    bface.scaleY = (fface.scaleY)*dscale;
    UpdateCubeP();
}

function TabInitH(){
    tabh = new createjs.Shape();
    tabh.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 25);
    tabh.x = 250;
    tabh.y = 100;

    stage.addChild(tabh);

    // using "on" binds the listener to the scope of the currentTarget by default
	// in this case that means it executes in the scope of the button.
    tabh.on("mousedown", function (evt) {
		//this.parent.addChild(this);
		this.offset = {x: this.x, y: this.y - evt.stageY};
	});

	// the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
    tabh.on("pressmove", function (evt) {
		//this.x = evt.stageX + this.offset.x;
		this.y = evt.stageY + this.offset.y;
		// indicate that the stage should be updated on the next tick:
		update = true;

        UpdateCubeH();
	});
}

function TabInitW(){
    tabw = new createjs.Shape();
    tabw.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 25);
    tabw.x = 100;
    tabw.y = 250;

    stage.addChild(tabw);

    // using "on" binds the listener to the scope of the currentTarget by default
	// in this case that means it executes in the scope of the button.
    tabw.on("mousedown", function (evt) {
		//this.parent.addChild(this);
		this.offset = {x: this.x - evt.stageX, y: this.y};
	});

	// the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
    tabw.on("pressmove", function (evt) {
		this.x = evt.stageX + this.offset.x;
		//this.y = evt.stageY + this.offset.y;
		// indicate that the stage should be updated on the next tick:
		update = true;
        UpdateCubeW();
	});
}

function TabInitD(){
    tabd = new createjs.Shape();
    tabd.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 25);
    tabd.x = 400;
    tabd.y = 400;

    stage.addChild(tabd);

    // using "on" binds the listener to the scope of the currentTarget by default
	// in this case that means it executes in the scope of the button.
    tabd.on("mousedown", function (evt) {
		//this.parent.addChild(this);
		this.offset = {x: this.x - evt.stageX, y: this.y};
	});

	// the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
    tabd.on("pressmove", function (evt) {
		this.x = evt.stageX + this.offset.x;
		//this.y = evt.stageY + this.offset.y;
		// indicate that the stage should be updated on the next tick:
		update = true;
        UpdateCubeD();
	});
}

function TabInitP(){
    tabp = new createjs.Shape();
    tabp.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 25);
    //tabp.setBounds(0,0,50,50);
    tabp.x = 250;
    tabp.y = 250;

    stage.addChild(tabp);

    // using "on" binds the listener to the scope of the currentTarget by default
	// in this case that means it executes in the scope of the button.
    tabp.on("mousedown", function (evt) {
		this.parent.addChild(this);
		this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
	});

	// the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
    tabp.on("pressmove", function (evt) {

        if( (evt.stageX + this.offset.x) > (stage.getBounds().x+(fface.getBounds().x+(fface.getTransformedBounds().width/2))+OUTER_MARGIN) &&
            (evt.stageX + this.offset.x) < (stage.getBounds().width-(fface.getBounds().x+(fface.getTransformedBounds().width/2))-OUTER_MARGIN)
        ){
    		this.x = evt.stageX + this.offset.x;
        }
        if( (evt.stageY + this.offset.y) > (stage.getBounds().y+(fface.getBounds().y+(fface.getTransformedBounds().height/2))+OUTER_MARGIN) &&
            (evt.stageY + this.offset.y) < (stage.getBounds().height-(fface.getBounds().y+(fface.getTransformedBounds().height/2))-OUTER_MARGIN)
        ){
            this.y = evt.stageY + this.offset.y;
        }
		// indicate that the stage should be updated on the next tick:
		update = true;

        UpdateCubeP({x:this.x,y:this.y});
	});
}

function tick(event) {
	// this set makes it so the stage only re-renders when an event handler indicates a change has happened.
	if (update) {
		update = false; // only update once
		stage.update(event);
	}
}
