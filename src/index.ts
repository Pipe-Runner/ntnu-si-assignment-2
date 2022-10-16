import "./styles/index.css";
import styles from "./index.module.css";
import MasterPanel from "@/components/controls/MasterPanel";
import ClassicPSO from "@/sketches/ClassicPSO";
import { SketchMap } from "@/types/common";
import PathFinding from "./sketches/PathFinding";
import PathFindingSingleObstacle from "./sketches/PathFindingSingleObstacle";
import PathFindingMultipleObstacles from "./sketches/PathFindingMultipleObstacles";

const canvasContainer = document.getElementById("app")!;
canvasContainer?.classList.add(styles.canvasContainer);

function app() {
  // Creating a map of sketch names to their classes
  const sketchMap: SketchMap = {
    "Classic PSO": new ClassicPSO(canvasContainer),
    "Path Finding": new PathFinding(canvasContainer),
    "Path Finding Single Obstacle": new PathFindingSingleObstacle(
      canvasContainer
    ),
    "Path Finding Multiple Obstacles": new PathFindingMultipleObstacles(
      canvasContainer
    ),
  };

  // Creating a master panel
  const masterPanel = new MasterPanel("Master Panel", sketchMap);
}

app();
