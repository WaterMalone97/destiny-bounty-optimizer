import React from 'react';

class Test extends React.Component {
  // Initialize the state
  constructor(props){
    super(props);
    this.state = ''
  }

  // Fetch the list on first mount
  componentDidMount() {
    fetch('/dev/test')
    .then(res => res.json())
    .then(text => this.setState(text))
  }

  // Retrieves the list of items from the Express app

  render() {
    const text = this.state;
    return (
      <div className="App">
        <h1>List of Items</h1>
          <div>
              <h2>{this.state.text}</h2>
          </div>
      </div>
    )
  }
}

export default Test;