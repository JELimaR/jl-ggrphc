import  fs from 'fs';
import DrawerMap from "./DrawerMap";
import RandomNumberGenerator from "./Geom/RandomNumberGenerator";
import JCell from "./Voronoi/JCell";
import JDiagram from "./Voronoi/JDiagram";
import JPoint from "./Geom/JPoint";
import chroma from 'chroma-js';
import JRegionMap, { IJRegionInfo } from './JRegionMap';

import DataInformationFilesManager from './DataInformationLoadAndSave';
const dataInfoManager = DataInformationFilesManager.instance;

export interface ICellContainer {
	cells?: JCell[] | Set<JCell> | Map<number, JCell>;
	forEachCell: (func: (c: JCell) => void) => void
}

export const createICellContainerFromCellArray = (cells: JCell[]): ICellContainer => {
	return {
		cells: cells,
		forEachCell: (func: (jc: JCell) => void) => {
			cells.forEach((c: JCell) => {func(c)})
		}
	}
}

export interface IJContinentInfo extends IJRegionInfo {
	id: number;
}

export class JContinentMap extends JRegionMap {
	private _id: number;

	constructor(id: number, world: JWorldMap, info?: IJContinentInfo | JRegionMap) {
		const iri: IJRegionInfo | undefined = (info instanceof JRegionMap) ? info.getInterface() : info;
		super(world, iri);
		this._id = id;
	}

	get id(): number { return this._id }
	getInterface(): IJIslandInfo {
		return {
			id: this._id,
			...super.getInterface()
		}
	}

}

export interface IJIslandInfo extends IJRegionInfo {
	id: number;
}

export class JIslandMap extends JRegionMap {
	constructor(private _id: number, world: JWorldMap, info?: IJRegionInfo,) {
		super(world, info);
	}

	get id(): number {return this._id}

	getInterface(): IJIslandInfo {
		return {
			id: this._id,
			...super.getInterface()
		}
	}
}

export default class JWorldMap implements ICellContainer {

    private _diagram: JDiagram;
	public _islands: JIslandMap[] = [];
	public _continents: JContinentMap[] = [];

    constructor(d: JDiagram) {
        this._diagram = d;
		this.smoothHeight();
		// this.smoothHeight();
		// this.smoothHeight();

		// islands
		console.time('set Islands');
		let regionInfoArr: IJIslandInfo[] = dataInfoManager.loadIslandsInfo(this.diagram.cells.size);
		if (regionInfoArr.length > 0) {
			regionInfoArr.forEach((iii: IJIslandInfo, i: number) => {
				this._islands.push(
					new JIslandMap(i, this, iii)
				);
			})
		} else {
			this.generateIslandList();
			dataInfoManager.saveIslandsInfo(this._islands, this.diagram.cells.size);
		}
		console.timeEnd('set Islands');

		// continents
		console.time('set continents');
		let continentsInfoArr: IJContinentInfo[] = dataInfoManager.loadContinentsInfo(this.diagram.cells.size);
		if (continentsInfoArr.length > 0) {
			continentsInfoArr.forEach((ici: IJContinentInfo, i: number) => {
				this._continents.push(
					new JContinentMap(i, this, ici)
				);
			})
		} else {
			this.generateContinentList();
			dataInfoManager.saveContinentsInfo(this._continents, this.diagram.cells.size);
		}
		this._continents.forEach((cont: JContinentMap) => { console.log(cont.id, cont.area) })
		console.timeEnd('set continents');

		console.log('cantidad de islands', this._islands.length);
    }

	generateIslandList(): void {
		let lista: Map<number, JCell> = new Map<number, JCell>();
		this._diagram.forEachCell((c: JCell) => {
			if (c.isLand) lista.set(c.id, c);
		})

		let currentId = -1;
		while (lista.size > 0) {
			currentId++;
			const cell: JCell = lista.entries().next().value[1];
			cell.mark();
			lista.delete(cell.id);

			let reg: JIslandMap = new JIslandMap(currentId, this);
			reg.addCell(cell);

			let qeue: Map<number, JCell> = new Map<number, JCell>();
			this._diagram.getNeighbors(cell).forEach((ncell: JCell) => {
				qeue.set(ncell.id, ncell)
			});
			while (qeue.size > 0) {
				const neigh: JCell = qeue.entries().next().value[1];
				qeue.delete(neigh.id);
				lista.delete(neigh.id);
				neigh.mark();
				reg.addCell(neigh);

				this._diagram.getNeighbors(neigh).forEach((nnn: JCell) => {
					if (nnn.isLand && !nnn.isMarked() && !qeue.has(nnn.id)) {
						qeue.set(nnn.id, nnn);
					}
				})
			}
			this._islands.push(reg);
		}
		// ordenar
		this._islands.sort((a: JIslandMap, b: JIslandMap) => { return b.area - a.area });

		this._diagram.forEachCell((c: JCell) => { c.dismark(); })
	}

	generateContinentList(): void {
		this._continents[4] = new JContinentMap(4, this);
		this._islands.forEach((isl: JIslandMap, i: number) => {
			if (i < 3) {
				this._continents[i] = new JContinentMap(i, this);
				this._continents[i].addRegion(isl);
			} else {
				const c: JCell = isl.cells.entries().next().value[1];
				if (c.center.x > 120) this._continents[4].addRegion(isl);
				else {
					const dist0: number = JRegionMap.minDistanceBetweenRegions(isl, this._continents[0]);
					const dist1: number = JRegionMap.minDistanceBetweenRegions(isl, this._continents[1]);
					const dist2: number = JRegionMap.minDistanceBetweenRegions(isl, this._continents[2]);
					if (dist0 < dist1 && dist0 < dist2) {
						this._continents[0].addRegion(isl)
					} else if (dist1 < dist2) {
						this._continents[1].addRegion(isl);
					} else {
						this._continents[2].addRegion(isl);
					}
				}
			}
		});
		// cont 0 divir en 2
		let plist: JPoint[][] = [
			[new JPoint(50, -20), new JPoint(45, -30), new JPoint(47, -37), new JPoint(60, -60)],
			[new JPoint(40, -30), new JPoint(22, -45), new JPoint(40, -60)],
		];

		const twoConts = this._continents[0].divideInSubregions(plist);
		this._continents[0] = new JContinentMap(0, this, twoConts[0]);
		this._continents[3] = new JContinentMap(3, this, twoConts[1]);
	}

	get diagram(): JDiagram {return this._diagram}
	get cells(): any {return this._diagram.cells}

	forEachCell(func: (c: JCell) => void) {
		this._diagram.forEachCell(func);
	}

	private smoothHeight() {
		this._diagram.forEachCell((c: JCell) => {
			c.mark();
			let ht: number = c.height;
			let cant: number = 1;
			let ns: JCell[] = this._diagram.getNeighbors(c)
			ns.forEach((n: JCell) => {
				cant++;
				if (n.isLand) {
					if (n.isMarked()) {
						ht += n.prevHeight;
					} else {
						ht += n.height;
					}
				} else {
					ht += 0.15;
				}
			})
			c.height = ht/cant;
		})
		this._diagram.forEachCell((c: JCell) => {
			c.dismark();
		})
	}

	private generateMoisture(): void {
		console.log('generating moisture');
	}
}
