import DrawerMap from "./DrawerMap";
import RandomNumberGenerator from "./Geom/RandomNumberGenerator";
import JCell from "./Voronoi/JCell";
import JDiagram from "./Voronoi/JDiagram";
import JPoint from "./Geom/JPoint";
import chroma from 'chroma-js';
import * as turf from '@turf/turf';
const colorScale = chroma.scale('Spectral').domain([1,0]);


export default class JWorldMap {

    private _diagram: JDiagram;

    constructor(d: JDiagram) {
        this._diagram = d;
		this.smoothHeight();
		// this.smoothHeight();
		// this.smoothHeight();
    }

	get diagram(): JDiagram {return this._diagram}

	private smoothHeight() {
		this._diagram.forEachCell((c: JCell) => {
			c.mark();
			let ht: number = c.height;
			let cant: number = 1;
			let ns: JCell[] = this._diagram.getNeighbors(c)
			ns.forEach((n: JCell) => {
				cant++;
				if (n.isLand) {
					if (n.isMarked()) {
						ht += n.prevHeight;
					} else {
						ht += n.height;
					}
				} else {
					ht += 0.15;
				}
			})
			c.height = ht/cant;
		})
		this._diagram.forEachCell((c: JCell) => {
			c.dismark();
		})
	}

	private generateMoisture(): void {
		console.log('generating moisture');
	}
/*
	drawHeight(dm: DrawerMap) {
		const polContainer = turf.polygon(
			[dm.getPointsBuffDrawLimits().map((p: JPoint) => {return p.toTurfPosition()})]
		);
		const zoom = dm.zoomValue;
		this._diagram.cells.forEach((c: JCell) => {	
			if (!turf.booleanDisjoint(polContainer, c.toTurfPolygonSimple())) {
				let color: string = c.isLand ? colorScale(c.height).hex() : colorScale(0.05).hex();
				const points: JPoint[] = (zoom >= 8) ? c.allVertices : c.voronoiVertices;
				dm.draw({
					points,
					strokeColor: color,
					fillColor: color
				});
			}
		})
	}

	drawCells(dm: DrawerMap) {
		const polContainer = turf.polygon(
			[dm.getPointsBuffDrawLimits().map((p: JPoint) => {return p.toTurfPosition()})]
		);
		const zoom = dm.zoomValue;
		this._diagram.cells.forEach((c: JCell) => {	
			if (!turf.booleanDisjoint(polContainer, c.toTurfPolygonSimple())) {
				let color: string = c.isLand ? colorScale(c.height).hex() : colorScale(0.05).hex();
				const points: JPoint[] = (zoom >= 8) ? c.allVertices : c.voronoiVertices;
				dm.draw({
					points,
					strokeColor: '#F50508',
					fillColor: '#FFFFFF'
				});
			}
		})
	}
*/
}