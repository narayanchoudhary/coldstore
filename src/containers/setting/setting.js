import React, { Component } from 'react'
import cellEditFactory from 'react-bootstrap-table2-editor';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import './setting.css';
import Sidebar from './../../components/sidebar/sidebar';
import { Switch, Route } from 'react-router-dom';
import Item from './../../containers/setting/items/items';
import AddItem from './items/addItem/addItem';
import Varieties from './../../containers/setting/varieties/varieties';
import AddVariety from './../../containers/setting/varieties/addVariety/addVariety';
import Size from './../../containers/setting/sizes/sizes';
import AddSize from './../../containers/setting/sizes/addSize/addSize';
import Setup from './../../containers/setting/setups/setups';
import AddSetup from './../../containers/setting/setups/addSetup/addSetup';
import Year from './years/years';
import AddYear from './years/addYear/addYear';

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
                            <Route path='/settings/addItem' component={AddItem} />
                            <Route path='/settings/varieties' component={Varieties} />
                            <Route path='/settings/addVariety' component={AddVariety} />
                            <Route path='/settings/sizes' component={Size} />
                            <Route path='/settings/addSize' component={AddSize} />
                            <Route path='/settings/years' component={Year} />
                            <Route path='/settings/addYear' component={AddYear} />
                            <Route path='/settings/setups' component={Setup} />
                            <Route path='/settings/addSetup' component={AddSetup} />
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