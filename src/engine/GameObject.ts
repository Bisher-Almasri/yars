import type { World } from "@dimforge/rapier2d-compat";
import type { ObjectId } from "../types";
import { Transform } from "./Transform";
import type RAPIER from "@dimforge/rapier2d-compat";

export abstract class GameObject {
  readonly id: ObjectId;
  public transform: Transform;
  public body?: RAPIER.RigidBody;
  public name: string = "unassigned";

  public active = true;
  constructor(transform: Transform) {
    this.id = crypto.randomUUID();
    this.transform = transform;
  }

  update(_dt: number, _eventQueue: RAPIER.EventQueue, _physicsWorld: RAPIER.World): void {
    if (this.body) {
      let translation = this.body.translation();
      this.transform.x = translation.x
      this.transform.y = translation.y
      this.transform.rotation = this.body.rotation()
    }
  }

  abstract render(ctx: CanvasRenderingContext2D): void;
  abstract initPhysics(physicsWorld: World): void;

  destroy(): void {
    this.active = false;
  }
}
