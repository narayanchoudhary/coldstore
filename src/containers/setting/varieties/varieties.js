import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import './varieties.css';
import Button from '../../../components/UI/button/button';
import Aux from '../../../components/Auxilary/Auxilary';
import { rowClasses } from '../../../utils/utils';

class Varieties extends Component {

    componentDidMount() {
        this.props.fetchVarieties(() => { });
    }

    handleClickOnDelete = (varietyId) => {
        this.props.deleteVariety(varietyId);
        this.props.fetchVarieties(() => { });
    }

    cellEdit = cellEditFactory({
        mode: 'click',
        blurToSvae: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
            this.props.editVariety(row, () => {
                this.props.fetchVarieties(() => {});
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
            dataField: 'varietyName',
            text: 'Name',
        }, {
            dataField: '_id',
            text: 'Action',
            formatter: this.createActionCell
        }];

        return (
            <div className="partiesContainer">
                <Link to='/settings/addVariety'>
                    <Button>  Add Variety </Button>
                </Link>
                <BootstrapTable
                    columns={columns}
                    keyField='_id'
                    data={this.props.varieties}
                    wrapperClasses="partiesTableWrapper"
                    bordered
                    hover
                    striped
                    cellEdit={this.cellEdit}
                    noDataIndication="No Items"
                    rowClasses={rowClasses}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        varieties: state.variety.varieties
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchVarieties: (type, thenCallback) => dispatch(actions.fetchVarieties(type, thenCallback)),
        deleteVariety: (varietyId) => dispatch(actions.deleteVariety(varietyId)),
        editVariety: (variety, thenCallback) => dispatch(actions.editVariety(variety, thenCallback))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Varieties);