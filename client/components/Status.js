import React from 'react';

const style = {
  padding: '10px 0',
  fontSize: '1.5rem'
}

class Status extends React.Component {
  render() {
    return <div style={style}>{this.props.message}</div>;
  }
}

export default Status;
