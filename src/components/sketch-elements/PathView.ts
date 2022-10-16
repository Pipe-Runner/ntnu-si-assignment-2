import p5 from "p5";

export function PathView(p5: p5, path: p5.Vector[], color: string = "green") {
  if (path.length > 1) {
    path.reduce((prev, curr) => {
      p5.strokeWeight(1);
      p5.stroke(color);
      p5.line(prev.x, prev.y, curr.x, curr.y);
      return curr;
    });
  }
}
