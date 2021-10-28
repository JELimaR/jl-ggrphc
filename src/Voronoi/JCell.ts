import { Cell, Halfedge } from "voronoijs";
import JPoint from '../Geom/JPoint';
import JEdge from './JEdge';
import JHalfEdge from './JHalfEdge';
import JSite from './JSite';
import zones from './zones';

import * as turf from '@turf/turf';

/**
 * En una cell:
 * 	halfedge es un borde de celda.
 */

export default class JCell {

	//private _cell: Cell;
	private _site: JSite;
	private _halfedges: JHalfEdge[] = [];
	private _inz: boolean;

	constructor(c: Cell, s: JSite, arrEdges: JEdge[]) {
		//this._cell = c;
		this._site = s
		c.halfedges.forEach( (he: Halfedge, idx: number) => {
			const edge: JEdge = arrEdges[idx];
			const Jhe: JHalfEdge = new JHalfEdge(he, this._site, edge);
			this._halfedges.push(Jhe);
		})
		this._inz = 
			turf.booleanContains(zones[0],this.toTurfPolygonSimple()) ||
			turf.booleanContains(zones[1],this.toTurfPolygonSimple()) ||
			turf.booleanContains(zones[2],this.toTurfPolygonSimple()) ||
			turf.booleanContains(zones[3],this.toTurfPolygonSimple()) 
		;
	}

	get site(): JSite {return this._site}
	get id(): number { return this._site.id }
	get center(): JPoint { return this._site.point	}
	get inZone(): boolean { return this._inz }

	/**
	 * 
	 */
	get allVertices(): JPoint[] { // se debe modificar
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

	get isBorder(): boolean {
		let out: boolean = false;
		for (let i = 0; i < this._halfedges.length && !out; i++) {
			const he = this._halfedges[i];
			out = !he.edge.rSite
		}
		return out; 
	}

	get area(): number {
		return turf.area(this.toTurfPolygonSimple())/1000000;
	}

	toTurfPolygonSimple(): turf.Feature<turf.Polygon> {
		let verts: JPoint[] = this.voronoiVertices;
		verts.push(verts[0]);
		return turf.polygon([
			verts.map((p: JPoint) => p.toTurfPosition())
		])
	}

	static equals(a: JCell, b: JCell): boolean {
		return (a.id === b.id)
	}

}

class JCellInformation {
	
}