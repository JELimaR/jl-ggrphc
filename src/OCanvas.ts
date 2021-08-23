import { createCanvas } from 'canvas';
import fs from 'fs'

import {Vector} from './Geom/Point'

export default class OCanvas {

	private _cnvs: any;

	constructor(SIZE: Vector) {
		this._cnvs = createCanvas(SIZE.x, SIZE.y);
	}

	get context(): CanvasRenderingContext2D {
		return this._cnvs.getContext('2d');
	}

	saveDraw(filePath: string) {
		const out = fs.createWriteStream( filePath );
		const stream = this._cnvs.createPNGStream();
		stream.pipe(out);
	}

}