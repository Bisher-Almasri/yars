import RAPIER, { EventQueue } from "@dimforge/rapier2d-compat";
import type { GameObject } from "./GameObject";

export class World {
  private objects = new Map<string, GameObject>();
  public physicsWorld: RAPIER.World;
  public eventQueue: RAPIER.EventQueue = new RAPIER.EventQueue(true);

  constructor() {
    const gravity = new RAPIER.Vector2(0, 0)
    this.physicsWorld = new RAPIER.World(gravity)
  }

  add<T extends GameObject>(gameObject: T): T {
    this.objects.set(gameObject.id, gameObject);
    gameObject.initPhysics(this.physicsWorld);
    return gameObject;
  }

  remove(id: string) {
    this.objects.delete(id);
  }
  get<T extends GameObject>(id: string): T | undefined {
    return this.objects.get(id) as T | undefined;
  }

  update(dt: number, eventQueue: EventQueue) {
    this.physicsWorld.timestep = dt;
    this.physicsWorld.step(this.eventQueue)
    
    this.objects.forEach((gameObject) => {
      if (gameObject.active) gameObject.update(dt, eventQueue, this.physicsWorld);
    });
  }

  render(ctx: CanvasRenderingContext2D) {
    this.objects.forEach((gameObject) => {
      if (gameObject.active) gameObject.render(ctx);
    });
  }

  getAll(): GameObject[] {
    return [...this.objects.values()];
  }
}
