
import Map from './Map';

console.log('init');
const map: Map = new Map({
	seed: 184, 
	cant: 100000,
	pathName: __dirname + '/../test.png', 
	rel: 2 });
console.log('voronoi diagram created');
map.generateHeigh(17);
map.drawHeighmap(true);