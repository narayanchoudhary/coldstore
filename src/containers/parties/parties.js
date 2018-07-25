import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory from 'react-bootstrap-table2-editor';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import './parties.css';
import Button from '../../components/UI/button/button';

class Parties extends Component {

    componentDidMount() {
        this.props.fetchParties(()=>{});
    }

    handleClickOnDelete = (partyId) => {
        this.props.deleteParty(partyId);
        this.props.fetchParties(()=>{});
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
        }
    });

    rowClasses = (row, rowIndex) => {
        return 'capitalize';
    };

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
            formatter: this.createDeleteButton
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