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
import Transactions from './containers/transactions/transactions';
import AddTransaction from './containers/transactions/addTransaction/addTransaction';
import Settings from './containers/setting/setting';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route exact={true} path='/' component={Home} />
          <Route path='/parties/singleParty/:partyId' component={SingleParty} />
          <Route path='/parties/addParty' component={AddParty} />
          <Route path='/parties' component={Parties} />
          <Route path='/avaks/addAvak' component={addAvak} />
          <Route path='/avaks' component={Avaks} />
          <Route path='/javaks/addJavak' component={addJavak} />
          <Route path='/javaks' component={Javaks} />
          <Route path='/transactions/addTransaction' component={AddTransaction} />
          <Route path='/transactions' component={Transactions} />
          <Route path='/settings' component={Settings} />
        </Switch>
      </div>
    );
  }
}

export default App;
