import JDiagram from "../Voronoi/JDiagram";
import DataInformationFilesManager from '../DataInformationLoadAndSave';
import { IJCellInformation } from "../Voronoi/JCellInformation";
import JCell from "../Voronoi/JCell";
import JWMap from "../JWMap";
import { IJIslandInfo, JIslandMap } from "../RegionMap/JRegionMap";
const dataInfoManager = DataInformationFilesManager.instance;


export default class JHeightMap extends JWMap {
  // private _diagram: JDiagram;
  private _islands: JIslandMap[] = [];

  constructor(d: JDiagram) {
    super(d);
    const cellsMap = this.diagram.cells;

    // height cells
		console.log('calculate and setting height');
		console.time('set height info');

    const loadedInfo: IJCellInformation[] = dataInfoManager.loadCellsInfo(cellsMap.size); // cambiar por heightinfo
    cellsMap.forEach((cell: JCell) => {
      const info: IJCellInformation | undefined = loadedInfo[cell.site.id];
      cell.heighInfo = info;
    })

    if (loadedInfo.length === 0) {
      this.smoothHeight();
      dataInfoManager.saveCellsInfo(cellsMap, cellsMap.size);
    }
    console.timeEnd('set height info');

    // islands
		console.log('calculate and setting island')
		console.time('set Islands');
		let regionInfoArr: IJIslandInfo[] = dataInfoManager.loadIslandsInfo(this.diagram.cells.size);
		if (regionInfoArr.length > 0) {
			regionInfoArr.forEach((iii: IJIslandInfo, i: number) => {
				this._islands.push(
					new JIslandMap(i, this.diagram, iii)
				);
			})
		} else {
			this.generateIslandList();
			dataInfoManager.saveIslandsInfo(this._islands, this.diagram.cells.size);
		}
		console.timeEnd('set Islands');
  }

  private smoothHeight() {
    this.forEachCell((c: JCell) => {
      c.mark();
      let ht: number = c.height;
      let cant: number = 1;
      let ns: JCell[] = this.diagram.getNeighbors(c)
      ns.forEach((n: JCell) => {
        cant++;
        if (n.isMarked()) {
          ht += n.prevHeight;
        } else {
          ht += n.height;
        }
      })
      ht = ht / cant;
      if (c.isLand)
        c.height = ht < 0.2 ? 0.2 : ht;
      else
        c.height = ht > 0.15 ? 0.15 : ht;
    })
    this.forEachCell((c: JCell) => {
      c.dismark();
    })
  }

  private generateIslandList(): void {
		let lista: Map<number, JCell> = new Map<number, JCell>();
		this.diagram.forEachCell((c: JCell) => {
			if (c.isLand) lista.set(c.id, c);
		})

		let currentId = -1;
		while (lista.size > 0) {
			currentId++;
			const cell: JCell = lista.entries().next().value[1];
			cell.mark();
			lista.delete(cell.id);

			let reg: JIslandMap = new JIslandMap(currentId, this.diagram);
			reg.addCell(cell);

			let qeue: Map<number, JCell> = new Map<number, JCell>();
			this.diagram.getNeighbors(cell).forEach((ncell: JCell) => {
				qeue.set(ncell.id, ncell)
			});

			console.log('island:', currentId);
			let times: number = 0;
			while (qeue.size > 0 && times < this.diagram.cells.size) {
				times++;
				const neigh: JCell = qeue.entries().next().value[1];
				qeue.delete(neigh.id);
				lista.delete(neigh.id);
				neigh.mark();
				reg.addCell(neigh);

				this.diagram.getNeighbors(neigh).forEach((nnn: JCell) => {
					if (nnn.isLand && !nnn.isMarked() && !qeue.has(nnn.id)) {
						qeue.set(nnn.id, nnn);
					}
				})
				if (reg.cells.size % 10000 == 0) console.log('island:', currentId, `hay ${reg.cells.size}`)
			}

			if (qeue.size > 0) throw new Error(`se supero el numero de cells: ${this.diagram.cells.size} en generateIslandList`)
			console.log('area:', reg.area)
			this._islands.push(reg);
		}
		// ordenar
		console.log(`sorting island`)
		this._islands.sort((a: JIslandMap, b: JIslandMap) => { return b.area - a.area });

		this.diagram.forEachCell((c: JCell) => { c.dismark(); })
	}
}