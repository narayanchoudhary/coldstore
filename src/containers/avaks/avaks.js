import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import './avaks.css';
import Button from '../../components/UI/button/button';
import CONST from '../../constants';

class Avaks extends Component {

    state = {
        parties: []
    };

    componentDidMount() {
        this.props.fetchAvaks(() => {
        });

        this.props.fetchParties(() => {
            let parties = this.props.parties.map((party) => {
                return { label: party.name + ' ' + party.address, value: party._id }
            });
            this.setState({ parties: parties });
        });
    }

    handleClickOnDelete = (avakId) => {
        this.props.deleteAvak(avakId);
        this.props.fetchAvaks(() => { });
    }

    createDeleteButton = (cell, row) => {
        return (
            <button
                className="btn btn-danger btn-xs"
                onClick={() => this.handleClickOnDelete(cell)}
            >
                Delete
            </button>
        );
    }

    cellEdit = cellEditFactory({
        mode: 'click',
        blurToSave: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
            this.props.editAvak(row);
        }
    });

    rowClasses = (row, rowIndex) => {
        return 'capitalize';
    };

    partyFormatter = (cell, row) => {
        this.props.parties.forEach((party) => {
            if (party._id === cell) {
                cell = party.name;
            }
        });
        return (
            <span>{cell}</span>
        );
    };

    render() {
        const headerSortingStyle = { backgroundColor: '#ccc' };

        const columns = [{
            dataField: '_id',
            text: 'ID',
            hidden: true
        }, {
            dataField: 'receiptNumber',
            text: 'R No',
            sort: true,
            headerSortingStyle,
            filter: textFilter()
        }, {
            dataField: 'date',
            text: 'Date',
            sort: true,
            headerSortingStyle,
            filter: textFilter()
        }, {
            dataField: 'party',
            text: 'Party',
            sort: true,
            headerSortingStyle,
            formatter: this.partyFormatter,
            filter: textFilter(),
            editor: {
                type: Type.SELECT,
                options: this.state.parties
            }
        }, {
            dataField: 'item',
            text: 'Item',
            sort: true,
            headerSortingStyle,
            filter: textFilter(),
            editor: {
                type: Type.SELECT,
                options: CONST.ITEMS
            }
        }, {
            dataField: 'variety',
            text: 'Variety',
            sort: true,
            headerSortingStyle,
            filter: textFilter(),
            editor: {
                type: Type.SELECT,
                options: CONST.VARIETIES
            },
            classes: (cell, row, rowIndex, colIndex) => {
                if (cell == 'lr') return 'lr';
            }
        }, {
            dataField: 'size',
            text: 'Size',
            sort: true,
            headerSortingStyle,
            filter: textFilter(),
            editor: {
                type: Type.SELECT,
                options: CONST.SIZES
            }
        }, {
            dataField: 'privateMarka',
            text: 'Marka',
            sort: true,
            headerSortingStyle,
            filter: textFilter()
        }, {
            dataField: 'packet',
            text: 'Packet',
            sort: true,
            headerSortingStyle,
            filter: textFilter()
        }, {
            dataField: 'weight',
            text: 'Weight',
            sort: true,
            headerSortingStyle,
            filter: textFilter()
        }, {
            dataField: 'motorNumber',
            text: 'M No',
            sort: true,
            headerSortingStyle,
            filter: textFilter(),
            classes: 'motor-no'
        }, {
            dataField: 'chamber',
            text: 'Chamber',
            sort: true,
            headerSortingStyle,
            filter: textFilter(),
        }, {
            dataField: 'floor',
            text: 'Floor',
            sort: true,
            headerSortingStyle,
            filter: textFilter(),
        }, {
            dataField: 'rack',
            text: 'Rack',
            sort: true,
            headerSortingStyle,
            filter: textFilter(),
        }, {
            dataField: '_id',
            text: 'Action',
            formatter: this.createDeleteButton
        }];

        let paginationOptions = {
            sizePerPageList: [{
                text: '11', value: 11
            }, {
                text: '12', value: 12
            }, {
                text: 'All', value: this.props.data ? this.props.data.length === 0 ? 1 : this.props.data.length : 1
            }]
        };

        return (
            <div className="avaksContainer">
                <Link to='/addAvak'>
                    <Button>  Add Avak </Button>
                </Link>
                <BootstrapTable
                    columns={columns}
                    keyField='_id'
                    data={this.props.data}
                    wrapperClasses="avaksTableWrapper"
                    bordered
                    hover
                    striped
                    cellEdit={this.cellEdit}
                    filter={filterFactory()}
                    noDataIndication="Koi bhi nahi mila bhai"
                    pagination={paginationFactory(paginationOptions)}
                    rowClasses={this.rowClasses}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        data: state.avak.avaks.data,
        parties: state.party.parties.data,
        fetchError: state.avak.avaks.error,
        deleteAvakError: state.avak.deleteAvak.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchAvaks: (thenCallback) => dispatch(actions.fetchAvaks(thenCallback)),
        fetchParties: (thenCallback) => dispatch(actions.fetchParties(thenCallback)),
        deleteAvak: (avakId) => dispatch(actions.deleteAvak(avakId)),
        editAvak: (avak) => dispatch(actions.editAvak(avak))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Avaks);