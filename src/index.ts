console.time('all');

import * as JCellToDrawEntryFunctions from './JCellToDrawEntryFunctions';
import DrawerMap, { IDrawEntry } from './DrawerMap'
import JPoint, { JVector } from './Geom/JPoint';
import JGrid, { JGridPoint } from './Geom/JGrid';
import JWorld from './JWorld';
import { createICellContainerFromCellArray } from './JWorldMap';
import DataInformationFilesManager from './DataInformationLoadAndSave';
import { DivisionMaker } from './divisions/DivisionMaker';
import { Tree } from 'jl-utlts';
import JRegionMap, { IJRegionTreeNode, JIslandMap, JStateMap } from './RegionMap/JRegionMap';
import statesPointsLists from './divisions/countries/statesPointsLists';
import { JContinentMap, JCountryMap } from './RegionMap/JRegionMap';
import JCell from './Voronoi/JCell';
import chroma from 'chroma-js';
import JHeightMap from './heightmap/JHeightMap';
import JTempMap from './climate/JTempMap';
import JClimateGrid from './climate/JClimateGrid'
import * as JTempFunctions from './climate/JTempFunctions';

const tam: number = 3600;
let SIZE: JVector = new JVector({ x: tam, y: tam / 2 });

DataInformationFilesManager.configPath(__dirname + `/../data`);

let dm: DrawerMap = new DrawerMap(SIZE, __dirname + `/../img`);
dm.setZoom(0) // 5
dm.setCenterpan(new JPoint(150, -15));
// navigate
console.log('zoom: ', dm.zoomValue)
console.log('center: ', dm.centerPoint)

console.log('draw buff');
console.log(dm.getPointsBuffDrawLimits());
console.log('center buff');
console.log(dm.getPointsBuffCenterLimits());

const TOTAL: number = 100;
const GRAN: number = .5;
const world: JWorld = new JWorld(TOTAL, GRAN);
// let jwm: JWorldMap = JMapGenerator.generate(TOTAL);
let jhm: JHeightMap = world.generateHeightMap();

dm.drawFondo()
// dm.drawCellMap(jhm, JCellToDrawEntryFunctions.heighLand(1));
// dm.drawArr(jwm.continents);
// const idx = 158//153; // 77 - 139 - 158 - 161
// const country = jwm.countries[idx-1];
// let countryArea = 0;
// jwm.countries.forEach((c: JCountryMap) => countryArea += c.area)
// dm.drawArr(jwm.countries/*, JCellToDrawEntryFunctions.land(0.5)*/);
// // const states: JStateMap[] = [];
// // let statesArea = 0;
// // jwm.states.forEach((s: JStateMap) => {
// //     states.push(s);
// //     statesArea += s.area;
// //     // console.log(s.id, s.area)
// // });
// // dm.drawArr(states)

// console.log(country.id, ':', country.area)
dm.drawMeridianAndParallels();
// dm.saveDrawFile(`${TOTAL}_heightMap.png`);

// console.log('drawing contries')
// jwm.countries.forEach((jcm: JCountryMap) => {
//     const dmc: DrawerMap = new DrawerMap(SIZE, __dirname + `/../img/countries`);
//     const panzoom = dmc.calculatePanzoomForReg(jcm);
//     dmc.setZoom(panzoom.zoom);
//     dmc.setCenterpan(panzoom.center);
//     dmc.drawCellMap(jwm, JCellToDrawEntryFunctions.heigh(1));
//     dmc.drawCellMap(jcm, JCellToDrawEntryFunctions.land(0.5));
//     dmc.drawMeridianAndParallels();
//     dmc.saveDrawFile( `${jcm.id}.png` );
//     console.log(jcm.id, jcm.area)
// })

// const dm2: DrawerMap = new DrawerMap(SIZE, __dirname + `/../img`);
// const panzoom = dm2.calculatePanzoomForReg(country);
// dm2.setZoom(panzoom.zoom);
// dm2.setCenterpan(panzoom.center);
// console.log('draw buff');
// console.log(dm2.getPointsBuffDrawLimits());

// console.log(dm2.zoomValue)

// dm2.drawCellMap(jwm, JCellToDrawEntryFunctions.heigh(1));
// dm2.drawCellMap(country, JCellToDrawEntryFunctions.land(0.5));
// country.states.forEach((js: JStateMap) => {
//     dm2.drawCellMap(createICellContainerFromCellArray(js.getLimitCells()), JCellToDrawEntryFunctions.colors({
//         strokeColor: '#FF0000A0',
//         fillColor: 'none'
//     }))
//     console.log(js.id, ':', Math.round(js.area*100)/100)
// })
// dm2.drawCellMap(country, JCellToDrawEntryFunctions.land(0.5));

