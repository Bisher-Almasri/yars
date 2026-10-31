export const COLLISION_GROUP = {
  world: 1 << 0,
  ball: 1 << 1,
  robot: 1 << 2,
  hive: 1 << 3,
} as const;

export const WORLD_COLLISION_GROUPS =
  COLLISION_GROUP.world | COLLISION_GROUP.ball | COLLISION_GROUP.robot;

export const BALL_COLLISION_GROUPS =
  COLLISION_GROUP.world |
  COLLISION_GROUP.ball |
  COLLISION_GROUP.robot |
  COLLISION_GROUP.hive;

export const ROBOT_COLLISION_GROUPS =
  COLLISION_GROUP.world | COLLISION_GROUP.ball | COLLISION_GROUP.robot;

const hiveInteriorHandles = new Set<number>();

export function collisionGroups(membership: number, filter: number): number {
  return membership | (filter << 16);
}

export function registerHiveInterior(handle: number): void {
  hiveInteriorHandles.add(handle);
}

export function isHiveInterior(handle: number): boolean {
  return hiveInteriorHandles.has(handle);
}
