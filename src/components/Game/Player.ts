import PlayerBullet from "./PlayerBullet";
import Invaders from "./Invaders";
import p5 from "p5";

declare global {
  interface Window {
    getData: (tokenId: string) => void;
    userProfile?: {
      email: string;
    }
  }
}

class Player {
  image: p5.Image;
  x: number;
  y: number;
  isMovingLeft: boolean;
  isMovingRight: boolean;
  isMovingUp: boolean;
  isMovingDown: boolean;
  bullets: PlayerBullet[];
  lives: number;
  maxBullets: number;
  score: number;
  r: number;
  nft: boolean;
  gas: any[];
  nftShown: { '1': boolean; '2': boolean };
  gamePaused: boolean;
  resumeCount: number;
  p5: p5;
  invaders: Invaders;

  constructor(shooterImage: p5.Image, p5: p5, invaders: Invaders) {
    this.image = shooterImage;
    this.x = p5.width / 2;
    this.y = p5.height - 30;
    this.isMovingLeft = false;
    this.isMovingRight = false;
    this.isMovingUp = false;
    this.isMovingDown = false;
    this.bullets = [];
    this.lives = 3;
    this.maxBullets = 2;
    this.score = 0;
    this.r = 10;
    this.nft = false;
    this.gas = [];
    this.nftShown = { '1': false, '2': false };
    this.gamePaused = false;
    this.resumeCount = 0;
    this.p5 = p5;
    this.invaders = invaders;
  }

  showNft(tokenId: '1' | '2') {
    if (!this.nftShown[tokenId]) {
      this.nft = true;
      this.nftShown[tokenId] = true;
      window.getData(tokenId);
    }
  }
  

  respawn() {
    this.x = this.p5.width / 2;
    this.y = this.p5.height - 30;
    this.isMovingLeft = false;
    this.isMovingRight = false;
    this.isMovingUp = false;
    this.isMovingDown = false;
    this.lives -= 1;
  }

  upgradeSpaceship() {
    this.image = this.p5.loadImage('playerv2.png');
    this.maxBullets = 4;
  }

  update(invaders: Invaders) {
    if (this.gamePaused) return;
    if (this.isMovingRight && this.x < this.p5.width - 40) {
      this.x += 1;
    } else if (this.isMovingLeft && this.x > 0) {
      this.x -= 1;
    }

    if (this.isMovingUp && this.y > 0) {
      this.y -= 1;
    } else if (this.isMovingDown && this.y < this.p5.height - 30) {
      this.y += 1;
    }
    this.updateBullets(invaders);
  }

  updateBullets(invaders: Invaders) {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      this.bullets[i].update();
      if (this.hasHitAlien(this.bullets[i], invaders)) {
        this.bullets.splice(i, 1);
        this.score += 10;
        break;
      } else if (this.bullets[i].isOffScreen()) {
        this.bullets.splice(i, 1);
        break;
      }
    }
  }

  pauseGame(tokenId: '1' | '2') {
    this.gamePaused = true;
    this.showNft(tokenId);
  }  

  resumeGame() {
    this.gamePaused = false;
    this.resumeCount++;
    if (this.resumeCount === 2) {
      this.upgradeSpaceship();
    }
  }

  moveLeft() {
    this.isMovingRight = false;
    this.isMovingLeft = true;
  }

  moveRight() {
    this.isMovingLeft = false;
    this.isMovingRight = true;
  }

  moveUp() {
    this.isMovingUp = true;
    this.isMovingDown = false;
  }

  moveDown() {
    this.isMovingUp = false;
    this.isMovingDown = true;
  }

  shoot() {
    const bulletOffset = 5;
    if (this.bullets.length < this.maxBullets) {
      this.bullets.push(new PlayerBullet(this.x + this.r, this.y, this.playerIsUp(), this.p5));

      if (this.maxBullets > 2) {
        this.bullets.push(new PlayerBullet(this.x - this.r + bulletOffset * 2, this.y, this.playerIsUp(), this.p5));
      }
    }
  }

  draw() {
    this.p5.image(this.image, this.x, this.y, this.r * 2, this.r * 2);
    this.drawBullets();
    this.drawGas();

    if (this.score == 50 && !this.nftShown['1']) {
      this.gamePaused = true;
      this.pauseGame('1');
    } else if (this.score == 100 && !this.nftShown['2']) {
      this.gamePaused = true;
      this.pauseGame('2');
    }
  }

  drawBullets() {
    for (let bullet of this.bullets) {
      bullet.draw(this.p5);
    }
  }
  

  drawGas() {
    let blocks = 8;
    let blockW = this.r / 2;
    let blockH = this.r / 3;

    for (let i = 0; i < blocks; i++) {
      let currentW = blockW - i + 2;
      let px = this.x + blockW * 2 - currentW / 2;
      if (this.isMovingLeft === true) {
        px += 2 * i + 1;
      } else if (this.isMovingRight === true) {
        px -= 2 * i + 1;
      }

      this.p5.fill(245, this.p5.random(150, 220), 66);
      this.p5.rect(px + this.p5.random(-2, 2), this.y + this.r * 2 + i * blockH + 4 + this.p5.random(-2, 2), currentW, blockH);
    }
  }

  drawLives(t_width: number) {
    for (let i = 0; i < this.lives; i++) {
      this.p5.image(this.image, this.p5.width - (i + 1) * 30, 10, this.r * 2, this.r * 2);
    }
  }

  drawInfo() {
    this.p5.fill(255);
    let bounty_text = window?.userProfile?.email + ": ";
    let bounty_text_w = this.p5.textWidth(bounty_text);
    this.p5.text(bounty_text, 50, 25);
    this.p5.push();
    this.p5.fill(100, 255, 100);
    this.p5.text(this.score, bounty_text_w + 50, 25);
    this.p5.pop();
    this.drawLives(bounty_text_w + this.p5.textWidth(this.score.toString()) + 100);
  }

  hasHitAlien(bullet: PlayerBullet, invaders: Invaders): boolean {
    return invaders.checkCollision(bullet.x, bullet.y);
  }

  playerIsUp(): boolean {
    return this.y > this.invaders.aliens[0].y;
  }

  loseLife() {
    if (this.lives > 0) {
      this.respawn();
    }
  }
}

export default Player;
