import {createCanvas} from 'canvas';
import fs from 'fs';

import { Vector } from './Geom/Point';
import VoronoiDiagram from './VoronoiDiagram';

const SIZE: Vector = new Vector( {x: 3600, y: 1800} );

const canvas = createCanvas(SIZE.x, SIZE.y)
const ctx = canvas.getContext('2d');

let vor: VoronoiDiagram = VoronoiDiagram.instance;
vor.createDiagram(SIZE.x, SIZE.y, 1500);

vor.drawDiagram( ctx );


const out = fs.createWriteStream(__dirname + '/../test.png')

const stream = canvas.createPNGStream()
stream.pipe(out);
console.log('finished');