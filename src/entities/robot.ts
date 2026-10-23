import { World, type EventQueue } from "@dimforge/rapier2d-compat";
import { GameObject } from "../engine/GameObject";
import mecanumKinematics from "../physics/mecanum";
import drawRobot from "../render/drawRobot";
import type { GamePiece, WheelPowers } from "../types";
import { robotCentricDrive } from "../utils/mecanumDrive";
import RAPIER from "@dimforge/rapier2d-compat";
import { gamePiece } from "./gamepiece";

export class Robot extends GameObject {
  wheelPowers: WheelPowers = {
    leftFront: 0,
    rightFront: 0,
    leftBack: 0,
    rightBack: 0,
  };

  private robotSize = 18 * 6;

  public robotStorage: gamePiece[] = [];

  name = "Robot"

  public intakeCollider!: RAPIER.Collider;

  drive(forward: number, strafe: number, rotate: number) {
    this.wheelPowers = robotCentricDrive(forward, strafe, rotate);
  }

  update(dt: number, eventQueue: EventQueue, physicsWorld: RAPIER.World): void {
    if (!this.body) return
    
    super.update(dt, eventQueue, physicsWorld)

    const {forward, strafe, rotate} = mecanumKinematics(this.wheelPowers, 400, 7);

    const heading = this.body.rotation()

    this.body.setLinvel({
        x: forward * Math.sin(heading) + strafe * Math.cos(heading),
        y: -forward * Math.cos(heading) + strafe * Math.sin(heading)
      },
      true
    )

    this.body.setAngvel(rotate, true)
    
    eventQueue.drainCollisionEvents((handle1: number, handle2: number, started: boolean) => {
      const intakeHandle = this.intakeCollider.handle;

      const otherHandle =
        handle1 === intakeHandle ? handle2 :
        handle2 === intakeHandle ? handle1 :
        undefined;

      if (started && otherHandle != undefined) {
        const otherCollider = physicsWorld.getCollider(otherHandle)
        const otherObject = otherCollider.parent()!.userData as gamePiece 

        if (otherObject.name == "Game Piece" && this.robotStorage.length <= 4) {
          this.robotStorage.push(otherObject);
          otherObject.destroy()
        }
        
      }
    })
  }
  
  render(ctx: CanvasRenderingContext2D): void {
    drawRobot(ctx, this.transform, this.robotStorage[0]?.gP.color);
  }

  initPhysics(physicsWorld: World): void {
    let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(this.transform.x, this.transform.y)
      .setLinearDamping(2.0)
      .setAngularDamping(1.0)

    this.body = physicsWorld.createRigidBody(rigidBodyDesc);
    this.body.userData = this

    const intakeY = this.robotSize / 2 - 6 - 14 / 2 + 6;

    let intakeColliderDesc = RAPIER.ColliderDesc.cuboid(45, 7.5)
      .setTranslation(0, intakeY)
      .setSensor(true)
      .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)

    let colliderDesc = RAPIER.ColliderDesc.cuboid(this.robotSize/2+2, this.robotSize/2+2)

    physicsWorld.createCollider(colliderDesc, this.body)

    this.intakeCollider = physicsWorld.createCollider(intakeColliderDesc, this.body)
  }

}
