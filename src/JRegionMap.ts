import JCell from './Voronoi/JCell';

export default class JRegionMap {
	private _cells: Map<number, JCell>;

	constructor() {
		this._cells = new Map<number, JCell>();
	}

	isInRegion(en: number | JCell) {
		const id: number = (en instanceof JCell) ? en.id : en;
		
	}
}