import { Voronoi, BoundingBox, Site, Diagram, Cell } from 'voronoijs';
import {CanvasRenderingContext2D} from 'canvas';
import PoissonDiskSampling from 'poisson-disk-sampling'

import Point from './Geom/Point';

export default class VoronoiDiagram {

    private _vor: Voronoi;
	private _bbox: BoundingBox;
    private _diagram: Diagram | undefined;
	private _sites: Site[];
	private pointGenerate: 'random' | 'poisson';

    constructor(XMAX: number, YMAX: number, n: number = 100, pointGenerate: 'random' | 'poisson' = 'poisson') {
		this._vor = new Voronoi();
        this._bbox = {xl: 0, xr: XMAX, yt: 0, yb: YMAX}; // xl is x-left, xr is x-right, yt is y-top, and yb is y-bottom
		this._sites = (pointGenerate === 'random')
			? this.randomSites(XMAX,YMAX,n)
			: this.poissonDiskSites(XMAX,YMAX,n);
		this.pointGenerate = pointGenerate;
		
	}

    createDiagram( rel: number = 0 ): Diagram {
            
        let sites: Site[] = this._sites;
    
        // a 'vertex' is an object exhibiting 'x' and 'y' properties. The
        // Voronoi object will add a unique 'voronoiId' property to all
        // sites. The 'voronoiId' can be used as a key to lookup the associated cell
        // in diagram.cells.
    
        this._diagram = this.calculate();

		if (this.pointGenerate === 'random') {
			for (let i=1; i <= rel ; i++) {
				this._diagram = this.relax();
			}
		}


        return this._diagram;
    }

    get diagram(): Diagram | undefined {
        return this._diagram;
    }

	private calculate(): Diagram {
		return this._vor.compute( this._sites, this._bbox )
	}

	private relax(): Diagram {
		if (!this._diagram) {
			throw new Error(`no diagram created`);
		} else {
			this._sites = this.improveSites(this._diagram.cells)
			return this.calculate();
		}		
	}

	private poissonDiskSites (XMAX: number, YMAX: number, n: number): Site[] {
        let out: Site[] = [];

		let pds = new PoissonDiskSampling({
			shape: [XMAX, YMAX],
			minDistance: 2*(XMAX+YMAX)/(n),
			maxDistance: 2*(XMAX+YMAX)/(n),
			tries: 10
		});

		let points = pds.fill();

		for (let p of points) {
			let xx = Math.round( p[0]*10000)/10000;
            let yy = Math.round( p[1]*10000)/10000;
            out.push( {id: 0, x: xx, y: yy} );
		}

        return out;
    }

    private randomSites (XMAX: number, YMAX: number, n: number): Site[] {
        let out: Site[] = [];

        for (let i=0; i<n; i++ ) {
            let xx = Math.round( Math.random()*XMAX*10000 )/10000;
            let yy = Math.round( Math.random()*YMAX*10000 )/10000;
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
        
                const SIZE = 20
                // 
                ctx.fillStyle = 'red'
                ctx.fillRect(c.site.x-SIZE/2, c.site.y-SIZE/2, SIZE, SIZE);
        
                ctx.beginPath();
        
                ctx.moveTo(hes[0].getStartpoint().x, hes[0].getStartpoint().y)
                for (let i=0; i < lrg; i++) {
                    ctx.lineTo(hes[i].getEndpoint().x, hes[i].getEndpoint().y)
                    
                }
                ctx.stroke();
                ctx.fillStyle = 'blue';
                ctx.closePath();

            }
			let p = new Polygon( this._diagram.cells[0] )
        } else {
            throw new Error(`no diagram created`);
        }
    }
}

/**
 * En una cell:
 * 	halfedge es un borde de celda.
 * 	cada halfedge tiene un objeto edge, que es una arista entre centro y el centro de una celda vecina
 */

class Polygon {

	private _cell: Cell;

	constructor( c: Cell ) {

		this._cell = c;
		
		//console.log(c)
		let hes = c.halfedges;
		for (let i = 0; i < hes.length; i++) {
			console.log( hes[i].edge );
		}
		
	}

	get cell(): Cell { return this._cell }

}