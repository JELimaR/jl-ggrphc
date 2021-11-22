console.time('all');
import { Site, Vertex } from 'voronoijs';
import DrawerMap from './DrawerMap'
import JPoint, {JVector} from './Geom/JPoint';
import GenerateMapVoronoiSites from './Voronoi/GenerateMapVoronoiSites';
import VoronoiDiagramMapCreator from './Voronoi/VoronoiDiagramMapCreator';
import JDiagram from './Voronoi/JDiagram'
import JCell from './Voronoi/JCell';
// import JEdge from './Voronoi/JEdge';

import chroma from 'chroma-js';
import * as turf from '@turf/turf';
import { LandRegs } from './zones/LandRegs';
// import { BuffRegs } from './zones/BuffRegs';
import JMap from './JMap';
import JEdge from './Voronoi/JEdge';
const colorScale = chroma.scale('Spectral').domain([1,0]);

const tam: number = 3600;
let SIZE: JVector = new JVector( {x: tam, y: tam/2} );
let pathName: string = __dirname + `/../test/${2}.png`;

let dm: DrawerMap = new DrawerMap(SIZE);
dm.saveDraw( pathName );

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
const zoom: number = 10;
dm.setZoom(zoom);
const cx: number = -106;
const cy: number = 40;
dm.setCenterpan(new JPoint(cx, cy))

const polContainer = turf.polygon([dm.getPointsBuffDrawLimits()]);
let polJP: JPoint[] = [];
polContainer.geometry.coordinates[0].forEach((coords) => {
	polJP.push(new JPoint(coords[0], coords[1]));
})
const polCenter = turf.polygon([dm.getPointsBuffCenterLimits()]);
let pointsPolCenter: JPoint[] = [];
polCenter.geometry.coordinates[0].forEach((coords) => {
	pointsPolCenter.push(new JPoint(coords[0], coords[1]));
})

console.log('center')
console.log(dm.getPanzoom().centerX, dm.getPanzoom().centerY)
// 200 mil - 1 min
// 400 mil - 2 mins
// max: 600 3 mins
const TOTAL: number = 50;

console.log('init voronoi');
console.time('voronoi');
console.time('Generate Sites')
let sites: Site[] = GenerateMapVoronoiSites.randomOnBuffRegsSites(TOTAL*1000);
console.timeEnd('Generate Sites')
let diagram: JDiagram = VoronoiDiagramMapCreator.createDiagram(sites, 1);
console.timeEnd('voronoi');

let map: JMap = new JMap(diagram);

// console.log(diagram.sites);
// console.log(diagram.cells);

console.log('init draw cells');
console.time('draw cells');
// let areas: number[] = [];
diagram.cells.forEach((c: JCell) => {	
	if (!turf.booleanDisjoint(polContainer, c.toTurfPolygonSimple())) {
		let color: string = c.isLand ? colorScale(c.height).hex() : colorScale(0.05).hex();
		const points: JPoint[] = (zoom >= 10) ? c.allVertices : c.voronoiVertices;
		dm.draw({
			points,
			strokeColor: '#A84311',
			fillColor: color
		});
		// areas.push(c.area);
	}
})
// console.log('min', Math.min(...areas))
// console.log('max', Math.max(...areas))
// let sum = 0;
// areas.forEach((n: number) => sum += n)
// console.log('prom', sum/areas.length)
console.log(diagram.cells.length)
console.timeEnd('draw cells')

/*
diagram.diagram.edges.forEach((e: Edge) => {
	oc.drawLine([new Point(e.va.x, e.va.y), new Point(e.vb.x, e.vb.y)], '#10118F');
})
*/
/*
diagram.diagram.edges.forEach((e: Edge) => {
	if (e.rSite)
		oc.drawLine([new Point(e.lSite.x, e.lSite.y), new Point(e.rSite.x, e.rSite.y)], '#50800F');
})
*/

let total: number = 0;
let landZones: number = 0;
let cantlandZones: number = 0;
diagram.cells.forEach((c: JCell) => {
	total += c.areaSimple;
	if (c.isLand) {
		landZones += c.areaSimple;
		cantlandZones++;
	}
})
total = total;
landZones = landZones;
console.log('total', Math.round(total));
console.log('promedio', Math.round(total/diagram.cells.length));
console.log()
console.log('sup landZones', Math.round(landZones));
console.log('promedio landZones', Math.round(landZones/cantlandZones));
console.log('cantidad landZones',(cantlandZones))
console.log()
console.log('sup resto', Math.round(total-landZones));
console.log('promedio resto', Math.round((total-landZones)/(diagram.cells.length-cantlandZones)));
console.log('cantidad resto',(diagram.cells.length-cantlandZones))

console.timeEnd('all');

dm.draw({
	points: pointsPolCenter,
	strokeColor: '#FF0000',
	fillColor: '#FF000025'
})
console.log(pointsPolCenter)