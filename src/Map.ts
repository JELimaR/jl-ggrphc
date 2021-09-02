import OCanvas from './OCanvas'
import Point, { Vector } from './Geom/Point';
import VoronoiDiagramCreator from './Voronoi/VoronoiDiagramCreator';
import RandomNumberGenerator from './Geom/RandomNumberGenerator'
import VorDiagram from './Voronoi/VorDiagram';
import VorPolygon from './Voronoi/VorPolygon';
import { random } from 'chroma-js';

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
		this._diagram.height = 0;
/*
		for (let i=0;i<3;i++) {
			let p: Point = new Point( 3000*rnd()+300, 1500*rnd() +150);
			let center: VorPolygon = this._diagram.getPolygonFromPoint( p );

			this.addIsland(rnd, center, 3000/(i+1));
		}
*/

		let centers: {p: Point, r: number, h: number}[] = [
			{p: new Point( 300, 900), r: 8011, h: 0.85},
			{p: new Point( 320, 750), r: 5835, h: 0.65},
			{p: new Point( 320, 550), r: 2835, h: 0.74},
			{p: new Point( 320, 450), r: 3135, h: 0.81}
		];
		for (let c of centers) {
			let center: VorPolygon = this._diagram.getPolygonFromPoint( c.p );
			this.addIsland(rnd, center, c.r, c.h);
		}		

	}

	addIsland(rnd: any, polStart: VorPolygon, radio: number, peakH: number) {

		let decr: number = Math.exp(-4.5/radio);
		
		// start island
		polStart.height = peakH;
		polStart.mark = true;
		polStart.typeHeight = 'land';
		console.log(polStart)

		// qeue
		let que: {currh: number, currP:VorPolygon}[] = [{currh:peakH, currP:polStart}];
		let dismark: VorPolygon[] = [];
		let count = 0;
		while (que.length !== 0 ) {
			let q = que.shift();
			if (q) {
				//const {currh, currP} = q;
				
				dismark.push(q.currP);

				if (dismark.length % 1000 === 0) {
					console.log(dismark.length, q.currh);
				}
				
				let ns: VorPolygon[] = this._diagram.getNeighbors(q.currP);
				ns.forEach( (n: VorPolygon) => {

					if (!n.mark) {
						n.mark = true;

						const parentDis: number = Point.geogDistance( n.center, q!.currP.center );
						const height: number = Math.pow(decr, parentDis) * q!.currh * (0.2*rnd() + 0.9);

						n.height = n.height + height;
						if (n.height > 1) 
							n.height = 1
						if (n.height > 0.2)
							n.typeHeight = 'land';

						if ( height > 0.1 ) {
							count++;
							que.push({currh: height, currP:n});
						}
					}
					/*
					if (que.length > preleng) {
						console.log('es true')
					}*/
								
				})
			}
		}
		console.log('finished')
		dismark.forEach((p: VorPolygon) => {
			p.mark = false;
		})

	}

	drawHeighmap(drawHeighWater: boolean): void {
		this._diagram.drawH( this._oc.context, drawHeighWater );
	}


}