import React, { Component, Fragment } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import { connect } from 'react-redux';
import * as actions from '../../../../store/actions';
import './javakLots.css';
import { columnFormatter, createDeleteButton, rowClasses, headerSortingStyle } from '../../../../utils/utils';

class JavakLots extends Component {

    componentDidMount() {
        this.props.fetchAvaksOfParty(this.props.partyId, this.props.type, () => {
            this.props.fetchJavakLotsByJavakId('tempJavakId', this.props.type, (response) => { });
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.partyId !== this.props.partyId || nextProps.type !== this.props.type) {
            this.props.fetchAvaksOfParty(nextProps.partyId, nextProps.type, () => {
                this.props.fetchJavakLotsByJavakId('tempJavakId', this.props.type, (response) => { });
            });
        }
    }
    handleClickOnDelete = (row) => {
        this.props.deleteJavakLot(row._id);
        this.props.fetchJavakLotsByJavakId('tempJavakId', this.props.type, (response) => { });
        // enable again the avak whose lot is deleted
        this.props.modifyAvaks(this.props.avaks, row.avakId, false);
    }

    handleClickOnAdd = (avakId) => {
        this.props.saveJavakLot(avakId, 'tempJavakId', () => {
            this.props.fetchJavakLotsByJavakId('tempJavakId', this.props.type, (response) => { });
        });

        // disable the avak which is added
        this.props.modifyAvaks(this.props.avaks, avakId, true);
    }

    createAddButton = (cell, row) => {
        return (
            <button
                className="btn btn-success btn-xs addButton"
                onClick={() => this.handleClickOnAdd(cell)}
                disabled={row.disabled}
            >
                Add
            </button>
        );
    }

    javakLotsColumns = [{
        dataField: '_id',
        text: 'ID',
        hidden: true
    }, {
        dataField: 'itemId',
        text: 'Item Id',
        hidden: true
    }, {
        dataField: 'lotNumber',
        text: 'Lot',
        editable: false,
    }, {
        dataField: 'packet',
        text: 'Packet',
        headerSortingStyle: headerSortingStyle,
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
                    message: 'Packets ' + (parseInt(avak.remainingPacket, 10) + 1) + ' se kam hona chahiye'
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
        headerSortingStyle: headerSortingStyle,
    }, {
        dataField: 'floor',
        text: 'Floor',
        headerSortingStyle: headerSortingStyle,
    }, {
        dataField: 'rack',
        text: 'Rack',
        headerSortingStyle: headerSortingStyle,
    }, {
        dataField: 'avakId',
        text: 'Avak',
        headerSortingStyle: headerSortingStyle,
        hidden: true
    }, {
        dataField: 'javakId',
        text: 'Javak',
        headerSortingStyle: headerSortingStyle,
        hidden: true
    }, {
        dataField: 'type',
        text: 'type',
        headerSortingStyle: headerSortingStyle,
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
        dataField: 'packet',
        text: 'Packet',
    }, {
        dataField: '_id',
        text: 'Action',
        formatter: this.createAddButton
    }, {
        dataField: 'date',
        text: 'Date',
    }, {
        dataField: 'type',
        text: 'Type',
        formatter: columnFormatter(this.props.types)
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
        dataField: 'remark',
        text: 'remark',
    }];

    cellEdit = cellEditFactory({
        mode: 'click',
        blurToSave: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
            this.props.editJavakLot(row, () => {
                this.props.fetchJavakLotsByJavakId('tempJavakId', this.props.type, (response) => { });
            });
        }
    });

    rowClasses = (row, rowIndex) => {
        return 'capitalize';
    };

    render() {
        return (
            <Fragment>
                <div className="grid-item avaksOfJavak" >
                    <BootstrapTable
                        columns={this.avakColumns}
                        keyField='_id'
                        data={this.props.avaks}
                        wrapperClasses="tableWrapper"
                        bordered
                        hover
                        striped
                        noDataIndication="No Avaks"
                        rowClasses={rowClasses}
                    />
                </div>
                <div className="grid-item javaksLots">
                    <BootstrapTable
                        columns={this.javakLotsColumns}
                        keyField='_id'
                        data={this.props.lots}
                        wrapperClasses="tableWrapper"
                        bordered
                        hover
                        striped
                        cellEdit={this.cellEdit}
                        noDataIndication="No Item"
                    />
                </div>
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        items: state.item.options,
        types: state.item.typeOptions,
        varieties: state.variety.options,
        sizes: state.size.options,
        avaks: state.javakLot.avaks,
        lots: state.javakLot.lots
    }
}

const mapDispatchToProps = dispatch => {
    return {
        editJavakLot: (javakLot, thenCallback) => dispatch(actions.editJavakLot(javakLot, thenCallback)),
        deleteJavakLot: (javakLotId) => dispatch(actions.deleteJavakLot(javakLotId)),
        fetchJavakLotsByJavakId: (javakId, type, thenCallback) => dispatch(actions.fetchJavakLotsByJavakId(javakId, type, thenCallback)),
        fetchAvaksOfParty: (partyId, type, thenCallback) => dispatch(actions.fetchAvaksOfParty(partyId, type, thenCallback)),
        saveJavakLot: (avakId, javakId, thenCallback) => dispatch(actions.saveJavakLot(avakId, javakId, thenCallback)),
        modifyAvaks: (avaks, avakId, status) => dispatch(actions.modifyAvaks(avaks, avakId, status)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(JavakLots);