import JWorldMap, { ICellContainer } from './JWorldMap';
import JCell from './Voronoi/JCell';

export default class JRegionMap implements ICellContainer{
	private _cells: Map<number, JCell>;
	private _neighborList: Set<number>;

	constructor(c: JCell) {
		this._cells = new Map<number, JCell>();
		this._cells.set(c.id, c);
		this._neighborList = new Set<number>([...c.neighborsId]);
	}

	get area(): number {
		let out:number = 0;
		this._cells.forEach((cell: JCell) => { 
			out += cell.area;
		 });
		return out;
	}

	forEachCell(func: (c: JCell) => void) {
		this._cells.forEach((cell: JCell) => { func(cell) });
	}

	isInRegion(en: number | JCell): boolean {
		const id: number = (en instanceof JCell) ? en.id : en;
		return this._cells.get(id) !== undefined;
	}

	addCell(c: JCell) {
		if (c.isLand)
			this._cells.set(c.id, c);
		c.neighborsId.forEach((id: number) => {
			if (!this.isInRegion(id)) {
				this._neighborList.add(id);
			}
		})
	}

	growing(world: JWorldMap, cant: number, supLim: number = Infinity) {
		for (let i=0; i<cant && this.area < supLim; i++) {
			this.growingOnes(world);
		}
	}

	private growingOnes(world: JWorldMap)  {
		let list = [...this._neighborList]
		list.forEach((e: number) => {
			this.addCell(world.diagram.cells.get(e)!);
			this._neighborList.delete(e);
		})
	}
}