import p5Base from "p5";

export function RobotView(
  p5: p5Base,
  position: p5Base.Vector,
  color: string = "cyan"
) {
  p5.stroke(color);
  p5.strokeWeight(8);
  p5.point(position);
}
