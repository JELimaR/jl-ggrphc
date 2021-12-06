import JWorldMap, { ICellContainer } from './JWorldMap';
import JCell from './Voronoi/JCell';
import JPoint from './Geom/JPoint';

export interface IRegionInfo {
	cells: number[];
	neighborList: number[];
	limitCellList: number[];
	area: number;
}

export default class JRegionMap implements ICellContainer {
	private _cells: Map<number, JCell>;
	private _neighborList: Set<number>;
	private _limitCellList: Set<number>;
	private _area: number;

	constructor(ent?: {info: IRegionInfo, world: JWorldMap}) {
		if (ent) {
			this._cells = new Map<number, JCell>();
			ent.info.cells.forEach((id: number) => {
				this._cells.set(id, ent.world.diagram.cells.get(id)!);
			})
			this._neighborList = new Set<number>(ent.info.neighborList);
			this._limitCellList = new Set<number>(ent.info.limitCellList);
			this._area = ent.info.area;
		} else {
			this._cells = new Map<number, JCell>();
			this._neighborList = new Set<number>();
			this._limitCellList = new Set<number>();
			this._area = 0;
		}
	}

	get area(): number {
		if (this._area === 0) {
			this.caculateArea();
		}
		return this._area;
	}

	get cells(): Map<number, JCell> {return this._cells}

	getLimitCells(): ICellContainer {		
		let cells: JCell[] = [];
		this._limitCellList.forEach((value: number) => {
			const c = this._cells.get(value);
			if (c) cells.push(c);
		})

		return {
			cells,
			forEachCell: (func: (jc: JCell) => void) => {
				cells.forEach((c: JCell) => {func(c)})
			}
		};
	}

	caculateArea(): void {
		this._area = 0;
		this._cells.forEach((cell: JCell) => { 
			this._area += cell.area;
		});
	}

	forEachCell(func: (c: JCell) => void) {
		this._cells.forEach((cell: JCell) => { func(cell) });
	}

	isInRegion(en: number | JCell): boolean {
		const id: number = (en instanceof JCell) ? en.id : en;
		return this._cells.get(id) !== undefined;
	}

	addCell(c: JCell) {
		if (c.isLand) {
			this._cells.set(c.id, c);
			this._limitCellList.add(c.id);
		}
		c.neighborsId.forEach((id: number) => {
			if (!this.isInRegion(id)) {
				this._neighborList.add(id);
			}
		})
		
		this._limitCellList.forEach((cellId: number) => {
			const cell = this._cells.get(cellId);
			if (cell) {
				const ni = cell.neighborsId;
				let islimit: boolean = false;
				for (let i = 0; i < ni.length && !islimit; i++) {
					if (!this.isInRegion(ni[i])) {
						islimit = true;
					}
				}
				if (!islimit) {
					this._limitCellList.delete(cell.id);
				}
			}			
		})
		this._area = 0;
	}

	growing(ent: {world: JWorldMap, cant: number, supLim?: number}) {
		ent.supLim = ent.supLim || Infinity;
		for (let i=0; i<ent.cant && this.area < ent.supLim; i++) {
			this.growingOnes(ent.world);
		}
	}

	private growingOnes(world: JWorldMap)  {
		let list = [...this._neighborList]
		list.forEach((e: number) => {
			this.addCell(world.diagram.cells.get(e)!);
			this._neighborList.delete(e);
		})
	}

	getInterface(): IRegionInfo {
		let cells: number[] = [];
		this._cells.forEach((c: JCell) => {cells.push(c.id)});
		return {
			cells,
			neighborList: Array.from(this._neighborList),
			limitCellList: Array.from(this._limitCellList),
			area: this._area
		}
	}

	// distance between
	static distanceBetween(reg1: JRegionMap, reg2: JRegionMap): number {
		let out: number = Infinity;
		reg1.getLimitCells().forEachCell((c1: JCell) => {
			reg2.getLimitCells().forEachCell((c2: JCell) => {
				const dist = JPoint.geogDistance(c1.center, c2.center);
				if (dist < out) out = dist;
			})
		})
		return out;
	}
}