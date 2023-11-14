import React, { Component } from 'react';

class Chatbot extends Component {
  render() {
    return (
      <div dangerouslySetInnerHTML={{ __html: '<!-- Paste chatbot embed code here -->' }}></div>
    );
  }
}

export default Chatbot;