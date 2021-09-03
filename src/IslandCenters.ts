import Point from './Geom/Point';

interface ICenterItem {
	indx: number;
	p: Point;
	r: number;
	h: number
}
export default (rand: () => number): ICenterItem[] => {
	let centers: ICenterItem[] = [];

	for (let i=0; i<46; i++) {
		centers.push({
			indx: i+1,
			h: rand()*0.4+0.4,
			p: new Point(3000*rand()+300,1200*rand()+300),
			r: 717+6702*rand()
		})
	}

	return centers;
}