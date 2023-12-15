import p5 from "p5";
import Player from "./Player";

class Alien {
  x: number;
  y: number;
  r: number;
  image: p5.Image;

  constructor(x: number, y: number, image: p5.Image) {
    this.x = x;
    this.y = y;
    this.r = 10;
    this.image = image;
  }

  draw(p: p5) {
    p.image(this.image, this.x, this.y, this.r * 2, this.r * 2);
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

export default Alien;
