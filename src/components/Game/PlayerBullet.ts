import Bullet from "./Bullet";
import p5 from "p5";

class PlayerBullet extends Bullet {
  up: boolean;
  p5: p5;

  constructor(x: number, y: number, up: boolean, p5: p5) {
    super(x, y);
    this.up = up;
    this.p5 = p5;
  }

  update() {
    if (this.up) {
      this.y -= 6;
    } else {
      this.y += 6;
    }
  }

  isOffScreen(): boolean {
    if (this.y < 0 || this.y > this.p5.height) {
      return true;
    } else {
      return false;
    }
  }
}

export default PlayerBullet;
