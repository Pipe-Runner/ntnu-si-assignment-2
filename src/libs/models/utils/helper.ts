import p5Base from "p5";

export function random(min: number, max: number) {
  const scale = Math.random();
  return min + scale * (max - min);
}

export function random2DinUnitCircle(): p5Base.Vector {
  const angle = random(0, 2 * Math.PI);
  const r = random(0, 1);
  return new p5Base.Vector(r * Math.cos(angle), r * Math.sin(angle));
}

export function randomUnit(): p5Base.Vector {
  return p5Base.Vector.random2D().normalize();
}
