import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory from 'react-bootstrap-table2-editor';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import './setups.css';
import Button from '../../../components/UI/button/button';
import Aux from '../../../components/Auxilary/Auxilary';

class Setups extends Component {

    componentDidMount() {
        this.props.fetchSetups(() => { });
    }

    handleClickOnDelete = (setupId) => {
        this.props.deleteSetup(setupId);
        this.props.fetchSetups(() => { });
    }

    cellEdit = cellEditFactory({
        mode: 'click',
        blurToSvae: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
            this.props.editSetup(row);
        }
    });

    rowClasses = (row, rowIndex) => {
        return 'capitalize';
    };

    render() {

        const columns = [{
            dataField: '_id',
            text: 'ID',
            hidden: true
        }, {
            dataField: 'item',
            text: 'Item',
        }, {
            dataField: 'avakHammali',
            text: 'Avak Hammali',
        }, {
            dataField: 'javakHammali',
            text: 'Javak Hammli',
        }];

        return (
            <div className="partiesContainer">
                <Link to='/settings/addSetup'>
                    <Button>  Add Setup </Button>
                </Link>
                <BootstrapTable
                    columns={columns}
                    keyField='_id'
                    data={this.props.setups}
                    wrapperClasses="partiesTableWrapper"
                    bordered
                    hover
                    striped
                    cellEdit={this.cellEdit}
                    filter={filterFactory()}
                    noDataIndication="No Setups"
                    rowClasses={this.rowClasses}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        setups: state.setup.setups
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchSetups: (type, thenCallback) => dispatch(actions.fetchSetups(type, thenCallback)),
        deleteSetup: (setupId) => dispatch(actions.deleteSetup(setupId)),
        editSetup: (setup) => dispatch(actions.editSetup(setup))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Setups);