import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import './javakLots.css';
import { connect } from 'react-redux';
import * as actions from '../../../../store/actions';

class JavakLots extends Component {

    state = {
        javakLots: []
    }

    javakIdFormatter = (cell, row) => {
        let javak = this.props.javaks.find((javak) => {
            return javak._id === cell;
        });
        return (
            <div>
                {javak && javak.receiptNumber}
            </div>
        );
    }

    javakDateFormatter = (cell, row) => {
        let javak = this.props.javaks.find((javak) => {
            return javak._id === row.javakId;
        });
        return (
            <div>
                {javak && javak.date}
            </div>
        );
    }

    columns = [{
        dataField: '_id',
        text: 'ID',
        hidden: true
    }, {
        dataField: 'date',
        text: 'Date',
        formatter: this.javakDateFormatter,
    }, {
        dataField: 'javakId',
        text: 'No',
        formatter: this.javakIdFormatter,
    }, {
        dataField: 'packet',
        text: 'Packet',
    }];

    render() {
        return (
            <BootstrapTable
                columns={this.columns}
                keyField='_id'
                data={this.props.javakLots}
                wrapperClasses="javaksTableWrapper javakLotsInsidePartyAccount"
                bordered
                hover
                striped
                noDataIndication="-"
            />
        )
    }
}

const mapStateToProps = state => {
    return {
        fetchError: state.avak.avaks.error,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchJavakLotsByAvakIds: (avakIds, thenCallback) => dispatch(actions.fetchJavakLotsByAvakIds(avakIds, thenCallback)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(JavakLots);