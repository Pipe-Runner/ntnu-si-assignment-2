import p5 from "p5";

export class RobotModel {
  constructor(public position: p5.Vector, public speed: number) {}

  /**
   * * Moves the robot to the given vector with the provided speed
   * * Returns a boolean to specify if the robot has reached the target
   */
  moveTo(target: p5.Vector, dt: number): boolean {
    const velocity = p5.Vector.sub(target, this.position)
      .normalize()
      .mult(this.speed);
    this.position.add(p5.Vector.mult(velocity, dt));
    return this.position.dist(target) < 1;
  }
}

export class ObstacleModel {
  /**
   * * Added a threshold of 6 to get a better padding around the obstacle
   */
  static BUFFER = 6;

  constructor(public position: p5.Vector, public radius: number) {}

  isInView(position: p5.Vector, radius: number): boolean {
    return p5.Vector.sub(this.position, position).mag() < radius + this.radius;
  }

  isObstructingMovement(
    robotPosition: p5.Vector,
    predictedPosition: p5.Vector
  ): boolean {
    if (
      p5.Vector.sub(this.position, predictedPosition).mag() <
      this.radius + ObstacleModel.BUFFER
    ) {
      return true;
    }

    const a = p5.Vector.sub(predictedPosition, robotPosition);
    const b = p5.Vector.sub(this.position, robotPosition);
    const bMag = b.mag();
    const aMag = a.mag();
    const cosTheta = b.dot(a) / (bMag * aMag);

    /**
     * * Check if found point on the line is actually between the two initial points
     */
    const l = bMag * cosTheta;
    const pointOnLine = p5.Vector.add(robotPosition, a.mult(l / aMag));

    console.log(
      p5.Vector.sub(pointOnLine, robotPosition).mag(),
      p5.Vector.sub(pointOnLine, predictedPosition).mag(),
      aMag
    );

    /**
     * Done to make the comparison numerically stable in a computer
     */
    const computation = p5.Vector.sub(pointOnLine, robotPosition).mag() +
    p5.Vector.sub(pointOnLine, predictedPosition).mag();

    // checking approximate inequality
    if (
      computation < (aMag - 0.1) || computation > (aMag + 0.1)
    )
      return false;

    const rPrime = bMag * Math.sin(Math.acos(cosTheta));

    return rPrime < this.radius + ObstacleModel.BUFFER;
  }
}
