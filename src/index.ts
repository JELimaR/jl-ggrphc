
import Map from './Map';

const map: Map = new Map({
	seed: 184, 
	cant: 100000,
	pathName: __dirname + '/../test.png', 
	rel: 2 });
map.generateHeigh(17);
map.drawHeighmap();