import p5 from "p5";
import Player from "./Player";

class Debris {
  x!: number;
  y!: number;
  r: number;
  isGoingLeft!: boolean;
  p5: p5;

  constructor(p5: p5) {
    this.p5 = p5;
    this.r = 5;
    this.resetDebris();
  }

  resetDebris() {
    this.y = this.p5.random(this.p5.height - 10);
    this.r = this.p5.random(5, 10);

    let spawnLeftSide = this.p5.random(1) < 0.5;

    if (spawnLeftSide) {
      this.x = this.p5.random(-this.p5.width, 0);
      this.isGoingLeft = false;
    } else {
      this.x = this.p5.random(this.p5.width, this.p5.width * 2);
      this.isGoingLeft = true;
    }
  }

  update() {
    if (this.isGoingLeft) {
      this.x--;
    } else {
      this.x++;
    }

    if (this.isOffScreen()) {
      this.resetDebris();
    }
  }

  isOffScreen(): boolean {
    if (this.isGoingLeft && this.x < -5) {
      return true;
    } else if (!this.isGoingLeft && this.x > this.p5.width + 5) {
      return true;
    }
    return false;
  }

  display() {
    this.p5.fill(100);
    this.p5.noStroke();
    this.p5.ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }

  hasHitPlayer(player: Player): boolean {
    if (
      this.p5.dist(this.x, this.y, player.x, player.y) <
      this.r + player.r
    ) {
      return true;
    }
    return false;
  }
}

export default Debris;
