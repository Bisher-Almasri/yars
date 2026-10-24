import { World } from "@dimforge/rapier2d-compat";
import { GameObject } from "../engine/GameObject";
import { drawGamePiece } from "../render/drawGamePiece";
import type { GamePiece } from "../types";
import RAPIER from "@dimforge/rapier2d-compat";

export class gamePiece extends GameObject {
    public gP: GamePiece = {
        radius: 1.4*6,
        color: "#FFE400"
    };

    name = "Game Piece"

    private verticalVelocity = 0;
    private readonly gravity = 980;
    private airborne = false;

    launch(verticalVelocity: number) {
        this.transform.z = 1;
        this.verticalVelocity = verticalVelocity
        this.airborne = true;
    }

    update(dt: number, eventQueue: RAPIER.EventQueue, physicsWorld: RAPIER.World): void {
        super.update(dt, eventQueue, physicsWorld)

        if (!this.airborne) return;

        this.verticalVelocity -= this.gravity * dt;
        this.transform.z += this.verticalVelocity * dt;

        if (this.transform.z <= 0) {
            this.transform.z = 0;
            this.verticalVelocity = 0
            this.airborne = false
        }
    }
    render(ctx: CanvasRenderingContext2D): void {
        drawGamePiece(ctx, this.transform, this.gP)
    }

    initPhysics(physicsWorld: World): void {
        let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(this.transform.x, this.transform.y)
            .setLinearDamping(1.5)
            .setCcdEnabled(true)
        
        this.body = physicsWorld.createRigidBody(rigidBodyDesc)
        this.body.userData = this

        let collider = RAPIER.ColliderDesc.ball(this.gP.radius)
            .setRestitution(0.4)
        
        physicsWorld.createCollider(collider, this.body)
    }
}
