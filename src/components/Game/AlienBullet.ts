import Bullet from "./Bullet";
import p5 from "p5";
import Player from "./Player";

class AlienBullet extends Bullet {
  r: number;
  
  constructor(x: number, y: number) {
    super(x, y);
    this.r = 2;
  }

  update() {
    this.y += 2;
  }

  hasHitPlayer(player: Player, p: p5): boolean {
    if (
      p.dist(this.x, this.y, player.x, player.y) <
      this.r + player.r
    ) {
      return true;
    }
    return false;
  }
}

export default AlienBullet;
