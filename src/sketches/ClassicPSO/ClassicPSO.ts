import { getCanvasDims } from "@/utils/constants";
import p5Base from "p5";
import { FitnessFunctions, PSO } from "@/libs/models/pso";
import SketchBase from "../SketchBase";
import { ParticleView } from "@/components/sketch-elements/ParticleView";
import { TargetView } from "@/components/sketch-elements/TargetView";

const { CANVAS_WIDTH, CANVAS_HEIGHT } = getCanvasDims();

class ClassicPSO extends SketchBase {
  colors: Record<string, string>;
  model: PSO | undefined;
  target: p5Base.Vector | undefined;
  config = {
    "Inertia Start": 1,
    "Inertia End": 0.99,
    "c-1": 1.05,
    "c-2": 0.05,
    "Particle Spawn Density": 150,
    "Particle Count": 50,
    "Max Initial Particle Speed": 2,
    "Max Epoch": 10000,
    "Fitness Threshold": -10,
    "Simulation Speed": 0.0001,
  };
  // min max step
  // 0.00001, 0.001, 0.00001

  constructor(canvasContainer: HTMLElement) {
    super(canvasContainer);

    // Color pallet creation
    this.colors = {
      background: getComputedStyle(document.documentElement).getPropertyValue(
        "--2dp"
      ),
      particle: getComputedStyle(document.documentElement).getPropertyValue(
        "--secondary"
      ),
      target: getComputedStyle(document.documentElement).getPropertyValue(
        "--primary"
      ),
      text: getComputedStyle(document.documentElement).getPropertyValue(
        "--text-medium"
      ),
    };
  }

  setup(p5: p5Base) {
    const canvas = p5.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.parent(this.canvasContainer);

    // Target creation
    this.target = p5.createVector(p5.width - 100, p5.height - 100);

    // Model creation
    this.model = new PSO(
      this.config["Particle Count"],
      this.config["Particle Spawn Density"],
      p5.createVector(200, 200),
      this.config["Max Initial Particle Speed"],
      FitnessFunctions.distanceFromTarget(
        this.target,
        0,
        p5.width,
        0,
        p5.height
      ),
      this.config
    );

    /**
     * * Initial paint with initial positions of particles and target
     * * based on model initialization
     */
    p5.background(this.colors!.background);

    this.showScore(p5);

    this.model?.particles.forEach((particle) => {
      ParticleView(p5, particle.position, this.colors.particle);
    });

    if (this.target) {
      TargetView(p5, this.target, this.colors.target);
    }
  }

  draw(p5: p5Base) {
    if (!this.model?.hasReachedOptima)
      this.model?.nextEpoch(p5.deltaTime * this.config["Simulation Speed"]);

    p5.background(this.colors!.background);

    this.showScore(p5);

    this.model?.particles.forEach((particle) => {
      ParticleView(p5, particle.position, this.colors.particle);
    });

    if (this.target) {
      TargetView(p5, this.target, this.colors.target);
    }
  }

  showScore(p5: p5Base) {
    p5.noStroke();
    p5.fill(this.colors.text);
    p5.text(`Best Fitness: ${this.model?.bestGlobalFitness}`, 10, 20);
    p5.fill(this.colors.text);
    p5.text(
      `Epoch: ${this.model?.currentEpoch} / ${this.config["Max Epoch"]}`,
      10,
      40
    );
  }
}

export { ClassicPSO as default };
