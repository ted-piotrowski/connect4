const { 
  EMPTY, 
  BOARD_WIDTH, 
  BOARD_HEIGHT 
} = require('../constants');

function generateBoard() {
  let board = [];
  for (let i = 0; i < BOARD_HEIGHT; i++) {
    board[i] = [];
    for (let j = 0; j < BOARD_WIDTH; j++) {
      board[i][j] = EMPTY;
    }
  }
  return board;
}

/**
 * Represents a Connect 4 board as 2-D array
 */
class Board {
  constructor() {
    this.board = generateBoard();
  }

  /**
   * return a clone so bad actors can't mutate our game
   */
  getBoard() {
    let board = [];
    for (let i = 0; i < this.board.length; i++) {
      board[i] = this.board[i].slice(0);
    }
    return board;
  }

  /**
   * Drop a token into a board column. If no more space in the
   * column, no token will be added
   * @param {number} column - the column index
   * @param {number} tokenColor - either RED or YELLOW
   * @returns {boolean} true if token was added, false otherwise
   */
  addToken(column, tokenColor) {
    for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
      if (this.board[row][column] === EMPTY) {
        this.board[row][column] = tokenColor;
        return true;
      }
    }
    return false;
  }

  /**
   * Check for game end condition. Connect 4 would involve last played
   * piece so only check for wins that would include the final piece
   * 
   * NOTE: Column constraint makes code harder to comprehend, might be 
   * premature optimization: EVIL
   * @param {number} column - column where last piece was dropped
   * @returns {boolean} true if board has a winning result
   */
  checkForWin(column) {
    let row;
    for (row = 0; this.board[row][column] === EMPTY && row < BOARD_HEIGHT; row++) { }
    return this._checkForHorizontalWin(row, column) || 
      this._checkForVerticalWin(row, column) || 
      this._checkForDiagonalWin(row, column);
  }

  /**
   * Only need to check that top row is full since tokens stack
   * @returns {boolean} true if the game is a tie
   */
  checkForTie() {
    let topRow = this.board[0];
    return topRow.indexOf(EMPTY) === -1;
  }

  /**
   * Iterate over board row where last piece was dropped and 
   * check for 4 consecutive pieces of the same color
   * @param {number} row - row where last piece was dropped
   * @param {number} column - column where last piece was dropped
   * @returns {boolean} true if 4 consecutive pieces
   */
  _checkForHorizontalWin(row, column) {
    let color = this.board[row][column];
    let winningString = [color, color, color, color].join('');
    let stringRow = this.board[row].join('');
    return stringRow.indexOf(winningString) !== -1;
  }

  /**
   * Iterate over column where last piece was dropped and 
   * check for 4 consecutive pieces of the same color
   * @param {number} row - row where last piece was dropped
   * @param {number} column - column where last piece was dropped
   * @returns {boolean} true if 4 consecutive pieces
   */
  _checkForVerticalWin(row, column) {
    let color = this.board[row][column];
    return ((row + 3) < BOARD_HEIGHT) &&
      this.board[row][column] === color &&
      this.board[row+1][column] === color &&
      this.board[row+2][column] === color && 
      this.board[row+3][column] === color;
   }

  /**
   * Check diagonal in NE and NW direction for 4 consecutive
   * pieces of the same color around where last piece was played
   * @param {number} row - row where last piece was dropped
   * @param {number} column - column where last piece was dropped
   * @returns {boolean} true if 4 consecutive pieces
   */
  _checkForDiagonalWin(row, column) {
    let color = this.board[row][column];
    let winningString = [color, color, color, color].join('');

    let NWCorner = {
      row: row - Math.min(row, column),
      column: column - Math.min(row, column) 
    }
    let NECorner = {
      row: row - Math.min(row, (BOARD_WIDTH - 1) - column),
      column: column + Math.min(row, (BOARD_WIDTH - 1) - column)
    }
    let i, j;
    let NWtoSE = [];
    for (i = NWCorner.row, j = NWCorner.column; i < BOARD_HEIGHT && j < BOARD_WIDTH; i++, j++) {
      NWtoSE.push(this.board[i][j]);
    }
    NWtoSE = NWtoSE.join('');
    if (NWtoSE.indexOf(winningString) !== -1) {
      return true;
    }

    let NEtoSW = [];
    for (i = NECorner.row, j = NECorner.column; i < BOARD_HEIGHT && j >= 0; i++, j--) {
      NEtoSW.push(this.board[i][j]);
    }
    NEtoSW = NEtoSW.join('');
    if (NEtoSW.indexOf(winningString) !== -1) {
      return true;
    }
    return false;
  }
}

module.exports = Board;