// console.log('cells:', country.cells.size)
// console.log('sup per cell:', country.area/country.cells.size)

// dm2.drawMeridianAndParallels();
// dm2.saveDrawFile( 'saveMap01aux.png' );

/*
Generar grilla
*/


/**
 * 
 * sol y temp
 */
let dm2: DrawerMap = new DrawerMap(SIZE, __dirname + `/../img/${TOTAL}`);
dm2.drawFondo()
let colorScale: chroma.Scale;

// const jtm: JTempMap = world.generateTemperatureMap();

let color: string;
const tempStep: number = 5;
const meses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

colorScale = chroma.scale('Spectral').domain([30, -30]);
// meses
// meses.forEach((mes: number) => {

// 	dm2.drawCellMap(jtm, (c: JCell): IDrawEntry => {

// 		let tarr: number[] = c.info.tempMonthArr;
// 		let val: number = tempStep*Math.round((tarr[mes-1])/tempStep);
// 		color = colorScale(val).hex();
// 		return {
// 			fillColor: color,
// 			strokeColor: color
// 		}
// 	})

// 	dm2.drawMeridianAndParallels();
// 	dm2.saveDrawFile(`tempMap_mes${mes > 9 ? mes : `0${mes}`}.png`);

// })


colorScale = chroma.scale('Spectral').domain([30, -30]);
let meds: number[] = [];
// temp med
// dm2.drawCellMap(jtm, (c: JCell): IDrawEntry => {
// 	let tarr: number[] = c.info.tempMonthArr;
// 	let val: number = 0;
// 	tarr.forEach((t: number) => val += t / 12)

// 	meds.push(val);

// 	color = colorScale(tempStep * Math.round(val / tempStep)).hex();

// 	return {
// 		fillColor: color,
// 		strokeColor: color
// 	}
// })

// dm2.drawMeridianAndParallels();
// dm2.saveDrawFile(`tempMapMed.png`);

colorScale = chroma.scale('Spectral').domain([1, 0]);
// temp cap
// dm2.drawCellMap(jtm, (c: JCell): IDrawEntry => {

// 	let cap: number = c.info.cellTemp._tempCap;
// 	color = colorScale(cap).hex();

// 	return {
// 		fillColor: color,
// 		strokeColor: color
// 	}
// })

// dm2.drawMeridianAndParallels();
// dm2.saveDrawFile(`tempMapCap.png`);

/**
 * GRID
 */
let dm3: DrawerMap = new DrawerMap(SIZE, __dirname + `/../img/${TOTAL}`);
dm3.drawFondo()

let grid = world.grid;
// nuevo
let tempGrid = new JClimateGrid(grid);
colorScale = chroma.scale('Spectral').domain([30, -30]);

// meses
meses.forEach((mes: number) => {
	tempGrid._grid._points.forEach((col: JGridPoint[], cidx: number) => {
		col.forEach((gp: JGridPoint, ridx: number) => {
			let tempValue: number;
			tempValue = tempGrid._tempData[cidx][ridx].tempMonth[mes - 1];
			tempValue = tempStep * Math.round(tempValue / tempStep);
			color = colorScale(tempValue).hex();
			dm3.drawDot(
				gp._point, {
				fillColor: color,
				strokeColor: color
			}, GRAN
			);
		})
	})
	// itcz
	tempGrid.getITCZPoints(mes).forEach((p: JPoint) => {
		color = '#FF0000'//colorScale(0).hex();
		dm3.drawDot(
			p, {
			fillColor: color,
			strokeColor: color
		}, GRAN
		);
	})
	// horse lat
	tempGrid.getHorseLatPoints(mes, 'n').forEach((p: JPoint) => {
		color = '#FFFF00';
		dm3.drawDot(
			p, {
			fillColor: color,
			strokeColor: color
		}, GRAN
		);
	})
	tempGrid.getHorseLatPoints(mes, 's').forEach((p: JPoint) => {
		color = '#FFFF00';
		dm3.drawDot(
			p, {
			fillColor: color,
			strokeColor: color
		}, GRAN
		);
	})
	// polar front
	tempGrid.getPolarFrontPoints(mes, 'n').forEach((p: JPoint) => {
		color = '#989898'
		dm3.drawDot(
			p, {
			fillColor: color,
			strokeColor: color
		}, GRAN
		);
	})
	tempGrid.getPolarFrontPoints(mes, 's').forEach((p: JPoint) => {
		color = '#989898'
		dm3.drawDot(
			p, {
			fillColor: color,
			strokeColor: color
		}, GRAN
		);
	})

	dm3.drawMeridianAndParallels();
	dm3.saveDrawFile(`gridTemp_mes${mes > 9 ? mes : `0${mes}`}.png`);
})

