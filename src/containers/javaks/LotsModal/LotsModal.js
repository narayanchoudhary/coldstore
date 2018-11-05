import React, { Component } from 'react'
import './LotsModal.css';
import Modal from 'react-responsive-modal';
import * as actions from '../../../store/actions';
import { connect } from 'react-redux';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import { createDeleteButton, headerSortingStyle } from '../../../utils/utils';

class LotsModal extends Component {

    state = {
        open: true,
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
        this.props.fetchJavakLotsByJavakId(this.props.javakId, 'all', (response) => {
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
            this.props.editJavakLot(row, () => {
                this.fetchJavakLots();
            });
        }
    });

    columns = [{
        dataField: '_id',
        text: 'ID',
        hidden: true
    },{
        dataField: 'lotNumber',
        text: 'Lot',
        editable: false,
    }, {
        dataField: 'packet',
        text: 'Packet',
        headerSortingStyle: headerSortingStyle,
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
                    data={this.props.lots}
                    wrapperClasses="javaksTableWrapper lotsTable"
                    bordered
                    hover
                    striped
                    cellEdit={this.cellEdit}
                    noDataIndication="No Item"
                />
                Total: {this.props.sumOfJavakLots}
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        lots: state.javakLot.lots,
        sumOfJavakLots: state.javakLot.sumOfJavakLots,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        editJavakLot: (javakLot, thenCallback) => dispatch(actions.editJavakLot(javakLot, thenCallback)),
        deleteJavakLot: (javakLotId) => dispatch(actions.deleteJavakLot(javakLotId)),
        fetchJavakLotsByJavakId: (javakId, type, thenCallback) => dispatch(actions.fetchJavakLotsByJavakId(javakId, type, thenCallback)),
        fetchAvaksOfParty: (partyId, thenCallback) => dispatch(actions.fetchAvaksOfParty(partyId, thenCallback)),
        saveJavakLot: (avakId, javakId, thenCallback) => dispatch(actions.saveJavakLot(avakId, javakId, thenCallback)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LotsModal);