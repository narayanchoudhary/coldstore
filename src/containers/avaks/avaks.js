import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import './avaks.css';
import Button from '../../components/UI/button/button';
import { columnFormatter, createDeleteButton, paginationOptions, filterValue, dateValidater } from '../../utils/utils';

class Avaks extends Component {

    componentDidMount() {
        this.props.fetchAvaks(() => { });
    }

    handleClickOnDelete = (avakId) => {
        this.props.deleteAvak(avakId);
        this.props.fetchAvaks(() => { });
    }

    cellEdit = cellEditFactory({
        mode: 'click',
        blurToSave: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
            this.props.editAvak(row);
        },
    });

    rowClasses = (row, rowIndex) => {
        return 'capitalize';
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
            filter: textFilter(),
            validator: dateValidater
                
        }, {
            dataField: 'party',
            text: 'Party',
            sort: true,
            headerSortingStyle,
            formatter: columnFormatter(this.props.parties),
            filter: textFilter(),
            filterValue: filterValue(this.props.parties),
            editor: {
                type: Type.SELECT,
                options: this.props.parties
            }
        }, {
            dataField: 'item',
            text: 'Item',
            sort: true,
            headerSortingStyle,
            filter: textFilter(),
            formatter: columnFormatter(this.props.items),
            editor: {
                type: Type.SELECT,
                options: this.props.items
            },
            filterValue: filterValue(this.props.items)
        }, {
            dataField: 'variety',
            text: 'Variety',
            sort: true,
            headerSortingStyle,
            filter: textFilter(),
            formatter: columnFormatter(this.props.varieties),
            filterValue: filterValue(this.props.varieties),
            editor: {
                type: Type.SELECT,
                options: this.props.varieties
            },
            classes: (cell, row, rowIndex, colIndex) => {
                if (cell === 'lr') return 'lr';
            }
        }, {
            dataField: 'size',
            text: 'Size',
            sort: true,
            headerSortingStyle,
            filter: textFilter(),
            formatter: columnFormatter(this.props.sizes),
            filterValue: filterValue(this.props.sizes),
            editor: {
                type: Type.SELECT,
                options: this.props.sizes
            }
        }, {
            dataField: 'privateMarka',
            text: 'Marka',
            sort: true,
            headerSortingStyle,
            filter: textFilter(),
            validator: (newValue, row, column) => {
                if (newValue === '') {
                    return {
                        valid: false,
                        message: 'Can not be empty'
                    };
                }
                return true;
            }
        }, {
            dataField: 'packet',
            text: 'Packet',
            sort: true,
            headerSortingStyle,
            filter: textFilter(),
            validator: (newValue, row, column) => {
                if (isNaN(newValue)) {
                    return {
                        valid: false,
                        message: 'Is not a number'
                    };
                }

                if (newValue < 1) {
                    return {
                        valid: false,
                        message: 'Should be greate than 0'
                    };
                }

                return true;
            }
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
            formatter: createDeleteButton(this.handleClickOnDelete)
        }];

        return (
            <div className="avaksContainer">
                <Link to='/avaks/addAvak'>
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
                    noDataIndication="No Avak"
                    pagination={paginationFactory(paginationOptions(this.props.avaks))}
                    rowClasses={this.rowClasses}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        data: state.avak.avaks.data,
        parties: state.party.partiesOptions,
        items: state.item.options,
        varieties: state.variety.options,
        sizes: state.size.options
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchAvaks: (thenCallback) => dispatch(actions.fetchAvaks(thenCallback)),
        fetchParties: (type, thenCallback) => dispatch(actions.fetchParties(type, thenCallback)),
        deleteAvak: (avakId) => dispatch(actions.deleteAvak(avakId)),
        editAvak: (avak) => dispatch(actions.editAvak(avak))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Avaks);