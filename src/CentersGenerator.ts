
import Point from './Geom/Point';

interface ICenterItem {
	indx: number;
	p: Point;
	r: number;
	h: number;
	addH: boolean,
}

type TypeXPos = 
	| 'random'
	| 'l'
	| 'c'
	| 'r'
type TypeYPos = 
	| 'random'
	| 'u'
	| 'b'

interface ICants {
	big: number,
	medium: number,
	small: number,
	tiny: number,
	noneLands?: ICants
}
class ValuesGenerator {
	private _rand: () => number;
	constructor (rand: ()=>number) {
		this._rand = rand;
	}

	getPoint(xp: TypeXPos, yp: TypeYPos) {
		return new Point(
			this.xRand(xp),
			this.yRand(yp)
		)
	}
	xRand(xp: TypeXPos) { 
		switch (xp) {
			case 'l':
				return 800*this._rand()+400
			case 'c':
				return 800*this._rand()+1400
			case 'r':
				return 800*this._rand()+2400
			default:
				return 3000*this._rand()+300
		}
	 }
	 yRand(yp: TypeYPos) { 
		switch (yp) {
			case 'u':
				return 500*this._rand()+400
			case 'b':
				return 500*this._rand()+1000
			default:
				return 1200*this._rand()+300
		}
	 }

	getBigRadius(): number {
		return 9000 + 4000*this._rand()
	}

	getMediumRadius(): number {
		return 4500 + 3000*this._rand()
	}

	getSmallRadius(): number {
		return 2500 + 1500*this._rand()
	}

	getTinyRadius(): number {
		return 500 + 1000*this._rand()
	}

	getRandomH(min: number, vari: number): number {
		return min + vari*this._rand();
	}

	randomZoneCenters(centers: ICenterItem[], xp: TypeXPos, yp: TypeYPos): ICenterItem[]  {

		
		centers.push({
			indx: centers.length+1,
			h: this.getRandomH(0.3,0.2),
			p: this.getPoint(xp,yp),
			r: this.getBigRadius(),
			addH: false,
		})
		
		for (let i=0;i<2; i++) {
			centers.push({
				indx: centers.length+1,
				h: this.getRandomH(0.2,0.2),
				p: this.getPoint(xp,yp),
				r: this.getMediumRadius(),
				addH: false,
			})
		}
		for (let i=0;i<3; i++) {
			centers.push({
				indx: centers.length+1,
				h: this.getRandomH(0.2,0.15),
				p: this.getPoint(xp,yp),
				r: this.getSmallRadius(),
				addH: false,
			})
		}
		for (let i=0;i<6; i++) {
			centers.push({
				indx: centers.length+1,
				h: this.getRandomH(0.2,0.1),
				p: this.getPoint(xp,yp),
				r: this.getTinyRadius(),
				addH: false,
			})
		}

		return centers;
	}

}



export default (rand: () => number): ICenterItem[] => {
	const VG = new ValuesGenerator(rand);

	let centers: ICenterItem[] = [];

	centers = VG.randomZoneCenters(centers, 'l','u')

	centers = VG.randomZoneCenters(centers, 'l','b')
	
	centers = VG.randomZoneCenters(centers, 'c','u')

	centers = VG.randomZoneCenters(centers, 'c','b')

	centers = VG.randomZoneCenters(centers, 'r','u')

	centers = VG.randomZoneCenters(centers, 'r','b')

	for (let i=0;i<12;i++) {
		centers.push({
			indx: centers.length+1,
			h: VG.getRandomH(0.2,0.1),
			p: VG.getPoint('random', 'random'),
			r: VG.getSmallRadius(),
			addH: false,
		});
	}

	for (let i=0;i<35;i++) {
		centers.push({
			indx: centers.length+1,
			h: VG.getRandomH(0.2,0.2),
			p: VG.getPoint('random', 'random'),
			r: VG.getTinyRadius(),
			addH: false,
		});
	}

	for (let i=0;i<6;i++) {
		centers.push({
			indx: centers.length+1,
			h: VG.getRandomH(0.15,0.1),
			p: VG.getPoint('random', 'random'),
			r: VG.getMediumRadius(),
			addH: true,
		});
	}
	
	return centers;
}

