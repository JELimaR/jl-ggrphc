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

		let centers: {p: Point, r: number, h: number}[] = [];
		// for (let i=0;i<28;i++) {
		for (let i=0;i<40;i++) {
			centers.push({
				p: new Point( 3000*rnd()+300, 1200*rnd()+200 ),
				r: 420+1677*rnd(),
				h: 0.5 + 0.5*rnd()
			})
		}
		for (let c of centers) {
			let center: VorPolygon = this._diagram.getPolygonFromPoint( c.p );
			this.addIsland(
				RandomNumberGenerator.makeRandomFloat(otherSeed),
				center,
				c.r,
				c.h
			);
			console.log(c)
		}
		console.log(centers);
		/*
		[
  {
    p: Point { _x: 2573.467764, _y: 509.900637 },
    r: 3285.2256778366864,
    h: 0.7003650236874819
  },
  {
    p: Point { _x: 2663.282271, _y: 1263.084817 },
    r: 3994.120360214263,
    h: 0.9652651865035295
  },
  {
    p: Point { _x: 1740.547429, _y: 1246.784407 },
    r: 5978.314308062196,
    h: 0.7220224253833294
  },
  {
    p: Point { _x: 3260.301798, _y: 880.093198 },
    r: 7068.888270121068,
    h: 0.5400259494781494
  },
  {
    p: Point { _x: 3075.07421, _y: 1365.358081 },
    r: 4114.9609306789935,
    h: 0.5953297354280949
  },
  {
    p: Point { _x: 3141.129676, _y: 361.493395 },
    r: 3554.7582507804036,
    h: 0.7626547981053591
  },
  {
    p: Point { _x: 2350.131798, _y: 1127.325693 },
    r: 2037.4263654984534,
    h: 0.5964253153651953
  },
  {
    p: Point { _x: 554.04897, _y: 950.158 },
    r: 3523.8535574153066,
    h: 0.801789365708828
  },
  {
    p: Point { _x: 1563.498701, _y: 729.806291 },
    r: 7195.897166211158,
    h: 0.7318241875618696
  },
  {
    p: Point { _x: 2190.475899, _y: 234.089813 },
    r: 3988.697305139154,
    h: 0.929998729377985
  },
  {
    p: Point { _x: 2693.883392, _y: 617.557748 },
    r: 1206.649753589183,
    h: 0.8329464718699455
  },
  {
    p: Point { _x: 2427.034586, _y: 596.882342 },
    r: 2547.7516623437405,
    h: 0.7145073805004358
  },
  {
    p: Point { _x: 1917.381379, _y: 1098.212638 },
    r: 5452.618992693722,
    h: 0.5629675630480051
  },
  {
    p: Point { _x: 810.057639, _y: 770.794678 },
    r: 1014.4730574823916,
    h: 0.8364755753427744
  },
  {
    p: Point { _x: 930.622432, _y: 1353.652962 },
    r: 3432.5658170990646,
    h: 0.7466070838272572
  },
  {
    p: Point { _x: 1564.138374, _y: 1340.342633 },
    r: 6215.567829977721,
    h: 0.8209896516054869
  },
  {
    p: Point { _x: 3155.882786, _y: 895.260356 },
    r: 5839.079667683691,
    h: 0.8852745648473501
  },
  {
    p: Point { _x: 1608.683451, _y: 1325.158688 },
    r: 3892.9040862433612,
    h: 0.8780953381210566
  },
  {
    p: Point { _x: 815.840437, _y: 1217.677473 },
    r: 5575.0435912795365,
    h: 0.8515361789613962
  },
  {
    p: Point { _x: 409.338317, _y: 1149.712214 },
    r: 1194.9674357436597,
    h: 0.6972202397882938
  },
  {
    p: Point { _x: 2058.658368, _y: 1248.483989 },
    r: 5983.856828592718,
    h: 0.56250842474401
  },
  {
    p: Point { _x: 823.051757, _y: 328.564595 },
    r: 5228.827172555029,
    h: 0.7000426221638918
  },
  {
    p: Point { _x: 2366.176638, _y: 597.893803 },
    r: 2220.47693086043,
    h: 0.9785665310919285
  },
  {
    p: Point { _x: 1794.266611, _y: 903.904445 },
    r: 508.76311108097434,
    h: 0.7912459895014763
  },
  {
    p: Point { _x: 2722.869254, _y: 353.854616 },
    r: 4983.262444965541,
    h: 0.9676308445632458
  },
  {
    p: Point { _x: 2322.077333, _y: 1083.992121 },
    r: 4987.061128344387,
    h: 0.8394536003470421
  },
  {
    p: Point { _x: 1403.70943, _y: 1313.515094 },
    r: 7089.819339953363,
    h: 0.5698030721396208
  },
  {
    p: Point { _x: 585.746165, _y: 203.974931 },
    r: 1475.1507377810776,
    h: 0.6216023694723845
  }
]
		*/
	}

	addIsland(rnd: ()=>number, polStart: VorPolygon, radio: number, peakH: number): void {

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