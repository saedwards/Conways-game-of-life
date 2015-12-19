// Display test
!(function () {

	var el = document.getElementById('gameOfLife'),
		gameOfLife = new NAMESPACE.GameOfLife([
			// Bit of fun [Fun board]
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
		]);

	document.addEventListener('game:evolved', _displayHandler);

	function _displayHandler (e) {

		outputDisplay(e.detail.model);
	}

	function outputDisplay (model) {

		var x,
			y,
			xLen,
			yLen = model.length,
			ul,
			li;

		el.innerHTML = '';

		for (y = 0; y < yLen; y++) {
			xLen = model[y].length;
			ul = document.createElement('ul');

			for (x = 0; x < xLen; x++) {
				li = document.createElement('li');
				li.className = model[y][x].content !== null ? 'alive' : 'dead';
				ul.appendChild(li);
			}

			el.appendChild(ul);
		}
	}

	// Solid state
	gameOfLife.toggleCellState(5, 6)
		.toggleCellState(6, 6)
		.toggleCellState(4, 7)
		.toggleCellState(7, 7)
		.toggleCellState(5, 8)
		.toggleCellState(7, 8)
		.toggleCellState(6, 9);

	// Oscillator
	gameOfLife.toggleCellState(1, 12)
		.toggleCellState(2, 12)
		.toggleCellState(3, 12);

	// Glider - On 'Fun' board
	gameOfLife.toggleCellState(11, 11)
		.toggleCellState(12, 11)
		.toggleCellState(13, 11)
		.toggleCellState(11, 12)
		.toggleCellState(12, 13);

	outputDisplay(gameOfLife.getCells());

	setInterval(function () {
		gameOfLife.tick();
	}, 500);

}());