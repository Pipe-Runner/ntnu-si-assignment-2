import p5Base from "p5";

export function ParticleView(
  p5: p5Base,
  position: p5Base.Vector,
  color: string = "white"
) {
  p5.stroke(color);
  p5.strokeWeight(5);
  p5.point(position);
}
