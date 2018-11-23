import React, { Component } from 'react';
import './App.css';
import { Switch, Route, withRouter } from 'react-router-dom';
import Header from './components/header/header';
import Home from './containers/dashboard/dashboard';
import Avaks from './containers/avaks/avaks';
import AddAvak from './containers/avaks/addAvak/addAvak';
import Parties from './containers/parties/parties';
import AddParty from './containers/parties/addParty/addParty';
import Javaks from './containers/javaks/javaks';
import AddJavak from './containers/javaks/addJavak/addJavak';
import SingleParty from './containers/parties/SingleParty/singleParty';
import Transactions from './containers/transactions/transactions';
import AddTransaction from './containers/transactions/addTransaction/addTransaction';
import Rents from './containers/rents/rents';
import AddRent from './containers/rents/addRent/addRent';
import Settings from './containers/setting/setting';
import Expenses from './containers/expenses/expenses';
import AddExpense from './containers/expenses/addExpense/addExpense';
import Banks from './containers/banks/banks';
import AddBank from './containers/banks/addBank/addBank';
import * as actions from './store/actions';
import { connect } from 'react-redux';
import Popup from "reactjs-popup";
import ReactAutoSuggest from './components/AutoSuggestions/autoSuggestions';
import MainContainer from './components/mainContainer/mainContainer';

class App extends Component {

  // fetch the following objects on load of the app because they are used across multiple components
  componentDidMount() {
    this.props.fetchItems(() => { });
    this.props.fetchVarieties(() => { });
    this.props.fetchSizes(() => { });
    this.props.fetchAddresses(() => { });
    this.props.fetchParties(() => { });
    this.props.fetchBanks(() => { });
    this.props.fetchExpenseCategories(() => { });
    this.props.fetchSetups(() => { });
  }

  render() {
    return (
      <div>
        <Header />
        <MainContainer>

          <Popup
            open={this.props.showPartySearchPopup}
            onClose={this.props.hidePartySearchPopup}
            modal
            closeOnDocumentClick
            contentStyle={{ minHeight: '200px', borderRadius: '4px', fontWeight: 600, padding: '0px' }}
          >
            <ReactAutoSuggest
              parties={this.props.parties}
              closer={this.props.hidePartySearchPopup}
              addresses={this.props.addresses}
            />
          </Popup>
          <Switch>
            <Route exact={true} path='/' component={Home} />
            <Route path='/parties/singleParty/:partyId' component={SingleParty} />
            <Route path='/parties/addParty' component={AddParty} />
            <Route path='/parties' component={Parties} />
            <Route path='/avaks/addAvak' component={AddAvak} />
            <Route path='/avaks' component={Avaks} />
            <Route path='/javaks/addJavak' component={AddJavak} />
            <Route path='/javaks' component={Javaks} />
            <Route path='/transactions/addTransaction' component={AddTransaction} />
            <Route path='/transactions' component={Transactions} />
            <Route path='/rents/addRent' component={AddRent} />
            <Route path='/rents' component={Rents} />
            <Route path='/expenses/addExpense' component={AddExpense} />
            <Route path='/expenses' component={Expenses} />
            <Route path='/banks/addBank' component={AddBank} />
            <Route path='/banks' component={Banks} />
            <Route path='/settings' component={Settings} />
          </Switch>
        </MainContainer>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    showPartySearchPopup: state.party.showPartySearchPopup,
    parties: state.party.options,
    addresses: state.address.options
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
    fetchExpenseCategories: (thenCallback) => dispatch(actions.fetchExpenseCategories(thenCallback)),
    fetchSetups: (thenCallback) => dispatch(actions.fetchSetups(thenCallback)),
    hidePartySearchPopup: (thenCallback) => dispatch(actions.hidePartySearchPopup(thenCallback)),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));