
import { createCanvas } from 'canvas';
import fs from 'fs';

import JPoint, {JVector} from './Geom/JPoint';

export interface IDrawEntry {
	points: JPoint[];
	fillColor: string | 'none';
	strokeColor: string | 'none';
	drawType?: 'line' | 'polygon'
}

export class Panzoom {
	private _zoom: number;
	private _centerX: number;
	private _centerY: number;
	private _elementSize: JVector;

	constructor(size: JVector) {
		this._elementSize = size;
		this._zoom = Math.pow(1.25,0);
		this._centerX = this._elementSize.x/2;
		this._centerY = this._elementSize.y/2;
		this.calculateCenter();
	}

	reset(): void {
		this._zoom = Math.pow(1.25,0);
		this._centerX = this._elementSize.x/2;
		this._centerY = this._elementSize.y/2;
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

	get scale(): number {return this._elementSize.x/360 * this._zoom}
	get centerX(): number {return this._centerX}
	get centerY(): number {return this._centerY}
	private calculateCenter(): void {
		let minCenterX = this._elementSize.x/2 * (1 - (this._zoom-1) * (+1));
		let maxCenterX = this._elementSize.x/2 * (1 - (this._zoom-1) * (-1));
		let minCenterY = this._elementSize.y/2 * (1 - (this._zoom-1) * (+1));
		let maxCenterY = this._elementSize.y/2 * (1 - (this._zoom-1) * (-1));

		if (this._centerX > maxCenterX) this._centerX = maxCenterX;
		if (this._centerY > maxCenterY) this._centerY = maxCenterY;
		if (this._centerX < minCenterX) this._centerX = minCenterX;
		if (this._centerY < minCenterY) this._centerY = minCenterY;
	}

	convertPointToDrawer(p: JPoint): JPoint {
		return new JPoint(
			p.x*this.scale + this._centerX,
			p.y*this.scale + this._centerY
		);
	}

	convertDrawerToPoint(p: number[]): JPoint {
		return new JPoint(
			(p[0] - this._centerX)/this.scale,
			(p[1] - this._centerY)/this.scale,
		);
	}

	get pointsBuffDrawLimits(): JPoint[] {
		const a = this.convertDrawerToPoint([0,0]);
		const b = this.convertDrawerToPoint([0,this._elementSize.y]);
		const c = this.convertDrawerToPoint([this._elementSize.x,this._elementSize.y]);
		const d = this.convertDrawerToPoint([this._elementSize.x,0]);
		return [a,b,c,d,a]
	}

	get pointsBuffCenterLimits(): JPoint[] {
		let minCenterX = this._elementSize.x/2 * (1 - (this._zoom-1) * (+1));
		let maxCenterX = this._elementSize.x/2 * (1 - (this._zoom-1) * (-1));
		let minCenterY = this._elementSize.y/2 * (1 - (this._zoom-1) * (+1));
		let maxCenterY = this._elementSize.y/2 * (1 - (this._zoom-1) * (-1));
		// drawer to point asuming center in size/2
		const a = new JPoint(
			(minCenterX-this._elementSize.x/2)/this.scale,
			(minCenterY-this._elementSize.y/2)/this.scale
		);
		const b = new JPoint(
			(minCenterX-this._elementSize.x/2)/this.scale,
			(maxCenterY-this._elementSize.y/2)/this.scale
		);
		const c = new JPoint(
			(maxCenterX-this._elementSize.x/2)/this.scale,
			(maxCenterY-this._elementSize.y/2)/this.scale
		);
		const d = new JPoint(
			(maxCenterX-this._elementSize.x/2)/this.scale,
			(minCenterY-this._elementSize.y/2)/this.scale
		);

		return [a,b,c,d,a];		
	}

	getPanXRange(): number {
		return this.pointsBuffCenterLimits[2].x - this.pointsBuffCenterLimits[1].x;
	}

	getPanYRange(): number {
		return this.pointsBuffCenterLimits[1].y - this.pointsBuffCenterLimits[0].y;
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

	getZoomValue(): number {return this._panzoom.zoom}

	setCenterpan(p: JPoint) {
		this._centerPoint = new JPoint(p.x,p.y);
		this._panzoom.centerX = -p.x*this._panzoom.scale + this._size.x/2;
		this._panzoom.centerY = -p.y*this._panzoom.scale + this._size.y/2;
	}

	getPointsBuffDrawLimits(): JPoint[] {
		return this._panzoom.pointsBuffDrawLimits;
	}

	getPointsBuffCenterLimits(): JPoint[] {
		return this._panzoom.pointsBuffCenterLimits;
	}

	/**borrar */
	getPanzoom() {return this._panzoom}

	/** uso del canvas */
	private get context(): CanvasRenderingContext2D {
		return this._cnvs.getContext('2d');
	}

	draw(ent: IDrawEntry): void {
		let len: number = ent.points.length;

        this.context.beginPath();

		const initialPoint: JPoint = this._panzoom.convertPointToDrawer(ent.points[len-1]);
        //this.context.moveTo(initialPoint.x, initialPoint.y);
        for (let vert of ent.points) {
			const vertex: JPoint = this._panzoom.convertPointToDrawer(vert);
            this.context.lineTo(vertex.x, vertex.y);
        }

		this.context.strokeStyle = ent.strokeColor;
		if (ent.strokeColor !== 'none') this.context.stroke();
		this.context.fillStyle = ent.fillColor;
		if (ent.fillColor !== 'none') this.context.fill();
        this.context.closePath();
	}

	saveDraw(filePath: string) {
		const out = fs.createWriteStream( filePath );
		const stream = this._cnvs.createPNGStream();
		stream.pipe(out);
	}

}