import VoronoiDiagramMapCreator from './Voronoi/VoronoiDiagramMapCreator';
import JDiagram from './Voronoi/JDiagram'
import JHeightMap from './heightmap/JHeightMap';
import JTempMap from './heightmap/JTempMap';

export default class JWorld {
	
	private _diagram: JDiagram;
	private _heightMap: JHeightMap | undefined;
	private _temperatureMap: JTempMap | undefined;
	
	constructor(TOTAL: number) {
		if (TOTAL < 5) TOTAL = 5;
		console.log('init voronoi');
		console.time('voronoi');
		this._diagram = VoronoiDiagramMapCreator.createDiagram(TOTAL, 1);
		console.timeEnd('voronoi');
	}

	get diagram(): JDiagram { return this._diagram }

	generateHeightMap(): JHeightMap {
		if (!this._heightMap)
			this._heightMap = new JHeightMap(this._diagram);
		return this._heightMap;
	}
	generateTemperatureMap(): JTempMap {
		if (!this._temperatureMap)
			this._temperatureMap = new JTempMap(this._diagram, this.generateHeightMap());
		return this._temperatureMap;
	}
}