import JCell from "../Voronoi/JCell";
import JCellHeight, {IJCellHeightInfo} from './JCellHeight';
import JCellTemp, { IJCellTempInfo } from './JCellTemp';

export default class JCellInformation {
	_cell: JCell
	_height: JCellHeight | undefined;
	_temp: JCellTemp | undefined;

	private _mark: boolean = false;

	constructor(cell: JCell) {
		this._cell = cell;
	}

	get mark(): boolean {return this._mark}
	set mark(b: boolean) {this._mark = b}

	/*
	 * height or relief
	 */
	setHeightInfo(h: IJCellHeightInfo) { this._height = new JCellHeight(this._cell, h);	}
	getHeightInfo(): IJCellHeightInfo | undefined { return this._height!.getInterface(); }	
	get cellHeight(): JCellHeight {
		return this._height!;
	}
	
	get isLand(): boolean { return this._height!.heightType === 'land' }
	get height(): number { return this._height!.height }
	get prevHeight(): number { return this._height!.prevHeight }
	set height(h: number) { this._height!.height = h }

	set islandId(id: number) { this._height!.islandId = id; }
	get islandId(): number { return this._height!.islandId; }

	/*
	 * temp
	 */
	setTempInfo(t: IJCellTempInfo) { this._temp = new JCellTemp(this._cell, t);	}
	getTempInfo(): IJCellTempInfo | undefined { return this._temp!.getInterface();	}
	get cellTemp(): JCellTemp {
		return this._temp!;
	}

	get tempMonthArr(): number[] { return this._temp!.tempMonth }
	get tempMedia(): number { 
		let out: number = 0;
		this._temp!.tempMonth.forEach((t: number) => out += t)
		return out/12;
	}
}