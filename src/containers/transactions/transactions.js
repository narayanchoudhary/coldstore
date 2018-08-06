import React, { Component } from 'react'
import Aux from '../../components/Auxilary/Auxilary';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';

class Transactions extends Component {

    state = {
        transactions: [],
        parties: []
    };

    componentDidMount() {
        this.props.fetchTransactions(()=> {

        });

        this.props.fetchParties(() => {
            let parties = this.props.parties.map((party) => {
                return { label: party.name + ' ' + party.address, value: party._id }
            });
            this.setState({ parties: parties });
        });
    }

    headerSortingStyle = { backgroundColor: '#ccc' };

    columns = [
        {
            dataField: '_id',
            text: 'ID',
            hidden: true
        }, {
            dataField: 'receiptNumber',
            text: 'R No',
            sort: true,
            headerSortingStyle: this.headerSortingStyle,
            filter: textFilter()
        }, {
            dataField: 'date',
            text: 'Date',
            sort: true,
            headerSortingStyle: this.headerSortingStyle,
            filter: textFilter()
        }, {
            dataField: 'party',
            text: 'Party',
            sort: true,
            headerSortingStyle: this.headerSortingStyle,
            formatter: this.partyFormatter,
            filter: textFilter(),
            editor: {
                type: Type.SELECT,
                options: this.state.parties
            }
        }, {
            dataField: 'amount',
            text: 'Amount',
            sort: true,
            headerSortingStyle: this.headerSortingStyle,
            filter: textFilter()
        }, {
            dataField: 'lya',
            text: 'Lya',
            sort: true,
            headerSortingStyle: this.headerSortingStyle,
            filter: textFilter()
        }, {
            dataField: 'dya',
            text: 'Dya',
            sort: true,
            headerSortingStyle: this.headerSortingStyle,
            filter: textFilter()
        }, {
            dataField: 'transactionType',
            text: 'Type', //TOdo cell edit
            sort: true,
            headerSortingStyle: this.headerSortingStyle,
            filter: textFilter()
        }, {
            dataField: 'checkNumber',
            text: 'CheckNo',
            sort: true,
            headerSortingStyle: this.headerSortingStyle,
            filter: textFilter()
        }, {
            dataField: 'remark',
            text: 'Remark',
            sort: true,
            headerSortingStyle: this.headerSortingStyle,
            filter: textFilter()
        }, {
            dataField: '_id',
            text: 'Action',
            formatter: this.createDeleteButton
        }];

    cellEdit = cellEditFactory({
        mode: 'click',
        blurToSave: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
//            this.props.editAvak(row); TODO
        },
    });

    paginationOptions = {
        sizePerPageList: [{
            text: '11', value: 11
        }, {
            text: '12', value: 12
        }, {
            text: 'All', value: this.state.transactions ? this.state.transactions.length === 0 ? 1 : this.state.transactions.length : 1
        }]
    };

    render() {
        return (
            <Aux>
                <BootstrapTable
                    columns={this.columns}
                    keyField='_id'
                    data={this.state.transactions}
                    wrapperClasses="avaksTableWrapper"
                    bordered
                    hover
                    striped
                    cellEdit={this.cellEdit}
                    filter={filterFactory()}
                    noDataIndication="Koi bhi nahi mila bhai"
                    pagination={paginationFactory(this.paginationOptions)}
                    rowClasses={this.rowClasses}
                />
            </Aux>
        )
    }
}

const mapStateToProps = state => {
    return {
        parties: state.party.parties.data,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchTransactions: (thenCallback) => dispatch(actions.fetchTransactions(thenCallback)),
        fetchParties: (thenCallback) => dispatch(actions.fetchParties(thenCallback)),
        deleteTransaction: (transactionsId) => dispatch(actions.deleteTransaction(transactionsId)),
        editTransaction: (transaction) => dispatch(actions.editTransaction(transaction))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);