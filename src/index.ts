
import Map from './Map';
import VoronoiDiagramCreator from './Voronoi/VoronoiDiagramCreator';
console.time('voronoi');
const cant = 400;
console.log('init');
let vdc: VoronoiDiagramCreator = Map.createVoronoi({
	seed: 184, 
	cant: cant*1000,
	rel: 2 }
);
console.log('voronoi diagram created');

let rango = {init: 1, end: 20};
let gs: number[] = [];
for (let i=rango.init;i<=rango.end;i++) {
	gs.push(i);
}

const hw: boolean = false;

console.time('generate');
 
for (let seed of gs) {
	const genSeed: number = seed;
	const map = new Map(
		vdc.diagram,
		__dirname + `/../test/test${cant}${hw ? 'w' : 'h'}/${genSeed}.png`
	);
	map.generateHeigh(genSeed);
	map.drawHeighmap(hw);
	console.log('voy en: ', seed, 'de: ', rango.end)
}

console.timeEnd('generate');
console.timeEnd('voronoi');



