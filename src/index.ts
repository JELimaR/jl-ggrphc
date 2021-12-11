console.time('all');
import fs from 'fs';
import chroma from 'chroma-js';

import * as JCellToDrawEntryFunctions from './JCellToDrawEntryFunctions';
import DrawerMap from './DrawerMap'
import JPoint, {JVector} from './Geom/JPoint';
import JWorldMapGenerator from './JWorldMapGenerator';
import JWorldMap, { JContinentMap, createICellContainerFromCellArray } from './JWorldMap';
import JCell from './Voronoi/JCell';
import JRegionMap from './JRegionMap';
import DataInformationFilesManager from './DataInformationLoadAndSave';
import * as utlts from 'jl-utlts';
import dividirCont2 from './dividirCont2'

const CUF = utlts.CollectionsUtilsFunctions.getInstance();

const tam: number = 3600;
let SIZE: JVector = new JVector( {x: tam, y: tam/2} );

DataInformationFilesManager.configPath( __dirname + `/../data`);

let dm: DrawerMap = new DrawerMap(SIZE, __dirname + `/../img`);
// dm.saveDrawStream( 'map.png' );
dm.setZoom(0) //5
dm.setCenterpan(new JPoint(25,-40));
// navigate
console.log('zoom: ', dm.zoomValue)
console.log('center: ', dm.centerPoint) // JPoint { _x: 37.748736, _y: -16.724721 }


console.log('draw buff');
console.log(dm.getPointsBuffDrawLimits());
console.log('center buff');
console.log(dm.getPointsBuffCenterLimits());

const TOTAL: number = 5;
let jwm: JWorldMap = JWorldMapGenerator.generate(TOTAL);

dm.drawCellMap(jwm, JCellToDrawEntryFunctions.heighLand(1));
dm.drawCellMap(jwm, JCellToDrawEntryFunctions.land(0.5));

/*
let cell: JCell = jwm.diagram.getCellFromPoint(new JPoint(35, -1.8));
let reg: JRegionMap = new JRegionMap(jwm);
reg.addCell(cell);
reg.growing({cant: 800, regFather: jwm._continents[2].region })
dm.drawCellMap(
	jwm._continents[2].region,
	JCellToDrawEntryFunctions.colors({
		strokeColor: 'none',
		fillColor: `#B144A1B0`
	})
)
console.log('reg area: ', reg.area);
*/

// dividirCont2(jwm, dm, CUF, createICellContainerFromCellArray);
jwm._continents.forEach((jsr: JRegionMap, id: number) => {
	
	const color: string = chroma.random().hex();
	dm.drawCellMap(
		jsr,
		JCellToDrawEntryFunctions.colors({
			strokeColor: `${color}`,
			fillColor: `${color}80`
		})
	)	
	console.log('area:', jsr.area)
});
dm.saveDrawFile( 'saveMap0.png' );

console.timeEnd('all');