import JPoint from './JPoint';

export default class JGrid {
	/*private*/ _points: JPoint[] = [];
	/*private*/ _granularity: number;
	
	constructor(gran: number) {
		this._granularity = gran;
		for (let i = -180; i <= 180; i += gran) {
		  for (let j = -90; j <= 90; j += gran) {
		    this._points.push(new JPoint(i, j));
		  }
		}
	}
}

