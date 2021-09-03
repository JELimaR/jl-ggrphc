import { Cell, Edge, Halfedge } from "voronoijs";
import Point from '../Geom/Point'

import chroma from 'chroma-js';
const colorScale = chroma.scale('Spectral').domain([1,0]);

/**
 * En una cell:
 * 	halfedge es un borde de celda.
 * 	cada halfedge tiene un objeto edge, que es una arista entre centro y el centro de una celda vecina
 */

interface IDrawPolygonOptions {
	color: string; 
	drawType: 'stroke' | 'fill';
}

const DefaultDrawOptions: IDrawPolygonOptions = {
	color: 'black',
	drawType: 'stroke'
}

type TypeHeight = 
	| 'land'
	| 'water'

export default class VorPolygon {

	private _cell: Cell;
	private _height: number = 0;
	private _typeHeight: TypeHeight = 'water';
	private _mark: boolean = false;

	constructor( c: Cell ) {
		this._cell = c;
	}

    get id(): number { return this._cell.site.id }
	get center(): Point {
		return new Point(this._cell.site.x, this._cell.site.y)
	}

	get vertices(): Point[] {
		let out: Point[] = [];
		for (let he of this._cell.halfedges ) {
            out.push( new Point(he.getStartpoint().x, he.getStartpoint().y))
        }
        return out;
	}

    get neighborsId(): number[] {
        return this._cell.getNeighborIds();
    }

	get isBorder(): boolean {
		return this._cell.getNeighborIds.length < this._cell.halfedges.length 
	}

	get typeHeight(): TypeHeight { return this._typeHeight}
	set typeHeight(en: TypeHeight) { this._typeHeight = en }

	get mark(): boolean {return this._mark}
	set mark(m: boolean) {this._mark = m}

	get cell(): Cell { return this._cell }

	set height(h: number) {this._height = h;}
	get height(): number {return this._height}

	drawH(ctx: CanvasRenderingContext2D, drawHeightWater: boolean = false): void {
		const h: number = (this._typeHeight === 'water' && !drawHeightWater)
			? 0.05
			: this._height;
		const hcol = colorScale(h).hex();
		this.draw( ctx, {color: hcol, drawType: 'fill'} );
	}
    
    draw( ctx: CanvasRenderingContext2D, { color, drawType }: IDrawPolygonOptions ) {
		color = color || DefaultDrawOptions.color;
		drawType = drawType || DefaultDrawOptions.drawType;

        const hes = this._cell.halfedges;
        let lrg: number = hes.length;

        ctx.beginPath();

        ctx.moveTo(hes[0].getStartpoint().x, hes[0].getStartpoint().y)
        for (let i=0; i < lrg; i++) {
            ctx.lineTo(hes[i].getEndpoint().x, hes[i].getEndpoint().y)
        }

		ctx.strokeStyle = color;
		// ctx.stroke();
		if (drawType === 'fill') {
			ctx.fillStyle = color;
			ctx.fill();
		}
        ctx.closePath();
    }

	static equals(a: VorPolygon, b: VorPolygon): boolean {
		return (a._cell.site.id === b._cell.site.id)
	}

}