// media
dm3.drawFondo()
tempGrid._grid._points.forEach((col: JGridPoint[], cidx: number) => {
	col.forEach((gp: JGridPoint, ridx: number) => {
		if (gp._cell.info.isLand) {
			let tempValue: number;
			tempValue = tempGrid._tempData[cidx][ridx].tempMed;
			meds.push(tempValue)
			tempValue = tempStep * Math.round(tempValue / tempStep);
			color = colorScale(tempValue).hex();
			dm3.drawDot(
				gp._point, {
				fillColor: color,
				strokeColor: color
			}, GRAN
			);
		}
	})
})

// ITCZ
let itczPoints: JPoint[] = tempGrid.getITCZPoints('med',)
itczPoints.forEach((p: JPoint) => {
	color = '#FF0000'//colorScale(0).hex();
	dm3.drawDot(
		p, {
		fillColor: color,
		strokeColor: color
	}, GRAN
	);
})

// horse lat
let horseLatPointsNorth: JPoint[] = tempGrid.getHorseLatPoints('med', 'n')
horseLatPointsNorth.forEach((p: JPoint) => {
	color = '#FFFF00'
	if (!grid.getGridPoint(p)._cell.info.isLand)
		dm3.drawDot(
			p, {
			fillColor: color,
			strokeColor: color
		}, GRAN
		);
})

let horseLatPointsSouth: JPoint[] = tempGrid.getHorseLatPoints('med', 's')
horseLatPointsSouth.forEach((p: JPoint) => {
	color = '#FFFF00'
	if (!grid.getGridPoint(p)._cell.info.isLand)
		dm3.drawDot(
			p, {
			fillColor: color,
			strokeColor: color
		}, GRAN
		);
})

// polar front
let polarFrontPointsNorth: JPoint[] = tempGrid.getPolarFrontPoints('med', 'n')
polarFrontPointsNorth.forEach((p: JPoint) => {
	color = '#989898'
	dm3.drawDot(
		p, {
		fillColor: color,
		strokeColor: color
	}, GRAN
	);
})
let polarFrontPointsSouth: JPoint[] = tempGrid.getPolarFrontPoints('med', 's')
polarFrontPointsSouth.forEach((p: JPoint) => {
	color = '#989898'
	dm3.drawDot(
		p, {
		fillColor: color,
		strokeColor: color
	}, GRAN
	);
})

// dm3.drawCellMap(jhm, JCellToDrawEntryFunctions.heighLand(0.1))

dm3.drawMeridianAndParallels();
dm3.saveDrawFile(`gridITZ.png`);

// temp cap
colorScale = chroma.scale('Spectral').domain([1, 0]);
tempGrid._grid._points.forEach((col: JGridPoint[], cidx: number) => {
	col.forEach((gp: JGridPoint, ridx: number) => {
		let capValue: number;
		capValue = tempGrid._tempData[cidx][ridx].tempCap;
		capValue = capValue;
		color = colorScale(capValue).hex();
		dm3.drawDot(
			gp._point, {
			fillColor: color,
			strokeColor: color
		}, GRAN
		);
	})
})

dm3.drawMeridianAndParallels();
dm3.saveDrawFile(`tempGridCap.png`);

colorScale = chroma.scale('Spectral').domain([30, 0]);
let mins: number[] = [];
let maxs: number[] = [];
// temp var
tempGrid._grid._points.forEach((col: JGridPoint[], cidx: number) => {
	col.forEach((gp: JGridPoint, ridx: number) => {
		let tarr: number[] = tempGrid._tempData[cidx][ridx].tempMonth;
		const maximo = Math.max(...tarr);
		const minimo = Math.min(...tarr);
		maxs.push(maximo);
		mins.push(minimo);

		let val: number = maximo - minimo;
		val = tempStep * Math.round(val/tempStep)
		color = colorScale(val).hex();
		dm3.drawDot(
			gp._point, {
			fillColor: color,
			strokeColor: color
		}, GRAN
		);
	})
})

dm3.drawMeridianAndParallels();
dm3.saveDrawFile(`tempGridVar.png`);

console.log('max', maxs.reduce((v: number, m: number) => (m > v) ? m : v));
console.log('min', mins.reduce((v: number, m: number) => (m < v) ? m : v));
let total: number = 0, cant: number = 0;
meds.forEach((val: number) => { total += val; cant++ });
console.log('med', total / cant);




console.timeEnd('all');

// console.log(jwm.continents[cid].states.get('S2195C1')?.id, jwm.continents[cid].states.get('S2195C1')?.area)