import { Site } from 'voronoijs';
import * as turf from '@turf/turf';

import RandomNumberGenerator from '../Geom/RandomNumberGenerator';
import zones from './zones';


const XDIF: number = 360;
const YDIF: number = 180;

export default class GenerateMapVoronoiSites {
	static randomSimpleSites(n: number): Site[] {
		let out: Site[] = [];

		const randFunc = RandomNumberGenerator.makeRandomFloat(n);

        for (let i=0; i<n; i++ ) {
            const pos = this.randomSite(randFunc);
            out.push( {id: i%2, x: pos[0], y: pos[1]} );
        }
        return out;
	}

	static randomOnZonesSites(ent: {nr: number, nz: number}): Site[] {
		let out: Site[] = [];

		const randFunc = RandomNumberGenerator.makeRandomFloat(ent.nr*ent.nz);

		for (let i=0; i<ent.nr; i++ ) {
            const pos = this.randomSite(randFunc)
            out.push( {id: ent.nz+i, x: pos[0], y: pos[1]});
        }

        for (let i=0; i<ent.nz; i++ ) {
			let ok: boolean = false;
			let pos: turf.Position;
			while (!ok) {
				pos = this.randomSite(randFunc);
				ok = this.inZone(pos);
				if (ok)
				out.push({id: i, x: pos[0], y: pos[1]});
			}
           
        }

        return out;
	}

	static inZone(pos: turf.Position): boolean {
		let out: boolean = false;
		zones.forEach((polygon: turf.Feature<turf.Polygon>) => {
			if (!out) {
				out = turf.booleanPointInPolygon(pos, polygon)
			}
		})
		return out;
	}

	private static randomSite(randFloat: () => number): turf.Position {
		let xx = Math.round( randFloat()*XDIF*1000000 )/1000000 - 180;
		let yy = Math.round( randFloat()*YDIF*1000000 )/1000000 - 90;
		return [xx, yy];
	}
}