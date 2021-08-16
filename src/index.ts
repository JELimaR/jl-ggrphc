import {createCanvas} from 'canvas';
import fs from 'fs';

import { Vector } from './Geom/Point';
import VoronoiDiagramCreator from './Voronoi/VoronoiDiagramCreator';
// import VorDiagram from './Voronoi/VorDiagram';

const SIZE: Vector = new Vector( {x: 3600, y: 1800} );

const canvas = createCanvas(SIZE.x, SIZE.y);
const ctx = canvas.getContext('2d');

let vdc: VoronoiDiagramCreator = new VoronoiDiagramCreator(SIZE.x, SIZE.y, 1000, 'poisson');

vdc.createDiagram( 2 );

vdc.diagram.drawDiagram( ctx );

const out = fs.createWriteStream( __dirname + '/../test.png');

const stream = canvas.createPNGStream()
stream.pipe(out);
console.log('finished');
