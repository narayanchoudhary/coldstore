import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import filterFactory, { textFilter, numberFilter, Comparator } from 'react-bootstrap-table2-filter';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import './avaks.css';
import Button from '../../components/UI/button/button';
import { headerSortingStyle, columnFormatter, createDeleteButton, rowClasses, paginationOptions, filterValue, dateValidater } from '../../utils/utils';

class Avaks extends Component {

    componentDidMount() {
        this.props.fetchAvaks(() => { });
    }

    handleClickOnDelete = (row) => {
        this.props.deleteAvak(row._id, () => {
            this.props.fetchAvaks(() => { });
        });
    }

    cellEdit = cellEditFactory({
        mode: 'click',
        blurToSave: true,
        afterSaveCell: (oldValue, newValue, row, column) => {

            if (column.dataField === 'address') {
                this.props.filterPartiesByAddress(this.props.parties, { value: newValue }, () => { });
            }
            this.props.editAvak(row, () => {

            });
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
            dataField: 'receiptNumber',
            text: 'R No',
            headerSortingStyle,
            sort: true,
            filter: numberFilter({
                defaultValue: { comparator: Comparator.EQ },
                placeholder: ' '
            })
        }, {
            dataField: 'date',
            text: 'Date',
            sort: true,
            headerSortingStyle,
            filter: textFilter({ placeholder: ' ' }),
            validator: dateValidater

        },
        {
            dataField: 'party',
            text: 'Party',
            sort: true,
            headerSortingStyle,
            formatter: columnFormatter(this.props.parties),
            filter: textFilter({ placeholder: ' ' }),
            filterValue: filterValue(this.props.parties),
            editor: {
                type: Type.SELECT,
                options: this.props.filteredParties
            },
            validator: (newValue, row, column) => {
                if (newValue === '') {
                    return {
                        valid: false,
                        message: 'Party can not be empty',
                    };
                }
                return true;
            }
        },
        {
            dataField: 'address',
            text: 'Address',
            sort: true,
            headerSortingStyle,
            filter: textFilter({ placeholder: ' ' }),
            formatter: columnFormatter(this.props.addresses),
            filterValue: filterValue(this.props.addresses),
            editor: {
                type: Type.SELECT,
                options: this.props.addresses
            }
        },
        {
            dataField: 'type',
            text: 'Type',
            sort: true,
            headerSortingStyle,
            filter: textFilter({ placeholder: ' ' }),
            formatter: columnFormatter(this.props.type),
            editor: {
                type: Type.SELECT,
                options: this.props.type
            },
            filterValue: filterValue(this.props.type)
        }, {
            dataField: 'item',
            text: 'Item',
            sort: true,
            headerSortingStyle,
            filter: textFilter({ placeholder: ' ' }),
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
            filter: textFilter({ placeholder: ' ' }),
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
            filter: textFilter({ placeholder: ' ' }),
            formatter: columnFormatter(this.props.sizes),
            filterValue: filterValue(this.props.sizes),
            editor: {
                type: Type.SELECT,
                options: this.props.sizes
            }
        }, {
            dataField: 'packet',
            text: 'Packet',
            sort: true,
            headerSortingStyle,
            filter: textFilter({ placeholder: ' ' }),
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
            filter: textFilter({ placeholder: ' ' })
        }, {
            dataField: 'motorBhada',
            text: 'Motor Bhada',
            sort: true,
            headerSortingStyle,
            filter: textFilter({ placeholder: ' ' }),
        }, {
            dataField: 'avakHammali',
            text: 'AvakHammali',
            sort: true,
            headerSortingStyle,
            filter: textFilter({ placeholder: ' ' }),
        }, {
            dataField: 'chamber',
            text: 'Chamber',
            sort: true,
            headerSortingStyle,
            filter: textFilter({ placeholder: ' ' }),
        }, {
            dataField: 'floor',
            text: 'Floor',
            sort: true,
            headerSortingStyle,
            filter: textFilter({ placeholder: ' ' }),
        }, {
            dataField: 'rack',
            text: 'Rack',
            sort: true,
            headerSortingStyle,
            filter: textFilter({ placeholder: ' ' }),
        }, {
            dataField: 'privateMarka',
            text: 'Marka',
            sort: true,
            headerSortingStyle,
            filter: textFilter({ placeholder: ' ' }),
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
            dataField: 'motorNumber',
            text: 'M No',
            sort: true,
            headerSortingStyle,
            filter: textFilter({ placeholder: ' ' }),
            classes: 'motor-no'
        }, {
            dataField: '_id',
            text: 'Action',
            formatter: createDeleteButton(this.handleClickOnDelete)
        }];

        return (
            <Fragment>
                <Link to='/avaks/addAvak'>
                    <Button>  Add Avak </Button>
                </Link>
                <BootstrapTable
                    columns={columns}
                    keyField='_id'
                    data={this.props.avaks}
                    wrapperClasses="tableWrapper avaksContainer"
                    bordered
                    hover
                    striped
                    cellEdit={this.cellEdit}
                    filter={filterFactory()}
                    noDataIndication="No Avak"
                    pagination={paginationFactory(paginationOptions(this.props.avaks))}
                    rowClasses={rowClasses}
                />
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        avaks: state.avak.avaks,
        parties: state.party.options,
        items: state.item.options,
        varieties: state.variety.options,
        sizes: state.size.options,
        addresses: state.address.options,
        type: state.item.typeOptions,
        filteredParties: state.party.filteredPartiesOptions,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchAvaks: (thenCallback) => dispatch(actions.fetchAvaks(thenCallback)),
        fetchParties: (type, thenCallback) => dispatch(actions.fetchParties(type, thenCallback)),
        deleteAvak: (avakId, thenCallback) => dispatch(actions.deleteAvak(avakId, thenCallback)),
        editAvak: (avak, thenCallback) => dispatch(actions.editAvak(avak, thenCallback)),
        filterPartiesByAddress: (parties, address, thenCallback) => dispatch(actions.filterPartiesByAddress(parties, address, thenCallback)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Avaks);