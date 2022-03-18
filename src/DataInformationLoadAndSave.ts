import { Site } from 'voronoijs';
import fs from 'fs';

import JCell from './Voronoi/JCell';
import { IJContinentInfo, IJCountryInfo, IJIslandInfo, IJStateInfo, JContinentMap, JCountryMap, JIslandMap, JStateMap } from './RegionMap/JRegionMap';
// import { IJDiagramInfo } from './Voronoi/JDiagram';
// import { IJEdgeInfo } from './Voronoi/JEdge';
import { IJCellInformation } from './Voronoi/JCellInformation';
import { JCellClimate, IJCellClimateInfo } from './heightmap/JClimateMap'

export default class DataInformationFilesManager {
	static _instance: DataInformationFilesManager;

	private _dirPath: string = '';

	private constructor() {}

	static get instance(): DataInformationFilesManager {
		if (!this._instance) {
			this._instance = new DataInformationFilesManager();
		}
		return this._instance;
	}

	static configPath(path: string): void {
		this.instance._dirPath = path;
		fs.mkdirSync(this.instance._dirPath, {recursive: true});
	}

	// voronoi diagram
	/*
	loadDiagram(tam: number): IJDiagramInfo | undefined {
		let out = {
			vertices: this.loadVertices(tam),
			cells: this.loadCells(tam),
			edges: this.loadEdges(tam),
		}
		if (out.cells.length == 0 || out.edges.length == 0 || out.vertices.length == 0) {
			return undefined
		}
		return out;
	}

	private loadVertices(tam: number): {x: number, y:number}[]  {
		let out: {x: number, y: number}[] = [];
		try {
			let pathName: string = `${this._dirPath}/${tam}/VoronoiDiagram/vertices.json`;
			out = JSON.parse(fs.readFileSync(pathName).toString());
		} catch (e) {
			
		}
		return out;	
	}

	private loadCells(tam: number): IJCellInfo[]  {
		let out: IJCellInfo[] = [];
		try {
			let pathName: string = `${this._dirPath}/${tam}/VoronoiDiagram/cells.json`;
			out = JSON.parse(fs.readFileSync(pathName).toString());
		} catch (e) {
			
		}
		return out;	
	}

	private loadEdges(tam: number): IJEdgeInfo[]  {
		let out: IJEdgeInfo[] = [];
		try {
			let pathName: string = `${this._dirPath}/${tam}/VoronoiDiagram/edges.json`;
			out = JSON.parse(fs.readFileSync(pathName).toString());
		} catch (e) {
			
		}
		return out;	
	}

	saveDiagram(diagram: IJDiagramInfo, tam: number): void {
		let dirpathName: string = `${this._dirPath}/${tam}/VoronoiDiagram`;
		fs.mkdirSync(dirpathName, {recursive: true});
		this.saveVertices(diagram.vertices, dirpathName);
		this.saveCells(diagram.cells, dirpathName);
		this.saveEdges(diagram.edges, dirpathName);
	}

	private saveVertices(verts: {x: number, y:number}[], dirpathName: string): void {
		let pathName: string = `${dirpathName}/vertices.json`;
		fs.writeFileSync(pathName, JSON.stringify(verts));
	}

	private saveCells(cells: IJCellInfo[], dirpathName: string): void {
		let pathName: string = `${dirpathName}/cells.json`;
		fs.writeFileSync(pathName, JSON.stringify(cells));
	}

	private saveEdges(edges: IJEdgeInfo[], dirpathName: string): void {
		let pathName: string = `${dirpathName}/edges.json`;
		fs.writeFileSync(pathName, JSON.stringify(edges));
	}
	*/
	// sites
	loadSites(tam: number): Site[] {
		if (this._dirPath === '') throw new Error('non configurated path');
		let out: Site[] = [];
		try {
			let pathFile: string = `${this._dirPath}/${tam}/GeneratedSites.json`;
			out = JSON.parse(fs.readFileSync(pathFile).toString());
		} catch (e) {
			
		}
		return out;
	}

	saveSites(sites: Site[], tam: number): void {
		fs.mkdirSync(`${this._dirPath}/${tam}`, {recursive: true});
		let pathName: string = `${this._dirPath}/${tam}/GeneratedSites.json`;
		fs.writeFileSync(pathName, JSON.stringify(sites));
	}

	/**
	 * cells information
	 */
	
	// heigth info cell
	loadCellsHeigth(tam: number): IJCellInformation[] {
		let out: IJCellInformation[] = [];
		try {
			let pathName: string = `${this._dirPath}/${tam}/CellsInfo/heigth.json`;
			out = JSON.parse(fs.readFileSync(pathName).toString());
		} catch (e) {
			
		}
		return out;
	}

