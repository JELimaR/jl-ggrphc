console.time('all');

import * as JCellToDrawEntryFunctions from './JCellToDrawEntryFunctions';
import DrawerMap, { IDrawEntry } from './DrawerMap'
import JPoint, { JVector } from './Geom/JPoint';
import JMapGenerator from './JMapGenerator';
import JWorldMap, { createICellContainerFromCellArray } from './JWorldMap';
import DataInformationFilesManager from './DataInformationLoadAndSave';
import { DivisionMaker } from './divisions/DivisionMaker';
import { Tree } from 'jl-utlts';
import JRegionMap, { IJRegionTreeNode, JStateMap } from './RegionMap/JRegionMap';
import statesPointsLists from './divisions/countries/statesPointsLists';
import { JContinentMap, JCountryMap } from './RegionMap/JRegionMap';
import JCell from './Voronoi/JCell';
import GenerateMapVoronoiSites from './Voronoi/GenerateMapVoronoiSites';
import chroma from 'chroma-js';
import JHeightMap from './heightmap/JHeightMap';
import JClimateMap from './heightmap/JClimateMap';
import {calculateDayTempLat, calculateMonthTempLat, calculateTempPromPerLat} from './heightmap/JTempFunctions';

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

const TOTAL: number = 700;
const generator: JMapGenerator = new JMapGenerator(TOTAL);
// let jwm: JWorldMap = JMapGenerator.generate(TOTAL);
let jhm: JHeightMap = generator.generateHeightMap();

dm.drawFondo()
dm.drawCellMap(jhm, JCellToDrawEntryFunctions.heighLand(1));
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
dm.saveDrawFile(`${TOTAL}_heightMap.png`);

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

let dm2: DrawerMap = new DrawerMap(SIZE, __dirname + `/../img/${TOTAL}`);
dm2.drawFondo()

let grid: JPoint[] = [];
const gridgran: number = 15;
for (let i = -180; i <= 180; i += gridgran) {
  for (let j = -90; j <= 90; j += gridgran) {
    grid.push(new JPoint(i, j));
  }
}

/**
 * 
 * sol y temp
 */

// const BOLTZMAN: number = 5.67 * Math.pow(10,-8);

const TODAY = 0;
let colorScale = chroma.scale('Spectral').domain([30, -20]);

grid.forEach((gp: JPoint) => {
	let tempValue: number; /*= calculateDayTempLat(gp.y, TODAY);*/
	tempValue = calculateTempPromPerLat(gp.y);
	// console.log(Math.pow(342*tempValue/BOLTZMAN,0.25)-250)
  /*
	dm.drawDot(gp, {
    fillColor: colorScale(tempValue).hex(),
    strokeColor: colorScale(tempValue).hex()
  }, 1)
	*/
})

const jcm: JClimateMap = generator.generateClimateMap(jhm);

let color: string;

// meses
colorScale = chroma.scale('Spectral').domain([30, -30]);
const meses = [1,2,3,4,5,6,7,8,9,10,11,12];
meses.forEach((mes: number) => {
	
	dm2.drawCellMap(jcm, (c: JCell): IDrawEntry => {
		
		let tarr: number[] = jcm._cellClimate.get(c.id)!._tempMonth;
		let val: number = 2.5*Math.round((tarr[mes-1])/2.5);
		color = colorScale(val).hex();
		return {
			fillColor: color,
			strokeColor: color
		}
	})
	
	dm2.drawMeridianAndParallels();
	dm2.saveDrawFile(`tempMap_mes${mes > 9 ? mes : `0${mes}`}.png`);

})

// temp med
colorScale = chroma.scale('Spectral').domain([30, -30]);
//colorScale = chroma.scale('Spectral').domain([30, -35]);
let meds: number[] = [];
dm2.drawCellMap(jcm, (c: JCell): IDrawEntry => {
	let tarr: number[] = jcm._cellClimate.get(c.id)!._tempMonth;
	let val: number = 0;
	tarr.forEach((t: number) => val += t/12)

	meds.push(val);
	
	color = colorScale(2.5*Math.round(val/2.5)).hex();
	/*
	let value: number = jcm._tempCellCap.get(c.id)!;
	color = colorScale(value).hex();
	*/
	return {
		fillColor: color,
		strokeColor: color
	}
})

dm2.drawMeridianAndParallels();
dm2.saveDrawFile(`tempMapMed.png`);

