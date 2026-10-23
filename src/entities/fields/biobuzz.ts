import type { Transform } from "../../engine/Transform";

export function biobuzzField(ctx: CanvasRenderingContext2D, center: Transform) {
    ctx.translate(center.x, center.y)
    ctx.rotate(center.rotation)
}