import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import './setting.css';

export class Settings extends Component {

    state = {
        settings: []
    }

    componentDidMount() {
        this.props.fetchSettings((response) => {
            this.setState({ settings: response.data });
        });
    }

    cellEdit = cellEditFactory({
        mode: 'click',
        blurToSave: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
            this.props.editSetting(row);
        },
    });

    render() {
        const columns = [{
            dataField: '_id',
            text: 'ID',
            hidden: true
        }, {
            dataField: 'settingName',
            text: 'Setting',
        }, {
            dataField: 'value',
            text: 'Value',
        }];

        return (
            <div className="avaksContainer settingContainer">
                <BootstrapTable
                    columns={columns}
                    keyField='_id'
                    data={this.state.settings}
                    wrapperClasses="avaksTableWrapper"
                    bordered
                    hover
                    striped
                    cellEdit={this.cellEdit}
                    noDataIndication="No items"
                />
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        data: state.avak.avaks.data,
        parties: state.party.parties.data,
        fetchError: state.avak.avaks.error,
        deleteAvakError: state.avak.deleteAvak.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchSettings: (thenCallback) => dispatch(actions.fetchSettings(thenCallback)),
        editSetting: (settingName) => dispatch(actions.editSetting(settingName))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
