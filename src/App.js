import React, { Component } from 'react';
import './App.css';
import { Switch, Route, withRouter } from 'react-router-dom';
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
import { connect } from 'react-redux';
import * as actions from './store/actions';

class App extends Component {

  // fetch the following objects on load of the app because they are used across multiple components
  componentDidMount() {
    this.props.fetchItems(() => { });
    this.props.fetchVarieties(() => { });
    this.props.fetchSizes(() => { });
    this.props.fetchAddresses(() => { });
    this.props.fetchParties(() => { });
    this.props.fetchBanks(() => { });
  }

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

const mapDispatchToProps = dispatch => {
  return {
    fetchSizes: (thenCallback) => dispatch(actions.fetchSizes(thenCallback)),
    fetchItems: (thenCallback) => dispatch(actions.fetchItems(thenCallback)),
    fetchVarieties: (thenCallback) => dispatch(actions.fetchVarieties(thenCallback)),
    fetchAddresses: (thenCallback) => dispatch(actions.fetchAddresses(thenCallback)),
    fetchParties: (thenCallback) => dispatch(actions.fetchParties(thenCallback)),
    fetchBanks: (thenCallback) => dispatch(actions.fetchBanks(thenCallback)),
  }
}

export default withRouter(connect(null, mapDispatchToProps)(App));