	saveCellsHeigth(mapCells: Map<number, JCell>, tam: number): void {
		fs.mkdirSync(`${this._dirPath}/${tam}/CellsInfo`, {recursive: true});
		let pathName: string = `${this._dirPath}/${tam}/CellsInfo/heigth.json`;
		let data: IJCellInformation[] = [];
		mapCells.forEach( (cell: JCell) => {
			data[cell.id] = cell.info;
		})
		fs.writeFileSync(pathName, JSON.stringify(data));
	}

	// climate info cell
	loadCellsClimate(tam: number): IJCellClimateInfo[] {
		let out: IJCellClimateInfo[] = [];
		try {
			let pathName: string = `${this._dirPath}/${tam}/CellsInfo/climate.json`;
			out = JSON.parse(fs.readFileSync(pathName).toString());
		} catch (e) {
			
		}
		return out;
	}

	saveCellsClimate(mapCells: Map<number, JCellClimate>, tam: number): void {
		fs.mkdirSync(`${this._dirPath}/${tam}/CellsInfo`, {recursive: true});
		let pathName: string = `${this._dirPath}/${tam}/CellsInfo/climate.json`;
		let data: IJCellClimateInfo[] = [];
		mapCells.forEach( (cell: JCellClimate) => {
			data[cell.info.id] = cell.info;
		})
		fs.writeFileSync(pathName, JSON.stringify(data));
	}

	// islands o masas
	loadIslandsInfo(tam: number): IJIslandInfo[] {
		let out: IJIslandInfo[] = [];
		try {
			let pathName: string = `${this._dirPath}/${tam}/IslandsInfo.json`;
			out = JSON.parse(fs.readFileSync(pathName).toString());
		} catch (e) {
			
		}
		return out;
	}

	saveIslandsInfo(islands: JIslandMap[], tam: number): void {
		fs.mkdirSync(`${this._dirPath}/${tam}`, {recursive: true});
		let pathName: string = `${this._dirPath}/${tam}/IslandsInfo.json`;
		let data: IJIslandInfo[] = [];
		islands.forEach( (i: JIslandMap) => {
			data.push(i.getInterface());
		})
		fs.writeFileSync(pathName, JSON.stringify(data));
	}
	// continents
	loadContinentsInfo(tam: number): IJContinentInfo[] {
		let out: IJContinentInfo[] = [];
		try {
			let pathName: string = `${this._dirPath}/${tam}/ContinentsInfo.json`;
			out = JSON.parse(fs.readFileSync(pathName).toString());
		} catch (e) {
			
		}
		return out;
	}

	saveContinentsInfo(continents: JContinentMap[], tam: number): void {
		fs.mkdirSync(`${this._dirPath}/${tam}`, {recursive: true});
		let pathName: string = `${this._dirPath}/${tam}/ContinentsInfo.json`;
		let data: IJContinentInfo[] = [];
		continents.forEach( (i: JContinentMap) => {
			data.push(i.getInterface());
		})
		fs.writeFileSync(pathName, JSON.stringify(data));
	}

	// states
	loadStatesInfo(tam: number, contid: number): IJStateInfo[]  {
		let out: IJStateInfo[] = [];
		try {
			let pathName: string = `${this._dirPath}/${tam}/divisions/cont${contid}/StatesInfo.json`;
			out = JSON.parse(fs.readFileSync(pathName).toString());
		} catch (e) {
			
		}
		return out;
	}

	saveStatesInfo(states: JStateMap[] | Map<string, JStateMap>, tam: number, contid: number) {
		fs.mkdirSync(`${this._dirPath}/${tam}/divisions/cont${contid}`, {recursive: true});
		let pathName: string = `${this._dirPath}/${tam}/divisions/cont${contid}/StatesInfo.json`;
		let data: IJStateInfo[] = [];
		states.forEach((s: JStateMap) => {
			data.push(s.getInterface());
		})
		fs.writeFileSync(pathName, JSON.stringify(data));
	}

	// country
	loadCountriesInfo(tam: number, contid: number): IJCountryInfo[]  {
		let out: IJCountryInfo[] = [];
		try {
			let pathName: string = `${this._dirPath}/${tam}/divisions/cont${contid}/CountriesInfo.json`;
			out = JSON.parse(fs.readFileSync(pathName).toString());
		} catch (e) {
			
		}
		return out;
	}

	saveCountriesInfo(countries: JCountryMap[], tam: number, contid: number) {
		fs.mkdirSync(`${this._dirPath}/${tam}/divisions/cont${contid}`, {recursive: true});
		let pathName: string = `${this._dirPath}/${tam}/divisions/cont${contid}/CountriesInfo.json`;
		let data: IJCountryInfo[] = [];
		countries.forEach((c: JCountryMap) => {
			data.push(c.getInterface());
		})
		fs.writeFileSync(pathName, JSON.stringify(data));
	}
}

export type TypeDivisionRegion = 
	| 'country'
	| 'state'