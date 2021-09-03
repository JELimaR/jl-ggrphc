import OCanvas from './OCanvas'
import Point, { Vector } from './Geom/Point';
import VoronoiDiagramCreator from './Voronoi/VoronoiDiagramCreator';
import RandomNumberGenerator from './Geom/RandomNumberGenerator'
import VorDiagram from './Voronoi/VorDiagram';
import VorPolygon from './Voronoi/VorPolygon';

interface IMapConstructorEntry {
	seed: number;
	rel: number;
	pathName: string;
	cant: number
}

export default class Map {
	private _seed: number;
	private _SIZE: Vector = new Vector( {x: 3600, y: 1800} );
	private _diagram: VorDiagram;
	private _oc: OCanvas; // usar canvas distintos?
	// private _rndInt: (N: number) => number; // no es necesario
	// private _rnd: () => number;

	constructor(entry: IMapConstructorEntry) {
		this._seed = entry.seed;

		const vdc: VoronoiDiagramCreator = new VoronoiDiagramCreator(this._SIZE, this._seed, entry.cant);
		vdc.createDiagram( entry.rel );
		this._diagram = vdc.diagram;

		this._oc = new OCanvas(this._SIZE);
		this._oc.saveDraw( entry.pathName );
	}

	generateHeigh(otherSeed: number) {
		console.log('generating heighmap');

		const rnd = RandomNumberGenerator.makeRandomFloat(otherSeed);

		let centers: { p: Point, r: number, h: number}[] = [];
		// for (let i=0;i<28;i++) {
		for (let i=0;i<40;i++) {
			centers.push({
				p: new Point( 3000*rnd()+300, 1200*rnd()+200 ),
				r: 420+2677*rnd(),
				h: 0.5 + 0.5*rnd()
			})
		}
		for (let c of centers) {
			console.log( c)
			let center: VorPolygon = this._diagram.getPolygonFromPoint( c.p );
			this.addIsland(
				RandomNumberGenerator.makeRandomFloat(otherSeed),
				center,
				c.r,
				c.h
			);
		}
		console.log(centers);
	}

	addIsland(rnd: ()=>number, polStart: VorPolygon, radio: number, peakH: number): void {
		const limit: number = 0.01;
		// decr per km
		const decr: number = Math.exp(Math.log(limit)/radio);
		// qeue
		interface QItem {
			h: number;
			p: VorPolygon;
		}
		let qeue: QItem[] = [];
		qeue.push({h: peakH, p: polStart});
		polStart.mark = true;
		for (let i = 0; i<qeue.length; i++) {
			const {p: pol, h}: QItem = qeue[i];
			pol.height = h + pol.height;
			if (pol.height > 1) pol.height = 1;
			if (pol.height > 0.2) pol.typeHeight = 'land';
			if (h > limit) {
				this._diagram.getNeighbors(pol).forEach((n: VorPolygon) => {
					if (!n.mark) {
						const parentDis: number = Point.geogDistance( n.center, pol.center );
						const height: number = Math.pow(decr, parentDis) * h  * (rnd()*0.2+0.9);
						qeue.push({h: height, p: n});
						n.mark = true;
					}
				});
			}
			if (i % 1000 === 0)
				console.log(i, h);
		}
		for (let i = 0; i<qeue.length; i++) {
			qeue[i].p.mark = false;
		}
	}

	addIslandDepracted(rnd: ()=>number, polStart: VorPolygon, radio: number, peakH: number): void {

		const decr: number = Math.exp(-4.5/radio);
		// start island
		polStart.height = peakH;
		polStart.mark = true;
		polStart.typeHeight = 'land';
		console.log(polStart);
		// qeue
		let que: {currh: number, currP: VorPolygon}[] = [{currh: peakH, currP: polStart}];
		let dismark: VorPolygon[] = [];

		while ( que.length !== 0 ) {
			const qe = que.shift();
			if (qe) {
				const currh: number = qe.currh;
				const currP: VorPolygon = qe.currP;
				
				dismark.push(currP);
				if (dismark.length % 1000 === 0) 
					console.log(dismark.length, currh);
				
				this._diagram.getNeighbors(currP).forEach( (n: VorPolygon) => {
					if ( !n.mark ) {
						n.mark = true;

						const parentDis: number = Point.geogDistance( n.center, currP.center );
						const h: number = Math.pow(decr, parentDis) * currh/* * (0.2*rnd() + 0.9)*/
						
						n.height = n.height + h;

						if (n.height > 1) 
							n.height = 1
						if (n.height > 0.2)
							n.typeHeight = 'land';
						if ( h > 0.01 ) {
							que.push({currh: h, currP: n});
						}
					}	
				})
			}
		}

		dismark.forEach((p: VorPolygon) => {
			p.mark = false;
		})
	}

	drawHeighmap(drawHeighWater: boolean): void {
		this._diagram.drawH( this._oc.context, drawHeighWater );
	}

}