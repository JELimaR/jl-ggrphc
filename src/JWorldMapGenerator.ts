
import { Site } from 'voronoijs';
import JPoint, {JVector} from './Geom/JPoint';
import GenerateMapVoronoiSites from './Voronoi/GenerateMapVoronoiSites';
import VoronoiDiagramMapCreator from './Voronoi/VoronoiDiagramMapCreator';
import JDiagram from './Voronoi/JDiagram'
import JWorldMap from './JWorldMap';


export default class JWorldMapGenerator {
	static generate(TOTAL: number): JWorldMap {
		console.log('init voronoi');
		console.time('voronoi');
		console.time('Generate Sites');
		let sites: Site[] = GenerateMapVoronoiSites.randomOnBuffRegsSites(TOTAL*1000);
		console.timeEnd('Generate Sites');
		let diagram: JDiagram = VoronoiDiagramMapCreator.createDiagram(sites, 1);
		console.timeEnd('voronoi');

		return new JWorldMap(diagram);
	}
}