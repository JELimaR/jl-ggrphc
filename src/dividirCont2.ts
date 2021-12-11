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

export default (jwm: JWorldMap, dm: DrawerMap, CUF: utlts.CollectionsUtilsFunctions, createICellContainerFromCellArray: any): void => {
	const cellsInRegion = jwm._continents[2].cells;
	let plist: JPoint[][] = [];
	/*
	plist = [
		[new JPoint(25, -5), new JPoint(7, -3), new JPoint(7, -14), new JPoint(-12, -8)],
		[new JPoint(14, -5), new JPoint(16, -8)],
		[new JPoint(32, 11), new JPoint(12, 16)],
		[new JPoint(-27, 8), new JPoint(-10, 15)]
	];
	*/
	for (let i = 0; i < 40; i++) {
		const cell: JCell = CUF.choose(Array.from(cellsInRegion))[1];
		plist.push([cell.center]);
	}

	let cellList: JCell[] = [];
	plist.forEach((points: JPoint[]) => {
		points.forEach((p: JPoint) => {
			cellList.push(jwm.diagram.getCellFromPoint(p));
		})
	})

	const arrSR = jwm._continents[2].divideInSubregions(plist);
	arrSR.sort((a, b) => {return a.area-b.area})
	console.log(arrSR.length);

	arrSR.forEach((jsr: JRegionMap, id: number) => {
		if (id === 0) {
			dm.drawCellMap(
				jsr,
				JCellToDrawEntryFunctions.colors({
					strokeColor: `#FF0000`,
					fillColor: `#FF0000C0`
				})
			)
		} else if (id === arrSR.length-1) {
			dm.drawCellMap(
				jsr,
				JCellToDrawEntryFunctions.colors({
					strokeColor: `#0000FF`,
					fillColor: `#0000FFC0`
				})
			)
		} else {
			const color: string = chroma.random().hex();
			dm.drawCellMap(
				jsr,
				JCellToDrawEntryFunctions.colors({
					strokeColor: `${color}`,
					fillColor: `${color}80`
				})
			)
		}
		console.log('area:', jsr.area)
		
	})

	dm.drawCellMap(
		createICellContainerFromCellArray(cellList),
		JCellToDrawEntryFunctions.colors({
			strokeColor: `#000000`,
			fillColor: `#000000`
		})
	)
}


