import { Cell, Diagram, Halfedge, Edge, Vertex } from 'voronoijs';
import JPoint, {JVector} from '../Geom/JPoint';
import JCell from "./JCell";
import JEdge from "./JEdge";
import JSite from './JSite';


export default class JDiagram {
	private _diagram: Diagram;
    private _cells: Map<number, JCell>  = new Map<number, JCell>();
	private _vertices: JPoint[] = [];
	private _edges: JEdge[] = []; //cambiar

    constructor( d: Diagram ) {
		this._diagram = d;
		// setear sites para usar despues
		let sites: Map<number, JSite> = new Map<number, JSite>();
        d.cells.forEach( (c: Cell) => {
			const Js: JSite = new JSite(c.site);
			sites.set(Js.id,Js);
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
        d.cells.forEach( (c: Cell) => {
			const Js: JSite = sites.get(c.site.id) as JSite;
			let arrEdges: JEdge[] = [];

			c.halfedges.forEach( (he: Halfedge) => {
				const aux = he.edge;
				const Je: JEdge = edgesMap.get(aux) as JEdge;
				arrEdges.push(Je)
			})
				
			const cell = new JCell(c, Js, arrEdges)
			this._cells.set(Js.id, cell);
		});
		
		
    }

	get diagram(): Diagram {return this._diagram}
	get sites(): JSite[] {
		let out: JSite[] = [];
		this._cells.forEach((c: JCell) => {
			out.push(c.site);
		})
		return out;
	}
	get vertices(): JPoint[] {return this._vertices}
	get edges(): JEdge[] {return this._edges}
	get cells(): JCell[] {
		let out: JCell[] = [];
		this._cells.forEach((c: JCell) => {
			out.push(c);
		})
		return out;
	}

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
			throw new Error('no se encontro polygon');
		}
	}
}