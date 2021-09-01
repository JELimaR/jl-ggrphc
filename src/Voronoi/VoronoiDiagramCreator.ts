import { Voronoi, BoundingBox, Site, Diagram, Cell, Edge } from 'voronoijs';

import VorDiagram from './VorDiagram';

import RandomNumberGenerator from '../Geom/RandomNumberGenerator';

import { Vector } from '../Geom/Point';

export default class VoronoiDiagramCreator {

    private _vor: Voronoi;
	private _bbox: BoundingBox;
    private _diagram: Diagram | undefined;
	private _sites: Site[];

    constructor(SIZE: Vector, seed: number, n: number = 100) {
		this._vor = new Voronoi();
		// xl is x-left, xr is x-right, yt is y-top, and yb is y-bottom
        this._bbox = {xl: 0, xr: SIZE.x, yt: 0, yb: SIZE.y};
		this._sites = this.randomSites(SIZE.x, SIZE.y, seed, n)
	}

    createDiagram( rel: number = 0 ): void {
		    
        this._diagram = this.calculate();

		for (let i=1; i <= rel ; i++) {
			this._diagram = this.relax();
		}		

    }

    get diagram(): VorDiagram {
        if ( !this._diagram ) {
            this.createDiagram(2);
        }
        return new VorDiagram( this._diagram! );
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

    private randomSites (XMAX: number, YMAX: number, seed: number, n: number): Site[] {
        let out: Site[] = [];

		const randFunc = RandomNumberGenerator.makeRandomFloat(seed);

        for (let i=0; i<n; i++ ) {
            let xx = Math.round( randFunc()*XMAX*1000000 )/1000000;
            let yy = Math.round( randFunc()*YMAX*1000000 )/1000000;
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
    
}


