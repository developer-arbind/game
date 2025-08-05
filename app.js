import { wrapGrid } from "https://esm.sh/animate-css-grid";


const grid = document.querySelector(".grid");
const { forceGridAnimation } = wrapGrid(grid);


const tiles = Array.from(document.querySelectorAll(".tile"));
const emptyTile = document.querySelector(".tile--empty");

// Get congratulations heading
const heading = document.querySelector(".heading");

const areaKeys = {
	A: ["B", "D"],
	B: ["A", "C", "E"],
	C: ["B", "F"],
	D: ["A", "E", "G"],
	E: ["B", "D", "F", "H"],
	F: ["C", "E", "I"],
	G: ["D", "H"],
	H: ["E", "G", "I"],
	I: ["F", "H"]
};


tiles.map(tile => {
	tile.addEventListener("click", event => {
		// Grab the grid area set on the clicked tile and empty tile
		const tileArea = tile.style.getPropertyValue("--area");
		const emptyTileArea = emptyTile.style.getPropertyValue("--area");

		// Swap the empty tile with the clicked tile
		emptyTile.style.setProperty("--area", tileArea);
		tile.style.setProperty("--area", emptyTileArea);

		// Animate the tiles
		forceGridAnimation();

		// Unlock and lock tiles
		unlockTiles(tileArea);
	});
});


const unlockTiles = currentTileArea => {
	
	
	tiles.map(tile => {
		const tileArea = tile.style.getPropertyValue("--area");

		if (areaKeys[currentTileArea.trim()].includes(tileArea.trim())) {
			tile.disabled = false;
		} else {
			tile.disabled = true;
		}
	});

	isComplete(tiles);
};


const isComplete = tiles => {
	
	const currentTilesString = tiles
		.map(tile => tile.style.getPropertyValue("--area").trim())
		.toString();

	if (currentTilesString == Object.keys(areaKeys).toString()) {
		heading.children[1].innerHTML = "You win!";
		heading.style = `
			animation: popIn .3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
		`;
	}
};


// Inversion calculator
const inversionCount = array => {
	

	return array.reduce((accumulator, current, index, array) => {
		return array
			.slice(index)
			.filter(item => {
				return item < current;
			})
			.map(item => {
				return [current, item];
			})
			.concat(accumulator);
	}, []).length;
};


const shuffledKeys = keys => Object.keys(keys).sort(() => .5 - Math.random());

setTimeout(() => {

	
	let startingAreas = Object.keys(areaKeys);
		
	
	while (inversionCount(startingAreas) % 2 == 1 || inversionCount(startingAreas) == 0) {
		startingAreas = shuffledKeys(areaKeys);
	}	


	tiles.map((tile, index) => {
		tile.style.setProperty("--area", startingAreas[index]);
	});

	
	forceGridAnimation();

	
	unlockTiles(emptyTile.style.getPropertyValue("--area"));
}, 2000);
