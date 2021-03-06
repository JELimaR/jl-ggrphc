import RandomNumberGenerator from "../Geom/RandomNumberGenerator";
import { BuffRegs } from "../zones/BuffRegs";
import { pointInArrReg } from "../Geom/utilsTurfFunctions";
import { HHRegs } from "../zones/HHRegs";
import { HLRegs } from "../zones/HLRegs";
import { LHRegs } from "../zones/LHRegs";
import { LLRegs } from "../zones/LLRegs";
import { MHRegs } from "../zones/MHRegs";
import { MLRegs } from "../zones/MLRegs";
import JCell from "../Voronoi/JCell";

export type TypeCellheight =
	| 'deepocean'
	| 'ocean'
	| 'land'

export interface IJCellHeightInfo {
	id: number;

	height: number;
	prevHeight: number;
	heightType: TypeCellheight;
	islandId: number;
}

export default class JCellHeight {
	private _cell: JCell;

	private _height: number;
	private _prevHeight: number = 0;
	private _heightType: TypeCellheight;
	private _islandId: number = -1;

	constructor(c: JCell, info: IJCellHeightInfo | undefined) {
		this._cell = c;
		// const turfPol = this._cell.toTurfPolygonSimple();
		if (info) {
			this._height = info.height;
			this._prevHeight = info.prevHeight;
			this._heightType = info.heightType;
			this._islandId = info.islandId;
			
		} else {
			const out = this.setReliefZone();
			this._height = Math.round(out.h*1000000)/1000000;
			this._heightType = out.th;
		}
	}

	// setReliefZone(): { h: number, th: TypeCellheight } {
	// 	let out: { h: number, th: TypeCellheight } = { h: 0, th: 'land' };
	// 	const rfn: ()=>number = RandomNumberGenerator.makeRandomFloat(this._cell.id);
	// 	if (!pointInArrReg(this._cell.center.toTurfPosition(), BuffRegs)) {
	// 		out.h = 0.05;
	// 		out.th = 'deepocean'
	// 	} else if (pointInArrReg(this._cell.center.toTurfPosition(), HHRegs)) {
	// 		out.h = 0.88+0.200*rfn();
	// 	} else if (pointInArrReg(this._cell.center.toTurfPosition(), HLRegs)) {
	// 		out.h = 0.68+0.240*rfn();
	// 	} else if (pointInArrReg(this._cell.center.toTurfPosition(), MHRegs)) {
	// 		out.h = 0.44+0.280*rfn();
	// 	} else if (pointInArrReg(this._cell.center.toTurfPosition(), MLRegs)) {
	// 		out.h = 0.30+0.180*rfn();
	// 	} else if (pointInArrReg(this._cell.center.toTurfPosition(), LHRegs)) {
	// 		out.h = 0.24+0.080*rfn();
	// 	} else if (pointInArrReg(this._cell.center.toTurfPosition(), LLRegs)) {
	// 		out.h = 0.20+0.048*rfn();
	// 	} else {
	// 		out.h = 0.18;
	// 		out.th = 'ocean';
	// 	}
	// 	return out;
	// }
	setReliefZone(): { h: number, th: TypeCellheight } {
		let out: { h: number, th: TypeCellheight } = { h: 0, th: 'land' };
		const rfn: ()=>number = RandomNumberGenerator.makeRandomFloat(this._cell.id);
		if (!pointInArrReg(this._cell.center.toTurfPosition(), BuffRegs)) {
			out.h = 0.05;
			out.th = 'deepocean'
		} else if (pointInArrReg(this._cell.center.toTurfPosition(), HHRegs)) {
			out.h = 0.700+0.300*rfn();
		} else if (pointInArrReg(this._cell.center.toTurfPosition(), HLRegs)) {
			out.h = 0.450+0.260*rfn();
		} else if (pointInArrReg(this._cell.center.toTurfPosition(), MHRegs)) {
			out.h = 0.315+0.150*rfn();
		} else if (pointInArrReg(this._cell.center.toTurfPosition(), MLRegs)) {
			out.h = 0.240+0.100*rfn();
		} else if (pointInArrReg(this._cell.center.toTurfPosition(), LHRegs)) {
			out.h = 0.216+0.034*rfn();
		} else if (pointInArrReg(this._cell.center.toTurfPosition(), LLRegs)) {
			out.h = 0.200+0.020*rfn();
		} else {
			out.h = 0.18;
			out.th = 'ocean';
		}
		return out;
	}

	get height(): number {return this._height}
	get prevHeight(): number {return this._prevHeight}
	get heightType(): TypeCellheight {return this._heightType}
	set height(h: number) {
		if (this._heightType === 'land' && h < 0.2) {
			this._prevHeight = this._height;
			this._height = 0.2;
			return;
		}
		if (this._heightType === 'ocean' && h > 0.19) {
			this._prevHeight = this._height;
			this._height = 0.19;
			return
		}
		if (this._heightType === 'deepocean') return;
		this._prevHeight = this._height;
		this._height = h;
	}
	set islandId(id: number) { this._islandId = id }
	get islandId(): number { return this._islandId }
	// get inLandZone(): boolean {return this._heightType === ''}

	getInterface(): IJCellHeightInfo { 
		return {
			id: this._cell.id,

			height: this._height,
			prevHeight: this._prevHeight,
			heightType: this._heightType,
			islandId: this._islandId
		}
	}
}