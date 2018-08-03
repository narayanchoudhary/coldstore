import React, { Component } from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import Header from './components/header/header';
import Home from './components/home/home';
import Avaks from './containers/avaks/avaks';
import addAvak from './containers/avaks/addAvak/addAvak';
import Parties from './containers/parties/parties';
import AddParty from './containers/parties/addParty/addParty';
import Javaks from './containers/javaks/javaks';
import addJavak from './containers/javaks/addJavak/addJavak';
import SingleParty from './containers/parties/SingleParty/singleParty';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/parties' component={Parties} />
          <Route path='/addParty' component={AddParty} />
          <Route path='/avaks' component={Avaks} />
          <Route path='/addAvak' component={addAvak} />
          <Route path='/javaks' component={Javaks} />
          <Route path='/addJavak' component={addJavak} />
          <Route path='/singleParty/:partyId' component={SingleParty} />
        </Switch>
      </div>
    );
  }
}

export default App;
