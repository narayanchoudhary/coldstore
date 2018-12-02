import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import filterFactory from 'react-bootstrap-table2-filter';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import './banks.css';
import Button from '../../components/UI/button/button';
import Aux from '../../components/Auxilary/Auxilary';
import { rowClasses } from '../../utils/utils';
import SingleBank from './singelBank/singleBank';

class Banks extends Component {

    state = {

    };

    componentDidMount() {
        this.props.fetchBanks(() => { });
    }

    handleClickOnDelete = (bankId) => {
        this.props.deleteBank(bankId);
        this.props.fetchBanks(() => { });
    }

    handleClickOnView(bankId) {
        let selectedBank = this.props.banks.find(bank => bankId === bank._id);
        this.setState({ selectedBank: selectedBank });
    }

    cellEdit = cellEditFactory({
        mode: 'click',
        blurToSvae: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
            this.props.editBank(row);
        }
    });

    createActionCell = (cell, row) => {
        return (
            <Aux>
                <button
                    className="btn btn-primary btn-xs view-btn viewButton"
                    onClick={() => this.handleClickOnView(cell)}
                >
                    View
                </button>
                <button
                    className="btn btn-danger btn-xs deleteButton"
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
            dataField: 'bankName',
            text: 'Name',
        }, {
            dataField: 'ifsc',
            text: 'IFSC',
        }, {
            dataField: '_id',
            text: 'Action',
            formatter: this.createActionCell
        }];

        return (
            <Fragment>
                {
                    this.state.selectedBank
                        ?
                        <SingleBank
                            bank={this.state.selectedBank}
                        />
                        :
                        <Aux>
                            <Link to='/banks/addBank'>
                                <Button>  Add Bank </Button>
                            </Link>
                            <BootstrapTable
                                columns={columns}
                                keyField='_id'
                                data={this.props.banks}
                                wrapperClasses="tableWrapper"
                                bordered
                                hover
                                striped
                                cellEdit={this.cellEdit}
                                filter={filterFactory()}
                                noDataIndication="No Banks"
                                rowClasses={rowClasses}
                            />
                        </Aux>
                }
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        banks: state.bank.banks
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchBanks: (type, thenCallback) => dispatch(actions.fetchBanks(type, thenCallback)),
        deleteBank: (bankId) => dispatch(actions.deleteBank(bankId)),
        editBank: (bank) => dispatch(actions.editBank(bank))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Banks);