// temp var
colorScale = chroma.scale('Spectral').domain([30, 0]);
let mins: number[] = [];
let maxs: number[] = [];
dm2.drawCellMap(jcm, (c: JCell): IDrawEntry => {
	let tarr: number[] = jcm._cellClimate.get(c.id)!._tempMonth;
	const maximo = Math.max(...tarr);
	const minimo = Math.min(...tarr);
	maxs.push(maximo);
	mins.push(minimo);
	let val: number = maximo - minimo;
	color = colorScale(val).hex();
	/*
	let value: number = jcm._tempCellCap.get(c.id)!;
	color = colorScale(value).hex();
	*/
	return {
		fillColor: color,
		strokeColor: color
	}
})

dm2.drawMeridianAndParallels();
dm2.saveDrawFile(`tempMapVar.png`);

console.log('max', Math.max(...maxs));
console.log('min', Math.min(...mins));
let total: number = 0;
meds.forEach((val: number) => total+=val);
console.log('med', total/jcm.diagram.cells.size);

/**
 * 
 * Vientos
 */
// let ini: JPoint;
// let ent: IDrawEntry;
// let jgranu: number = 10;
// let dotsize: number = 0.5;
// // alisios
// ent = {
//   strokeColor: `#6E7DAB`,
//   fillColor: `#6E7DAB`
// };

// for (let j = -200; j <= 200; j += jgranu) {

//   ini = new JPoint(j, 30);
//   dm.drawDot(ini, ent, 1);

//   for (let i = 200; i >= 0; i--) {
//     const y = -Math.cos((ini.y - 30) / 30 * Math.PI / 2);
//     const x = Math.sin((ini.y - 30) / 30 * Math.PI / 2);
//     let nuevo: JPoint = JPoint.add(ini, new JPoint(x, y));
//     dm.drawDot(nuevo, ent, dotsize);
// 	  ini = nuevo;
//   }

//   ini = new JPoint(j, -30)
//   dm.drawDot(ini, ent, 1);

//   for (let i = 200; i >= 0; i--) {
//     const y = -Math.cos((ini.y - 30) / 30 * Math.PI / 2);
//     const x = Math.sin((ini.y - 30) / 30 * Math.PI / 2);
//     let nuevo: JPoint = JPoint.add(ini, new JPoint(x, y));
//     dm.drawDot(nuevo, ent, dotsize);
//     ini = nuevo;
//   }
// }

// westerns
// ent = {
//   strokeColor: `#5762D5`,
//   fillColor: `#5762D5`
// };
// for (let j = -200; j <= 200; j += jgranu) {

//   ini = new JPoint(j, 30)
//   dm.drawDot(ini, ent, 1);

//   for (let i = 200; i >= 0; i--) {
//     const y = Math.cos((ini.y - 30) / 30 * Math.PI / 2);
//     const x = Math.sin((ini.y - 30) / 30 * Math.PI / 2);
//     let nuevo: JPoint = JPoint.add(ini, new JPoint(x, y));
//     dm.drawDot(nuevo, ent, dotsize);
//     ini = nuevo;
//   }

//   ini = new JPoint(j, -30)
//   dm.drawDot(ini, ent, 1);

//   for (let i = 200; i >= 0; i--) {
//     const y = Math.cos((ini.y - 30) / 30 * Math.PI / 2);
//     const x = Math.sin((ini.y - 30) / 30 * Math.PI / 2);
//     let nuevo: JPoint = JPoint.add(ini, new JPoint(x, y));
//     dm.drawDot(nuevo, ent, dotsize);
//     ini = nuevo;
//   }
// }

// // polar
// ent = {
//   strokeColor: `#FFFFFF`,
//   fillColor: `#FFFFFF`
// };

// for (let j = -200; j <= 200; j += jgranu) {

//   ini = new JPoint(j, 90)
//   dm.drawDot(ini, ent, 1);

//   for (let i = 200; i >= 0; i--) {
//     const y = Math.cos((ini.y - 30) / 30 * Math.PI / 2);
//     const x = Math.sin((ini.y - 30) / 30 * Math.PI / 2);
//     let nuevo: JPoint = JPoint.add(ini, new JPoint(x, y));
//     dm.drawDot(nuevo, ent, dotsize);
//     ini = nuevo;
//   }

//   ini = new JPoint(j, -90)
//   dm.drawDot(ini, ent, 1);

//   for (let i = 200; i >= 0; i--) {
//     const y = Math.cos((ini.y - 30) / 30 * Math.PI / 2);
//     const x = Math.sin((ini.y - 30) / 30 * Math.PI / 2);
//     let nuevo: JPoint = JPoint.add(ini, new JPoint(x, y));
//     dm.drawDot(nuevo, ent, dotsize);
//     ini = nuevo;
//   }
// }

console.timeEnd('all');

// console.log(jwm.continents[cid].states.get('S2195C1')?.id, jwm.continents[cid].states.get('S2195C1')?.area)