import * as turf from '@turf/turf';

import JCell from './JCell';
import zones from '../zones/zones';
import {RH, RM} from './reliefZones'

export type TypeCellHeigth =
	| 'deepwater'
	| 'middlewater'
	| ''

export default class JCellInformation {
	private _typeCellHeigt: TypeCellHeigth = '';
	private _heigth: number = 0;
	
	constructor(jcell: JCell) {
		const inLandZone: boolean = 
			turf.booleanContains(zones[0],jcell.toTurfPolygonSimple()) ||
			turf.booleanContains(zones[1],jcell.toTurfPolygonSimple()) ||
			turf.booleanContains(zones[2],jcell.toTurfPolygonSimple()) ||
			turf.booleanContains(zones[3],jcell.toTurfPolygonSimple());
		
		if (inLandZone) {
			const boolRH: boolean = 
				turf.booleanContains(RH[0],jcell.toTurfPolygonSimple()) ||
				turf.booleanContains(RH[1],jcell.toTurfPolygonSimple()) ||
				turf.booleanContains(RH[2],jcell.toTurfPolygonSimple()) ||
				turf.booleanContains(RH[3],jcell.toTurfPolygonSimple()) ||
				turf.booleanContains(RH[4],jcell.toTurfPolygonSimple()) ||
				turf.booleanContains(RH[5],jcell.toTurfPolygonSimple()) ||
				turf.booleanContains(RH[6],jcell.toTurfPolygonSimple());
			if (boolRH) {
				this._heigth = 0.4 + 0.6*Math.random();
			} else {
				const boolMH: boolean = 
					turf.booleanContains(RM[0],jcell.toTurfPolygonSimple()) ||
					turf.booleanContains(RM[1],jcell.toTurfPolygonSimple()) ||
					turf.booleanContains(RM[2],jcell.toTurfPolygonSimple()) ||
					turf.booleanContains(RM[3],jcell.toTurfPolygonSimple()) ||
					turf.booleanContains(RM[4],jcell.toTurfPolygonSimple()) ||
					turf.booleanContains(RM[5],jcell.toTurfPolygonSimple()) ||
					turf.booleanContains(RM[6],jcell.toTurfPolygonSimple()) ||
					turf.booleanContains(RM[7],jcell.toTurfPolygonSimple());
				if (boolMH) {
					this._heigth = 0.2 + 0.4*Math.random();
				} else {
					this._heigth = 0.1 + 0.2*Math.random();
				}
			}
		} else {
			this._heigth = 0.05;
			this._typeCellHeigt = 'deepwater';
		}
	}

	get typeCellHeigth(): TypeCellHeigth {return this._typeCellHeigt}
	get heigth(): number {return this._heigth}
	set heigth(h: number) {
		this._heigth = h;
	}

}