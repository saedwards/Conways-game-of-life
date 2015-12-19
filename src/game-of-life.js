/**
 * Implementation
 */
!(function (w) {
	'use strict';

	/**
	 * Augment NAMESPACE
	 */
	var ns = (w.NAMESPACE = w.NAMESPACE || {});


	/**
	 * Take advantage of hoisting for code clarity
	 */
	ns.GameOfLife = GameOfLife;


	/**
	 * GameOfLife
	 * @constructor
	 */
	function GameOfLife (grid) {

		var _this = this,
			cellConfig = grid || [
				// Default
				[0,0,0,0,0],
				[0,0,0,0,0],
				[0,0,0,0,0],
				[0,0,0,0,0],
				[0,0,0,0,0],
				[0,0,0,0,0]
			],
			numYCells = cellConfig.length,
			cells = [];

		_this.isCellAlive = isCellAlive;
		_this.toggleCellState = toggleCellState;
		_this.tick = tick;
		_this.getCells = getCells;

		function isCellAlive (x, y) {

			var cellContainerXLookup;

			if (cells[y]) {

				cellContainerXLookup = cells[y][x];

				/**
				 * Check out of range and entity occupies container
				 */
				return (cellContainerXLookup !== undefined && cellContainerXLookup.content !== null);
			}
			return false;
		}

		function toggleCellState (x, y) {
			cells[y][x].content = _createCellEntity();

			return _this;
		}

		function tick () {
			_evolve();
			document && document.dispatchEvent(new CustomEvent('game:evolved', { detail: { model: cells } }));
		}

		function getCells () {
			return cells;
		}

		function _evolve () {

			var cellsToChange = [],
				cellsToChangeLen,
				c;

			cells = cells.map(function (row) {

				return row.map(function (cell) {

					/**
					 * Game rules
					 */
					var neighbourCellsAliveLen = cell.neighbourCells.filter(function (neighbour) {
							return neighbour.content !== null;
						}).length;

					// Death
					if((neighbourCellsAliveLen < 2 || neighbourCellsAliveLen > 3)) {
						cell._changeTo = null;
						cellsToChange.push(cell);
					}
					// Birth
					else if(neighbourCellsAliveLen === 3) {
						cell._changeTo = _createCellEntity();
						cellsToChange.push(cell);
					}

					return cell;
				});
			});

			cellsToChangeLen = cellsToChange.length;

			/**
			 * Mutate state AFTER death and birth decisions made.
			 */
			for (c = 0; c < cellsToChangeLen; c++) {
				cellsToChange[c].content = cellsToChange[c]._changeTo;
				delete cellsToChange[c]._changeTo;
			}
		}

		function _createCellContainer (opts) {

			// Set defaults / describe param interface
			opts = opts || {};

			/**
			 * Container model
			 */
			return {
				id: opts.id,
				content: null
			};
		}

		function _createCellEntity () {

			/**
			 * Entity model
			 */
			return {};
		}

		function _setup () {
			_setupCreateContainersEntities();
			_setupMapNeighbours();
		}

		function _setupCreateContainersEntities () {

			var x, y,
				yLen;

			for (y = 0; y < numYCells; y++) {
				yLen = cellConfig[y].length;
				cells[y] = [];

				for (x = 0; x < yLen; x++) {
					cells[y][x] = _createCellContainer({
						id: y + '-' + x // Mainly for debugging
					});
				}
			}
		}

		/**
		 * Register neighbours to each cell container AFTER all cell-occupying entities have been been placed.
		 * @private
		 */
		function _setupMapNeighbours () {

			var x, y,
				xLen,

				/**
				 * Block scope would be nice...
				 */
				currCell,
				neighbourRow,
				currCellPrevRow,
				currCellRow,
				currCellNextRow;

			for (y = 0; y < numYCells; y++) {
				xLen = cellConfig[y].length;

				for (x = 0; x < xLen; x++) {
					currCell = cells[y][x];

					currCellPrevRow = [];
					currCellRow = [];
					currCellNextRow = [];

					// Previous row
					if (cells[y-1]) {
						neighbourRow = cells[y-1];
						currCellPrevRow = _getNeighboursInRow(neighbourRow, x, currCell);
					}

					// Current row
					currCellRow = _getNeighboursInRow(cells[y], x, currCell);

					// Next row
					if (cells[y+1]) {
						neighbourRow = cells[y+1];
						currCellNextRow = _getNeighboursInRow(neighbourRow, x, currCell);
					}

					/**
					 * Find neighbour cells associated with cell container
					 */
					cells[y][x].neighbourCells = [].concat(
						currCellPrevRow,
						currCellRow,
						currCellNextRow
					);
				}
			}
		}

		function _getNeighboursInRow (row, i, currContainerCell) {

			var startSlicePos = row[i-1] ? i-1 : 0,
				stopSlicePos = row[i+1] ? i+2 : row.length;

			return row.slice(startSlicePos, stopSlicePos).filter(function (cell) {
				return currContainerCell !== cell;
			});
		}

		function _clone(obj) {
			var copy,
				prop;

			copy = {};

			for (prop in obj) {
				if (obj.hasOwnProperty(prop)) copy[prop] = obj[prop];
			}

			return copy;
		}

		_setup();
	}

}(window));

