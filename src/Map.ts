import OCanvas from './OCanvas'
import Point, { Vector } from './Geom/Point';
import VoronoiDiagramCreator from './Voronoi/VoronoiDiagramCreator';
import RandomNumberGenerator from './Geom/RandomNumberGenerator'

export default class Map {
	private _seed: number;
	private _rndInt: (N: number) => number; // no es necesario
	private _rnd: () => number;

	constructor(s: number = 0) {
		this._seed = s;
		this._rndInt = RandomNumberGenerator.makeRandomInt( this._seed );
		this._rnd = RandomNumberGenerator.makeRandomFloat( this._rndInt(this._seed) );
	}

	createMainGrid(  ) {
		// const vd: VoronoiDiagramCreator;
	}

}