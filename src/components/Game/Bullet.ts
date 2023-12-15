import p5 from "p5";

class Bullet {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  draw(p: p5) {
    p.fill(255);
    p.rect(this.x, this.y, 3, 10);
  }
}

export default Bullet;
