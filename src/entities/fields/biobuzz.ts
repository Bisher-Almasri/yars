import type { World } from "@dimforge/rapier2d-compat";
import { Field } from "../field";
import RAPIER from "@dimforge/rapier2d-compat";

export class biobuzzField extends Field {
    private goalSize = 18*6
    render(ctx: CanvasRenderingContext2D): void {
        super.render(ctx)

        ctx.strokeStyle = "#ED1C25"
        ctx.save()
        ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2)
        ctx.strokeRect(-this.goalSize/2, -this.goalSize/2, this.goalSize, this.goalSize)
        ctx.restore()
    }

    initPhysics(physicsWorld: World): void {
        super.initPhysics(physicsWorld);

        // const topWall = RAPIER.ColliderDesc.cuboid(this.fieldHalf, 2).setTranslation(0, -this.fieldHalf)
        // const bottomWall = RAPIER.ColliderDesc.cuboid(this.fieldHalf, 2).setTranslation(0, this.fieldHalf)
        // const leftWall = RAPIER.ColliderDesc.cuboid(2, this.fieldHalf).setTranslation(-this.fieldHalf, 0)
        // const rightWall = RAPIER.ColliderDesc.cuboid(2, this.fieldHalf).setTranslation(this.fieldHalf, 0)

        // physicsWorld.createCollider(topWall, this.body);
        // physicsWorld.createCollider(bottomWall, this.body);
        // physicsWorld.createCollider(leftWall, this.body);
        // physicsWorld.createCollider(rightWall, this.body);

        const topGoal = RAPIER.ColliderDesc.cuboid(this.goalSize/2, 1).setTranslation(0, -this.goalSize/2);
        const bottomGoal = RAPIER.ColliderDesc.cuboid(this.goalSize/2, 1).setTranslation(0, this.goalSize/2);
        const leftGoal = RAPIER.ColliderDesc.cuboid(1, this.goalSize/2).setTranslation(-this.goalSize/2, 0);
        const rightGoal = RAPIER.ColliderDesc.cuboid(1, this.goalSize/2).setTranslation(this.goalSize/2, 0);

        physicsWorld.createCollider(topGoal, this.body)
        physicsWorld.createCollider(bottomGoal, this.body)
        physicsWorld.createCollider(leftGoal, this.body)
        physicsWorld.createCollider(rightGoal, this.body)
    }

}