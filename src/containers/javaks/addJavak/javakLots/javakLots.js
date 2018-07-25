import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import { connect } from 'react-redux';
import * as actions from '../../../../store/actions/index';

class JavakLots extends Component {

    headerSortingStyle = { backgroundColor: '#ccc' };

    columns = [{
        dataField: '_id',
        text: 'ID',
        hidden: true
    }, {
        dataField: 'packet',
        text: 'Packet',
        headerSortingStyle: this.headerSortingStyle,
    }, {
        dataField: 'chamber',
        text: 'Chamber',
        headerSortingStyle: this.headerSortingStyle,
    }, {
        dataField: 'floor',
        text: 'Floor',
        headerSortingStyle: this.headerSortingStyle,
    }, {
        dataField: 'rack',
        text: 'Rack',
        headerSortingStyle: this.headerSortingStyle,
    }, {
        dataField: 'avakId',
        text: 'Avak',
        headerSortingStyle: this.headerSortingStyle,
        hidden: true
    }, {
        dataField: 'javakId',
        text: 'Javak',
        headerSortingStyle: this.headerSortingStyle,
        hidden: true
    }];

    cellEdit = cellEditFactory({
        mode: 'click',
        blurToSave: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
            this.props.editJavakLot(row);
        }
    });

    render() {
        return (
            <div className="grid-item">
                <BootstrapTable
                    columns={this.columns}
                    keyField='_id'
                    data={this.props.lots}
                    wrapperClasses="javaksTableWrapper"
                    bordered
                    hover
                    striped
                    cellEdit={this.cellEdit}
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
        editJavakLot: (javakLot) => dispatch(actions.editJavakLot(javakLot))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(JavakLots);