var game = new Phaser.Game(800, 400, Phaser.CANVAS, 'pop', { preload: preload, create: create, preRender: preRender, render: render });

var imgs = [ "BadTux1", "BadTux2", "batarang", "bizzaro", "feather1", "tux-batman", "cursor", "background" ];
var showDebug = true;

function preload() {
  imgs.forEach(function(i){
      game.load.image(i, 'res/'+i+'.png');
  }); 
}

var tux;
var line;
var mouseBody;
var mouseSpring;
var drawLine = false;

function create() {
  game.world.setBounds(0, 0, 5000, 400);
  game.add.tileSprite(0, 0, 5000, 600, 'background');

  game.physics.startSystem(Phaser.Physics.P2JS);
  game.physics.p2.gravity.y = 1000;
  game.physics.p2.restitution = .1;

  createPlayer();
  createMouseGrab();
  game.input.onDown.add(click, this);
  game.input.onUp.add(release, this);
  game.input.addMoveCallback(move, this);

}

function createPlayer(){
  //  Create player
  tux = game.add.sprite(200, 200, 'tux-batman');
  tux.scale.set(.5);
  game.physics.p2.enable(tux);
  //tux.body.setCircle(15);
  game.camera.follow(tux);
}

function createMouseGrab(){
  //  Create our Mouse Cursor / Spring
  mouseBody = game.add.sprite(100, 100, 'cursor');
  game.physics.p2.enable(mouseBody);
  mouseBody.body.static = true;
  mouseBody.body.setCircle(10);
  mouseBody.body.data.shapes[0].sensor = true;

  //  Debug spring line
  line = new Phaser.Line(tux.x, tux.y, mouseBody.x, mouseBody.y);


}

function click(pointer) {
  var bodies = game.physics.p2.hitTest(pointer.position, [ tux.body ]);

  if (bodies.length){
    //  Attach to the first body the mouse hit
    mouseSpring = game.physics.p2.createSpring(mouseBody, bodies[0], 0, 30, 1);
    line.setTo(tux.x, tux.y, mouseBody.x, mouseBody.y);
    drawLine = true;
  }

}

function release() {
  game.physics.p2.removeSpring(mouseSpring);
  drawLine = false;
}

function move(pointer, x, y, isDown) {
  mouseBody.body.x = x;
  mouseBody.body.y = y;
  line.setTo(tux.x, tux.y, mouseBody.x, mouseBody.y);
}

function preRender() {
  if (line){
    line.setTo(tux.x, tux.y, mouseBody.x, mouseBody.y);
  }

}

function render() {
  if (drawLine){
    game.debug.geom(line);
  }
/*
  if(tux.position.x > 800){
    game.camera.follow(tux);
  }
*/
}

