import type { World } from "@dimforge/rapier2d-compat";
import { Field } from "../field";
import { drawBiobuzzField } from "../../render/fields/biobuzz";

export class biobuzzField extends Field {
  private decorationsInitialized = false;

  render(ctx: CanvasRenderingContext2D): void {
    super.render(ctx);
    drawBiobuzzField(
      ctx,
      this.transform,
      this.decorationsInitialized ? undefined : this,
    );
    this.decorationsInitialized = true;
  }

  initPhysics(physicsWorld: World): void {
    super.initPhysics(physicsWorld);
  }
}
