import { Cell, Diagram, Edge } from 'voronoijs';
import JPoint, {JVector} from '../Geom/JPoint';
import JSite from './JSite';

import RandomNumberGenerator from '../Geom/RandomNumberGenerator';
import * as turf from '@turf/turf'

interface IJEdgeConstructor {
	e: Edge;
	ls: JSite;
	rs?: JSite;
	va: JPoint;
	vb: JPoint;
}

export default class JEdge {

	private _edge: Edge;
	private _lSite: JSite;
	private _rSite: JSite | undefined;
	private _vertexA: JPoint;
	private _vertexB: JPoint; 

	constructor({e, ls, rs, va, vb}: IJEdgeConstructor) {
		this._edge = e;
		this._lSite = ls;
		this._rSite = rs;
		this._vertexA = va;
		this._vertexB = vb;
	}

	// get diagramId(): string { return this._id}

	get lSite(): JSite {return this._lSite}
	get rSite(): JSite | undefined {return this._rSite}
	get vertexA(): JPoint { return this._vertexA}
	get vertexB(): JPoint { return this._vertexB}

	get diamond(): turf.Feature<turf.Polygon> {
		if (this._rSite) {
			return turf.polygon([[
				this._vertexA.toTurfPosition(),
				this._lSite.point.toTurfPosition(),
				this._vertexB.toTurfPosition(),
				this._rSite.point.toTurfPosition(),
				this._vertexA.toTurfPosition(),
			]])
		} else {
			throw new Error('No existe diamond para un edge sin rSite');
		}
	}

	get points(): JPoint[] {
		let out: JPoint[] = [];
		if (this._rSite) {
			const randf: () => number = RandomNumberGenerator.makeRandomFloat(this._rSite.id);
			const pointsList: turf.Position[] = noiseTraceLine(
				[this._vertexA.toTurfPosition(), this._vertexB.toTurfPosition()],
				this.diamond,
				randf
			);
			pointsList.forEach((element: turf.Position) => {
				out.push( new JPoint( element[0], element[1] ) )
			})
		} else {
			out = [this._vertexA, this._vertexB];
		}
		return out;
	}
	
}

export const edgeNoisePoints = (edge: Edge): JPoint[] => {
	let out: JPoint[] = [];
	if (edge.rSite) {
		const randf: () => number = RandomNumberGenerator.makeRandomFloat(edge.rSite.id);
		const pointsList: turf.Position[] = noiseTraceLine(
			[[edge.va.x, edge.va.y], [edge.vb.x, edge.vb.y]],
			constructDiamond(edge),
			randf
		);
		pointsList.forEach((element: turf.Position) => {
			out.push( new JPoint( element[0], element[1] ) )
		})
	}  else {
		out = [JPoint.fromVertex(edge.va), JPoint.fromVertex(edge.vb)];
	}
	return out;
}

const constructDiamond = (edge: Edge): turf.Feature<turf.Polygon> => {
	return turf.polygon([[
		[edge.va.x, edge.va.y],
		[edge.lSite.x, edge.lSite.y],
		[edge.vb.x, edge.vb.y],
		[edge.rSite.x, edge.rSite.y],
		[edge.va.x, edge.va.y],
	]]);
}

export const noiseTraceLine = (pin: turf.Position[], diamond: turf.Feature<turf.Polygon>, randf: () => number): turf.Position[] => {
	let out: turf.Position[] = pin;
	let ok: boolean = false;

	while (!ok) {
		let aux: turf.Position[] = [[...out[0]]];
		for (let i=0; i<out.length-1;i++) {
			let tout = noiseMidleBetween(out[i], out[i+1], diamond, randf);
			aux = aux.concat(tout.two);
			ok = ok || tout.ok;
		}
		out = [...aux];	
	}
	return out;
}

const noiseMidleBetween = (ini: turf.Position, fin: turf.Position, diamond: turf.Feature<turf.Polygon>, randf: () => number): {two: turf.Position[], ok: boolean} => {
	let two: turf.Position[];
	let ok: boolean;

	let dist: number = turf.distance(ini,fin, {units: 'kilometers'})

	if (dist < 1) {
		ok = true;
		two = [ fin];
	} else {
		ok = false;

		let degres: number = turf.lengthToDegrees(dist, 'kilometers')

		two = [
			generateRandomPointInDiamond(ini, fin, diamond, degres, randf),
			fin
		]
	}

	return { two, ok }
}

const generateRandomPointInDiamond = (ini: turf.Position, fin: turf.Position, diamond: turf.Feature<turf.Polygon>, degres: number, randf: () => number): turf.Position => {

	let mdx: number = (ini[0]+fin[0])/2 + 0.4*degres*(randf() - 0.5); 
	let mdy: number = (ini[1]+fin[1])/2 + 0.4*degres*(randf() - 0.5);

	let out: turf.Position = [mdx, mdy];

	while (!turf.booleanPointInPolygon(out, diamond)) {
		mdx = (ini[0]+fin[0])/2 + 0.4*degres*(randf() - 0.5); 
		mdy = (ini[1]+fin[1])/2 + 0.4*degres*(randf() - 0.5);

		out = [mdx, mdy];
	}

	return out;
}

