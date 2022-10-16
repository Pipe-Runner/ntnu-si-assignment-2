import p5Base from "p5";

export function TargetView(
  p5: p5Base,
  position: p5Base.Vector,
  color: string = "red"
) {
  p5.stroke(color);
  p5.strokeWeight(10);
  p5.point(position);
}
