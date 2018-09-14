import React from 'react';

const style = {
  padding: '10px 0'
}

class Status extends React.Component {
  render() {
    return <div style={style}>{this.props.message}</div>;
  }
}

export default Status;
