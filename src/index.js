import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import avakReducer from './store/reducers/avak';
import javakReducer from './store/reducers/javak';
import javakLotReducer from './store/reducers/javakLot';
import partyReducer from './store/reducers/party';
import yearReducer from './store/reducers/year';
import itemReducer from './store/reducers/item';
import sizeReducer from './store/reducers/size';
import addressReducer from './store/reducers/address';
import setupReducer from './store/reducers/setup';
import varietyReducer from './store/reducers/variety';
import bankReducer from './store/reducers/bank';
import expenseCategoryReducer from './store/reducers/expenseCategory';
import expenseReducer from './store/reducers/expense';
import dashboardReducer from './store/reducers/dashboard';
import transactionReducer from './store/reducers/transaction';
import rentReducer from './store/reducers/rent';
import { reducer as formReducer } from 'redux-form';
import '../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import thunk from 'redux-thunk';
import 'bootstrap/dist/css/bootstrap.min.css';

const rootReducer = combineReducers({
    party: partyReducer,
    avak: avakReducer,
    javak: javakReducer,
    javakLot: javakLotReducer,
    year: yearReducer,
    item: itemReducer,
    variety: varietyReducer,
    size: sizeReducer,
    setup: setupReducer,
    form: formReducer,
    address: addressReducer,
    bank: bankReducer,
    expenseCategory: expenseCategoryReducer,
    expense: expenseReducer,
    dashboard: dashboardReducer,
    transaction: transactionReducer,
    rent: rentReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

const app =
    <BrowserRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>;
ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
