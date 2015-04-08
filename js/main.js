var canvas, stage;

var mouseTarget;	// the display object currently under the mouse, or being dragged
var dragStarted;	// indicates whether we are currently in a drag operation
var offset;
var update = true;

var fface, bface, tabh, tabw, tabd, tabp;
var dscale = 1;

$(document).ready(function(){

    stage = new createjs.Stage("volumizer");

	// enable touch interactions if supported on the current device:
	createjs.Touch.enable(stage);

	// enabled mouse over / out events
	stage.enableMouseOver(10);
	stage.mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas

    FaceInitB();
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
    fface.graphics.beginStroke("Black").drawRect(0, 0, 300, 300);
    fface.setBounds(0,0,300,300);
    fface.x = 100;
    fface.y = 100;

    stage.addChild(fface);

    stage.update();
}

function FaceInitB(){
    bface = new createjs.Shape();
    bface.graphics.beginStroke("Black").drawRect(0, 0, 300, 300);
    bface.setBounds(0,0,300,300);
    bface.x = 100;
    bface.y = 100;

    stage.addChild(bface);

    stage.update();
}

function UpdateCubeP(){

    //console.log(fface.graphics.getBounds().width);
    var fb = fface.getTransformedBounds();

    fface.x = tabp.x - (fb.width/2);
    fface.y = tabp.y - (fb.height/2);

    tabh.x = fface.x + (fb.width/2);
    tabh.y = fface.y;

    tabw.x = fface.x;
    tabw.y = fface.y + (fb.height/2);

    tabd.x = fface.x + fb.width + ( (fface.x + fb.width) - ((fface.x + fb.width)*dscale));
    tabd.y = fface.y + (fb.height);
}

function UpdateCubeH(){
    //console.log( ((fface.y+(fface.getTransformedBounds().height/2))-this.y)/(fface.getBounds().height/2) );
    fface.scaleY = (((fface.y+(fface.getTransformedBounds().height/2))-tabh.y)/(fface.getBounds().height/2));
    bface.scaleY = (fface.scaleY)*(1-( (tabd.x-(fface.x+fface.getTransformedBounds().width))/(fface.getBounds().width)));
    //console.log(fface.getBounds().height);
    //console.log((((fface.y+(fface.getTransformedBounds().height/2))-tabh.y)/(fface.getBounds().height/2)));

    UpdateCubeP();
}

function UpdateCubeW(){
    fface.scaleX = (((fface.x+(fface.getTransformedBounds().width/2))-tabw.x)/(fface.getBounds().width/2));
    bface.scaleX = (fface.scaleX)*(1-( (tabd.x-(fface.x+fface.getTransformedBounds().width))/(fface.getBounds().width)));
    UpdateCubeP();
}

function UpdateCubeD(){
    //console.log(fface.x, (fface.getTransformedBounds().width),  tabd.x, (fface.getBounds().width/2));
    //console.log( 1-( (tabd.x-(fface.x+fface.getTransformedBounds().width))/(fface.getBounds().width/2)) );
    dscale = (1-( (tabd.x-(fface.x+fface.getTransformedBounds().width))/(fface.getBounds().width)));
    console.log(dscale);
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
		this.x = evt.stageX + this.offset.x;
		this.y = evt.stageY + this.offset.y;
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
