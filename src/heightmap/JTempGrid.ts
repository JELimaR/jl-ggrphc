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

interface IDay {
  d: number;
  m: number;
}

interface ITempPerDay {
  idm: IDay;
  tempLat: number;
}

export const generateTempLatArrPerDay = (lat: number): ITempPerDay[] => {
  let daysArr: IDay[] = [];
  let rotDayArr: number[] = [];

  for (let d = 1; d <= 378; d++) {
    daysArr.push({
      d,
      m: (Math.floor((d - 1) / 63) * 2 + 1) + (((d - 1) % 63) > 31 ? 1 : 0)
    })
    rotDayArr.push(
      MAXROT * Math.sin((d - 95.5) / 378 * 2 * Math.PI)
    )
  }

  let out: ITempPerDay[] = [];
  daysArr.forEach((idm: IDay) => {
    let tmpValue = Math.cos((lat - rotDayArr[idm.d]) * Math.PI / 180);
    out.push({
      tempLat: tmpValue,
      idm: idm
    })
  })

  return out;
}

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

