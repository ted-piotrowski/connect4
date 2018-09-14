const { 
  RED, 
  YELLOW
} = require('../constants');

class Game {

  constructor(player1Id, player2Id, board) {
    if (player1Id === player2Id) {
      throw new Error('Players cannot have same id');
    }
    this.playerRed = player1Id;
    this.playerYellow = player2Id;
    this.playerActive = player1Id;
    this.gameTied = false;
    this.gameOver = false;
    this.winner = false;
    this.board = board;
  }

  /**
   * Toggle the active player
   */
  nextTurn() {
    if (this.playerActive === this.playerRed) {
      this.playerActive = this.playerYellow;
    } else {
      this.playerActive = this.playerRed;
    }
  }

  /**
   * Given a player in the game, return the other player
   * @param {string} player - id of a player in the game
   * @returns {string} the opponent
   */
  getOpponent(player) {
    if (player === this.playerYellow) {
      return this.playerRed;
    } else {
      return this.playerYellow;
    }
  }

  /**
   * Player drops a token into a column
   * @param {string} player - player id for player making the move
   * @param {number} column - column where token is dropped
   */
  move(player, column) {
    if (player === this.playerActive && !this.gameOver) {
      let tokenColor = (this.playerActive === this.playerRed) ? RED : YELLOW;
      let success = this.board.addToken(column, tokenColor);
      if (success) {
        this.gameTied = this.board.checkForTie();
        this.gameOver = this.board.checkForWin(column);
        this.winner = this.playerActive;
        this.nextTurn();
      }
    }
  }

  /**
   * Dump the game state into an object
   * @param {string} player - id of player requesting the game state object
   * @returns {object} the current game state for the requesting player
   */
  getGameStateForPlayer(player) {
    let status = (player === this.playerActive) ? "Your turn" : "Opponent's turn"; 
    if (this.gameOver) {
      status = 'Game over. ';
      if (this.winner === player) {
        status += 'You win!';
      } else {
        status += 'You lose. :(';
      }
    } else if (this.gameTied) {
      status = 'Game tied';
    }
    return {
      status: status,
      board: this.board.getBoard(),
    } 
  }

  isFinished() {
    return this.gameOver || this.gameTied;
  }

  /**
   * Serialize the board as a string of 7x6=42 characters
   */
  serializeBoard() {
    let output = [];
    let board = this.board.getBoard();
    for (let i = 0; i < board.length; i++) {
      output = output.concat(board[i]);
    }
    return output.join(''); 
  }

  destroy() {
    delete this.board;
  }
}

module.exports = Game;
