console.time('all');
import fs from 'fs';


import * as JCellToDrawEntryFunctions from './JCellToDrawEntryFunctions';
import DrawerMap from './DrawerMap'
import JPoint, {JVector} from './Geom/JPoint';
import JWorldMapGenerator from './JWorldMapGenerator';
import JWorldMap from './JWorldMap';
import JCell from './Voronoi/JCell';
import JRegionMap from './JRegionMap';

const tam: number = 3600;
let SIZE: JVector = new JVector( {x: tam, y: tam/2} );
let pathName: string = __dirname + `/../img`;
fs.mkdirSync(pathName, {recursive: true});

let dm: DrawerMap = new DrawerMap(SIZE);
// dm.saveDraw( pathName, 'map.png' );
dm.setZoom(7)
dm.setCenterpan(new JPoint(35,-15));
// navigate
console.log('zoom: ', dm.zoomValue)
console.log('center: ', dm.centerPoint) // JPoint { _x: 37.748736, _y: -16.724721 }


console.log('draw buff');
console.log(dm.getPointsBuffDrawLimits());
console.log('center buff');
console.log(dm.getPointsBuffCenterLimits());

const TOTAL: number = 700;
let jwm: JWorldMap = JWorldMapGenerator.generate(TOTAL);

dm.drawCellMap(jwm, JCellToDrawEntryFunctions.heighLand());
// dm.drawCellMap(jwm, JCellToDrawEntryFunctions.land(1));
dm.saveMap( pathName, 'saveMap0.png' );
let cell: JCell = jwm.diagram.getCellFromPoint(new JPoint(37.7487, -16.7247));
let reg: JRegionMap = new JRegionMap(cell);
reg.addCell(jwm.diagram.getCellFromPoint(new JPoint(33, -16.7247)));
reg.growing(jwm, 8, 250000);

dm.drawCellMap(reg, JCellToDrawEntryFunctions.colors({strokeColor: 'none', fillColor: '#78121280'}))
// dm.drawCellMap(jwm, JCellToDrawEntryFunctions.colors({strokeColor: '#FF000080', fillColor: 'none'}))

let area = 0;
reg.forEachCell((c: JCell) => { area += c.area })
console.log('reg area: ', area);

console.timeEnd('all');

dm.saveMap( pathName, 'saveMap1.png' );