import { numberLiteralTypeAnnotation } from '@babel/types';
import { createCanvas } from 'canvas';
import fs from 'fs';

import JPoint, {JVector} from './Geom/JPoint';

export interface IDrawEntry {
	points: JPoint[];
	fillColor: string | 'none';
	strokeColor: string | 'none';
}

export class Panzoom {
	private _zoom: number;
	private _centerX: number;
	private _centerY: number;
	private _canvasSize: JVector;

	constructor(size: JVector) {
		this._zoom = Math.pow(1.25,0);
		this._canvasSize = size;
		this._centerX = this._canvasSize.x/2;
		this._centerY = this._canvasSize.y/2;
		this.calculateCenter();
	}

	set zoom(n: number) {
		if (n >= 0 && n === Math.round(n)) {
			this._zoom = Math.pow(1.25,n);
		}
		this.calculateCenter();
	}
	set centerX(X: number) {
		this._centerX = X;
		this.calculateCenter();
	}
	set centerY(Y: number) {
		this._centerY = Y;
		this.calculateCenter();
	}

	get scale(): number {return this._canvasSize.x/360 * this._zoom}
	get centerX(): number {return this._centerX}
	get centerY(): number {return this._centerY}
	private calculateCenter(): void {
		let minCenterX = this._canvasSize.x/2 * (1 - (this._zoom-1) * (+1));
		let maxCenterX = this._canvasSize.x/2 * (1 - (this._zoom-1) * (-1));
		let minCenterY = this._canvasSize.y/2 * (1 - (this._zoom-1) * (+1));
		let maxCenterY = this._canvasSize.y/2 * (1 - (this._zoom-1) * (-1));

		if (this._centerX > maxCenterX) this._centerX = maxCenterX;
		if (this._centerY > maxCenterY) this._centerY = maxCenterY;
		if (this._centerX < minCenterX) this._centerX = minCenterX;
		if (this._centerY < minCenterY) this._centerY = minCenterY;
	}

}

export default class DrawerMap {

	private _size: JVector;
	private _cnvs: any;

	private _panzoom: Panzoom;
	private _centerPoint: JPoint;

	constructor(SIZE: JVector) {
		this._size = SIZE;
		this._cnvs = createCanvas(SIZE.x, SIZE.y);

		this._panzoom = new Panzoom(this._size);
		this._centerPoint = new JPoint(0,0);
	}

	setZoom(n: number) {
		this._panzoom.zoom = n;
	}

	setCenterpan(p: JPoint) {
		this._centerPoint = new JPoint(p.x,p.y)
		this._panzoom.centerX = -p.x*this._panzoom.scale + this._size.x/2;
		this._panzoom.centerY = -p.y*this._panzoom.scale + this._size.y/2;
	}

	get pointsBuffPanZoom(): number[][] {
		const a = this.convertToMap([0,0]);
		const b = this.convertToMap([0,1800]);
		const c = this.convertToMap([3600,1800]);
		const d = this.convertToMap([3600,0]);
		return [a,b,c,d,a]
	}

	get context(): CanvasRenderingContext2D {
		return this._cnvs.getContext('2d');
	}

	private drawLine(points: JPoint[], color: string): void {
		this.context.beginPath();

        for (let vert of points) {
			const coords: number[] = this.convertPoint(vert);
            this.context.lineTo(coords[0], coords[1]);
        }

		this.context.strokeStyle = color;
		this.context.stroke();

        this.context.closePath();
	}

	drawCell(vertices: JPoint[], color: string) {
        let len: number = vertices.length;

        this.context.beginPath();

		const initialPoint: number[] = this.convertPoint(vertices[len-1]);
        this.context.moveTo(initialPoint[0], initialPoint[1]);
        for (let vert of vertices) {
			const coords: number[] = this.convertPoint(vert);
            this.context.lineTo(coords[0], coords[1]);
        }

		this.context.strokeStyle = color;
		this.context.stroke();
		this.context.fillStyle = color;
		this.context.fill();
        this.context.closePath();
	}

	draw(ent: IDrawEntry): void {
		let len: number = ent.points.length;

        this.context.beginPath();

		const initialPoint: number[] = this.convertPoint(ent.points[len-1]);
        //this.context.moveTo(initialPoint[0], initialPoint[1]);
        for (let vert of ent.points) {
			const coords: number[] = this.convertPoint(vert);
            this.context.lineTo(coords[0], coords[1]);
        }

		this.context.strokeStyle = ent.strokeColor;
		if (ent.strokeColor !== 'none') this.context.stroke();
		this.context.fillStyle = ent.fillColor;
		if (ent.fillColor !== 'none') this.context.fill();
        this.context.closePath();
	}

	private convertPoint(p: JPoint): number[] {
		return [
			p.x*this._panzoom.scale + this._panzoom.centerX,
			p.y*this._panzoom.scale + this._panzoom.centerY
		];
	}

	private convertToMap(p: number[]): number[] {
		return [
			(p[0] - this._panzoom.centerX)/this._panzoom.scale,
			(p[1] - this._panzoom.centerY)/this._panzoom.scale,
		]
	}

	saveDraw(filePath: string) {
		const out = fs.createWriteStream( filePath );
		const stream = this._cnvs.createPNGStream();
		stream.pipe(out);
	}

}