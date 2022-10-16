import { ObstacleModel } from "@/libs/general-state";
import p5 from "p5";

/**
 * Fitness function needs to increase as the particle gets closer to the target.
 * And should decreases as the particle gets farther from the target or gets into unfavourable areas like boundaries.
 */
export class FitnessFunctions {
  static distanceFromTarget =
    (
      targetPosition: p5.Vector,
      lowerBoundX: number,
      upperBoundX: number,
      lowerBoundY: number,
      upperBoundY: number
    ) =>
    (particlePosition: p5.Vector) => {
      if (
        particlePosition.x < lowerBoundX ||
        particlePosition.x > upperBoundX ||
        particlePosition.y < lowerBoundY ||
        particlePosition.y > upperBoundY
      ) {
        return Number.MIN_SAFE_INTEGER;
      }

      return -1 * particlePosition.dist(targetPosition);
    };

  static distanceFromTargetWithinVision =
    (
      initialPosition: p5.Vector,
      visionRadius: number,
      targetPosition: p5.Vector,
      lowerBoundX: number,
      upperBoundX: number,
      lowerBoundY: number,
      upperBoundY: number
    ) =>
    (particlePosition: p5.Vector) => {
      if (
        particlePosition.x < lowerBoundX ||
        particlePosition.x > upperBoundX ||
        particlePosition.y < lowerBoundY ||
        particlePosition.y > upperBoundY
      ) {
        return Number.MIN_SAFE_INTEGER;
      }

      if (particlePosition.dist(initialPosition) > visionRadius) {
        return Number.MIN_SAFE_INTEGER;
      }

      return -1 * particlePosition.dist(targetPosition);
    };

  static distanceFromTargetWithinVisionAvoidObstacles =
    (
      initialPosition: p5.Vector,
      visionRadius: number,
      targetPosition: p5.Vector,
      obstacles: ObstacleModel[],
      lowerBoundX: number,
      upperBoundX: number,
      lowerBoundY: number,
      upperBoundY: number
    ) =>
    (particlePosition: p5.Vector) => {
      if (
        particlePosition.x < lowerBoundX ||
        particlePosition.x > upperBoundX ||
        particlePosition.y < lowerBoundY ||
        particlePosition.y > upperBoundY
      ) {
        return Number.MIN_SAFE_INTEGER;
      }

      if (particlePosition.dist(initialPosition) > visionRadius) {
        return Number.MIN_SAFE_INTEGER;
      }

      for (const obstacle of obstacles) {
        if (obstacle.isObstructingMovement(initialPosition, particlePosition)) {
          return Number.MIN_SAFE_INTEGER;
        }
      }

      return -(
        particlePosition.dist(targetPosition) +
        (obstacles.length === 0
          ? 0
          : 0.3 * particlePosition.dist(initialPosition))
      );
    };
}
