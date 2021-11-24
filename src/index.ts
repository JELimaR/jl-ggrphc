console.time('all');
import fs from 'fs';

import DrawerMap from './DrawerMap';
import JPoint, {JVector} from './Geom/JPoint';
import JWorldMapGenerator from './JWorldMapGenerator';
import JWorldMap from './JWorldMap';

const tam: number = 3600;
let SIZE: JVector = new JVector( {x: tam, y: tam/2} );
let pathName: string = __dirname + `/../img`;
fs.mkdirSync(pathName, {recursive: true});

let dm: DrawerMap = new DrawerMap(SIZE);
dm.saveDraw( pathName, 'map.png' );


console.log('center: ', dm.centerPoint)

dm.zoomIn();
dm.zoomIn();
dm.zoomIn();
dm.zoomIn();
console.log('center: ', dm.centerPoint)
dm.toRight();
dm.toRight();
dm.toRight();
dm.toBottom();
dm.toBottom();
dm.zoomIn();
console.log('center: ', dm.centerPoint)
dm.zoomIn();

console.log('center: ', dm.centerPoint)


console.log('draw buff');
console.log(dm.getPointsBuffDrawLimits());
console.log('center buff');
console.log(dm.getPointsBuffCenterLimits());

const TOTAL: number = 10;
let wm: JWorldMap = JWorldMapGenerator.generate(TOTAL);
wm.drawHeight(dm);

console.timeEnd('all');

