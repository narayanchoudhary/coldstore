import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import filterFactory from 'react-bootstrap-table2-filter';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import './sizes.css';
import Button from '../../../components/UI/button/button';
import Aux from '../../../components/Auxilary/Auxilary';
import { rowClasses } from '../../../utils/utils';

class Sizes extends Component {

    componentDidMount() {
        this.props.fetchSizes(() => { });
    }

    handleClickOnDelete = (sizeId) => {
        this.props.deleteSize(sizeId);
        this.props.fetchSizes(() => { });
    }

    cellEdit = cellEditFactory({
        mode: 'click',
        blurToSvae: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
            this.props.editSize(row);
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
            dataField: 'sizeName',
            text: 'Name',
        }, {
            dataField: '_id',
            text: 'Action',
            formatter: this.createActionCell
        }];

        return (
            <div className="partiesContainer">
                <Link to='/settings/addSize'>
                    <Button>  Add Size </Button>
                </Link>
                <BootstrapTable
                    columns={columns}
                    keyField='_id'
                    data={this.props.sizes}
                    wrapperClasses="partiesTableWrapper"
                    bordered
                    hover
                    striped
                    cellEdit={this.cellEdit}
                    filter={filterFactory()}
                    noDataIndication="No Sizes"
                    rowClasses={rowClasses}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        sizes: state.size.sizes
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchSizes: (type, thenCallback) => dispatch(actions.fetchSizes(type, thenCallback)),
        deleteSize: (sizeId) => dispatch(actions.deleteSize(sizeId)),
        editSize: (size) => dispatch(actions.editSize(size))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sizes);