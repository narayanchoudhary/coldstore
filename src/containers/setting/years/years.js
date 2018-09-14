import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import filterFactory from 'react-bootstrap-table2-filter';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import './years.css';
import Button from '../../../components/UI/button/button';
import Aux from '../../../components/Auxilary/Auxilary';
import { rowClasses } from '../../../utils/utils';

class Years extends Component {

    componentDidMount() {
        this.props.fetchYears(() => { });
    }

    handleClickOnDelete = (yearId) => {
        this.props.deleteYear(yearId);
        this.props.fetchYears(() => { });
    }

    cellEdit = cellEditFactory({
        mode: 'click',
        blurToSvae: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
            let newRow = {};
            newRow._id = row.value;
            newRow.year = row.label;
            this.props.editYear(newRow);
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
            dataField: 'value',
            text: 'ID',
            hidden: true
        }, {
            dataField: 'label',
            text: 'Name',
        }, {
            dataField: 'value',
            text: 'Action',
            formatter: this.createActionCell
        }];

        return (
            <div className="partiesContainer">
                <Link to='/settings/addYear'>
                    <Button>  Add Year </Button>
                </Link>
                <BootstrapTable
                    columns={columns}
                    keyField='value'
                    data={this.props.years}
                    wrapperClasses="partiesTableWrapper"
                    bordered
                    hover
                    striped
                    cellEdit={this.cellEdit}
                    filter={filterFactory()}
                    noDataIndication="No Years"
                    rowClasses={rowClasses}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        years: state.year.years
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchYears: (thenCallback) => dispatch(actions.fetchYears(thenCallback)),
        deleteYear: (yearId) => dispatch(actions.deleteYear(yearId)),
        editYear: (year) => dispatch(actions.editYear(year))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Years);