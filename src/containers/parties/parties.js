import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import './parties.css';
import Button from '../../components/UI/button/button';
import Aux from '../../components/Auxilary/Auxilary';
import { columnFormatter } from '../../utils/formatters';

class Parties extends Component {

    state = {
        singlePartyId: null
    }

    handleClickOnDelete = (partyId) => {
        this.props.deleteParty(partyId);
        this.props.fetchParties(() => { });
    }

    handleClickOnView = (partyId) => {
        this.setState({ singlePartyId: partyId });
    }

    cellEdit = cellEditFactory({
        mode: 'click',
        blurToSvae: false,
        afterSaveCell: (oldValue, newValue, row, column) => {
            this.props.editParty(row, () => {
                this.props.fetchParties(() => { });
            });
        },
        nonEditableRows: () => { return [0, 3] }
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
            filter: textFilter(),
            formatter: columnFormatter(this.props.addresses),
            editor: {
                type: Type.SELECT,
                options: this.props.addresses
            },
            filterValue: (cell, row) => {
                let filterValue = this.props.addresses.filter(address => {
                    return address.value === cell;
                })[0];
                return filterValue.label;
            },
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
                text: 'All', value: this.props.parties ? this.props.parties.length : 1
            }]
        };

        return (
            <div className="partiesContainer">
                {
                    this.state.singlePartyId

                        ? <Redirect to={"/parties/singleParty/" + this.state.singlePartyId} />
                        : null
                }
                <Link to='/parties/addParty'>
                    <Button>  Add Party </Button>
                </Link>
                <BootstrapTable
                    columns={columns}
                    keyField='_id'
                    data={this.props.parties}
                    wrapperClasses="partiesTableWrapper"
                    bordered
                    hover
                    striped
                    cellEdit={this.cellEdit}
                    filter={filterFactory()}
                    noDataIndication="No Party"
                    pagination={paginationFactory(paginationOptions)}
                    rowClasses={this.rowClasses}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        parties: state.party.data,
        addresses: state.address.options
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchParties: (thenCallback) => dispatch(actions.fetchParties(thenCallback)),
        deleteParty: (partyId) => dispatch(actions.deleteParty(partyId)),
        editParty: (party, thenCallback) => dispatch(actions.editParty(party, thenCallback))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Parties);