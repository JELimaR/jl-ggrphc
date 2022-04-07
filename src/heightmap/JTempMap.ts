import JPoint from "../Geom/JPoint";
import JWMap from "../JWMap";
import JDiagram from "../Voronoi/JDiagram";
import JCell from "../Voronoi/JCell";
import JHeightMap from './JHeightMap';
import JRegionMap, { JIslandMap } from '../RegionMap/JRegionMap';
import * as TempFunctions from './JTempFunctions';
import * as turf from '@turf/turf';
import DataInformationFilesManager from '../DataInformationLoadAndSave';
const dataInfoManager = DataInformationFilesManager.instance;

export interface ICellTempLat {
	tempLatMed: number;
	tempLatMin: number;
	tempLatMax: number;
	tempLatMonth: number[];
}

export interface IJCellTempInfo {
	id: number;
	tempCap: number;
	tempMonth: number[];
}

export class JCellTemp {
	_cell: JCell;
	_tempCap: number = 1;
	_tempMonth: number[];
	constructor(cell: JCell, info: IJCellTempInfo) {
		this._cell = cell;
		this._tempCap = info.tempCap;
		this._tempMonth = info.tempMonth;
	}

	get tempMonth(): number[] { return this._tempMonth }
	set tempMonth(tempArr: number[]) { this._tempMonth = [...tempArr] }

	get info(): IJCellTempInfo {
		return {
			id: this._cell.id,
			tempCap: this._tempCap,
			tempMonth: this._tempMonth,
		}
	}
}


export default class JTempMap extends JWMap {

	_temperaturesCellMap: Map<number, ICellTempLat> = new Map<number, ICellTempLat>(); // map de id y temp - borrar no se debe guardar todos esos datos
	_tempCellMonth: Map<number, number[]> = new Map<number, number[]>();
	_tempCellCap: Map<number, number> = new Map<number, number>();
	_tempCellPrevCap: Map<number, number> = new Map<number, number>();

	_cellClimate: Map<number, JCellTemp> = new Map<number, JCellTemp>();

	constructor(d: JDiagram, hm: JHeightMap) { // no se precisa el hm?
		super(d);
		const cellsMap = this.diagram.cells;

		// temp cells
		console.log('calculate and setting temp');
		console.time('set temp info');

		const loadedInfo: IJCellTempInfo[] = dataInfoManager.loadCellsTemperature(cellsMap.size);

		if (loadedInfo.length > 0) {
			loadedInfo.forEach((data: IJCellTempInfo) => {
				this._cellClimate.set(data.id, new JCellTemp(cellsMap.get(data.id)!, data))
			})
		} else {
			/*
			 * capability
			 */
			this.calculateCapCell(hm);
			this.smoothCap();
			this.smoothCap();
			this.smoothCap();
			/*
			 * temp
			 */
			cellsMap.forEach((cell: JCell) => {
				// console.log(TempFunctions.calculateTempPromPerLat(cell.center.y));
				const ict: ICellTempLat = {
					tempLatMed: TempFunctions.calculateTempPromPerLat(cell.center.y),
					tempLatMin: TempFunctions.calculateTempMinPerLat(cell.center.y),
					tempLatMax: TempFunctions.calculateTempMaxPerLat(cell.center.y),
					tempLatMonth: TempFunctions.generateTempLatArrPerMonth(cell.center.y).map((v) => v.tempLat)
				}
				// this._temperaturesCellMap.set(cell.id, ict)

				let tarr: number[] = [];
				ict.tempLatMonth.forEach((mt: number) => {
					let tv: number = ict.tempLatMed + (ict.tempLatMed - mt) * this._tempCellCap.get(cell.id)!;
					tv = tv * 50 - 23;
					if (cell.isLand)
						tv -= 6.5 * (Math.round((cell.height - 0.2) * 10) / 10) * 6 / 0.8;

					tarr.push(tv);
				})
				this._tempCellMonth.set(cell.id, tarr)

				this._cellClimate.set(cell.id, new JCellTemp(cell, {
					id: cell.id,
					tempCap: this._tempCellCap.get(cell.id)!,
					tempMonth: tarr,
				}))
			})
			this.smoothTemp();
			this.smoothTemp();
		}

		if (loadedInfo.length === 0) {
			dataInfoManager.saveCellsTemperature(this._cellClimate, this._cellClimate.size);
		}
		console.timeEnd('set temp info');
	}

	calculateCapCell(h: JHeightMap): void {
		// const islands: JIslandMap[] = h.islands;
		this.forEachCell((cell: JCell) => {
			let captotal: number = 0//10 * (cell.isLand ? 1.0 : 0.25);

			const neigs: JCell[] = this.diagram.getNeighborsInWindow(cell, 5);
			neigs.forEach((nw: JCell) => {
				captotal += nw.isLand ? 1.0 : 0.25;
			});
			/*
			if (!cell.isLand) {
				this._tempCellCap.set(cell.id, 0.8);
			} else {
				
				const dist = islands[cell.islandId].minDistanceToCell(cell);
				this._tempCellCap.set(cell.id, 0.5 + 0.5 * dist/4500);
				
			}
			*/
			this._tempCellCap.set(cell.id, captotal / (neigs.length + 0));
			if (cell.id % 1000 == 0) console.log(`van ${cell.id}: neigh: ${neigs.length}`)
		})
		console.log('cap cells calculada');
	}

	smoothCap(): void {
		this.forEachCell((cell: JCell) => {
			// cell.mark();
			if (cell.isLand) {
				let capt: number = this._tempCellCap.get(cell.id)!;
				let cant: number = 1;

				let ns: JCell[] = this.diagram.getNeighbors(cell)
				ns.forEach((n: JCell) => {
					cant++;
					capt += this._tempCellCap.get(n.id)!;
				})
				capt = capt / cant;
				this._tempCellCap.set(cell.id, capt);
			}
		})
		// this.forEachCell((c: JCell) => {
		//   c.dismark();
		// })
	}

	smoothTemp(): void {
		this.forEachCell((cell: JCell) => {
			// cell.mark();
			const cellClimate = this._cellClimate.get(cell.id);
			const neigs = this.diagram.getNeighbors(cell);

			let tempTotal: number[] = cellClimate!.tempMonth;
			let cant: number = 1;

			neigs.forEach((nc: JCell) => {
				const neigClimate = this._cellClimate.get(nc.id);
				cant++;
				neigClimate!.tempMonth.forEach((temp: number, idx: number) => tempTotal[idx] += temp);
			})

			cellClimate!.tempMonth = tempTotal.map((t: number) => t / cant)

		})
		// this.forEachCell((c: JCell) => {
		// 	c.dismark();
		// })
	}

}

let grid: JPoint[] = [];
const gridgran: number = 5;
for (let i = -180; i <= 180; i += gridgran) {
	for (let j = -90; j <= 90; j += gridgran) {
		grid.push(new JPoint(i, j));
	}
}