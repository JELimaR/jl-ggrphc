import { Diagram, Edge } from 'voronoijs';
import Point from "../Geom/Point";
import VorPolygon from "./VorPolygon";

export default class VorDiagram {
    private _polygons: VorPolygon[];
    private _edges: Edge[];
    private _vertices: Point[];

    constructor( d: Diagram ) {
        this._polygons = d.cells.map( (c) => new VorPolygon(c) );
        this._edges = [...d.edges];
        this._vertices = d.vertices.map( (v) => new Point(v.x,v.y) );
    }

	set height(h: number) {
		this._polygons.forEach((p: VorPolygon) => {
			p.height = h;
		})
	}

	drawH(ctx: CanvasRenderingContext2D, transparence: number = 1) {
		this._polygons.forEach((p: VorPolygon) => {
			p.drawH(ctx, transparence);
		})
	}

    drawDiagram(ctx: CanvasRenderingContext2D) {
        for (let pp of this._polygons) {
			pp.draw(ctx, {
				color: `#800000`,
				drawType: 'stroke'
			});
        }
    }

	getNeighbors(pol: VorPolygon): VorPolygon[] {
		let out: VorPolygon[] = [];
		for ( let id of pol.neighborsId) {
			const n: VorPolygon | undefined = this._polygons.find( (p) => p.id === id );
			if (n) out.push(n);
		}
		return out;
	}

	getPolygonFromPoint(p: Point): VorPolygon {
		let out: VorPolygon = this._polygons[0];
		let lrg: number = this._polygons.length, minDis: number = Infinity;

		for (let i=0; i<lrg; i++) {
			let c: Point = this._polygons[i].center;
			let dis: number = Point.distance(c,p);
			if (dis < minDis) {
				out = this._polygons[i];
				minDis = dis;
			}
		}
		return out;
	}

}