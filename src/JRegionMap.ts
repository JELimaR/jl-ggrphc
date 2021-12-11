import JWorldMap, { ICellContainer, JContinentMap } from './JWorldMap';
import JCell from './Voronoi/JCell';
import JPoint from './Geom/JPoint';
import RandomNumberGenerator from "./Geom/RandomNumberGenerator";

export interface IJRegionInfo {
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
	private _world: JWorldMap;

	constructor(world: JWorldMap, info?: IJRegionInfo) {
		this._world = world;
		if (info) {
			this._cells = new Map<number, JCell>();
			info.cells.forEach((id: number) => {
				this._cells.set(id, this._world.cells.get(id)!);
			})
			this._neighborList = new Set<number>(info.neighborList);
			this._limitCellList = new Set<number>(info.limitCellList);
			this._area = info.area;
		} else {
			this._cells = new Map<number, JCell>();
			this._neighborList = new Set<number>();
			this._limitCellList = new Set<number>();
			this._area = 0;
		}
	}

	get area(): number { return this._area;	}
	get cells(): Map<number, JCell> {return this._cells}
	forEachCell(func: (c: JCell) => void) {
		this._cells.forEach((cell: JCell) => { func(cell) });
	}

	getLimitCells(): JCell[] {
		let cells: JCell[] = [];
		this._limitCellList.forEach((value: number) => {
			const c = this._cells.get(value);
			if (c) cells.push(c);
		})

		return cells;
	}

	private updateLimitCellList(): void {
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
	}

	isInRegion(en: number | JCell): boolean {
		const id: number = (en instanceof JCell) ? en.id : en;
		return this._cells.get(id) !== undefined;
	}

	addCell(c: JCell): void {
		if (this.isInRegion(c.id)) {
			return;
		}
		if (c.isLand) {
			this._cells.set(c.id, c);
			this._area += c.area;
			this._limitCellList.add(c.id);
		}
		c.neighborsId.forEach((id: number) => {
			const ncell = this._world.cells.get(id);
			if (ncell && !this.isInRegion(ncell) && ncell.info.heightType !== 'deepwater') {
				this._neighborList.add(id);
			}
		})
		
		this.updateLimitCellList();	
	}

	addRegion(reg: JRegionMap): void {
		let isDisjunt: boolean = true;
		reg.forEachCell((c: JCell) => {
			if (!this.isInRegion(c.id)) {
				this._cells.set(c.id, c);
			} else {
				isDisjunt = false;
			}
		})
		if (isDisjunt) {
			this._area += reg._area;
		} else {
			this._area = 0;
			this._cells.forEach((c: JCell) => {
				this._area += c.area;
			})
		}
		reg._limitCellList.forEach((lcv: number) => { this._limitCellList.add(lcv) });
		reg._neighborList.forEach((nv: number) => { this._neighborList.add(nv) });
		this._neighborList.forEach((nv: number) => {
			if (this.isInRegion(nv)) this._neighborList.delete(nv);
		});
		this.updateLimitCellList();
	}

	growing(ent: {cant: number, supLim?: number, regFather?: JRegionMap}) {
		ent.supLim = ent.supLim || Infinity;
		for (let i=0; i<ent.cant && this.area < ent.supLim; i++) {
			this.growingOnes(ent.regFather);
		}
	}

	private growingOnes(regFather?: JRegionMap) {
		if (this._neighborList.size === 0) return;
		let list = [...this._neighborList]
		list.forEach((e: number) => {
			const cell: JCell = this._world.cells.get(e);
			if (!cell.isLand || (!(regFather && !regFather.isInRegion(e)))) {
				this.addCell(cell);
				this._neighborList.delete(e);
			}
		})
	}

	divideInSubregions(plist: JPoint[][]): JRegionMap[] {
		let subs: JRegionMap[] = [];
		let used: Set<number> = new Set<number>();
		const randFunc = RandomNumberGenerator.makeRandomFloat(plist.length);
		plist.forEach((points: JPoint[]) => {
			let newSR: JRegionMap = new JRegionMap(this._world);
			subs.push(newSR);
			points.forEach((p: JPoint) => {
				const centerCell: JCell = this._world.diagram.getCellFromPoint(p);
				centerCell.mark();
				newSR.addCell(centerCell);
				used.add(centerCell.id);
			})
		})
		
		console.log('total cells:', this._cells.size);
		
		for (let i=0; i<1000 && used.size < this._cells.size; i++) {	
			subs.forEach((jsr: JRegionMap) => {
				jsr.growingOnesInDivide(this, used, randFunc);
			})
		}
		this._cells.forEach((c: JCell) => {
			if (!c.isMarked()) {
				this.addCellToNearestRegion(c, subs);
			}
		})

		this._world.cells.forEach((c: JCell) => {c.dismark()})

		return subs;
	}

	private growingOnesInDivide(regFather: JRegionMap, used: Set<number>, randFunc: ()=>number)  {
		if (this._neighborList.size === 0) return;
		let list = [...this._neighborList];
		list.forEach((e: number) => {
			if (randFunc() < 0.5) {
				const cell: JCell = this._world.cells.get(e);
				// si cell island entonces debe estar en regFather y ademas no debe estar marcado
				if ((!cell.isLand || regFather.isInRegion(cell)) && !cell.isMarked()) {
					if (cell.isLand) used.add(cell.id)
					cell.mark();
					this.addCell(cell);
					this._neighborList.delete(e);
				}
			}
		})
	}

	private addCellToNearestRegion(cell: JCell, subs: JRegionMap[]) {
		let dist: number [] = [];
		subs.forEach((sr: JRegionMap) => { 
			dist.push( sr.minDistanceToCell(cell) );
		})

		const minDist = Math.min(...dist);
		const indexMin = dist.indexOf(minDist);
		subs[indexMin].addCell(cell);
	}

	getInterface(): IJRegionInfo {
		let cells: number[] = [];
		this._cells.forEach((c: JCell) => {cells.push(c.id)});
		return {
			cells,
			neighborList: Array.from(this._neighborList),
			limitCellList: Array.from(this._limitCellList),
			area: this.area
		}
	}

	minDistanceToCell(cell: JCell): number {
		let out: number = Infinity;
		this.getLimitCells().forEach((clim: JCell) => {
			const dist = JPoint.geogDistance(clim.center, cell.center);
			if (dist < out) out = dist;
		})
		return out;
	}

	// distance between
	static minDistanceBetweenRegions(reg1: JRegionMap, reg2: JRegionMap): number {
		let out: number = Infinity;
		reg1.getLimitCells().forEach((c1: JCell) => {
			reg2.getLimitCells().forEach((c2: JCell) => {
				const dist = JPoint.geogDistance(c1.center, c2.center);
				if (dist < out) out = dist;
			})
		})
		return out;
	}
/*
	static intersect(reg1: JRegionMap, reg2: JRegionMap): JRegionMap {
		let out: JRegionMap = new JRegionMap(reg1._world);
		reg1._cells.forEach((c1: JCell) => {
			if (reg2.isInRegion(c1)) {
				out.addCell(c1);
			}
		})
		return out;
	}

	static existIntersect(reg1: JRegionMap, reg2: JRegionMap): boolean {
		let out: boolean = false;
		let it = reg1._cells.values();
		for (let i=0; i<reg1._cells.size && !out ; i++ ) {
			const c1: JCell = it.next();
			out = reg2.isInRegion(c1);
		}
		return out;
	}*/
}
