import p5Base from "p5";

export function ObstacleView(
  p5: p5Base,
  position: p5Base.Vector,
  radius: number,
  stroke: string = "purple",
  fill: string = "purple"
) {
  p5.stroke(stroke);
  p5.fill(fill);
  p5.strokeWeight(1);
  p5.circle(position.x, position.y, 2 * radius);
}
