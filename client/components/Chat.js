import React from 'react';

const textBoxStyle = {
  margin: '5px 5px',
  padding: '5px',
  width: '50%'
}

const outputStyle = {
  overflowY: 'scroll',
  maxHeight: '85px'
}

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      text: '' 
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmitMessage = this.onSubmitMessage.bind(this);
  }

  componentDidUpdate() {
    // scroll to bottom of chat
    this.outputContainer.scrollTop = this.outputContainer.scrollHeight;
  }

  onChange(e) {
    this.setState({
      text: e.target.value
    })
  }

  onSubmitMessage(e) {
    e.preventDefault();
    const {submitMessage} = this.props;
    const { text } = this.state;
    this.setState({
      text: ''
    });
    submitMessage(text);
  }

  renderMessage(message) {
    return <div>{message}</div>;
  }

  render() {
    const {text} = this.state;
    const {messages} = this.props;

    return (
      <div>
        <form onSubmit={this.onSubmitMessage}>
          <label for="message">Send message:</label>
          <input name="message" style={textBoxStyle}  onChange={this.onChange} value={text} />
        </form>
        <div style={outputStyle} ref={(el) => { this.outputContainer = el }}>
          {messages.map(this.renderMessage)}
        </div>
      </div>
    )
  }
}

export default Chat;
