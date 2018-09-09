import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import { connect } from 'react-redux';
import * as actions from '../../../../store/actions';
import Aux from '../../../../components/Auxilary/Auxilary';
import './javakLots.css';
import { columnFormatter, createDeleteButton } from '../../../../utils/formatters';

class JavakLots extends Component {

    componentDidMount() {
        this.props.fetchAvaksOfParty(this.props.partyId, () => {
            this.props.fetchJavakLotsByJavakId('tempJavakId', (response) => { });
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.partyId !== this.props.partyId) {
            this.props.fetchAvaksOfParty(nextProps.partyId, () => { });
        }
    }

    headerSortingStyle = { backgroundColor: '#ccc' };

    handleClickOnDelete = (row) => {
        this.props.deleteJavakLot(row._id);
        this.props.fetchJavakLotsByJavakId('tempJavakId', (response) => { });
        // enable again the avak whose lot is deleted
        this.props.modifyAvaks(this.props.avaks, row.avakId, false);
    }

    handleClickOnAdd = (avakId) => {
        this.props.saveJavakLot(avakId, 'tempJavakId', () => {
            this.props.fetchJavakLotsByJavakId('tempJavakId', (response) => { });
        });

        // disable the avak which is added
        this.props.modifyAvaks(this.props.avaks, avakId, true);
    }

    createAddButton = (cell, row) => {
        return (
            <button
                className="btn btn-success btn-xs"
                onClick={() => this.handleClickOnAdd(cell)}
                disabled={row.disabled}
            >
                Add
            </button>
        );
    }

    columns = [{
        dataField: '_id',
        text: 'ID',
        hidden: true
    }, {
        dataField: 'packet',
        text: 'Packet',
        headerSortingStyle: this.headerSortingStyle,
        validator: (newValue, row, column) => {
            let avak = this.props.avaks.filter(avak => avak._id === row.avakId)[0];
            if (isNaN(newValue)) {
                return {
                    valid: false,
                    message: 'Packet should be numeric'
                };
            }
            if (newValue > avak.remainingPacket) {
                return {
                    valid: false,
                    message: 'Packets should be up to' + avak.remainingPacket
                };
            }
            if (newValue < 1) {
                return {
                    valid: false,
                    message: 'Packets should be greater than 0'
                };
            }
            return true;
        }
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
    }, {
        dataField: '_id',
        text: 'Action',
        formatter: createDeleteButton(this.handleClickOnDelete)
    }];

    avakColumns = [{
        dataField: '_id',
        text: 'ID',
        hidden: true
    }, {
        dataField: 'receiptNumber',
        text: 'R No',
    }, {
        dataField: 'date',
        text: 'Date',
    }, {
        dataField: 'item',
        text: 'Item',
        formatter: columnFormatter(this.props.items)
    }, {
        dataField: 'variety',
        text: 'Variety',
        classes: (cell, row, rowIndex, colIndex) => {
            if (cell === 'lr') return 'lr';
        },
        formatter: columnFormatter(this.props.varieties)
    }, {
        dataField: 'size',
        text: 'Size',
        formatter: columnFormatter(this.props.sizes)
    }, {
        dataField: 'privateMarka',
        text: 'Marka',
    }, {
        dataField: 'packet',
        text: 'Packet',
    }, {
        dataField: 'weight',
        text: 'Weight',
    }, {
        dataField: 'motorNumber',
        text: 'M No',
        classes: 'motor-no'
    }, {
        dataField: 'chamber',
        text: 'Chamber',
    }, {
        dataField: 'floor',
        text: 'Floor',
    }, {
        dataField: 'rack',
        text: 'Rack',
    }, {
        dataField: '_id',
        text: 'Action',
        formatter: this.createAddButton
    }];

    cellEdit = cellEditFactory({
        mode: 'click',
        blurToSave: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
            this.props.editJavakLot(row);
        }
    });

    rowClasses = (row, rowIndex) => {
        return 'capitalize';
    };

    render() {
        return (
            <Aux>
                <div className="grid-item avaksOfJavak" >
                    <BootstrapTable
                        columns={this.avakColumns}
                        keyField='_id'
                        data={this.props.avaks}
                        wrapperClasses="avaksTableWrapper"
                        bordered
                        hover
                        striped
                        noDataIndication="No Avaks"
                        rowClasses={this.rowClasses}
                    />
                </div>
                <div className="grid-item javaksLots">
                    <BootstrapTable
                        columns={this.columns}
                        keyField='_id'
                        data={this.props.lots}
                        wrapperClasses="javaksTableWrapper"
                        bordered
                        hover
                        striped
                        cellEdit={this.cellEdit}
                        noDataIndication="No Item"
                    />
                </div>
            </Aux>
        )
    }
}

const mapStateToProps = state => {
    return {
        items: state.item.options,
        varieties: state.variety.options,
        sizes: state.size.options,
        avaks: state.javakLot.avaks,
        lots: state.javakLot.lots
    }
}

const mapDispatchToProps = dispatch => {
    return {
        editJavakLot: (javakLot) => dispatch(actions.editJavakLot(javakLot)),
        deleteJavakLot: (javakLotId) => dispatch(actions.deleteJavakLot(javakLotId)),
        fetchJavakLotsByJavakId: (javakId, thenCallback) => dispatch(actions.fetchJavakLotsByJavakId(javakId, thenCallback)),
        fetchAvaksOfParty: (partyId, thenCallback) => dispatch(actions.fetchAvaksOfParty(partyId, thenCallback)),
        saveJavakLot: (avakId, javakId, thenCallback) => dispatch(actions.saveJavakLot(avakId, javakId, thenCallback)),
        modifyAvaks: (avaks, avakId, status) => dispatch(actions.modifyAvaks(avaks, avakId, status)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(JavakLots);