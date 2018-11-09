import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import './addresses.css';
import Button from '../../../components/UI/button/button';
import Aux from '../../../components/Auxilary/Auxilary';
import { rowClasses } from '../../../utils/utils';
import { paginationOptions } from '../../../utils/utils';
import paginationFactory from 'react-bootstrap-table2-paginator';
class Addresses extends Component {

    handleClickOnDelete = (addressId) => {
        this.props.deleteAddress(addressId);
        this.props.fetchAddresses(() => { });
    }

    cellEdit = cellEditFactory({
        mode: 'click',
        blurToSvae: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
            this.props.editAddress(row, () => {
                this.props.fetchAddresses(() => {});
            });
        }
    });

    rowClasses = (row, rowIndex) => {
        return 'capitalize';
    };

    createActionCell = (cell, row) => {
        return (
            <Aux>
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
            dataField: 'addressName',
            text: 'Name',
            filter: textFilter(),
        }, {
            dataField: '_id',
            text: 'Action',
            formatter: this.createActionCell
        }];

        return (
            <div className="partiesContainer">
                <Link to='/settings/addAddress'>
                    <Button>  Add Address </Button>
                </Link>
                <BootstrapTable
                    columns={columns}
                    keyField='_id'
                    data={this.props.addresses}
                    wrapperClasses="partiesTableWrapper"
                    bordered
                    hover
                    striped
                    cellEdit={this.cellEdit}
                    filter={filterFactory()}
                    noDataIndication="No Addresses"
                    rowClasses={rowClasses}
                    pagination={paginationFactory(paginationOptions(this.props.addresses))}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        addresses: state.address.addresses
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchAddresses: (thenCallback) => dispatch(actions.fetchAddresses(thenCallback)),
        deleteAddress: (addressId) => dispatch(actions.deleteAddress(addressId)),
        editAddress: (address, thenCallback) => dispatch(actions.editAddress(address, thenCallback))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Addresses);