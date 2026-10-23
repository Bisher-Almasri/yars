import { type EventQueue } from "@dimforge/rapier2d-compat";
import { GameObject } from "../engine/GameObject";
import mecanumKinematics from "../physics/mecanum";
import drawRobot from "../render/drawRobot";
import type { WheelPowers } from "../types";
import { robotCentricDrive } from "../utils/mecanumDrive";
import RAPIER from "@dimforge/rapier2d-compat";
import { gamePiece } from "./gamepiece";
import { Transform } from "../engine/Transform";
import type { World } from "../engine/World";

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

  private shootCooldown = 0;
  private readonly shootInterval = 0.15;
  public target!: Transform;

  drive(forward: number, strafe: number, rotate: number) {
    this.wheelPowers = robotCentricDrive(forward, strafe, rotate);
  }

  shoot(world: World) {
    if (this.shootCooldown > 0) return;
    if (this.robotStorage.length <= 0) return

    const objShoot = this.robotStorage.shift()!;
    objShoot.active = true

    const turretLocalY = 6 * 6 - 56;
    const cos = Math.cos(this.transform.rotation);
    const sin = Math.sin(this.transform.rotation);
    const turretX = this.transform.x - turretLocalY * sin;
    const turretY = this.transform.y + turretLocalY * cos;

    const dx = this.target.x - turretX;
    const dy = this.target.y - turretY;

    const distance = Math.hypot(dx, dy);
    if (distance === 0) return;

    const directionX = dx / distance;
    const directionY = dy / distance;
    const muzzleDistance = 28;

    objShoot.transform.setTransform(
      new Transform(
        turretX + directionX * muzzleDistance,
        turretY + directionY * muzzleDistance,
        1,
        0
      )
    );

    world.add(objShoot);

    const speed = 6000;

    const vx = directionX * speed;
    const vy = directionY * speed;

    objShoot.body!.setLinvel({ x: vx, y: vy }, true);
    this.shootCooldown = this.shootInterval
  }

  update(dt: number, eventQueue: EventQueue, physicsWorld: RAPIER.World): void {
    if (!this.body) return

    this.shootCooldown = Math.max(0, this.shootCooldown - dt)
    
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

        if (otherObject.name == "Game Piece" && this.robotStorage.length < 4) {
          if (this.robotStorage.includes(otherObject)) return;
          if (otherObject.body) {
            physicsWorld.removeRigidBody(otherObject.body);
            otherObject.body = undefined;
          }
          otherObject.destroy()
          this.robotStorage.push(otherObject);
          console.log(this.robotStorage.length)
        }
        
      }
    })
  }
  
  render(ctx: CanvasRenderingContext2D): void {
    this.target = new Transform(ctx.canvas.width / 2, ctx.canvas.height / 2)
    drawRobot(ctx, this.transform, this.target,this.robotStorage[0]?.gP.color);
  }

  initPhysics(physicsWorld: RAPIER.World): void {
    let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(this.transform.x, this.transform.y)
      .setLinearDamping(2.0)
      .setAngularDamping(1.0)

    this.body = physicsWorld.createRigidBody(rigidBodyDesc);
    this.body.userData = this

    const intakeY = this.robotSize / 2 - 6 - 14 / 2 + 6;

    let intakeColliderDesc = RAPIER.ColliderDesc.cuboid(45, 8)
      .setTranslation(0, intakeY)
      .setSensor(true)
      .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)

    let colliderDesc = RAPIER.ColliderDesc.cuboid(this.robotSize/2+2, this.robotSize/2+2)

    physicsWorld.createCollider(colliderDesc, this.body)

    this.intakeCollider = physicsWorld.createCollider(intakeColliderDesc, this.body)
  }

}
