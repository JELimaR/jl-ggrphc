import { Cell, Halfedge } from "voronoijs";
import JPoint from '../Geom/JPoint';
import JEdge from './JEdge';
import JHalfEdge from './JHalfEdge';
import JSite from './JSite';

import * as turf from '@turf/turf';
import { polInArrReg, intersectTurfPolygon, areaArrReg, polContainInArrReg, pointInArrReg } from '../zones/functions';
import { LandRegs } from '../zones/LandRegs';
import { BuffRegs } from "../zones/BuffRegs";
import { HHRegs } from '../zones/HHRegs';
import { HLRegs } from '../zones/HLRegs';
import { MLRegs } from '../zones/MLRegs';
import { MHRegs } from '../zones/MHRegs';
import { LHRegs } from "../zones/LHRegs";
import { LLRegs } from '../zones/LLRegs';
import RandomNumberGenerator from "../Geom/RandomNumberGenerator";

/**
 * En una cell:
 * 	halfedge es un borde de celda.
 */

export default class JCell {

	//private _cell: Cell;
	private _site: JSite;
	private _halfedges: JHalfEdge[] = [];
	private readonly _cellInformation: JCellInformation;

	constructor(c: Cell, s: JSite, arrEdges: JEdge[], info: IJCellInformation | undefined) {
		//this._cell = c;
		this._site = s
		c.halfedges.forEach( (he: Halfedge, idx: number) => {
			const edge: JEdge = arrEdges[idx];
			const Jhe: JHalfEdge = new JHalfEdge(this._site, edge);
			this._halfedges.push(Jhe);
		})
		this._cellInformation = new JCellInformation(this, info);
	}

	get info(): IJCellInformation {return this._cellInformation.getInterface()}

	get site(): JSite { return this._site }
	get id(): number { return this._site.id }
	get center(): JPoint { return this._site.point }
	get isLand(): boolean { return this._cellInformation.heightType === 'land' }

	get allVertices(): JPoint[] {
		let out: JPoint[] = [];
		for (let he of this._halfedges ) {
			const pts = he.points
			for (let i=1; i< pts.length; i++) {
				out.push(pts[i]);
			}
        }
        return out;
	}

	get voronoiVertices(): JPoint[] {
		let out: JPoint[] = [];
		for (let he of this._halfedges ) {
            out.push(he.initialPoint)
        }
        return out;
	}

    get neighborsId(): number[] {
		let out: number[] = [];
		this._halfedges.forEach((he: JHalfEdge) => {
			if (he.edge.lSite.id !== this.id) {
				out.push(he.edge.lSite.id)
			} else {
				if (!!he.edge.rSite) out.push(he.edge.rSite.id)
			}
		})
        return out;
    }

	get height(): number {return this._cellInformation.height}
	get prevHeight(): number {return this._cellInformation.prevHeight}
	set height(h: number) {this._cellInformation.height = h}

	get isBorder(): boolean {
		let out: boolean = false;
		for (let i = 0; i < this._halfedges.length && !out; i++) {
			const he = this._halfedges[i];
			out = !he.edge.rSite
		}
		return out; 
	}

	get area(): number {
		return turf.area(this.toTurfPolygonComplete())/1000000;
	}

	get areaSimple(): number {
		return turf.area(this.toTurfPolygonSimple())/1000000;
	}

	private toTurfPolygonComplete(): turf.Feature<turf.Polygon> {
		let verts: JPoint[] = this.allVertices;
		verts.push(verts[0]);
		return turf.polygon([
			verts.map((p: JPoint) => p.toTurfPosition())
		])
	}

	toTurfPolygonSimple(): turf.Feature<turf.Polygon> {
		let verts: JPoint[] = this.voronoiVertices;
		verts.push(verts[0]);
		return turf.polygon([
			verts.map((p: JPoint) => p.toTurfPosition())
		])
	}

	mark(): void { this._cellInformation.mark = true }
	dismark(): void { this._cellInformation.mark = false }
	isMarked(): boolean {return this._cellInformation.mark }

	static equals(a: JCell, b: JCell): boolean {
		return (a.id === b.id)
	}

}

type TypeCellheight =
	| 'deepwater'
	| 'water'
	| 'land'

export interface IJCellInformation {
	id: number;

	height: number;
	prevHeight: number;
	heightType: TypeCellheight;
}

class JCellInformation {
	private _cell: JCell;
	private _mark: boolean = false;

	private _height: number;
	private _prevHeight: number = 0;
	private _heightType: TypeCellheight;

	constructor(c: JCell, info: IJCellInformation | undefined) {
		this._cell = c;
		// const turfPol = this._cell.toTurfPolygonSimple();
		if (info) {
			this._height = info.height;
			this._prevHeight = info.prevHeight;
			this._heightType = info.heightType;
		} else {
			const out = this.setReliefZone();
			this._height = Math.round(out.h*1000000)/1000000;
			this._heightType = out.th;
		}
	}

	private setReliefZone(): { h: number, th: TypeCellheight} {
		let out: {h: number, th: TypeCellheight} = { h: 0, th: 'land'};
		const rfn: ()=>number = RandomNumberGenerator.makeRandomFloat(this._cell.id);
		if (!pointInArrReg(this._cell.center.toTurfPosition(), BuffRegs)) {
			out.h = 0.05;
			out.th = 'deepwater'
		} else if (pointInArrReg(this._cell.center.toTurfPosition(), HHRegs)) {
			out.h = 0.85+0.15*rfn();
		} else if (pointInArrReg(this._cell.center.toTurfPosition(), HLRegs)) {
			out.h = 0.75+0.15*rfn();
		} else if (pointInArrReg(this._cell.center.toTurfPosition(), MHRegs)) {
			out.h = 0.6+0.2*rfn();
		} else if (pointInArrReg(this._cell.center.toTurfPosition(), MLRegs)) {
			out.h = 0.5+0.15*rfn();
		} else if (pointInArrReg(this._cell.center.toTurfPosition(), LHRegs)) {
			out.h = 0.35+0.2*rfn();
		} else if (pointInArrReg(this._cell.center.toTurfPosition(), LLRegs)) {
			out.h = 0.25+0.15*rfn();
		} else {
			out.h = 0.15;
			out.th = 'water';
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
		if (this._heightType === 'water' && h > 0.15) {
			this._prevHeight = this._height;
			this._height = 0.15;
			return
		}
		if (this._heightType === 'deepwater') return;
		this._prevHeight = this._height;
		this._height = h;
	}
	// get inLandZone(): boolean {return this._heightType === ''}
	get mark(): boolean {return this._mark}
	set mark(b: boolean) {this._mark = b}

	getInterface(): IJCellInformation { return {
		id: this._cell.id,

		height: this._height,
		prevHeight: this._prevHeight,
		heightType: this._heightType,
	} }
}