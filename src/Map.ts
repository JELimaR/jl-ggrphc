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

		for (let i=0;i<5;i++) {
			let p: Point = new Point( 3600*rnd(), 1800*rnd() );
			let center: VorPolygon = this._diagram.getPolygonFromPoint( p );

			this.addIsland(rnd, center, 4000/(i+1));
		}
		

	}

	addIsland(rnd: any, polStart: VorPolygon, radio: number) {

		let currH = 0.5*rnd()+0.5; // pico
		
		// start island
		polStart.height = currH;
		polStart.mark = true;
		polStart.typeHeight = 'land';
		console.log(polStart)

		// se crea la cola
		let que: VorPolygon[] = [polStart];
		let dismark: VorPolygon[] = [];
		
		while (que.length !== 0 ) {
			let poli = que.shift();
			if (poli) {
				dismark.push(poli);

				const centerDis: number = Point.geogDistance( polStart.center, poli.center );
				
				let ns: VorPolygon[] = this._diagram.getNeighbors(poli);
				ns.forEach( (n: VorPolygon) => {
					const h: number = ((radio-centerDis)/radio * 0.75 + 0.25 * rnd())*currH // mejorar
					if ( !n.mark && h > 0.01 ) {
						
						n.mark = true;
						n.height += h;
						if (n.height > 1) {n.height = 1}
						n.typeHeight = 'land';
						que.push(n);
					}						
				})
				
			}
		}

		dismark.forEach( (p: VorPolygon) => {
			p.mark = false;
		} )

	}

	drawHeighmap(): void {
		this._diagram.drawH( this._oc.context );
	}

}