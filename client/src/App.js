import React, { Component } from 'react';
import ReadSmartContract from "./ReadSmartContract";
import SetSmartContract from "./SetSmartContract";
import ListingLaws from "./ListingLaws"
import './App.css';

class App extends Component {
  state = { loading: true, drizzleState: null };

  componentDidMount() {
    const { drizzle } = this.props;

    this.unsubscribe = drizzle.store.subscribe(() => {
      const drizzleState = drizzle.store.getState();

      if (drizzleState.drizzleStatus.initialized) {
        this.setState({ loading: false, drizzleState });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    if (this.state.loading) return "Loading Drizzle...";
    return (
      <div className="App">
        <ListingLaws />
      </div>
    );
  }
}

export default App;
