import {Site} from 'voronoijs';
import JPoint from '../Geom/JPoint';

export default class JSite {

	private _id: number;
	private _point: JPoint;

	constructor(s: Site) {
		this._id = s.id;
		this._point = new JPoint(s.x, s.y);
	}

	get id(): number {return this._id}
	get point(): JPoint {return this._point}
}