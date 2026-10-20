import type { GameObject } from "./GameObject";

export class World {
  private objects = new Map<string, GameObject>();

  add<T extends GameObject>(gameObject: T): T {
    this.objects.set(gameObject.id, gameObject);
    return gameObject;
  }

  remove(id: string) {
    this.objects.delete(id);
  }
  get<T extends GameObject>(id: string): T | undefined {
    return this.objects.get(id) as T | undefined;
  }

  update(dt: number) {
    this.objects.forEach((gameObject) => {
      if (gameObject.active) gameObject.update(dt);
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
