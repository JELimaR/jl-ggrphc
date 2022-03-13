
import { Site } from 'voronoijs';
import GenerateMapVoronoiSites from './Voronoi/GenerateMapVoronoiSites';
import VoronoiDiagramMapCreator from './Voronoi/VoronoiDiagramMapCreator';
import JDiagram from './Voronoi/JDiagram'
import JWorldMap from './JWorldMap';
import JHeightMap from './heightmap/JHeightMap';


export default class JMapGenerator {
	
	private _diagram: JDiagram;
	constructor(TOTAL: number) {
		if (TOTAL < 5) TOTAL = 5;
		console.log('init voronoi');
		console.time('voronoi');
		this._diagram = VoronoiDiagramMapCreator.createDiagram(TOTAL, 1);
		console.timeEnd('voronoi');
	}

	generate(TOTAL: number): JWorldMap {
		if (TOTAL < 5) TOTAL = 5;
		console.log('init voronoi');
		console.time('voronoi');
		let diagram: JDiagram = VoronoiDiagramMapCreator.createDiagram(TOTAL, 1);
		console.timeEnd('voronoi');

		return new JWorldMap(diagram);
	}

	generateHeightMap(): JHeightMap {
		return new JHeightMap(this._diagram);
	}
}