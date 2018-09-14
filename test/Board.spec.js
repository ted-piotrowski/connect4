var assert = require('assert');
var Board = require('../server/Board');
var { RED, YELLOW, EMPTY } = require('../constants');

describe('Board', function () {
  it('should be 7x6 dimensions', function () {
    let gameBoard = new Board();
    let board = gameBoard.getBoard();
    assert.equal(board.length, 6); // 6 rows
    assert.equal(board[0].length, 7); // 7 columns
  });

  it('should accept new tokens', function () {
    let gameBoard = new Board();
    let board = gameBoard.getBoard();
    assert.equal(board[5][0], EMPTY);

    success = gameBoard.addToken(0, RED);
    assert.equal(success, true);
    board = gameBoard.getBoard();
    assert.equal(board[5][0], RED);

    success = gameBoard.addToken(0, YELLOW);
    assert.equal(success, true);
    board = gameBoard.getBoard();
    assert.equal(board[4][0], YELLOW);
  });

  it('should not accept tokens if column full', function () {
    let gameBoard = new Board();
    success = gameBoard.addToken(0, RED);
    success = gameBoard.addToken(0, RED);
    success = gameBoard.addToken(0, RED);
    success = gameBoard.addToken(0, RED);
    success = gameBoard.addToken(0, RED);
    success = gameBoard.addToken(0, RED);
    let board = gameBoard.getBoard();
    assert.equal(success, true);
    assert.equal(board[0][0], RED);
    success = gameBoard.addToken(0, RED);
    assert.equal(success, false);
  });

  it('should indicate win if 4 pieces in a row', function () {
    let gameBoard = new Board();
    let board = gameBoard.getBoard();
    gameBoard.addToken(0, RED);
    gameBoard.addToken(1, RED);
    gameBoard.addToken(2, RED);
    let gameOver = gameBoard.checkForWin(2);
    assert.equal(gameOver, false);
    gameBoard.addToken(3, RED);
    gameOver = gameBoard.checkForWin(3);
    assert.equal(gameOver, true);
  });

  it('should not indicate win if 4 pieces in row but not consecutive', function () {
    let gameBoard = new Board();
    let board = gameBoard.getBoard();
    gameBoard.addToken(0, RED);
    gameBoard.addToken(1, RED);
    gameBoard.addToken(2, RED);
    gameBoard.addToken(5, RED);
    gameOver = gameBoard.checkForWin(5);
    assert.equal(gameOver, false);
  });

  it('should indicate win if 4 pieces in a column', function () {
    let gameBoard = new Board();
    let board = gameBoard.getBoard();
    gameBoard.addToken(0, RED);
    gameBoard.addToken(0, RED);
    gameBoard.addToken(0, RED);
    let gameOver = gameBoard.checkForWin(0);
    assert.equal(gameOver, false);
    gameBoard.addToken(0, RED);
    gameOver = gameBoard.checkForWin(0);
    assert.equal(gameOver, true);
  });

  it('should not indicate win if 4 pieces in column but not consecutive', function () {
    let gameBoard = new Board();
    let board = gameBoard.getBoard();
    gameBoard.addToken(0, RED);
    gameBoard.addToken(0, RED);
    gameBoard.addToken(0, RED);
    gameBoard.addToken(0, YELLOW);
    gameBoard.addToken(0, RED);
    gameOver = gameBoard.checkForWin(0);
    assert.equal(gameOver, false);
  });

  it('should indicate win diagonally in NE direction', function () {
    let gameBoard = new Board();
    gameBoard.addToken(0, RED);
    gameBoard.addToken(1, YELLOW);
    gameBoard.addToken(1, RED);
    gameBoard.addToken(2, YELLOW);
    gameBoard.addToken(2, YELLOW);
    gameBoard.addToken(2, RED);
    gameBoard.addToken(3, YELLOW);
    gameBoard.addToken(3, YELLOW);
    gameBoard.addToken(3, YELLOW);
    let gameOver = gameBoard.checkForWin(3);
    assert.equal(gameOver, false);
    gameBoard.addToken(3, RED);
    gameOver = gameBoard.checkForWin(3);
    assert.equal(gameOver, true);
  });

  it('should indicate win diagonally in NW direction', function () {
    let gameBoard = new Board();
    gameBoard.addToken(3, RED);
    gameBoard.addToken(2, YELLOW);
    gameBoard.addToken(2, RED);
    gameBoard.addToken(1, YELLOW);
    gameBoard.addToken(1, YELLOW);
    gameBoard.addToken(1, RED);
    gameBoard.addToken(0, YELLOW);
    gameBoard.addToken(0, YELLOW);
    gameBoard.addToken(0, YELLOW);
    let gameOver = gameBoard.checkForWin(0);
    assert.equal(gameOver, false);
    gameBoard.addToken(0, RED);
    gameOver = gameBoard.checkForWin(0);
    assert.equal(gameOver, true);
  });

  it('should indicate tie when board is full', function () {
    let gameBoard = new Board();
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        gameBoard.addToken(j, RED);
      }
    }
    let tie = gameBoard.checkForTie();
    assert.equal(tie, true);
  });
});