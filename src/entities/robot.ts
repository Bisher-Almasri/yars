import type { World } from "@dimforge/rapier2d-compat";
import { GameObject } from "../engine/GameObject";
import mecanumKinematics from "../physics/mecanum";
import drawRobot from "../render/drawRobot";
import type { WheelPowers } from "../types";
import { robotCentricDrive } from "../utils/mecanumDrive";
import RAPIER from "@dimforge/rapier2d-compat";

export class Robot extends GameObject {
  wheelPowers: WheelPowers = {
    leftFront: 0,
    rightFront: 0,
    leftBack: 0,
    rightBack: 0,
  };

  private robotSize = 18 * 6;

  drive(forward: number, strafe: number, rotate: number) {
    this.wheelPowers = robotCentricDrive(forward, strafe, rotate);
  }

  update(dt: number): void {
    if (!this.body) return
    
    super.update(dt)

    const {forward, strafe, rotate} = mecanumKinematics(this.wheelPowers, 400, 7);

    const heading = this.body.rotation()

    this.body.setLinvel({
      x: forward * Math.sin(heading) + strafe * Math.cos(heading),
      y: -forward * Math.cos(heading) + strafe * Math.sin(heading)
    },
    true
  )

  this.body.setAngvel(rotate, true)
  
  }
  render(ctx: CanvasRenderingContext2D): void {
    drawRobot(ctx, this.transform);
  }

  initPhysics(physicsWorld: World): void {
    let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(this.transform.x, this.transform.y)
      .setLinearDamping(2.0)
      .setAngularDamping(1.0)

    this.body = physicsWorld.createRigidBody(rigidBodyDesc);

    let colliderDesc = RAPIER.ColliderDesc.cuboid(this.robotSize/2, this.robotSize/2)

    physicsWorld.createCollider(colliderDesc, this.body)
  }

}
