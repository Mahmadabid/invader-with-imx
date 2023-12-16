import p5 from "p5";
import Invaders from "./Invaders";
import Player from "./Player";
import Debris from "./Debris";
import { Sketch } from "react-p5-wrapper";

declare global {
  interface Window {
    isconnecting?: boolean;
  }
}

export function Sketch() {
  let alienImage: p5.Image;
  let invaders: Invaders;
  let shooterImage: p5.Image;
  let player: Player;
  let allDebris: Debris[] = [];
  let gameOver = false;
  let canvas: p5.Renderer;
  let canvasEl: HTMLCanvasElement;
  let loading = 10;
  let loadingPlus = true;
  let resumeButton: p5.Element;
  let upgradedShooterImage: p5.Image;

  const NUM_DEBRIS = 5;

  function preload(p: p5) {
    alienImage = p.loadImage("/invader1.png");
    shooterImage = p.loadImage('/player.png');
    upgradedShooterImage = p.loadImage('/playerv2.png');
  }

  function setup(p: p5) {
    canvasEl = document.getElementById('sketch-holder') as HTMLCanvasElement;
    canvas = p.createCanvas(canvasEl.offsetWidth, 400);
    canvas.style('display', 'block');
    canvas.parent('sketch-holder');
    invaders = new Invaders(alienImage, p, 4);
    player = new Player(shooterImage, p, invaders);

    for (let i = 0; i < NUM_DEBRIS; i++) {
      if (allDebris.length < NUM_DEBRIS) {
        allDebris.push(new Debris(p));
      }
    }

    resumeButton = p.createButton('Resume Game');
    resumeButton.position(p.width / 2 - 40, p.height / 2 + 220);
    resumeButton.mousePressed(resumeGame);
    resumeButton.hide();
  }

  function showGameOver(p: p5) {
    p.background(0);
    gameOver = true;
    p.fill(255);
    let gameOverT = "GAME OVER! Click to continue. Your score was " + player.score;
    p.textSize(16);
    p.text(gameOverT, p.width / 2 - p.textWidth(gameOverT) / 2, p.height / 2);
  }

  function connectToStart(p: p5) {
    p.background(100);
    p.fill(255);
    p.textSize(16);
    let startText1 = "Game will start after successful authentication";
    let startText2 = "Click on Connect passport";
    let textXpos1 = p.width / 2 - p.textWidth(startText1) / 2;
    let textXpos2 = p.width / 2 - p.textWidth(startText2) / 2;
    let textYpos = p.height / 2;

    if (window.isconnecting) {
      startText1 = "Connecting ...";
      textXpos1 = p.width / 2 - p.textWidth(startText1) / 2;
      if (loadingPlus === true && loading == 100) {
        loadingPlus = false;
      } else if (loading == 10 && loadingPlus === false) {
        loadingPlus = true;
      }
      if (loadingPlus) {
        loading++;
      } else {
        loading--;
      }
      p.fill(loading + 150);
    }

    p.text(startText1, textXpos1, textYpos);
    p.text(startText2, textXpos2, textYpos + 20);
  }

  function resumeGame(p: p5) {
    console.log('Resuming game, hiding resume button');
    player.resumeGame();
    resumeButton.hide();
    p.loop();
    let nft = document.getElementById("nft");
    nft ? nft.innerHTML = "" : null
  }

  function draw(p: p5) {
    if (gameOver) {
      showGameOver(p);
    } else if (window?.userProfile?.email) {
      if (!player.gamePaused) {
        p.background(0);
        player.update(invaders);
        updateDebrisAndCheckCollisions(p);
        invaders.update(player);
      }

      player.draw();
      player.drawInfo();
      invaders.draw();

      if (player.gamePaused && resumeButton.elt.style.display === 'none') {
        console.log('Pausing game, showing resume button');
        p.noLoop();
        resumeButton.show();
      }

      if (player.lives == 0) {
        gameOver = true;
      }
    } else {
      connectToStart(p);
    }

  }

  function mousePressed(p: p5) {
    if (gameOver === true) {
      gameOver = false;
      setup(p);
    }
  }

  function keyPressed(p: p5) {
    if (p.keyCode === p.RIGHT_ARROW || p.keyCode == 88) {
      player.moveRight();
    } else if (p.keyCode === p.LEFT_ARROW || p.keyCode == 90) {
      player.moveLeft();
    } else if (p.keyCode === 32) {
      player.shoot();
    }

    if (p.keyCode === p.UP_ARROW) {
      player.moveUp();
    } else if (p.keyCode == p.DOWN_ARROW) {
      player.moveDown();
    }
  }

  function updateDebrisAndCheckCollisions(p: p5) {
    for (let i = 0; i < allDebris.length; i++) {
      allDebris[i].update();
      allDebris[i].display();

      if (allDebris[i].hasHitPlayer(player)) {
        allDebris.splice(i, 1);
        player.loseLife();
        break;
      }
    }
  }

  function windowResized(p: p5) {
    p.resizeCanvas(canvasEl.offsetWidth, 400);
    p.background(0);
  }

  new p5((p: p5) => {
    p.preload = () => preload(p);
    p.setup = () => setup(p);
    p.draw = () => draw(p);
    p.mousePressed = () => mousePressed(p);
    p.keyPressed = () => keyPressed(p);
    p.windowResized = () => windowResized(p);
  });
  return (
    <Sketch setup={setup} draw={draw} />
)
}