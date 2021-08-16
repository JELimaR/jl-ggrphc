import { Voronoi, BoundingBox, Site, Diagram, Cell } from 'voronoijs';
import {CanvasRenderingContext2D} from 'canvas';


export default class VoronoiDiagram {

    private static _instance: VoronoiDiagram;
    private _diagram: Diagram | undefined;

    private constructor() { /*  */}

    static get instance(): VoronoiDiagram {
        if ( !VoronoiDiagram._instance ) {
            VoronoiDiagram._instance = new VoronoiDiagram();
        }
        return VoronoiDiagram._instance;
    }

    createDiagram( XMAX: number, YMAX: number, n: number ): Diagram {
        let voronoi = new Voronoi();
        let bbox: BoundingBox = {xl: 0, xr: XMAX, yt: 0, yb: YMAX}; // xl is x-left, xr is x-right, yt is y-top, and yb is y-bottom
    
        let sites: Site[] = this.randomSites(XMAX,YMAX,n);
    
        // a 'vertex' is an object exhibiting 'x' and 'y' properties. The
        // Voronoi object will add a unique 'voronoiId' property to all
        // sites. The 'voronoiId' can be used as a key to lookup the associated cell
        // in diagram.cells.
    
        this._diagram = voronoi.compute(sites, bbox);

        let h=3;
        for (let i=0; i < h ; i++) {
            sites = this.improveSites( this._diagram.cells );
            this._diagram = voronoi.compute( sites, bbox )
        }

        return this._diagram;

    }

    get diagram(): Diagram | undefined {
        return this._diagram;     
    }

    private randomSites (XMAX: number, YMAX: number, n: number): Site[] {
        let out: Site[] = [];
        for (let i=0; i<n; i++ ) {
            let xx = Math.round( Math.random()*XMAX );
            let yy = Math.round( Math.random()*YMAX );
            out.push( {id: i, x: xx, y: yy} );
        }
        return out;
    }

    private improveSites(cells: Cell[]): Site[] {
        let out: Site[] = [];
        for (let c of cells) {
            out.push( this.getCentroid(c) );
        }
        return out;
    }

    private getCentroid(c: Cell): Site {
        const hes = c.halfedges;
        let lrg: number = hes.length;
        let xx: number = 0, yy: number = 0;
        for (let i=0; i < lrg; i++) {
            xx += hes[i].getEndpoint().x
            yy += hes[i].getEndpoint().y
        }

        return {id: c.site.id, x: xx/lrg, y:yy/lrg}
    }

    drawDiagram(ctx: CanvasRenderingContext2D) {
        if (this._diagram) {
            for (let c of this._diagram.cells) {
                const hes = c.halfedges;
                let lrg: number = hes.length;
        
                // const SIZE = 10
                // 
                // ctx.fillStyle = 'red'
                // ctx.fillRect(c.site.x-SIZE/2, c.site.y-SIZE/2, SIZE, SIZE);
        
                ctx.beginPath();
        
                ctx.moveTo(hes[0].getStartpoint().x, hes[0].getStartpoint().y)
                for (let i=0; i < lrg; i++) {
                    ctx.lineTo(hes[i].getEndpoint().x, hes[i].getEndpoint().y)
                    
                }
                ctx.stroke();
                ctx.fillStyle = 'blue';
                ctx.closePath();
            }
        } else {
            throw new Error(`no diagram created`);
        }
    }
}