console.time('all');
import { Site } from 'voronoijs';
import DrawerMap from './DrawerMap'
import JPoint, {JVector} from './Geom/JPoint';
import GenerateMapVoronoiSites from './Voronoi/GenerateMapVoronoiSites';
import VoronoiDiagramMapCreator from './Voronoi/VoronoiDiagramMapCreator';
import JDiagram from './Voronoi/JDiagram'
import JCell from './Voronoi/JCell';
// import JEdge from './Voronoi/JEdge';

import chroma from 'chroma-js';
import * as turf from '@turf/turf';
import JMap from './JMap';
import fs from 'fs';
const colorScale = chroma.scale('Spectral').domain([1,0]);

const tam: number = 3600;
let SIZE: JVector = new JVector( {x: tam, y: tam/2} );
let pathName: string = __dirname + `/../test/${2}.png`;

let dm: DrawerMap = new DrawerMap(SIZE);
dm.saveDraw( pathName );

// fondo
dm.draw({
	points: [
		new JPoint(-200,-100),
		new JPoint( 200,-100),
		new JPoint( 200, 100),
		new JPoint(-200, 100),
		new JPoint(-200,-100),
	],
	strokeColor: '#FFFFFF',
	fillColor: 'none'
})
const zoom: number = 2;
dm.setZoom(zoom);
const cx: number = -15;
const cy: number = -53;
dm.setCenterpan(new JPoint(cx, cy));

console.log('center')
console.log(dm.getPanzoom().centerX, dm.getPanzoom().centerY)
console.log(dm.getPanzoom().getPanXRange(), dm.getPanzoom().getPanYRange())
// 200 mil - 1 min
// 400 mil - 2 mins
// max: 600 3 mins
const TOTAL: number = 10;

console.log('init voronoi');
console.time('voronoi');
console.time('Generate Sites')
let sites: Site[] = GenerateMapVoronoiSites.randomOnBuffRegsSites(TOTAL*1000);
console.timeEnd('Generate Sites')
let diagram: JDiagram = VoronoiDiagramMapCreator.createDiagram(sites, 1);
console.timeEnd('voronoi');

let jmap: JMap = new JMap(diagram);


console.log('init draw cells');
console.time('draw cells');

jmap.drawHeigh(dm)

const xstep = (dm.getPointsBuffDrawLimits()[2].x - dm.getPointsBuffDrawLimits()[1].x)/2;
let i = -1*dm.getPanzoom().getPanXRange();
let num: number = 1;
while (i<=dm.getPanzoom().getPanXRange()) {
	const ystep = (dm.getPointsBuffDrawLimits()[1].y - dm.getPointsBuffDrawLimits()[0].y)/2;
	let j = -1*dm.getPanzoom().getPanYRange();
	while (j<=dm.getPanzoom().getPanYRange()) {

		if (!fs.existsSync((__dirname + `/../test/${zoom}/`)))
			fs.mkdirSync(__dirname + `/../test/${zoom}/`);

		let drawer: DrawerMap = new DrawerMap(SIZE);
		drawer.saveDraw( __dirname + `/../test/${zoom}/${num}.png` );

		drawer.setZoom( zoom);
		drawer.setCenterpan( new JPoint(i,j) );

		console.log(i,j)
		jmap.drawHeigh(drawer);

		j+=ystep;
		num++;
	}
	i+=xstep;
}
console.log(dm.getPointsBuffCenterLimits())
console.timeEnd('all');

