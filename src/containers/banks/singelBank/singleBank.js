import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import './singleBank.css';
import { rowClasses, headerSortingStyle, columnFormatter } from "../../../utils/utils";
import moment from 'moment';

class SingleBank extends Component {

    state = {
        statement: []
    };

    componentDidMount() {
        this.props.fetchTransactionsOfSingleBank(this.props.bank._id, () => {
            this.props.fetchExpensesOfSingleBank(this.props.bank._id, () => {
                let statement = [...this.props.transactions, ...this.props.expenses];
                statement.sort((a, b) => {
                    const aDate = moment(a.date, 'DD-MM-YYYY');
                    const bDate = moment(b.date, 'DD-MM-YYYY');
                    return -( aDate.diff(bDate, 'days'));
                });
                
                statement = statement.map((statement) => {
                    let party =  statement.party;
                    if(statement.expenseCategory) {
                        party = statement.expenseCategory;
                    }
                    let debit;
                    let credit;
                    if(statement.side === 'credit') {
                        credit = statement.amount;
                    } else if(statement.side === 'debit') {
                        debit = statement.amount;
                    } else {
                        debit = statement.amount;
                    }

                    return { ...statement, party: party, debit: debit, credit: credit}
                });
                this.setState({ statement: statement });
            });
        });
    }

    render() {
        const columns = [{
            dataField: '_id',
            text: 'ID',
            hidden: true
        }, {
            dataField: 'receiptNumber',
            text: 'R No',
            sort: true,
            headerSortingStyle,
        }, {
            dataField: 'date',
            text: 'Date',
            sort: true,
            headerSortingStyle,
        }, {
            dataField: 'party',
            text: 'Particular',
            sort: true,
            headerSortingStyle,
            formatter: columnFormatter([...this.props.parties, ...this.props.expenseCategories ]),
        }, {
            dataField: 'checkNumber',
            text: 'Check Number',
            sort: true,
            headerSortingStyle,
        }, {
            dataField: 'remark',
            text: 'Remark',
            sort: true,
            headerSortingStyle,
        }, {
            dataField: 'credit',
            text: 'Credit',
            sort: true,
            headerSortingStyle,
        }, {
            dataField: 'debit',
            text: 'Debit',
            sort: true,
            headerSortingStyle,
        }];

        return (
            <div className="partyAccount avaksContainer">
                <h3 className="partyName" >{this.props.bank ? this.props.bank.bankName + ' statement' : null}</h3>
                <BootstrapTable
                    columns={columns}
                    keyField='_id'
                    data={this.state.statement}
                    wrapperClasses="avaksTableWrapper"
                    bordered
                    hover
                    striped
                    noDataIndication="No Transactions"
                    rowClasses={rowClasses}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        transactions: state.bank.transactions,
        expenses: state.bank.expenses,
        parties: state.party.options,
        expenseCategories: state.expenseCategory.options
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchTransactionsOfSingleBank: (bankId, thenCallback) => dispatch(actions.fetchTransactionsOfSingleBank(bankId, thenCallback)),
        fetchExpensesOfSingleBank: (bankId, thenCallback) => dispatch(actions.fetchExpensesOfSingleBank(bankId, thenCallback))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleBank);