var NetworkGame = require('./NetworkGame');
var Board = require('./Board');
var fs = require('fs');

var { MOVE_EVENT, MESSAGE_EVENT, WAITING_EVENT } = require('../constants');

// hashmap to store games indexed by client socket ids
// so we can quickly retrieve game associated with incoming message
var games = {};
var waitingPlayerSocket = null;

function GameServer(io) {

  io.on('connection', function (socket) {
    console.log('new player connected', socket.id);

    // this connection is either already waiting to join a game or in a game
    if ((waitingPlayerSocket !== null && waitingPlayerSocket.id === socket.id)
      || games[socket.id]) {
      return;
    }

    /***** start game *****/
    if (waitingPlayerSocket !== null) {
      console.log('game started', waitingPlayerSocket.id, socket.id);
      let newGame = new NetworkGame(waitingPlayerSocket, socket, new Board());
      // store in hashmap indexed by player connection for future lookup
      games[socket.id] = newGame;
      games[waitingPlayerSocket.id] = newGame;
      waitingPlayerSocket = null;
      newGame.broadcast();
    } else {
      waitingPlayerSocket = socket;
      socket.emit(WAITING_EVENT, 'Waiting for opponent to connect to server.')
      console.log('player waiting');
    }

    /***** end game *****/
    socket.on('disconnect', function () {
      console.log('player left')

      // waiting player left. free up waiting space
      if (waitingPlayerSocket !== null && socket.id === waitingPlayerSocket.id) {
        waitingPlayerSocket = null;
      } else if (games[socket.id]) {
        // game participant left. inform their opponent and clean up the game
        // if the game was finished, persist it to disk
        let currentGame = games[socket.id];
        if (currentGame) {
          let opponentSocket = currentGame.getOpponent(socket.id);

          // persist the game if it is finished
          if (currentGame.isFinished()) {
            let board = currentGame.serializeBoard();
            fs.appendFile('database.txt', `${board}\n`, function (err) {
              if (err) {
                return console.log('Failed to persist game to disk');
              }
              console.log('Game saved to disk', board);
            })
          }

          currentGame.setOpponentDisconnected();
          currentGame.broadcast();

          currentGame.destroy();
          delete games[socket.id];
          delete games[opponentSocket];
          delete currentGame;
        }
      }
    });

    /***** incoming move *****/
    socket.on(MOVE_EVENT, function (column) {
      console.log('player moved', column, socket.id);
      let currentGame = games[socket.id];
      if (currentGame) {
        currentGame.move(socket.id, parseInt(column));
        currentGame.broadcast();
      }
    });

    /***** incoming message *****/
    socket.on(MESSAGE_EVENT, function (message) {
      console.log('player message', message, socket.id);
      // chat is not for essays
      sanitizedMessage = message.substring(0, 256);
      let currentGame = games[socket.id];
      if (currentGame) {
        let opponent = currentGame.getOpponent(socket.id)
        console.log('relaying message', opponent);
        socket.broadcast.to(opponent).emit(MESSAGE_EVENT, sanitizedMessage)
      }
    });
  });
}

module.exports = GameServer;
