import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import filterFactory from 'react-bootstrap-table2-filter';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import './setups.css';
import { columnFormatter } from '../../../utils/utils';
import { rowClasses } from '../../../utils/utils';

class Setups extends Component {

    componentDidMount() {
        this.props.fetchSetups(() => { });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.currentYear !== this.props.currentYear) {
            this.props.fetchSetups(() => { });
        }
    }

    handleClickOnDelete = (setupId) => {
        this.props.deleteSetup(setupId);
        this.props.fetchSetups(() => { });
    }

    cellEdit = cellEditFactory({
        mode: 'click',
        blurToSave: true,
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
            formatter: columnFormatter(this.props.items),
            editable: false
        }, {
            dataField: 'rent',
            text: 'Rent / Kilo',
        }, {
            dataField: 'avakHammali',
            text: 'Avak Hammali / Packet',
        }, {
            dataField: 'javakHammali',
            text: 'Javak Hammli / Packet',
        }];

        return (
            <div className="partiesContainer">
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
                    rowClasses={rowClasses}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        setups: state.setup.setups,
        items: state.item.options,
        currentYear: state.year.currentYear
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