import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import filterFactory from 'react-bootstrap-table2-filter';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import './items.css';
import Button from '../../../components/UI/button/button';
import Aux from '../../../components/Auxilary/Auxilary';
import { rowClasses } from '../../../utils/utils';

class Items extends Component {

    handleClickOnDelete = (itemId) => {
        this.props.deleteItem(itemId);
        this.props.fetchItems(() => { });
    }

    cellEdit = cellEditFactory({
        mode: 'click',
        blurToSvae: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
            this.props.editItem(row, () => {
                this.props.fetchItems(() => { });
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
            dataField: 'itemName',
            text: 'Name',
        }, {
            dataField: '_id',
            text: 'Action',
            formatter: this.createActionCell
        }];

        return (
            <div className="partiesContainer">
                <Link to='/settings/addItem'>
                    <Button>  Add Item </Button>
                </Link>
                <BootstrapTable
                    columns={columns}
                    keyField='_id'
                    data={this.props.items}
                    wrapperClasses="partiesTableWrapper"
                    bordered
                    hover
                    striped
                    cellEdit={this.cellEdit}
                    filter={filterFactory()}
                    noDataIndication="No Items"
                    rowClasses={rowClasses}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        items: state.item.items
    }
}

const mapDispatchToProps = dispatch => {
    return {
        deleteItem: (itemId) => dispatch(actions.deleteItem(itemId)),
        editItem: (item, thenCallback) => dispatch(actions.editItem(item, thenCallback)),
        fetchItems: (thenCallback) => dispatch(actions.fetchItems(thenCallback))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Items);