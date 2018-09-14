var NetworkGame = require('./NetworkGame');
var Board = require('./Board');
var fs = require('fs');

var { MOVE_EVENT, MESSAGE_EVENT, WAITING_EVENT} = require('../constants');

// hashmap to store games indexed by client socket ids
// so we can quickly retrieve game associated with incoming message
var games = {};
var waitingPlayerSocket = null;

module.exports = {
  listen: function (io) {

    io.on('connection', function (socket) {
      console.log('player connected', socket.id);

      // this connection is either already waiting to join a game or in a game
      if ((waitingPlayerSocket !== null && waitingPlayerSocket.id === socket.id) 
          || games[socket.id]) {
        return;
      }

      /***** start game *****/
      if (waitingPlayerSocket !== null) {
        let newGame = new NetworkGame(waitingPlayerSocket, socket, new Board());
        // store in games hashmap for future lookup
        games[socket.id] = newGame;
        games[waitingPlayerSocket.id] = newGame;
        console.log('game started', waitingPlayerSocket.id, socket.id);
        waitingPlayerSocket = null;
        newGame.broadcast();
      } else {
        waitingPlayerSocket = socket;
        socket.emit(WAITING_EVENT, 'Waiting for opponent')
        console.log('player waiting');
      }

      socket.on('disconnect', function () {
        /***** end game *****/
        console.log('player left')

        // waiting player left. they were never in a game so no game to destroy
        if (waitingPlayerSocket !== null && socket.id === waitingPlayerSocket.id) {
          waitingPlayerSocket = null;
        } else if (games[socket.id]) {
          // can't have a game with only one player, so destroy associated games
          let currentGame = games[socket.id];
          let opponentSocket = currentGame.getOpponent(socket.id);
          currentGame.setOpponentDisconnected();
          currentGame.broadcast();

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

          currentGame.destroy();

          delete games[socket.id];
          delete games[opponentSocket];
          delete currentGame;
        }
      });

      socket.on(MOVE_EVENT, function (column) {
        console.log('player moved', column, socket.id);
        games[socket.id].move(socket.id, parseInt(column));
        games[socket.id].broadcast();
      });

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
}
