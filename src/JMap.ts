import RandomNumberGenerator from "./Geom/RandomNumberGenerator";
import JCell from "./Voronoi/JCell";
import JDiagram from "./Voronoi/JDiagram";


export default class JMap {

    private _diagram: JDiagram;

    constructor(d: JDiagram) {
        this._diagram = d;
        // asignar mar prof
    }

    generateHeigh(otherSeed: number) {
		console.log('generating heighmap');
		const rnd = RandomNumberGenerator.makeRandomFloat(otherSeed);

		this.smoothHeight();
		// this._diagram.setMaxHeight();
		// this.setBorderHeigh();

	}

	private smoothHeight() {
		/*this._diagram.forEachCell((c: JCell) => {
			c.mark = true;
			let ht: number = 0;
			let ns: JCell[] = this._diagram.getNeighbors(p)
			ns.forEach((n: JCell) => {
				if (n.mark) {
					ht = ht + n.prevHeight;
				} else {
					ht = ht + n.height;
				}
			})
			c.height = (c.height+ht)/(ns.length+1);
		})
		this._diagram.forEachCell((c: JCell) => {
			c.mark = false;
		})*/
	}

	private addIsland(rnd: ()=>number, polStart: JCell, radio: number, peakH: number, addH: boolean): void {
		// decr per km
		const decr: number = Math.exp(Math.log(0.01)/radio);
		// qeue
		interface QItem {
			h: number;
			p: JCell;
		}
		let qeue: QItem[] = [];
		qeue.push({h: peakH, p: polStart});
		/*
        polStart.mark = true;
		for (let i = 0; i<qeue.length; i++) {
			const {p: pol, h}: QItem = qeue[i];
			if (!(addH && (pol.typeHeight === 'water')))
				pol.height = h + pol.height;
			if (pol.height > 0.2) pol.typeHeight = 'land';
			if (h > 0.01) {
				this._diagram.getNeighbors(pol).forEach((n: JCell) => {
					if (!n.mark) {
						const parentDis: number = JPoint.geogDistance( n.center, pol.center );
						const height: number = Math.pow(decr, parentDis) * h  * (rnd()*0.1+0.95);
						qeue.push({h: height, p: n});
						n.mark = true;
					}
				});
			}
		}
		for (let i = 0; i<qeue.length; i++) {
			qeue[i].p.mark = false;
		}
        */
	}

	generateMoisture(): void {
		console.log('generating moisture');
	}

}