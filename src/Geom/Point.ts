

export default class Point {
	private _x: number;
	private _y: number;

	constructor( x: number, y: number ) {
		this._x = Math.round(x * 10000)/10000;
		this._y = Math.round(y * 10000)/10000;
	}

	get x() { return this._x }
	get y() { return this._y }

	static add(a: Point, b: Point ): Point {
		return new Point( a._x + b._x, a._y + b._y );
	}

	scale(k: number): Point {
		return new Point( this._x * k, this._y * k);
	}

	translate( dir: Vector ) {
		this._x = dir.x + this._x;
		this._y = dir.y + this._y;
	}

	static equal(a: Point, b: Point): boolean {
		return (
			a._x === b._x &&
			a._y === b._y
		)
	}

	static distance(a: Point, b: Point): number {
		return Math.sqrt( Math.pow(a._x-b._x, 2) + Math.pow(a._y-b._y, 2) );
	}
}

export class Vector extends Point {
	// private _beg: Point;
	// private _end: Point;

	constructor( ends: Point | {x:number, y:number}, begins: Point | {x: number, y: number} = {x:0,y:0} ) {
		super(ends.x - begins.x, ends.y - begins.y )
		// this._end = JSON.parse( JSON.stringify(ends) );
		// this._beg = JSON.parse( JSON.stringify(begins) );
		
	}
}