import { createCanvas } from 'canvas';
import fs from 'fs';

import JPoint, {JVector} from './Geom/JPoint'

export default class OCanvas {

	private _cnvs: any;

	constructor(SIZE: JVector) {
		this._cnvs = createCanvas(SIZE.x, SIZE.y);
	}

	get context(): CanvasRenderingContext2D {
		return this._cnvs.getContext('2d');
	}

	drawLine(points: JPoint[], color: string): void {
		this.context.beginPath();

        //this.context.moveTo(points[0].x, points[0].y)
        for (let i in points) {
             this.context.lineTo(points[i].x*10+1800, points[i].y*10+900)
        }

		this.context.strokeStyle = color;
		this.context.stroke();

        this.context.closePath();
	}

	drawCell(vertices: JPoint[], color: string) {
        let len: number = vertices.length;

        this.context.beginPath();

        this.context.moveTo(vertices[len-1].x*10+1800, vertices[len-1].y*10+900);
        for (let vert of vertices) {
            this.context.lineTo(vert.x*10+1800, vert.y*10+900)
        }

		this.context.strokeStyle = color;
		this.context.stroke()
		this.context.fillStyle = color;
		this.context.fill();
        this.context.closePath();
	}

	saveDraw(filePath: string) {
		const out = fs.createWriteStream( filePath );
		const stream = this._cnvs.createPNGStream();
		stream.pipe(out);
	}

}