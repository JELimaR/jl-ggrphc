import JPoint from "../Geom/JPoint";
import JWMap from "../JWMap";
import JDiagram from "../Voronoi/JDiagram";
import JCell from "../Voronoi/JCell";
import * as TempFunctions from './JTempFunctions';


export default class JClimateMap extends JWMap {

	_temperaturesCellMap: Map<number, number> = new Map<number, number>(); // map de id y temp - borrar?
	
  constructor(d: JDiagram) {
    super(d);
    const cellsMap = this.diagram.cells;

    // temp cells
		console.log('calculate and setting temp');
		console.time('set temp info');

    // const loadedInfo: IJCellInformation[] = dataInfoManager.loadCellsTemp(cellsMap.size); // cambiar por heightinfo
    cellsMap.forEach((cell: JCell) => {
      // console.log(TempFunctions.generateTempLatArrPerMonth(cell.center.y));
			// console.log(TempFunctions.calculateTempPromPerLat(cell.center.y));
			this._temperaturesCellMap.set(cell.id, TempFunctions.calculateTempPromPerLat(cell.center.y))
    })

    /*if (loadedInfo.length === 0) {
      this.smoothHeight();
      dataInfoManager.saveCellsInfo(cellsMap, cellsMap.size);
    }*/
    console.timeEnd('set temp info');
  }

}

let grid: JPoint[] = [];
const gridgran: number = 5;
for (let i = -180; i <= 180; i += gridgran) {
  for (let j = -90; j <= 90; j += gridgran) {
    grid.push(new JPoint(i, j));
  }
}