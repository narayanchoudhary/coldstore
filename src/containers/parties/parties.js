import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory from 'react-bootstrap-table2-editor';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import './parties.css';
import Button from '../../components/UI/button/button';
import Aux from '../../components/Auxilary/Auxilary';

class Parties extends Component {

    state = {
        modal: false,
        singlePartyId: null
    }

    componentDidMount() {
        this.props.fetchParties(() => { });
    }

    handleClickOnDelete = (partyId) => {
        this.props.deleteParty(partyId);
        this.props.fetchParties(() => { });
    }

    handleClickOnView = (partyId) => {
        this.setState({ singlePartyId: partyId });
    }

    createDeleteButton = (cell, row) => {
        return (
            <button
                className="btn btn-danger btn-xs"
                onClick={() => this.handleClickOnDelete(cell)}
            >
                Delete
            </button>
        );
    }

    cellEdit = cellEditFactory({
        mode: 'click',
        blurToSvae: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
            this.props.editParty(row);
        },
        nonEditableRows: () => { return [0, 3]}
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
    };

    closeModal = () => {
        this.setState({ modal: false, partyId: null });
    }


    render() {
        const headerSortingStyle = { backgroundColor: '#ccc' };

        const columns = [{
            dataField: '_id',
            text: 'ID',
            hidden: true
        }, {
            dataField: 'address',
            text: 'Address',
            sort: true,
            headerSortingStyle,
            filter: textFilter()
        }, {
            dataField: 'name',
            text: 'Name',
            sort: true,
            headerSortingStyle,
            filter: textFilter()
        }, {
            dataField: 'phone',
            text: 'Phone',
            sort: true,
            headerSortingStyle,
            filter: textFilter()
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
                text: 'All', value: this.props.data ? this.props.data.length : 1
            }]
        };

        return (
            <div className="partiesContainer">
                {
                    this.state.singlePartyId

                        ? <Redirect to={"/singleParty/" + this.state.singlePartyId} />
                        : null
                }
                <Link to='/addParty'>
                    <Button>  Add Party </Button>
                </Link>
                <BootstrapTable
                    columns={columns}
                    keyField='_id'
                    data={this.props.data}
                    wrapperClasses="partiesTableWrapper"
                    bordered
                    hover
                    striped
                    cellEdit={this.cellEdit}
                    filter={filterFactory()}
                    noDataIndication="Koi bhi nahi mila bhai"
                    pagination={paginationFactory(paginationOptions)}
                    rowClasses={this.rowClasses}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        data: state.party.parties.data,
        fetchError: state.party.parties.error,
        deletePartyError: state.party.deleteParty.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchParties: (thenCallback) => dispatch(actions.fetchParties(thenCallback)),
        deleteParty: (partyId) => dispatch(actions.deleteParty(partyId)),
        editParty: (party) => dispatch(actions.editParty(party))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Parties);