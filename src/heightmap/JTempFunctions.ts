import JPoint from "../Geom/JPoint";


// const generateGrid = (gridgran: number): JPoint[] => { // esta funcion debe ir en geom
//   let grid: JPoint[] = [];
//   for (let i = -180; i <= 180; i += gridgran) {
//     for (let j = -90; j <= 90; j += gridgran) {
//       grid.push(new JPoint(i, j));
//     }
//   }
//   return grid;
// }

const MAXROT: number = 23;
const BOLTZMAN: number = 5.67 * Math.pow(10, -8);

interface IDay {
	d: number;
	m: number;
}

interface ITempPerDay {
	idm: IDay;
	tempLat: number;
}

/**
 * Temperatura en funcion de la latitud diaria
 */
export const calculateDayTempLat = (lat: number, day: number): number => {
	const ROT: number = MAXROT * Math.sin((day - 112) / 378 * 2 * Math.PI)
	return (Math.cos((lat - ROT) * Math.PI / 180) + 0.0) / 1.0;
}

/**
 * Temperatura en funcion de la latitud diaria
 */
export const generateTempLatArrPerDay = (lat: number): ITempPerDay[] => {
	let daysArr: IDay[] = [];
	let rotDayArr: number[] = [];

	for (let d = 1; d <= 378; d++) {
		daysArr.push({
			d,
			m: (Math.floor((d - 1) / 63) * 2 + 1) + (((d - 1) % 63) > 31 ? 1 : 0)
		})
		rotDayArr.push(
			MAXROT * Math.sin((d - 112) / 378 * 2 * Math.PI)
		)
	}

	let out: ITempPerDay[] = [];
	daysArr.forEach((idm: IDay) => {
		let tmpValue = calculateDayTempLat(lat, idm.d)/* Math.cos((lat - rotDayArr[idm.d]) * Math.PI / 180);*/
		out.push({
			tempLat: tmpValue,
			idm: idm
		})
	})

	return out;
}

/**
 * Temperatura media en funcion de la latitud por mes
 */
export const generateTempLatArrPerMonth = (lat: number): { month: number, tempLat: number }[] => {
	let out: { month: number, tempLat: number }[] = [];

	const tempPerDay: ITempPerDay[] = generateTempLatArrPerDay(lat);

	for (let m = 1; m <= 12; m++) {
		let mtemp = 0;
		let cant = 0;
		tempPerDay
			.filter((val: ITempPerDay) => val.idm.m === m)
			.forEach((itpd: ITempPerDay) => {
				mtemp += itpd.tempLat;
				cant += 1;
			})
		out.push({
			month: m,
			tempLat: mtemp / cant
		})
	}

	return out;
}

export const calculateMonthTempLat = (lat: number, month: number): number => {
	const tempArr = generateTempLatArrPerMonth(lat);
	return tempArr[month].tempLat;
}

/**
 * Temperatura promedio en funcion de la latitud anual
 */
export const calculateTempPromPerLat = (lat: number): number => {
	let out: number = 0;

	const tempPerDay: ITempPerDay[] = generateTempLatArrPerDay(lat);

	tempPerDay.forEach((itpd: ITempPerDay) => {
		out += itpd.tempLat;
	})

	return out / 378;
}

/**
 * Temperatura minima en funcion de la latitud anual
 */
export const calculateTempMinPerLat = (lat: number): number => {
	
	const tempPerDay: ITempPerDay[] = generateTempLatArrPerDay(lat);

	return Math.min(...tempPerDay.map((itpd: ITempPerDay) => itpd.tempLat));
}


// const generateGridTempLatArr = (gridgran: number) => {
//   let daysArr: IDay[] = [];
//   let rotDayArr: number[] = [];

//   for (let d = 1; d <= 378; d++) {
//     daysArr.push({
//       d,
//       m: (Math.floor((d - 1) / 63) * 2 + 1) + (((d - 1) % 63) > 31 ? 1 : 0)
//     })
//     rotDayArr.push(
//       MAXROT * Math.sin((d - 95.5) / 378 * 2 * Math.PI)
//     )
//   }

//   let grid: JPoint[] = generateGrid(gridgran);

//   // const colorScale = chroma.scale('Spectral').domain([1, 0]);
//   let out = [];
//   daysArr.forEach((idm: IDay) => {
//     grid.forEach((gp: JPoint) => {
//       let tmpValue = Math.cos((gp.y - rotDayArr[idm.d]) * Math.PI / 180);
//       out.push()
//     })
//   })

// }

