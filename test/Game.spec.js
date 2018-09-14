var assert = require('assert');
var Game = require('../server/Game');
var Board = require('../server/Board');

describe('Game', function () {
  it('should return opponent', function () {
    let game = new Game('p1', 'p2', new Board());
    let opponent = game.getOpponent('p1');
    assert.equal(opponent, 'p2');
    opponent = game.getOpponent('p2');
    assert.equal(opponent, 'p1');
  });

  it('should serialize board', function () {
    let game = new Game('p1', 'p2', new Board());
    game.move('p1', 0);
    game.move('p2', 0);
    game.move('p1', 5);
    output = game.serializeBoard();
    assert.equal(output.length, 42);
    assert.equal(output, '000000000000000000000000000020000001000010');
  });
});
