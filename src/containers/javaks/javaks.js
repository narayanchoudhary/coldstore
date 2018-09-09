import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import './javaks.css';
import Button from '../../components/UI/button/button';
import Aux from '../../components/Auxilary/Auxilary';
import LotsModal from './LotsModal/LotsModal';
import { columnFormatter } from '../../utils/utils';

class Javaks extends Component {

    state = {
        modal: false
    };

    componentDidMount() {
        this.props.fetchJavaks(() => { });
    }

    handleClickOnDelete = (javakId) => {
        this.props.deleteJavak(javakId);
        this.props.fetchJavaks(() => { });
    }

    handleClickOnView = (javakId) => {
        this.setState({ modal: true, javakId: javakId });
    }

    closeModal = () => {
        this.setState({ modal: false, javakId: null });
    }

    cellEdit = cellEditFactory({
        mode: 'click',
        blurToSave: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
            this.props.editJavak(row);
        }
    });

    rowClasses = (row, rowIndex) => {
        return 'capitalize';
    };

    createActionCell = (cell, row) => {
        return (
            <Aux>
                <button
                    className="btn btn-primary btn-xs view-btn"
                    onClick={() => this.handleClickOnView(cell)}
                >
                    View
                </button>
                <button
                    className="btn btn-danger btn-xs"
                    onClick={() => this.handleClickOnDelete(cell)}
                >
                    Delete
            </button>
            </Aux>
        );
    }

    render() {
        const headerSortingStyle = { backgroundColor: '#ccc' };

        const columns = [{
            dataField: '_id',
            text: 'ID',
            hidden: true
        }, {
            dataField: 'receiptNumber',
            text: 'R No',
            sort: true,
            headerSortingStyle,
            filter: textFilter()
        }, {
            dataField: 'date',
            text: 'Date',
            sort: true,
            headerSortingStyle,
            filter: textFilter()
        }, {
            dataField: 'party',
            text: 'Party',
            sort: true,
            headerSortingStyle,
            formatter: columnFormatter(this.props.parties),
            filter: textFilter(),
            editor: {
                type: Type.SELECT,
                options: this.props.parties
            }
        }, {
            dataField: 'merchant',
            text: 'Merchant',
            sort: true,
            headerSortingStyle,
            filter: textFilter(),
            formatter: columnFormatter(this.props.parties),
            editor: {
                type: Type.SELECT,
                options: this.props.parties
            }
        }, {
            dataField: 'motorNumber',
            text: 'M No',
            sort: true,
            headerSortingStyle,
            filter: textFilter(),
            classes: 'motor-no'
        }, {
            dataField: '_id',
            text: 'Action',
            formatter: this.createActionCell
        }];

        let paginationOptions = {
            sizePerPageList: [{
                text: '11', value: 11
            }, {
                text: '12', value: 12
            }, {
                text: 'All', value: this.props.data ? this.props.data.length === 0 ? 1 : this.props.data.length : 1
            }]
        };

        return (
            <div className="javaksContainer">
                <Link to='/javaks/addJavak'>
                    <Button>  Add Javak </Button>
                </Link>
                <BootstrapTable
                    columns={columns}
                    keyField='_id'
                    data={this.props.data}
                    wrapperClasses="javaksTableWrapper"
                    bordered
                    hover
                    striped
                    cellEdit={this.cellEdit}
                    filter={filterFactory()}
                    noDataIndication="No Javak"
                    pagination={paginationFactory(paginationOptions)}
                    rowClasses={this.rowClasses}
                />
                {
                    this.state.modal
                        ? <LotsModal
                            javakId={this.state.javakId}
                            closeModal={this.closeModal}
                        />
                        : null
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        data: state.javak.javaks.data,
        parties: state.party.partiesOptions,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchJavaks: (thenCallback) => dispatch(actions.fetchJavaks(thenCallback)),
        deleteJavak: (javakId) => dispatch(actions.deleteJavak(javakId)),
        editJavak: (javak) => dispatch(actions.editJavak(javak))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Javaks);