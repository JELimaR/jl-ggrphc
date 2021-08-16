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

    drawDiagram(ctx: CanvasRenderingContext2D) {
        
        for (let pp of this._polygons) {
            const hes = pp.cell.halfedges;
            let lrg: number = hes.length;
    
            const SIZE = 2
            // 
            ctx.fillStyle = 'red'
            ctx.fillRect(pp.cell.site.x-SIZE/2, pp.cell.site.y-SIZE/2, SIZE, SIZE);
    
            ctx.beginPath();
    
            ctx.moveTo(hes[0].getStartpoint().x, hes[0].getStartpoint().y)
            for (let i=0; i < lrg; i++) {
                ctx.lineTo(hes[i].getEndpoint().x, hes[i].getEndpoint().y)
                
            }
            ctx.stroke();
            ctx.fillStyle = 'blue';
            ctx.closePath();

        }
        let p = this._polygons[77];
        p.fill(ctx, 'blue');
        let ni = p.neighborsId;
        console.log(ni)
        for (let n in ni) {
            let npol = this._polygons.find((e) => e.id === ni[n]);
            if (npol) {
                npol.fill(ctx, 'green');
            }
        }
        
    }

}