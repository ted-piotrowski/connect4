import React from 'react';
import { EMPTY, RED, YELLOW } from '../../constants';

const rowStyle = {
  display: 'flex'
};

const columnStyle = {
  borderWidth: 1,
  borderColor: '#ccc',
};

const emptyStyle = {
  backgroundColor: 'white',
  textAlign: 'center',
  margin: '5px',
  borderRadius: '100%',
  borderColor: '#ccc',
  borderWidth: 2,
  borderStyle: 'solid',
  padding: Math.min(window.innerHeight / 25, window.innerWidth / 20) + 'px'
}

const redStyle = {
  ...emptyStyle,
  backgroundColor: 'red'
}

const yellowStyle = {
  ...emptyStyle,
  backgroundColor: 'yellow'
}

class Row extends React.Component {
  constructor(props) {
    super(props);
    this.renderColumn = this.renderColumn.bind(this);
  }

  renderColumn(value, index) {
    const { onMove } = this.props;
    let style = emptyStyle;
    if (value === RED) {
      style = redStyle;
    } else if (value === YELLOW) {
      style = yellowStyle;
    }
    return (<div style={columnStyle}>
      <div style={style} onClick={() => onMove(index)}></div>
    </div>)
  }

  render() {
    const { columns } = this.props;
    return (
      <div style={rowStyle}>
        {columns.map(this.renderColumn)}
      </div>
    );
  }
}

export default Row;