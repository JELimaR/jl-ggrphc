import {Halfedge, Site, Edge, Vertex} from 'voronoijs';

import JPoint, {JVector} from '../Geom/JPoint';
import JEdge from './JEdge';
import JSite from './JSite';


export default class JHalfEdge {

	constructor(private _halfedge: Halfedge, private _site: JSite, private _edge: JEdge) {
		
	}

	get initialPoint(): JPoint {
		/*
		const vecA: JVector = new JVector(this._site.point, this._edge.vertexA);
		const vecB: JVector = new JVector(this._site.point, this._edge.vertexB);
		if (vecA.angle > vecB.angle) {
			return this._edge.vertexA;
		} else {
			return this._edge.vertexB;
		}
		*/
		let out: JPoint;
		let startVertex: Vertex = this._halfedge.getStartpoint();
		if ( JPoint.equal(this._edge.vertexA, new JPoint(startVertex.x,startVertex.y))) {
			out = this._edge.vertexA;
		} else {
			out = this._edge.vertexB;
		}
		return out;
	}
	private get finalPoint(): JPoint {
		/*
		const vecA: JVector = new JVector(this._site.point, this._edge.vertexA);
		const vecB: JVector = new JVector(this._site.point, this._edge.vertexB);
		if (vecA.angle < vecB.angle) {
			return this._edge.vertexA;
		} else {
			return this._edge.vertexB;
		}
		*/
		let out: JPoint;
		let endVertex: Vertex = this._halfedge.getEndpoint();
		if ( JPoint.equal(this._edge.vertexA, new JPoint(endVertex.x, endVertex.y))) {
			out = this._edge.vertexA;
		} else {
			out = this._edge.vertexB;
		}
		return out;
	}

	get points(): JPoint[] {
		let out: JPoint[] = this._edge.points;
		if (!JPoint.equal(out[0], this.initialPoint)) {
			out.reverse();
		}
		return out;
	}
	get edge(): JEdge {return this._edge}

}