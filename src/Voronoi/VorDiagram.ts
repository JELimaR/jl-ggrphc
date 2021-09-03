import { Cell, Diagram, Edge } from 'voronoijs';
import Point from "../Geom/Point";
import VorPolygon from "./VorPolygon";

interface dataVorDiagram {
	
}

export default class VorDiagram {
    private _polygons: Map<number, VorPolygon>;
    private _edges: Edge[];
    private _vertices: Point[];

    constructor( d: Diagram ) {
        this._polygons = new Map<number, VorPolygon>();
		d.cells.forEach( (c: Cell) => {
			let p = new VorPolygon(c);
			this._polygons.set(p.id,p);
		});
        this._edges = [...d.edges];
        this._vertices = d.vertices.map( (v) => new Point(v.x,v.y) );
    }

	set height(h: number) {
		this._polygons.forEach((p: VorPolygon) => {
			p.height = h;
		})
	}

	forEachPolygon(func: (p: VorPolygon) => void) {
		this._polygons.forEach((p: VorPolygon) => {
			func(p);
		})
	}

	drawH(ctx: CanvasRenderingContext2D, drawHW: boolean) {
		this._polygons.forEach((p: VorPolygon) => {
			p.drawH(ctx, drawHW);
		})
	}

    drawDiagram(ctx: CanvasRenderingContext2D) {
		this._polygons.forEach( (pp: VorPolygon) => {
			pp.draw(ctx, {
				color: `#800000`,
				drawType: 'stroke'
			});
		})
    }

	getNeighbors(pol: VorPolygon): VorPolygon[] {
		let out: VorPolygon[] = [];
		for ( let id of pol.neighborsId) {
			const n: VorPolygon | undefined = this._polygons.get(id)
			if (n) 
				out.push(n);
			else 
				throw new Error('polygon tiene neghbor que no existe');
		}
		return out;
	}

	getPolygonFromPoint(p: Point): VorPolygon {
		let out: VorPolygon | undefined;
		let lrg: number = this._polygons.size, minDis: number = Infinity;

		this._polygons.forEach( (vp: VorPolygon) => {
			let c: Point = vp.center;
			let dis: number = Point.distance(c,p);
			if (dis < minDis) {
				out = vp;
				minDis = dis;
			}
		})
		if (out)
			return out;
		else {
			throw new Error('no se encontro polygon');
		}
	}

}