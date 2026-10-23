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

    render(ctx: CanvasRenderingContext2D): void {
        drawGamePiece(ctx, this.transform.x, this.transform.y, this.gP)
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
