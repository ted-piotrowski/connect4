import React from 'react';
import ReactDOM from 'react-dom';

import Board from './components/Board';
import Status from './components/Status';
import Chat from './components/Chat';
import { 
  WAITING_EVENT, 
  MOVE_EVENT,
  MESSAGE_EVENT,
  UPDATE_EVENT
} from '../constants';

class App extends React.Component {

  constructor() {
    super();
    this.socket = io();
    this.state = {
      messages: [],
      status: 'Initializing',
      board: []
    }
    this.onMove = this.onMove.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentWillMount() {
    this.socket.on(WAITING_EVENT, (status) => {
      this.setState({
        status: status,
        board: []
      })
    });
    this.socket.on(UPDATE_EVENT, (gameState) => {
      console.log('game update', gameState.board);
      this.setState({
        status: gameState.status,
        board: gameState.board
      });
    });
    this.socket.on(MESSAGE_EVENT, (message) => {
      console.log('message event', message);
      this.setState({
        messages: this.state.messages.concat(['Opponent: ' + message])
      });
    });
  }

  onMove(column) {
    this.socket.emit(MOVE_EVENT, column);
  }

  sendMessage(message) {
    console.log('sending message', message);
    this.socket.emit(MESSAGE_EVENT, message);
    this.setState({
      messages: this.state.messages.concat(['You: ' + message])
    })
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  render() {
    const { status, board, messages } = this.state;
    return (
      <div>
        <Status message={status} />
        <Board board={board} onMove={this.onMove} />
        <Chat messages={messages} submitMessage={this.sendMessage} />
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)