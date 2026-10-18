export type WheelPowers = {
  leftFront: number;
  rightFront: number;
  leftBack: number;
  rightBack: number;
};

export type Velocity = {
  forward: number;
  strafe: number;
  rotate: number;
};

export type ObjectId = string;

export type Vector2 = {
  x: number;
  y: number
}

export type Transform = {
  position: Vector2;
  rotation: number
}

export type GameObjectKind = 
  | "robot"
  | "gamePiece"
  | "intake"
  | "wall"
  | "goal"

export type GameObject = {
  id: ObjectId;
  kind: GameObjectKind;
  transform: Transform;
  radius: number

  ownerId: object | null;

  parentId: ObjectId | null;

  collider?: Collider
}

export type Collider =
  | {
    type: "circle",
    radius: number
  }
  | {
    type: "rectangle",
    width: number,
    height: number
  }

export type GamePiece = GameObject & {
  kind: "gamePiece",
  pieceType: "ball" | "cube"
  color: string
}

export type Robot = GameObject & {
  kind: "robot",
  intakeId: ObjectId
}