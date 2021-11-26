console.time('all');
import fs from 'fs';
import chroma from 'chroma-js';


import * as JCellToDrawEntryFunctions from './JCellToDrawEntryFunctions';
import DrawerMap from './DrawerMap'
import JPoint, {JVector} from './Geom/JPoint';
import JWorldMapGenerator from './JWorldMapGenerator';
import JWorldMap from './JWorldMap';
import JCell from './Voronoi/JCell';

const tam: number = 3600;
let SIZE: JVector = new JVector( {x: tam, y: tam/2} );
let pathName: string = __dirname + `/../img`;
fs.mkdirSync(pathName, {recursive: true});

let dm: DrawerMap = new DrawerMap(SIZE);
dm.saveDraw( pathName, 'map.png' );
console.log('0',dm.getPointsBuffDrawLimits());
console.log('xStep', dm.getPanzoom().getXstep());

// navigate
dm.zoomIn();
dm.zoomIn();
dm.zoomIn();
dm.zoomIn();
dm.toTop();
dm.zoomIn();
dm.zoomIn();
dm.toRight();
dm.toRight();
dm.zoomIn();
dm.zoomIn();
console.log('1',dm.getPointsBuffDrawLimits());
console.log('xStep', dm.getPanzoom().getXstep())
dm.zoomIn();
dm.zoomIn();
dm.zoomIn();
dm.zoomIn();
dm.zoomIn();
dm.toTop();
dm.zoomOut();
console.log('zoom: ', dm.zoomValue)
console.log('center: ', dm.centerPoint)


console.log('draw buff');
console.log(dm.getPointsBuffDrawLimits());
console.log('center buff');
console.log(dm.getPointsBuffCenterLimits());

const TOTAL: number = 100;
let jwm: JWorldMap = JWorldMapGenerator.generate(TOTAL);

dm.drawCellMap(jwm, JCellToDrawEntryFunctions.heighLand());
dm.drawCellMap(jwm, JCellToDrawEntryFunctions.land(0));
//dm.drawCellMap(jwm, JCellToDrawEntryFunctions.colors({strokeColor: '#78121210', fillColor: '#78121210'}))

let cell: JCell = jwm.diagram.getCellFromPoint(dm.centerPoint);
console.log(cell.area)
dm.draw(cell.allVertices, {
	strokeColor: '#761100',
	fillColor: '#761100'
})

console.timeEnd('all');
