
import { Site } from 'voronoijs';
import OCanvas from './OCanvas'
import JPoint, {JVector} from './Geom/JPoint';
import GenerateMapVoronoiSites from './Voronoi/GenerateMapVoronoiSites';
import VoronoiDiagramMapCreator from './Voronoi/VoronoiDiagramMapCreator';
// import RandomNumberGenerator from './Geom/RandomNumberGenerator';
import JDiagram from './Voronoi/JDiagram'
import JCell from './Voronoi/JCell';
import JEdge from './Voronoi/JEdge';
// import * as shape from './Voronoi/shape';

import chroma from 'chroma-js';
import * as turf from '@turf/turf';
const colorScale = chroma.scale('Spectral').domain([1,0]);

import zonas from './Voronoi/zones' //cambiar

let SIZE: JVector = new JVector( {x: 3600, y: 1800} );
let pathName: string = __dirname + `/../test/${2}.png`;

let oc: OCanvas = new OCanvas(SIZE); 
oc.saveDraw( pathName );

oc.drawCell([
	new JPoint(-200,-100),
	new JPoint( 200,-100),
	new JPoint( 200, 100),
	new JPoint(-200, 100),
	new JPoint(-200,-100),
], '#FFFFFF')

console.log('init voronoi')
console.time('voronoi');
const entnum = {nr: 30, nz: 70};
let sites: Site[] = GenerateMapVoronoiSites.randomOnZonesSites(entnum);
let diagram: JDiagram = VoronoiDiagramMapCreator.createDiagram(sites, 1);
console.timeEnd('voronoi');

// console.log(diagram.sites);
// console.log(diagram.cells);


console.time('draw cells')
diagram.cells.forEach((c: JCell) => {
	let color: string = c.inZone ? colorScale(0.2).hex() : colorScale(0.05).hex();
	oc.drawCell(c.voronoiVertices, color); //cambiar nombre
})
console.log(diagram.cells.length)
console.timeEnd('draw cells')

diagram.edges.forEach((ve: JEdge) => {
	//oc.drawLine(ve.points, '#000000');
	//console.log(ve)
})

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
	total += c.area;
	if (c.inZone) {
		landZones += c.area;
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

/*
zonas.forEach((pol: turf.Feature<turf.Polygon>) => {
	let points: JPoint[] = pol.geometry.coordinates[0].map((p: turf.Position) => {
		return JPoint.fromTurf(p)
	})
	oc.drawLine(points, '#154488');
})
*/
