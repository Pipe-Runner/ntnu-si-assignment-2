import p5 from "p5";
import { random2DinUnitCircle, randomUnit } from "../utils/helper";

export class ParticleModel {
  constructor(
    public position: p5.Vector,
    public velocity: p5.Vector,
    public bestPosition: p5.Vector,
    public bestFitness: number,
    // TODO: REMOVE ADDED FOR DEBUGGING
    public outOfBounds?: boolean
  ) {}

  updatePosition(newPos: p5.Vector) {
    this.position = newPos;
  }

  updateVelocity(newVel: p5.Vector) {
    this.velocity = newVel;
  }
}

export class PSO {
  public particles: ParticleModel[];
  public bestGlobalPosition: p5.Vector | undefined;
  public bestGlobalFitness: number = Number.MIN_SAFE_INTEGER;
  public currentEpoch = 0;
  public hasReachedOptima = false;

  constructor(
    particleCount: number,
    particleSpawnDensity: number,
    initialPosition: p5.Vector,
    private maxParticleSpeed: number,
    private fitnessFunction: (pos: p5.Vector) => number,
    private hyperParams: Record<string, number>
  ) {
    this.particles = [];

    for (let i = 0; i < particleCount; i++) {
      const position = random2DinUnitCircle()
        .mult(particleSpawnDensity)
        .add(initialPosition);
      const velocity = randomUnit().mult(this.maxParticleSpeed);
      const bestPosition = position.copy();
      const bestFitness = this.fitnessFunction(bestPosition);

      this.particles.push(
        new ParticleModel(
          position,
          velocity,
          bestPosition,
          bestFitness,
          // TODO: REMOVE ADDED FOR DEBUGGING
          bestFitness === Number.MIN_SAFE_INTEGER
        )
      );

      // Update global best
      if (!this.bestGlobalFitness || bestFitness > this.bestGlobalFitness) {
        this.bestGlobalFitness = bestFitness;
        this.bestGlobalPosition = bestPosition.copy();
      }
    }
  }

  nextEpoch(dt: number) {
    /**
     * * Setting it to original here makes sure if no new best is found, the old one is kept
     */
    let newBestGlobalFitness = this.bestGlobalFitness!;
    let newBestGlobalPosition = this.bestGlobalPosition!;

    // velocity update: v(t+1) and position update d(t+1) and calculating best global fitness
    this.particles.forEach((particle) => {
      const w =
        this.hyperParams["Inertia Start"] -
        (this.hyperParams["Inertia Start"] - this.hyperParams["Inertia End"]) *
          (this.currentEpoch / this.hyperParams["Max Epoch"]);
      const r1 = Math.random();
      const r2 = Math.random();
      const { ["c-1"]: c1, ["c-2"]: c2 } = this.hyperParams;
      const newVel = p5.Vector.sub(particle.bestPosition, particle.position)
        .mult(r1 * c1)
        .add(
          p5.Vector.sub(this.bestGlobalPosition!, particle.position).mult(
            r2 * c2
          )
        )
        .add(p5.Vector.mult(particle.velocity, w));

      particle.updateVelocity(newVel);

      const newPos = p5.Vector.mult(particle.velocity, dt).add(
        particle.position
      );

      particle.updatePosition(newPos);

      const newFitness = this.fitnessFunction(newPos);

      // TODO: REMOVE ADDED FOR DEBUGGING
      if (newFitness === Number.MIN_SAFE_INTEGER) {
        particle.outOfBounds = true;
      } else {
        particle.outOfBounds = false;
      }

      if (newFitness > particle.bestFitness) {
        particle.bestFitness = newFitness;
        particle.bestPosition = newPos.copy();
      }

      if (newBestGlobalFitness < newFitness) {
        newBestGlobalFitness = this.fitnessFunction(newPos);
        newBestGlobalPosition = newPos.copy();
      }
    });

    this.bestGlobalFitness = newBestGlobalFitness;
    this.bestGlobalPosition = newBestGlobalPosition;
    this.currentEpoch++;

    /**
     * * Termination condition check
     */
    if (
      this.currentEpoch >= this.hyperParams["Max Epoch"] ||
      (this.hyperParams["Fitness Threshold"]
        ? this.bestGlobalFitness >= this.hyperParams["Fitness Threshold"]
        : false)
    ) {
      this.hasReachedOptima = true;
    }
  }
}
