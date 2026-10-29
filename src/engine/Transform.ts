export class Transform {
  public x: number;
  public y: number;
  public z: number;
  public rotation: number;

  constructor(x = 0, y = 0, z = 0, rotation = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.rotation = rotation;
  }

  setTransform(transform: Transform) {
    this.x = transform.x;
    this.y = transform.y;
    this.z = transform.z;
    this.rotation = transform.rotation;
  }
}
