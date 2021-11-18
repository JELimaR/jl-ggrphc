import { Voronoi, BoundingBox, Site, Cell, Diagram, Edge, Vertex } from 'voronoijs';

import JDiagram from './JDiagram';

export default class VoronoiDiagramMapCreator {

    static createDiagram(sites: Site[], rel: number = 0 ): JDiagram {
        console.time('compute')
		let bbox: BoundingBox = {xl: -180, xr: 180, yt: -90, yb: 90};
		let vor = new Voronoi();
		//let sites = VoronoiDiagramMapCreator.randomSites( seed, n)
		    
        let diagram = vor.compute( sites, bbox );

		for (let i=1; i <= rel ; i++) {
			sites = VoronoiDiagramMapCreator.improveSites(diagram.cells);
			diagram = vor.compute( sites, bbox );
		}
        console.timeEnd('compute')

        return new JDiagram(diagram);
    }

    private static improveSites(cells: Cell[]): Site[] {
        let out: Site[] = [];
        for (let c of cells) {
            out.push( VoronoiDiagramMapCreator.getCentroid(c) );
        }
        return out;
    }

    private static getCentroid(c: Cell): Site {
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


