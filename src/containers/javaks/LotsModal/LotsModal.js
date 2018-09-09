import React, { Component } from 'react'
import './LotsModal.css';
import Modal from 'react-responsive-modal';
import * as actions from '../../../store/actions';
import { connect } from 'react-redux';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import { createDeleteButton } from '../../../utils/utils';

class LotsModal extends Component {

    state = {
        open: true,
        lots: []
    };

    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
        this.props.closeModal();
    };

    componentDidMount() {
        this.fetchJavakLots();
    }

    fetchJavakLots = () => {
        this.props.fetchJavakLotsByJavakId(this.props.javakId, (response) => {
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
    }

    cellEdit = cellEditFactory({
        mode: 'click',
        blurToSave: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
            this.props.editJavakLot(row);
        }
    });

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
        formatter: createDeleteButton(this.handleClickOnDelete)
    }];

    render() {
        return (
            <Modal
                open={this.state.open}
                onClose={this.onCloseModal}
                animationDuration={1000}
                center

            >
                <BootstrapTable
                    columns={this.columns}
                    keyField='_id'
                    data={this.state.lots}
                    wrapperClasses="javaksTableWrapper lotsTable"
                    bordered
                    hover
                    striped
                    cellEdit={this.cellEdit}
                    noDataIndication="No Item"
                />
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        data: state.avak.avaks.data,
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

export default connect(mapStateToProps, mapDispatchToProps)(LotsModal);