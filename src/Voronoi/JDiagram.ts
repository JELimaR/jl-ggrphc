import { Cell, Diagram, Halfedge, Edge, Vertex } from 'voronoijs';
import JPoint, {JVector} from '../Geom/JPoint';
import JCell from "./JCell";
import JEdge from "./JEdge";
import JSite from './JSite';
import fs from 'fs';
import { IJCellInformation } from './JCell';


export default class JDiagram {
	// private _diagram: Diagram;
    private _cells: Map<number, JCell>  = new Map<number, JCell>();
	private _vertices: JPoint[] = [];
	private _edges: JEdge[] = []; //cambiar

    constructor( d: Diagram ) {
		console.log('Setting JDiagram values')
		console.time('set JDiagram values');
		let sites: Map<number, JSite> = new Map<number, JSite>();
        d.cells.forEach( (c: Cell) => {
			const js: JSite = new JSite(c.site);
			sites.set(js.id,js);
		});
		// setear vertices
		let verticesMap = new Map<Vertex, JPoint>();
		d.vertices.forEach((v: Vertex) => {
			const p = new JPoint(v.x, v.y);
			this._vertices.push(p);
			verticesMap.set(v,p);
		})
		// setear edges
		let edgesMap = new Map<Edge, JEdge>();
		d.edges.forEach( (e: Edge) => {
			// obtener vertices: va y vb
			let va: JPoint = verticesMap.get(e.va) as JPoint;
			let vb: JPoint = verticesMap.get(e.vb) as JPoint;

			// obtener los sites: lSite y rSite
			const ls: JSite = sites.get(e.lSite.id) as JSite;
			const rs: JSite | undefined = e.rSite ? sites.get(e.rSite.id) : undefined;

			let Je = new JEdge({
				e: e,
				va: va,
				vb: vb,
				ls: ls,
				rs: rs
			});

			this._edges.push(Je);
			edgesMap.set(e, Je)
		})
		
		// setear cells
		const loadedInfo: IJCellInformation[] = loadCellsInfo(d.cells.length);
        d.cells.forEach( (c: Cell) => {
			const js: JSite = sites.get(c.site.id) as JSite;
			let arrEdges: JEdge[] = [];

			c.halfedges.forEach( (he: Halfedge) => {
				const aux = he.edge;
				const je: JEdge = edgesMap.get(aux) as JEdge;
				arrEdges.push(je)
			})

			const info: IJCellInformation | undefined = loadedInfo[c.site.id];
				
			const cell = new JCell(c, js, arrEdges, info);
			this._cells.set(js.id, cell);
		});
		
		if (loadedInfo.length === 0)
			saveCellsInfo( this._cells);
		
		console.timeEnd('set JDiagram values');
    }

	get sites(): JSite[] {
		let out: JSite[] = [];
		this._cells.forEach((c: JCell) => {
			out.push(c.site);
		})
		return out;
	}
	get vertices(): JPoint[] {return this._vertices}
	get edges(): JEdge[] {return this._edges}
	get cells(): Map<number, JCell> { return this._cells }

	forEachCell(func: (c: JCell) => void) {
		this._cells.forEach((c: JCell) => {
			func(c);
		})
	}

	getNeighbors(cell: JCell): JCell[] {
		let out: JCell[] = [];
		for ( let id of cell.neighborsId) {
			const n: JCell | undefined = this._cells.get(id);
			if (n) 
				out.push(n);
			else 
				throw new Error('cell tiene neghbor que no existe');
		}
		return out;
	}

	getCellFromPoint(p: JPoint): JCell {
		// se puede verificar si el punto se encuentra en la cell
		let out: JCell | undefined;
		let minDis: number = Infinity;

		this._cells.forEach( (vp: JCell) => {
			let c: JPoint = vp.center;
			let dis: number = JPoint.distance(c,p);
			if (dis < minDis) {
				out = vp;
				minDis = dis;
			}
		})
		if (out)
			return out;
		else {
			throw new Error('no se encontro cell');
		}
	}
}

const loadCellsInfo = (c: number): IJCellInformation[] => {
	let out: IJCellInformation[] = [];
	try {
		let pathName: string = __dirname + `/../../test/CellsInfo${c}.json`;
		out = JSON.parse(fs.readFileSync(pathName).toString());
	} catch (e) {
		
	}
	return out;
}

const saveCellsInfo = (mapCells: Map<number,JCell>): void => {
	let pathName: string = __dirname + `/../../test/CellsInfo${mapCells.size}.json`;
	let data: IJCellInformation[] = [];
	mapCells.forEach( (cell: JCell) => {
		data[cell.id] = cell.info;
	})
	fs.writeFileSync(pathName, JSON.stringify(data));
}