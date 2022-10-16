import { getCanvasDims } from "@/utils/constants";
import p5Base from "p5";
import { FitnessFunctions, PSO } from "@/libs/models/pso";
import SketchBase from "../SketchBase";
import { ParticleView } from "@/components/sketch-elements/ParticleView";
import { TargetView } from "@/components/sketch-elements/TargetView";
import { RobotView } from "@/components/sketch-elements/RobotView";
import { RobotPhase } from "@/types/common";
import { RobotModel } from "@/libs/general-state";
import p5 from "p5";
import { PathView } from "@/components/sketch-elements/PathView";
import { SearchingCircleView } from "@/components/sketch-elements/SearchingCircleView";

const { CANVAS_WIDTH, CANVAS_HEIGHT } = getCanvasDims();

class PathFinding extends SketchBase {
  colors: Record<string, string>;
  model: PSO | undefined;
  robotModel: RobotModel | undefined;
  target: p5Base.Vector | undefined;
  localTarget: p5Base.Vector | undefined;
  robotPhase: RobotPhase = "searching";
  path: p5.Vector[] = [];
  config = {
    "Inertia Start": 1,
    "Inertia End": 0.99,
    "c-1": 1.05,
    "c-2": 0.05,
    "Particle Spawn Density": 150,
    "Particle Count": 20,
    "Max Initial Particle Speed": 2,
    "Max Epoch": 1000,
    "Target Distance Threshold": 5,
    "Robot Speed": 0.15,
    "Vision Radius": 200,
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
      searchingCircleStroke: getComputedStyle(
        document.documentElement
      ).getPropertyValue("--text-disabled"),
      searchingCircleFill: getComputedStyle(
        document.documentElement
      ).getPropertyValue("--border-color"),
      particle: getComputedStyle(document.documentElement).getPropertyValue(
        "--secondary"
      ),
      particleOutOfBound: getComputedStyle(
        document.documentElement
      ).getPropertyValue("--secondary-v2"),
      target: getComputedStyle(document.documentElement).getPropertyValue(
        "--primary"
      ),
      robot: getComputedStyle(document.documentElement).getPropertyValue(
        "--asset"
      ),
      path: getComputedStyle(document.documentElement).getPropertyValue(
        "--brand"
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

    // Path initialization
    this.path.push(p5.createVector(100, 100));

    // Robot creation
    this.robotModel = new RobotModel(
      this.path[0].copy(),
      this.config["Robot Speed"]
    );

    /**
     * * Initial paint with initial positions of particles and target
     * * based on model initialization
     */
    p5.background(this.colors!.background);

    TargetView(p5, this.target, this.colors.target);

    RobotView(p5, this.robotModel!.position, this.colors.robot);
  }

  draw(p5: p5Base) {
    switch (this.robotPhase) {
      case "searching": {
        if (!this.model) {
          /**
           * * If no model is created, we create one
           */
          this.model = new PSO(
            this.config["Particle Count"],
            this.config["Particle Spawn Density"],
            this.robotModel?.position!,
            this.config["Max Initial Particle Speed"],
            FitnessFunctions.distanceFromTargetWithinVision(
              this.robotModel?.position!,
              this.config["Vision Radius"],
              this.target!,
              0,
              p5.width,
              0,
              p5.height
            ),
            this.config
          );
        } else {
          if (!this.model?.hasReachedOptima) {
            /**
             * * If model is created, we update it provided it has not reached the optima
             */
            this.model?.nextEpoch(
              p5.deltaTime * this.config["Simulation Speed"]
            );
          } else {
            /**
             * * If it has reached optima then we set the local target to the best particle,
             * * remove the model
             */
            this.localTarget = this.model?.bestGlobalPosition;
            this.path.push(this.localTarget!.copy());
            this.model = undefined;
            this.robotPhase = "moving";
          }
        }
        break;
      }
      case "moving": {
        if (this.robotModel?.moveTo(this.localTarget!, p5.deltaTime)) {
          if (
            this.robotModel?.position.dist(this.target!) <
            this.config["Target Distance Threshold"]
          ) {
            this.robotPhase = "reached";
          } else {
            this.robotPhase = "searching";
          }
        }
        break;
      }
      case "reached": {
        this.model = undefined;
        break;
      }
      default:
        console.error("Invalid robot phase");
    }

    // Render
    p5.background(this.colors!.background);

    this.model && this.showScore(p5);

    this.robotPhase === "reached" && this.showCompletionMessage(p5);

    this.robotPhase === "searching" &&
      SearchingCircleView(
        p5,
        this.robotModel?.position!,
        this.config["Vision Radius"],
        this.colors.searchingCircleStroke,
        this.colors.searchingCircleFill
      );

    PathView(p5, this.path, this.colors.path);

    TargetView(p5, this.target!, this.colors.target);

    RobotView(p5, this.robotModel!.position, this.colors.robot);

    this.model?.particles.forEach((particle) => {
      ParticleView(
        p5,
        particle.position,
        particle.outOfBounds
          ? this.colors.particleOutOfBound
          : this.colors.particle
      );
    });
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

  showCompletionMessage(p5: p5Base) {
    p5.noStroke();
    p5.fill(this.colors.text);
    p5.text("Target Reached", 10, 20);
  }
}

export { PathFinding as default };
