import JDiagram from "../Voronoi/JDiagram";
import DataInformationFilesManager from '../DataInformationLoadAndSave';
// import { IJCellInformation } from "../Voronoi/JCellInformation";
import  {IJCellHeightInfo } from '../CellInformation/JCellHeight';
import JCell from "../Voronoi/JCell";
import JWMap from "../JWMap";
import JRegionMap, { IJIslandInfo, JIslandMap } from "../RegionMap/JRegionMap";
const dataInfoManager = DataInformationFilesManager.instance;


export default class JHeightMap extends JWMap {
  // private _diagram: JDiagram;
  private _islands: JIslandMap[] = [];

  constructor(d: JDiagram) {
    super(d);
    const cellsMap = this.diagram.cells;

    /*
		 * height cells
		 */
		console.log('calculate and setting height');
		console.time('set height info');

    const loadedInfo: IJCellHeightInfo[] = dataInfoManager.loadCellsHeigth(cellsMap.size); // cambiar por heightinfo
    cellsMap.forEach((cell: JCell) => {
      const hinf: IJCellHeightInfo | undefined = loadedInfo[cell.site.id];
      cell.info.setHeightInfo(hinf);
    })

    console.timeEnd('set height info');
		
    /*
		* islands
		*/
		console.log('calculate and setting island')
		console.time('set Islands');
		let regionInfoArr: IJIslandInfo[] = dataInfoManager.loadIslandsInfo(this.diagram.cells.size);
		if (regionInfoArr.length > 0) {
			regionInfoArr.forEach((iii: IJIslandInfo) => {
				this._islands.push(
					new JIslandMap(iii.id, this.diagram, iii)
				);
			})
		} else {
			this.generateIslandList();
		}
		console.timeEnd('set Islands');
		
		// guardar info
		if (loadedInfo.length === 0) {
			this.smoothHeight();
			dataInfoManager.saveCellsHeigth(cellsMap, cellsMap.size);
		}
		if (regionInfoArr.length === 0) {
			dataInfoManager.saveIslandsInfo(this._islands, cellsMap.size);
		}
  }

  private smoothHeight() {
    this.forEachCell((c: JCell) => {
      c.mark();
      let ht: number = c.info.height;
      let cant: number = 1;
      let ns: JCell[] = this.diagram.getNeighbors(c)
      ns.forEach((n: JCell) => {
        cant++;
        if (n.isMarked()) {
          ht += n.info.prevHeight;
        } else {
          ht += n.info.height;
        }
      })
      ht = ht / cant;
      if (c.info.isLand)
        c.info.height = ht < 0.2 ? 0.2 : ht;
      else
        c.info.height = ht > 0.15 ? 0.15 : ht;
    })
    this.forEachCell((c: JCell) => {
      c.dismark();
    })
  }

  private generateIslandList(): void {
		let lista: Map<number, JCell> = new Map<number, JCell>();
		this.diagram.forEachCell((c: JCell) => {
			if (c.info.isLand) lista.set(c.id, c);
		})

		let currentId: number = -1;
		while (lista.size > 0) {
			currentId++;
			const cell: JCell = lista.entries().next().value[1];
			cell.mark();
			lista.delete(cell.id);

			let isl: JIslandMap = new JIslandMap(currentId, this.diagram);
			isl.addCell(cell);
			cell.info.islandId = isl.id; // nuevo

			let qeue: Map<number, JCell> = new Map<number, JCell>();
			this.diagram.getNeighbors(cell).forEach((ncell: JCell) => {
				qeue.set(ncell.id, ncell)
			});

			console.log('island:', currentId, isl.id);
			let times: number = 0;
			while (qeue.size > 0 && times < this.diagram.cells.size) {
				times++;
				const neigh: JCell = qeue.entries().next().value[1];
				qeue.delete(neigh.id);
				lista.delete(neigh.id);
				neigh.mark();
				isl.addCell(neigh);
				neigh.info.islandId = isl.id; // nuevo

				this.diagram.getNeighbors(neigh).forEach((nnn: JCell) => {
					if (nnn.info.isLand && !nnn.isMarked() && !qeue.has(nnn.id)) {
						qeue.set(nnn.id, nnn);
					}
				})
				if (isl.cells.size % 10000 == 0) console.log('island:', currentId, `hay ${isl.cells.size}`)
			}

			if (qeue.size > 0) throw new Error(`se supero el numero de cells: ${this.diagram.cells.size} en generateIslandList`)
			console.log('area:', isl.area)
			this._islands.push(isl);
		}
		// ordenar
		console.log(`sorting island`)
		this._islands.sort((a: JIslandMap, b: JIslandMap) => { return b.area - a.area });

		this.diagram.forEachCell((c: JCell) => { c.dismark(); })
	}

	get islands() {return this._islands }

	get landRegion(): JRegionMap {
		let out: JRegionMap = new JRegionMap(this.diagram);
		this._islands.forEach((isl: JIslandMap) => {
			out.addRegion(isl);
		})
		return out;
	}
}