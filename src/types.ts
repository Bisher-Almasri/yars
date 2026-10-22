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

export type Collider =
  | {
      type: "circle";
      radius: number;
    }
  | {
      type: "rectangle";
      width: number;
      height: number;
    };


export type GamePiece = {
    radius: number,
    color: string
}