import p5 from "p5";
import p5Base from "p5";

type PlayState = "playing" | "paused" | "stopped";

/**
 * This class takes care of the housekeeping for p5 sketches.
 * It provides a simple interface for starting and stopping sketches and
 * also provides a blueprint for creating new sketches.
 */
abstract class SketchBase {
  protected abstract config: Record<string, number>;
  protected playState: PlayState = "paused";
  protected p5: p5Base | undefined;

  constructor(public canvasContainer: HTMLElement) {}

  abstract setup(p5: p5Base): void;

  abstract draw(p5: p5Base): void;

  start() {
    this.playState = "paused";

    /**
     * * Sketch constructor
     */
    this.p5 = new p5Base((p5) => {
      /**
       * * Binding is needed else `this` will change on call from p5
       */
      p5.setup = () => {
        p5.frameRate(60);

        this.setup.bind(this)(p5);

        /**
         * * We want to manually start the loop using the master panel
         */
        this.pause();
      };

      p5.draw = () => {
        if (this.playState === "playing") {
          this.draw.bind(this)(p5);
        }
      };
    });
  }

  stop() {
    this.p5?.remove();
    this.playState = "stopped";
  }

  getConfig(): Record<string, number> {
    return this.config;
  }

  /**
   * ! Using p5.noLoop() and p5.loop() is not a good idea since it will
   * ! cause a spike in deltaTime (last frame and current frame will have a huge delta)
   */
  play() {
    this.playState = "playing";
  }

  pause() {
    this.playState = "paused";
  }

  reset() {
    this.stop();
    this.start();
  }
}

export { SketchBase as default };
