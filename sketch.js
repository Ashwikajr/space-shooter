var bg;
var bg1;
var e1, e2, p1;
var player;
var enemygroup;
var edegs;
var bulletgroup;
var enemybulletgroup;
var START = 0, PLAY = 1, END = 2;
var gameState = START;
var lives = 3;
var score = 0;
var gameOver, gameOverImg, restart, restartImg;
var explosionSound, gameOverSound, playerDeadSound, playerShootSound;
var count=1;
function preload() {
  bg = loadImage("space1.jpg");
  e1 = loadImage("E1.png");
  e2 = loadImage("E2.png");
  p1 = loadImage("P1.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  explosionSound = loadSound("sounds/explosion.mp3");
  gameOverSound = loadSound("sounds/gameOver.wav");
  playerDeadSound = loadSound("sounds/playerDead.wav");
  playerShootSound = loadSound("sounds/playerShoot.wav");
}

function setup() {
  createCanvas(600, 600);
  bg1 = createSprite(400, 200, width, height);
  bg1.addImage(bg);
  bg1.scale = 6.5;
  //bg1.x=bg1.width/2;


  player = createSprite(300, 500, 20, 20);
  player.addImage(p1);
  player.scale = 0.8;

  player.setCollider("rectangle", 0, 0, 150, player.height)
  enemygroup = new Group();
  bulletgroup = new Group();
  enemybulletgroup = new Group();

  textSize(40);
  fill("white");

  gameOver = createSprite(300, 200, 50, 50);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 1.5;
  gameOver.visible = false;

  restart = createSprite(300, 300, 50, 50);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  restart.visible = false;
}

function draw() {
  background(180, 180, 180);
  drawSprites();
  text("Score: " + score, 50, 50);
  text("Lives: " + lives, 350, 50);
  if (gameState === START) {
    gameOver.visible = false;
    restart.visible = false;
    text("Press 'S' to START", 130, 300);
    if (keyDown("s")) {
      gameState = PLAY;
    }
  }
  else if (gameState === PLAY) {
    bg1.velocityY = (2 + 3 * score / 10);

    if (keyDown(RIGHT_ARROW)) {
      player.x += 10;
    }
    if (keyDown(LEFT_ARROW)) {
      player.x -= 10;
    }
    if (bg1.y > 350) {
      bg1.y = 50;
    }

    if (keyDown("a")) {
      sponbullets();
      playerShootSound.play();
    }

    sponenemy();
    for (var i = 0; i < enemygroup.length; i++) {
      if (bulletgroup.length > 0) {
        for (var j = 0; j < bulletgroup.length; j++) {
          if (bulletgroup.get(j).isTouching(enemygroup.get(i))) {
            enemygroup.get(i).destroy();
            bulletgroup.get(j).destroy();
            score = score + 5;
            explosionSound.play();
            break;
          }
        }
      }
    }
    if (enemybulletgroup.isTouching(player) || enemygroup.isTouching(player)) {
      lives = lives - 1;
      gameState = END;
      playerDeadSound.play();
    }

  }
  else {
    //gameOver.visible = true;
    restart.visible = true;
    bg1.velocityY = 0;
    enemygroup.setVelocityYEach(0);
    enemybulletgroup.setVelocityYEach(0);
    enemygroup.setLifetimeEach(-1);
    enemybulletgroup.setLifetimeEach(-1);
    if (lives > 0) {
      reset();
    }
    else {
      gameOver.visible = true;
      restart.visible = false;
      if(count===1){
        gameOverSound.play();
        count=0;
      }
    }
  }
  edegs = createEdgeSprites();
  player.collide(edegs[0]);
  player.collide(edegs[1]);
}

function reset() {
  if (mousePressedOver(restart)) {
    //score = 0;
    gameState = START;
    enemygroup.destroyEach();
    enemybulletgroup.destroyEach();
  }
}

function sponenemy() {
  if (frameCount % 200 === 0) {
    var enemy = createSprite(Math.round(random(50, 550)), 50, 20, 20);
    enemy.scale = 0.5;
    enemy.velocityY = 2;
    var r = Math.round(random(1, 2));
    switch (r) {
      case 1: {
        enemy.addImage(e1);
        enemy.scale = 0.3;
      }
        break;
      default: {
        enemy.addImage(e2);
        enemy.setCollider("rectangle", 0, 0, 150, enemy.height);
      }
        break;
    }
    enemy.lifetime = 600;
    enemygroup.add(enemy);

    var bullet = createSprite(enemy.x, enemy.y + 20, 6, 20);
    bullet.shapeColor = "orange";
    bullet.velocityY = 5;
    bullet.lifetime = 200;
    enemybulletgroup.add(bullet);

    gameOver.depth = enemygroup.maxDepth()+1;
  }
}

function sponbullets() {
  var bullet = createSprite(player.x, player.y - 40, 6, 20);
  bullet.shapeColor = "yellow";
  bullet.velocityY = -3;
  bullet.lifetime = 200;
  bulletgroup.add(bullet);
}