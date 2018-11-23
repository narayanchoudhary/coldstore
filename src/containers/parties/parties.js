import React, { Component, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import filterFactory, { textFilter, numberFilter } from 'react-bootstrap-table2-filter';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import './parties.css';
import Button from '../../components/UI/button/button';
import Aux from '../../components/Auxilary/Auxilary';
import { headerSortingStyle, columnFormatter, paginationOptions, filterValue, rowClasses } from '../../utils/utils';

class Parties extends Component {

    state = {
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
            filterValue: filterValue(this.props.addresses),
        }, {
            dataField: 'name',
            text: 'Name',
            sort: true,
            headerSortingStyle,
            filter: textFilter()
        }, {
            dataField: 'totalAvak',
            text: 'Avak',
            sort: true,
            headerSortingStyle,
            filter: textFilter(),
            editable: false,
        }, {
            dataField: 'totalJavak',
            text: 'Javak',
            sort: true,
            headerSortingStyle,
            filter: textFilter(),
            editable: false,
        }, {
            dataField: 'balance',
            text: 'Balance',
            sort: true,
            headerSortingStyle,
            filter: numberFilter(),
            editable: false,
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

        return (
            <Fragment>
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
                    wrapperClasses="tableWrapper partiesTableWrapper"
                    bordered
                    hover
                    striped
                    cellEdit={this.cellEdit}
                    filter={filterFactory()}
                    noDataIndication="No Party"
                    pagination={paginationFactory(paginationOptions(this.props.parties))}
                    rowClasses={rowClasses}
                />
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        parties: state.party.parties,// not state.party.options because it is the actual table not the formatters just like address is being used in it.
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