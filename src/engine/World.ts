import RAPIER, { EventQueue } from "@dimforge/rapier2d-compat";
import type { GameObject } from "./GameObject";

export class World {
  private objects = new Map<string, GameObject>();
  public physicsWorld: RAPIER.World;
  public eventQueue: RAPIER.EventQueue = new RAPIER.EventQueue(true);

  constructor() {
    const gravity = new RAPIER.Vector2(0, 0);
    this.physicsWorld = new RAPIER.World(gravity);
  }

  add<T extends GameObject>(gameObject: T): T {
    this.objects.set(gameObject.id, gameObject);
    gameObject.initPhysics(this.physicsWorld);
    return gameObject;
  }

  addGroup<T extends GameObject>(...gameObjects: T[]) {
    gameObjects
      .sort((a, b) => a.transform.z - b.transform.z)
      .forEach((gameObject) => this.add(gameObject));
  }

  remove(id: string) {
    this.objects.delete(id);
  }
  get<T extends GameObject>(id: string): T | undefined {
    return this.objects.get(id) as T | undefined;
  }

  update(dt: number, eventQueue: EventQueue) {
    this.physicsWorld.timestep = dt;
    this.physicsWorld.step(this.eventQueue);

    this.objects.forEach((gameObject) => {
      if (gameObject.active)
        gameObject.update(dt, eventQueue, this.physicsWorld);

      if (gameObject.children)
        gameObject.children.forEach((child) => {
          child.update(dt, eventQueue, this.physicsWorld);
        });
    });
  }

  render(ctx: CanvasRenderingContext2D) {
    [...this.objects.values()]
      .filter((gameObject) => gameObject.active)
      .sort((a, b) => a.transform.z - b.transform.z)
      .forEach((gameObject) => {
        gameObject.renderIfNeeded(ctx);

        if (gameObject.children) {
          [...gameObject.children.values()]
            .filter((child) => child.active)
            .sort((a, b) => a.transform.z - b.transform.z)
            .forEach((child) => child.renderIfNeeded(ctx));
        }
      });

    this.renderDebug(ctx)
  }

  private renderDebug(ctx: CanvasRenderingContext2D) {
    const buffers = this.physicsWorld.debugRender();
    const vtx = buffers.vertices;
    const cls = buffers.colors;

    ctx.save();

    for (let i = 0; i < vtx.length / 4; i++) {
      const x1 = vtx[i * 4];
      const y1 = vtx[i * 4 + 1];
      const x2 = vtx[i * 4 + 2];
      const y2 = vtx[i * 4 + 3];

      const r = Math.floor(cls[i * 8] * 255);
      const g = Math.floor(cls[i * 8 + 1] * 255);
      const b = Math.floor(cls[i * 8 + 2] * 255);
      const a = cls[i * 8 + 3];

      ctx.beginPath();
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
      ctx.lineWidth = 1;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    ctx.restore();
  }
  getAll(): GameObject[] {
    return [...this.objects.values()];
  }
}
