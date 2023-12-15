import Alien from "./Alien";
import AlienBullet from "./AlienBullet";
import p5 from "p5";
import Player from "./Player";

class Invaders {
  alienImage: p5.Image;
  rowsCount: number;
  direction: number;
  y: number;
  aliens: Alien[];
  bullets: AlienBullet[];
  movingDown: boolean;
  speed: number;
  timeSinceLastBullet: number;
  p5: p5;

  constructor(alienImage: p5.Image, p5: p5, rowsCount: number) {
    this.alienImage = alienImage;
    this.rowsCount = rowsCount;
    this.direction = 0;
    this.y = 40;
    this.aliens = this.initialiseAliens();
    this.bullets = [];
    this.movingDown = true;
    this.speed = 0.2;
    this.timeSinceLastBullet = 0;
    this.p5 = p5
  }

  update(player: Player) {
    for (let alien of this.aliens) {
      if (this.direction === 0) {
        alien.x += this.speed;
      } else if (this.direction === 1) {
        alien.x -= this.speed;
      }
      if (alien.hasHitPlayer(player, this.p5)) {
        player.loseLife();
      }
    }

    if (this.hasChangedDirection()) {
      this.moveAlienDown();
    }
    if (this.aliens.length === 0) {
      this.nextLevel();
    }

    if (this.timeSinceLastBullet >= 40) {
      let bottomAliens = this.getBottomAliens();
      if (bottomAliens.length) {
        this.makeABottomAlienShoot(bottomAliens);
      }
    }
    this.timeSinceLastBullet++;

    this.updateBullets(player);
  }

  hasChangedDirection(): boolean {
    for (let alien of this.aliens) {
      if (alien.x >= this.p5.width - 40) {
        this.direction = 1;
        return true;
      } else if (alien.x <= 20) {
        this.direction = 0;
        return true;
      }
    }
    return false;
  }

  moveAlienDown() {
    for (let alien of this.aliens) {
      if (this.movingDown) {
        alien.y += 10;
        if (alien.y >= this.p5.height - 30) {
          this.movingDown = false;
        }
      } else {
        alien.y -= 10;
        if (alien.y <= 0) {
          this.movingDown = true;
        }
      }
    }
  }

  getBottomAliens(): Alien[] {
    let allXPositions = this.getAllXPositions();
    let aliensAtTheBottom: Alien[] = [];
    for (let alienAtX of allXPositions) {
      let bestYPosition = 0;
      let lowestAlien;
      for (let alien of this.aliens) {
        if (alien.x === alienAtX) {
          if (alien.y > bestYPosition) {
            bestYPosition = alien.y;
            lowestAlien = alien;
          }
        }
      }
      if (lowestAlien) {
        aliensAtTheBottom.push(lowestAlien);
      }
    }
    return aliensAtTheBottom;
  }

  getAllXPositions(): number[] {
    let allXPositions: number[] = [];
    for (let alien of this.aliens) {
      allXPositions.push(alien.x);
    }
    return allXPositions;
  }
  
  nextLevel() {
    this.speed += 0.2;
    this.aliens = this.initialiseAliens();
  }

  initialiseAliens(): Alien[] {
    let aliens: Alien[] = [];
    let y = 40;
    const sketchWidth = this.p5.width;
    
    for (let i = 0; i < this.rowsCount; i++) {
      for (let x = 40; x < sketchWidth - 40; x += 30) {
        aliens.push(new Alien(x, y, this.alienImage));
      }
      y += 40;
    }
    return aliens;
  }
  

  draw() {
    for (let bullet of this.bullets) {
      this.p5.fill("#f30000");
      this.p5.rect(bullet.x, bullet.y, 4, 10);
    }

    for (let alien of this.aliens) {
      alien.draw(this.p5);
    }
  }

  checkCollision(x: number, y: number): boolean {
    for (let i = this.aliens.length - 1; i >= 0; i--) {
      let currentAlien = this.aliens[i];
      if (
        this.p5.dist(x, y, currentAlien.x + 11.5, currentAlien.y + 8) < 10
      ) {
        this.aliens.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  makeABottomAlienShoot(bottomAliens: Alien[]) {
    let shootingAlien = this.p5.random(bottomAliens);
    let bullet = new AlienBullet(
      shootingAlien.x + 10,
      shootingAlien.y + 10
    );
    this.bullets.push(bullet);
    this.timeSinceLastBullet = 0;
  }

  updateBullets(player: Player) {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      this.bullets[i].y += 2;
      if (this.bullets[i].hasHitPlayer(player, this.p5)) {
        player.loseLife();
      }
    }
  }  
}

export default Invaders;
