import  fs from 'fs';
import DrawerMap from "./DrawerMap";
import RandomNumberGenerator from "./Geom/RandomNumberGenerator";
import JCell from "./Voronoi/JCell";
import JDiagram from "./Voronoi/JDiagram";
import JPoint from "./Geom/JPoint";
import chroma from 'chroma-js';
import JRegionMap, { IRegionInfo } from './JRegionMap';

import DataInformationFilesManager from './DataInformationLoadAndSave';
const dataInfoManager = DataInformationFilesManager.instance;

export interface ICellContainer {
	cells?: JCell[] | Set<JCell> | Map<number, JCell>;
	forEachCell: (func: (c: JCell) => void) => void
}

export const createICellContainerFromCellArray = (cells: JCell[]) => {
	return {
		cells: cells,
		forEachCell: (func: (jc: JCell) => void) => {
			cells.forEach((c: JCell) => {func(c)})
		}
	}
}

export class JContintentMap {
	private _id: number;
	public _islands: JIslandMap[] = [];
	public _region: JRegionMap;

	constructor(id: number) {
		this._id = id;		
		this._region = new JRegionMap();
	}

	addIsland(isl: JIslandMap) {
		this._islands.push(isl);
		isl.forEachCell((cell: JCell) => {
			this._region.addCell(cell);
		})
	}
}

export class JIslandMap extends JRegionMap {
	constructor(private _id: number, ent?: {info: IRegionInfo, world: JWorldMap}) {
		super(ent);
	}
}

export default class JWorldMap implements ICellContainer {

    private _diagram: JDiagram;
	public _islands: JIslandMap[] = [];
	public _continents: JContintentMap[] = [];

    constructor(d: JDiagram) {
        this._diagram = d;
		this.smoothHeight();
		// this.smoothHeight();
		// this.smoothHeight();

		// islands
		console.time('set Islands');
		let regionInfoArr: IRegionInfo[] = dataInfoManager.loadIslandsInfo(this.diagram.cells.size);
		if (regionInfoArr.length > 0) {
			regionInfoArr.forEach((iri: IRegionInfo, i: number) => {
				this._islands.push(
					new JIslandMap(i, {info: iri, world: this})
				);
			})
		} else {
			this.generateIslandList();
			dataInfoManager.saveIslandsInfo(this._islands, this.diagram.cells.size);
		}
		console.timeEnd('set Islands');

		// continents
		console.time('set continents');
		
		this._continents[3] = new JContintentMap(3);
		this._islands.forEach((isl: JIslandMap, i: number) => {
			if (i<3) {
				this._continents[i] = new JContintentMap(i);
				this._continents[i].addIsland(isl);
			} else {
				const c: JCell = isl.cells.entries().next().value[1];
				if (c.center.x > 120) this._continents[3].addIsland(isl);
				else {
					const dist0: number = JRegionMap.distanceBetween(isl, this._continents[0]._region);
					const dist1: number = JRegionMap.distanceBetween(isl, this._continents[1]._region);
					const dist2: number = JRegionMap.distanceBetween(isl, this._continents[2]._region);
					if (dist0 < dist1 && dist0 < dist2) {
						this._continents[0].addIsland(isl)
					} else if (dist1 < dist2) {
						this._continents[1].addIsland(isl);
					} else {
						this._continents[2].addIsland(isl);
					}
				}
			}
		});
		console.timeEnd('set continents');
		console.log('cantidad de islands', this._islands.length);
    }

	get diagram(): JDiagram {return this._diagram}
	get cells(): any {return this._diagram.cells}

	forEachCell(func: (c: JCell) => void) {
		this._diagram.forEachCell(func);
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

			let reg: JIslandMap = new JIslandMap(currentId);
			reg.addCell(cell);

			//let reg: JCell[] = [cell];
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
				//reg.push(neigh);
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

		this._diagram.forEachCell((c: JCell) => {
			c.dismark();
		})
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
