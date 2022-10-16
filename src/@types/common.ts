import SketchBase from "@/sketches/SketchBase";

export type SketchMap = Record<string, SketchBase>;

export type RobotPhase = 'moving' | 'searching' | 'reached';