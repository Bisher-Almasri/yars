export class Transform {
  public x: number;
  public y: number;
  public rotation: number;

  constructor(x = 0, y = 0, rotation = 0) {
    this.x = x;
    this.y = y;
    this.rotation = rotation;
  }

  transform(moveX: number, moveY: number) {
    (this.x += moveX), (this.y += moveY);
  }
  rotate(rot: any) {
    this.rotate(rot);
  }
}
