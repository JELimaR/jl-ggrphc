import JPoint from "../Geom/JPoint";
import JWMap from "../JWMap";
import JDiagram from "../Voronoi/JDiagram";


export default class JClimateMap extends JWMap {
  constructor(d: JDiagram) {
    super(d);
  }
}

let grid: JPoint[] = [];
const gridgran: number = 5;
for (let i = -180; i <= 180; i += gridgran) {
  for (let j = -90; j <= 90; j += gridgran) {
    grid.push(new JPoint(i, j));
  }
}