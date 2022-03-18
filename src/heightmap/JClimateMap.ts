import JPoint from "../Geom/JPoint";
import JWMap from "../JWMap";
import JDiagram from "../Voronoi/JDiagram";
import JCell from "../Voronoi/JCell";
import JHeightMap from './JHeightMap';
import JRegionMap, {JIslandMap} from '../RegionMap/JRegionMap';
import * as TempFunctions from './JTempFunctions';
import * as turf from '@turf/turf';
import DataInformationFilesManager from '../DataInformationLoadAndSave';
const dataInfoManager = DataInformationFilesManager.instance;

export interface ICellTempLat {
	tempLatMed: number;
	tempLatMin: number;
	tempLatMonth: number[];	
}

export interface IJCellClimateInfo {
	id: number;
	tempCap: number;
	tempMonth: number[];
}

export class JCellClimate {
	_cell: JCell;
	_tempCap: number = 1;
	_tempMonth: number[];
	constructor(cell: JCell, info: IJCellClimateInfo) {
		this._cell = cell;
		this._tempCap = info.tempCap;
		this._tempMonth = info.tempMonth;
	}

	get info(): IJCellClimateInfo {
		return {
			id: this._cell.id,
			tempCap: this._tempCap,
		}
	}
}


export default class JClimateMap extends JWMap {

	_temperaturesCellMap: Map<number, ICellTempLat> = new Map<number, ICellTempLat>(); // map de id y temp - borrar no se debe guardar todos esos datos
	_tempCellMonth: Map<number, number[]> = new Map<number, number[]>();
	_tempCellCap: Map<number, number> = new Map<number, number>();
	_tempCellPrevCap: Map<number, number> = new Map<number, number>();

	_cellClimate: Map<number, JCellClimate> = new Map<number, JCellClimate>();
	
  constructor(d: JDiagram, hm: JHeightMap) {
    super(d);
    const cellsMap = this.diagram.cells;

    // temp cells
		console.log('calculate and setting temp');
		console.time('set temp info');

    const loadedInfo: IJCellClimateInfo[] = dataInfoManager.loadCellsClimate(cellsMap.size);
		/*
     * capability
		 */
		this.calculateCapCell(hm);
		this.smoothCap();
		/*
     * temp
		 */
    cellsMap.forEach((cell: JCell) => {
			// console.log(TempFunctions.calculateTempPromPerLat(cell.center.y));
			const ict: ICellTempLat = {
				tempLatMed: TempFunctions.calculateTempPromPerLat(cell.center.y),
				tempLatMin: TempFunctions.calculateTempMinPerLat(cell.center.y),
				tempLatMonth: TempFunctions.generateTempLatArrPerMonth(cell.center.y).map((v) => v.tempLat)
			}
			// this._temperaturesCellMap.set(cell.id, ict)
			
			let tarr: number[] = [];
			ict.tempLatMonth.forEach((mt: number, idx: number) => {
				const tv: number = ict.tempLatMed + (ict.tempLatMed - ict.tempLatMonth[idx]) * this._tempCellCap.get(cell.id)!;
				tarr.push(tv);
			})
			this._tempCellMonth.set(cell.id, tarr)
			
			this._cellClimate.set(cell.id, new JCellClimate( cell, {
				id: cell.id,
				tempCap: this._tempCellCap.get(cell.id)!,
				tempMonth: tarr,
			}))
    })

    if (loadedInfo.length === 0) {
      dataInfoManager.saveCellsClimate(this._cellClimate, this._cellClimate.size);
    }
    console.timeEnd('set temp info');
  }

	calculateCapCell(h: JHeightMap): void {
		// const islands: JIslandMap[] = h.islands;
		this.forEachCell((cell: JCell) => {
			let captotal: number = 0;
			
			const neigs: JCell[] = this.diagram.getNeighborsInWindow(cell, 10);
			neigs.forEach((nw: JCell) => {
				captotal += nw.isLand ? 1.0 : 0.5;
			});
			/*
			if (!cell.isLand) {
				this._tempCellCap.set(cell.id, 0.8);
			} else {
				
				const dist = islands[cell.islandId].minDistanceToCell(cell);
				this._tempCellCap.set(cell.id, 0.5 + 0.5 * dist/4500);
				
			}
			*/
			this._tempCellCap.set(cell.id, captotal/neigs.length);
			if (cell.id % 1000 == 0) console.log(`van ${cell.id}: neigh: ${neigs.length}`)
		})
		console.log('cap cells calculada');
	}

	smoothCap(): void {
		this.forEachCell((cell: JCell) => {
			cell.mark();
			if (cell.isLand) {     
	      let capt: number = this._tempCellCap.get(cell.id)!;
	      let cant: number = 1;
				
	      let ns: JCell[] = this.diagram.getNeighbors(cell)
	      ns.forEach((n: JCell) => {
	        cant++;
					capt += this._tempCellCap.get(n.id)!;
	        /*if (n.isMarked()) {
	          capt += n.prevHeight;
	        } else {
	          capt += n.height;
	        }*/
	      })
	      capt = capt / cant;
				this._tempCellCap.set(cell.id, capt);
			}
      /*if (c.isLand)
        c.height = ht < 0.2 ? 0.2 : ht;
      else
        c.height = ht > 0.15 ? 0.15 : ht;*/
    })
    this.forEachCell((c: JCell) => {
      c.dismark();
    })
	}

}

let grid: JPoint[] = [];
const gridgran: number = 5;
for (let i = -180; i <= 180; i += gridgran) {
  for (let j = -90; j <= 90; j += gridgran) {
    grid.push(new JPoint(i, j));
  }
}