import React from 'react';
import Row from './Row';

const boardStyle = {
  display: 'inline-block',
  backgroundColor: 'blue',
  padding: '10px',
  borderType: 'solid',
  borderColor: '#ccc',
  borderWidth: 3
};

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
  }

  renderRow(columns) {
    const {onMove} = this.props;
    return <Row columns={columns} onMove={onMove} />
  }

  render() {
    const { board } = this.props;
    return (
      <div style={boardStyle}>
        {board.map(this.renderRow)}
      </div>
    )
  }
}

export default Board;