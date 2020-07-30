import React from 'react';

class Test extends React.Component {
  // Initialize the state
  constructor(props){
    super(props);
    this.state = ''
  }

  // Fetch the list on first mount
  componentDidMount() {
    this.callAPI();
  }

  // Retrieves the list of items from the Express app
  callAPI = () => {
    fetch('/dev/test')
    .then(res => res.json())
    .then(text => this.setState(text))
  }

  render() {
    const text = this.state;
    return (
      <div className="App">
        <h1>List of Items</h1>
          <div>
              <h2>{text}</h2>
          </div>
        )
      </div>
    );
  }
}

export default Test;