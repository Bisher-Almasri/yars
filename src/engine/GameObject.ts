import type { ObjectId } from "../types";
import { Transform } from "./Transform";

export abstract class GameObject {
  readonly id: ObjectId;
  public transform: Transform;

  active = true;
  constructor(transform: Transform) {
    this.id = crypto.randomUUID();
    this.transform = transform;
  }

  update(_dt: number): void {}

  abstract render(ctx: CanvasRenderingContext2D): void;

  destroy(): void {
    this.active = false;
  }
}
