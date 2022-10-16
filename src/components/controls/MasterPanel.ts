import SketchBase from "@/sketches/SketchBase";
import { SketchMap } from "@/types/common";
import dat, { GUI } from "dat.gui";

class MasterPanel {
  gui: GUI;
  activeSketchKey: string;
  activeSketch: SketchBase;
  settingsFolder: GUI | undefined;

  constructor(
    name: string,
    private sketchMap: SketchMap,
    onSketchChange?: (newSketch: SketchBase) => void
  ) {
    this.gui = new dat.GUI({
      name,
      width: 360,
    });

    const sketchMapOptions = Object.keys(this.sketchMap);
    this.activeSketchKey = sketchMapOptions[0];
    this.activeSketch = this.sketchMap[this.activeSketchKey];
    this.activeSketch.start();

    const sketchController = this.gui.add(
      this,
      "activeSketchKey",
      sketchMapOptions
    );
    sketchController.name("Active Sketch");
    sketchController.onChange((newSketchKey) => {
      // Stop current sketch
      this.activeSketch.stop();

      // Start new sketch
      this.activeSketch = this.sketchMap[newSketchKey];
      this.activeSketch.start();

      this.createSettingsFolder();
      onSketchChange && onSketchChange(this.activeSketch);
    });

    this.createSettingsFolder();
    onSketchChange && onSketchChange(this.activeSketch);
  }

  createSettingsFolder() {
    if (this.settingsFolder) {
      this.gui.removeFolder(this.settingsFolder);
    }

    this.settingsFolder = this.gui.addFolder("Sketch Settings");
    this.settingsFolder.open();

    const activeSketchConfig = this.activeSketch.getConfig();
    Object.entries(activeSketchConfig).map(([key, value]) => {
      // TODO: Create a config type
      this.settingsFolder!.add(activeSketchConfig, key);
    });

    this.settingsFolder!.add({ Play: () => this.activeSketch.play() }, "Play");
    this.settingsFolder!.add(
      { Pause: () => this.activeSketch.pause() },
      "Pause"
    );
    this.settingsFolder!.add(
      { Reset: () => this.activeSketch.reset() },
      "Reset"
    );
  }
}

export { MasterPanel as default };
