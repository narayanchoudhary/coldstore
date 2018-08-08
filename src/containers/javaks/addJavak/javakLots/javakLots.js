import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import { connect } from 'react-redux';
import * as actions from '../../../../store/actions';
import Aux from '../../../../components/Auxilary/Auxilary';
import './javakLots.css';

class JavakLots extends Component {

    state = {
        lots: [],
        avaks: [],
        disabledAvaks: []
    }

    componentDidMount() {
        this.props.fetchAvaksOfParty(this.props.partyId, (response) => {
            let avaks = response.data.map((avak) => {
                // add label for remaining packet
                let remainingPacket = avak.packet - avak.sentPacket;
                let label = avak.packet.toString() + '-' + remainingPacket.toString();
                // add disabled field if the remaining packet is 0
                return { ...avak, packet: label, disabled: remainingPacket === 0 ? true : false }
            });
            this.setState({ avaks: avaks });
        });
    }

    componentWillReceiveProps(nextProps) {
        nextProps.fetchAvaksOfParty(nextProps.partyId, (response) => {
            let avaks = response.data.map((avak) => {
                // add label for remaining packet
                let remainingPacket = avak.packet - avak.sentPacket;
                let label = avak.packet.toString() + '-' + remainingPacket.toString();
                // add disabled field if the remaining packet is 0
                return { ...avak, packet: label, disabled: remainingPacket === 0 ? true : false }
            });
            this.setState({ avaks: avaks });
        });
    }

    headerSortingStyle = { backgroundColor: '#ccc' };

    fetchJavakLots = () => {
        this.props.fetchJavakLotsByJavakId('tempJavakId', (response) => {
            let lots = response.data.map((lot) => {
                return {
                    _id: lot._id,
                    packet: lot.packet,
                    chamber: lot.chamber,
                    floor: lot.floor,
                    rack: lot.rack,
                    avakId: lot.avakId,
                    javakId: lot.javakId
                };
            });
            this.setState({ lots: lots });
        });
    }

    handleClickOnDelete = (row) => {
        this.props.deleteJavakLot(row._id);
        this.fetchJavakLots();

        var index = this.state.avaks.findIndex(a => a._id === row.avakId);
        let newAvaks = Object.assign([...this.state.avaks], { [index]: Object.assign({}, this.state.avaks[index], { disabled: false }) });
        this.setState({ avaks: newAvaks });
    }

    handleClickOnAdd = (avakId) => {
        this.props.saveJavakLot(avakId, 'tempJavakId', () => {
            this.fetchJavakLots();
        });

        var index = this.state.avaks.findIndex(a => a._id === avakId);
        let newAvaks = Object.assign([...this.state.avaks], { [index]: Object.assign({}, this.state.avaks[index], { disabled: true }) });
        this.setState({ avaks: newAvaks });
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

    createDeleteButton = (cell, row) => {
        return (
            <button
                className="btn btn-danger btn-xs"
                onClick={() => this.handleClickOnDelete(row)}
            >
                Delete
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
        formatter: this.createDeleteButton
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
    }, {
        dataField: 'variety',
        text: 'Variety',
        classes: (cell, row, rowIndex, colIndex) => {
            if (cell === 'lr') return 'lr';
        }
    }, {
        dataField: 'size',
        text: 'Size',
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

    render() {
        return (
            <Aux>
                <div className="grid-item avaksOfJavak" >
                    <BootstrapTable
                        columns={this.avakColumns}
                        keyField='_id'
                        data={this.state.avaks}
                        wrapperClasses="avaksTableWrapper"
                        bordered
                        hover
                        striped
                        noDataIndication="No Item"
                    />
                </div>
                <div className="grid-item javaksLots">
                    <BootstrapTable
                        columns={this.columns}
                        keyField='_id'
                        data={this.state.lots}
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
        data: state.avak.avaks.data,
        parties: state.party.parties.data,
        fetchError: state.avak.avaks.error,
        deleteAvakError: state.avak.deleteAvak.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        editJavakLot: (javakLot) => dispatch(actions.editJavakLot(javakLot)),
        deleteJavakLot: (javakLotId) => dispatch(actions.deleteJavakLot(javakLotId)),
        fetchJavakLotsByJavakId: (javakId, thenCallback) => dispatch(actions.fetchJavakLotsByJavakId(javakId, thenCallback)),
        fetchAvaksOfParty: (partyId, thenCallback) => dispatch(actions.fetchAvaksOfParty(partyId, thenCallback)),
        saveJavakLot: (avakId, javakId, thenCallback) => dispatch(actions.saveJavakLot(avakId, javakId, thenCallback)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(JavakLots);