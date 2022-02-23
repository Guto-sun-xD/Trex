var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score = 0;
var gameover, gameover_img;
var restart, restart_img;

var pulo, pontos, morre;

var touches;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  pulo = loadSound("jump.mp3");
  pontos = loadSound("checkPoint.mp3");
  morre = loadSound("die.mp3");

  restart_img = loadImage("restart.png")
  gameover_img = loadImage("gameOver.png") 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height - 20,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  trex.setCollider("circle", 0, 0, 50);
  trex.debug = false;

  ground = createSprite(width/2,height - 20,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(width/2,height - 10,width,10);
  invisibleGround.visible = false;
  
  //crie Grupos de Obstáculos e Nuvens
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  restart = createSprite(width/2,height/2);
  gameover = createSprite(width/2,height/2 - 50);
  restart.addImage(restart_img);
  gameover.addImage(gameover_img);
  restart.scale = 0.5;
  gameover.scale = 0.80;
}

function draw() {
  background(180);
  text("Score: "+ score, width - 100,50);
  //console.log (trex.y);
  if(gameState === PLAY){
    trex.changeAnimation("running", trex_running);
    restart.visible = false
    gameover.visible = false
    console.log(getFrameRate());
    score = score + Math.round(getFrameRate()/60);
    if(score > 0 && score % 100 == 0) {
      pontos.play();
     
    }
    //mover o solo
    ground.velocityX = -4;
    if((keyDown("space") || touches.length > 0)&& trex.y >= height - 40) {
      trex.velocityY = -13;
      pulo.play();
      touches = [];
    }
    trex.velocityY = trex.velocityY + 0.8;
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
   spawnClouds();
   spawnObstacles();
   if(obstaclesGroup.isTouching (trex)) {
     gameState = END;
     //trex.velocityY = -13
     morre.play();
     
    }
    
  }
  else if(gameState === END){
    //parar o solo
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0)
    cloudsGroup.setVelocityXEach(0)
    trex.changeAnimation("collided", trex_collided);
    cloudsGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);
    //score = 0;
    restart.visible = true;
    gameover.visible = true;
    if(mousePressedOver(restart) || touches.length > 0){
      reset();
      touches = [];
    }
  }
   
  trex.collide(invisibleGround);
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width - 10,height - 35,10,40);
   obstacle.velocityX = -6 - score/100;
   
   
    // //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //atribuir escala e vida útil ao obstáculo          
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //adicione cada obstáculo ao grupo
   obstaclesGroup.add(obstacle);
 }
}




function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
     cloud = createSprite(width,height/2,40,10);
    cloud.y = Math.round(random(height/2 -30,height/2 + 30));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3 - score/100;
    
     //atribuir vida útil à variável
    cloud.lifetime = 1000;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicionando nuvem ao grupo
   cloudsGroup.add(cloud);
  }
  
}

  function reset() {
    gameState = PLAY;
    score = 0;
    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
    trex
  }