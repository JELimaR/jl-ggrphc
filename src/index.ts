
import Map from './Map';
import VoronoiDiagramCreator from './Voronoi/VoronoiDiagramCreator';

const cant = 100;
console.log('init');
let vdc: VoronoiDiagramCreator = Map.createVoronoi({
	seed: 184, 
	cant: cant*1000,
	rel: 2 }
);
console.log('voronoi diagram created');

const gs: number[] = [414,58]
const hw: boolean = false;

for (let seed of gs) {
	const genSeed: number = seed;
	const map = new Map(
		vdc.diagram,
		__dirname + `/../test/test${cant}${hw ? 'w' : 'h'}/${genSeed}.png`
	);
	map.generateHeigh(genSeed);
	map.drawHeighmap(hw);
}




