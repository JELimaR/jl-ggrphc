import { Site } from 'voronoijs';
import fs  from 'fs';

import JCell, { IJCellInformation } from './Voronoi/JCell';
import JRegionMap, { IRegionInfo } from './JRegionMap';

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
	
	// info cell
	loadCellsInfo(tam: number): IJCellInformation[] {
		let out: IJCellInformation[] = [];
		try {
			let pathName: string = `${this._dirPath}/${tam}/CellsInfo.json`;
			out = JSON.parse(fs.readFileSync(pathName).toString());
		} catch (e) {
			
		}
		return out;
	}

	saveCellsInfo(mapCells: Map<number, JCell>, tam: number): void {
		fs.mkdirSync(`${this._dirPath}/${tam}`, {recursive: true});
		let pathName: string = `${this._dirPath}/${tam}/CellsInfo.json`;
		let data: IJCellInformation[] = [];
		mapCells.forEach( (cell: JCell) => {
			data[cell.id] = cell.info;
		})
		fs.writeFileSync(pathName, JSON.stringify(data));
	}

	// islands o masas
	loadIslandsInfo(tam: number): IRegionInfo[] {
		let out: IRegionInfo[] = [];
		try {
			let pathName: string = `${this._dirPath}/${tam}/IslandsInfo.json`;
			out = JSON.parse(fs.readFileSync(pathName).toString());
		} catch (e) {
			
		}
		return out;
	}

	saveIslandsInfo(islands: JRegionMap[], tam: number): void {
		fs.mkdirSync(`${this._dirPath}/${tam}`, {recursive: true});
		let pathName: string = `${this._dirPath}/${tam}/IslandsInfo.json`;
		let data: IRegionInfo[] = [];
		islands.forEach( (i: JRegionMap) => {
			data.push(i.getInterface());
		})
		fs.writeFileSync(pathName, JSON.stringify(data));
	}
	// continents

}