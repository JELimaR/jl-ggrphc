import { Cell, Edge } from "voronoijs";

/**
 * En una cell:
 * 	halfedge es un borde de celda.
 * 	cada halfedge tiene un objeto edge, que es una arista entre centro y el centro de una celda vecina
 */

export default class VorPolygon {

	private _cell: Cell;

	constructor( c: Cell ) {

		this._cell = c;
		
	}

    get id(): number { return this._cell.site.id }

    get neighborsId(): number[] {
        let out: number[] = [];
        for (let e of this._cell.halfedges ) {
            const edge: Edge = e.edge;
            if ( edge.lSite.id !== this.id ) {
                out.push( edge.lSite.id )
            } else {
                if ( edge.rSite !== null ) {
                    out.push( edge.rSite.id );
                }
            }
        }
        return out;
    }

	get cell(): Cell { return this._cell }
    
    fill( ctx: CanvasRenderingContext2D, color: string ) {
        const hes = this._cell.halfedges;
        let lrg: number = hes.length;

        // const SIZE = 20
        // 
        // ctx.fillStyle = 'red'
        // ctx.fillRect(this._cell.site.x-SIZE/2, this._cell.site.y-SIZE/2, SIZE, SIZE);

        ctx.beginPath();

        ctx.moveTo(hes[0].getStartpoint().x, hes[0].getStartpoint().y)
        for (let i=0; i < lrg; i++) {
            ctx.lineTo(hes[i].getEndpoint().x, hes[i].getEndpoint().y)
            
        }

        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }

}