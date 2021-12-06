console.time('all');
import fs from 'fs';

import * as JCellToDrawEntryFunctions from './JCellToDrawEntryFunctions';
import DrawerMap from './DrawerMap'
import JPoint, {JVector} from './Geom/JPoint';
import JWorldMapGenerator from './JWorldMapGenerator';
import JWorldMap, { JContintentMap, createICellContainerFromCellArray } from './JWorldMap';
import JCell from './Voronoi/JCell';
import JRegionMap from './JRegionMap';
import DataInformationFilesManager from './DataInformationLoadAndSave';

const tam: number = 3600;
let SIZE: JVector = new JVector( {x: tam, y: tam/2} );

DataInformationFilesManager.configPath( __dirname + `/../data`);

let dm: DrawerMap = new DrawerMap(SIZE, __dirname + `/../img`);
// dm.saveDrawStream( 'map.png' );
dm.setZoom(0)
dm.setCenterpan(new JPoint(120,-15));
// navigate
console.log('zoom: ', dm.zoomValue)
console.log('center: ', dm.centerPoint) // JPoint { _x: 37.748736, _y: -16.724721 }


console.log('draw buff');
console.log(dm.getPointsBuffDrawLimits());
console.log('center buff');
console.log(dm.getPointsBuffCenterLimits());

const TOTAL: number = 100;
let jwm: JWorldMap = JWorldMapGenerator.generate(TOTAL);

// dm.drawCellMap(jwm, JCellToDrawEntryFunctions.heighLand());
dm.drawCellMap(jwm, JCellToDrawEntryFunctions.land(1));
/*
let cell: JCell = jwm.diagram.getCellFromPoint(new JPoint(35, -18));
let reg: JRegionMap = new JRegionMap();
reg.addCell(cell);
reg.growing(jwm, 2, 250000);

dm.drawCellMap(
	reg,
	JCellToDrawEntryFunctions.colors({strokeColor: 'none', fillColor: '#78121280'})
);

let area = 0;
reg.forEachCell((c: JCell) => { area += c.area })
console.log('reg area: ', area);
*/

const randomColors = [
	'#057722',
	'#343568',
	'#47cbcf',
	'#fb0266',
	'#f8cda0',
	'#151a8a',
	'#196341',
]
/*
jwm._islands.forEach((isl: JRegionMap, i: number) => {
	if (i < 3) {
		const icolor: number = Math.round(Math.random()*(randomColors.length-1));
		dm.drawCellMap(
			isl,
			JCellToDrawEntryFunctions.colors({
				strokeColor: 'none',
				fillColor: '#458889'//`${randomColors[icolor]}`
			})
		)
		/*
		dm.drawCellMap(
			isl.getLimitCells(),
			JCellToDrawEntryFunctions.colors({
				strokeColor: '#000000',
				fillColor: `#FFFFFF`
			})
		)
		
		console.log(`reg area island ${i+1}:`, isl.area);
		console.log();
	}
});
*/
jwm._continents.forEach((continent: JContintentMap, id: number) => {
	const icolor: number = Math.round(Math.random()*(randomColors.length-1));
	continent._islands.forEach((isl: JRegionMap) => {
		dm.drawCellMap(
			isl,
			JCellToDrawEntryFunctions.colors({
				strokeColor: 'none',
				fillColor: `${randomColors[id]}`
			})
		)
	})
})

/*
const centerCell = jwm.diagram.getCellFromPoint(new JPoint(125,0));
dm.drawCellMap(
	createICellContainerFromCellArray([centerCell]),
	JCellToDrawEntryFunctions.colors({
		strokeColor: 'none',
		fillColor: '#000000'//`${randomColors[icolor]}`
	})
)
*/
dm.saveDrawFile( 'saveMap1.png' );

console.timeEnd('all');