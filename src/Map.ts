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
		this._diagram.height = 0.1*rnd();

		let p: Point = new Point( 3600*rnd(), 1800*rnd() );
		let center: VorPolygon = this._diagram.getPolygonFromPoint( p );

		this.addIsland(rnd, center, 500);

	}

	addIsland(rnd: any, polCent: VorPolygon, radio: number) {

		let currH = 0.5*rnd()+0.5;
		polCent.height = currH;
		console.log(polCent)

		let que: {hh: number, pp: VorPolygon}[] = [{hh: polCent.height, pp: polCent}];

		while (que.length !== 0) {
			let g = que.shift();
			if (g) {		
				if ( Point.geogDistance( polCent.center, g.pp.center ) < radio ) {
					let ns: VorPolygon[] = this._diagram.getNeighbors(g.pp);
					ns.forEach( (n: VorPolygon) => {
						if (n.typeHeight !== 'land' ) {
							n.height = g!.pp.height;
							n.typeHeight = 'land'
							que.push({hh: n.height, pp: n});
						}
					})
				}
			}
		}

	}

	drawHeighmap(): void {
		this._diagram.drawH( this._oc.context );
	}

}