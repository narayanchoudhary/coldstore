import React, { Component } from 'react'
import cellEditFactory from 'react-bootstrap-table2-editor';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import './setting.css';
import Sidebar from './../../components/sidebar/sidebar';
import { Switch, Route } from 'react-router-dom';
import Item from './../../containers/setting/items/items';
import addItem from './items/addItem/addItem';
import Varieties from './../../containers/setting/varieties/varieties';
import Size from './../../containers/setting/size/size';
import Year from './year/year';

export class Settings extends Component {
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-2">
                        <Sidebar />
                    </div>
                    <div className="col-sm-10">
                        <Switch>
                            <Route path='/settings/items' component={Item} />
                            <Route path='/settings/addItem' component={addItem} />
                            <Route path='/settings/varieties' component={Varieties} />
                            <Route path='/settings/size' component={Size} />
                            <Route path='/settings/year' component={Year} />
                        </Switch>
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        
    }
}

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
