import OCanvas from './OCanvas'

import Point, { Vector } from './Geom/Point';
import VoronoiDiagramCreator from './Voronoi/VoronoiDiagramCreator';

import VorDiagram from './Voronoi/VorDiagram';
import VorPolygon from './Voronoi/VorPolygon';

import RandomNumberGenerator from './Geom/RandomNumberGenerator'

const SIZE: Vector = new Vector( {x: 3600, y: 1800} );

const oc: OCanvas = new OCanvas(SIZE);
oc.saveDraw( __dirname + '/../test.png' );

const ctx: CanvasRenderingContext2D = oc.context;
//ctx.transform(1,0,-1,0,0,0);

let seed: number = 231;
let vdc: VoronoiDiagramCreator = new VoronoiDiagramCreator(SIZE, seed, 4000);
console.log('creating diagram')
vdc.createDiagram( 5 );
let vd: VorDiagram = vdc.diagram;

// vdc.diagram.drawDiagram( ctx );


const rnd = RandomNumberGenerator.makeRandomFloat(28);

let p: Point = new Point( 1800*rnd(), 900*rnd() );
console.log(p)
let vp = vd.getPolygonFromPoint( p );

// create island
console.log('creating island')
vd.height = 0.1*rnd();

let currH = 0.85;
vp.height = currH;
//vp.drawH(ctx, 1)

let que: {hh: number, pp: VorPolygon}[] = [{hh: vp.height, pp: vp}];

while (que.length !== 0) {
	let g = que.shift();
	if (g) {		
		if (g.hh > 0.2) {
			let ns: VorPolygon[] = vd.getNeighbors(g.pp);
			ns.forEach( (n: VorPolygon) => {
				if (n.height < 0.1 ) {
					n.height = g!.pp.height*0.8*(0.9+0.2*rnd());
					que.push({hh: n.height, pp: n});
				}
			})
		}
	}
}

vd.drawH( ctx, 0.2 );


