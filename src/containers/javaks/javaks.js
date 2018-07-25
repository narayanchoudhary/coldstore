import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import './javaks.css';
import Button from '../../components/UI/button/button';
import CONST from '../../constants';

class Javaks extends Component {

    state = {
        parties: []
    };

    componentDidMount() {
        this.props.fetchJavaks(()=>{
        });

        this.props.fetchParties(()=> {
            let parties = this.props.parties.map((party) => {
                return { label: party.name + ' ' + party.address, value: party._id.toLowerCase() }
            });
            this.setState({ parties: parties });
        });
    }

    handleClickOnDelete = (javakId) => {
        this.props.deleteJavak(javakId);
        this.props.fetchJavaks(()=>{});
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
            this.props.editJavak(row);
        }
    });

    rowClasses = (row, rowIndex) => {
        return 'capitalize';
    };

    partyFormatter = (cell, row) => {
        this.props.parties.forEach((party)=> {
            if(party._id.toLowerCase() === cell.toLowerCase()) {
                cell = party.name
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
            dataField: 'merchant',
            text: 'Merchant',
            sort: true,
            headerSortingStyle,
            filter: textFilter(),
            editor: {
                type: Type.SELECT,
                options: this.state.parties
            }
        }, {
            dataField: 'motorNumber',
            text: 'M No',
            sort: true,
            headerSortingStyle,
            filter: textFilter(),
            classes: 'motor-no'
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
            <div className="javaksContainer">
                <Link to='/addJavak'>
                    <Button>  Add Javak </Button>
                </Link>
                <BootstrapTable
                    columns={columns}
                    keyField='_id'
                    data={this.props.data}
                    wrapperClasses="javaksTableWrapper"
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
        data: state.javak.javaks.data,
        parties: state.party.parties.data,
        fetchError: state.javak.javaks.error,
        deleteJavakError: state.javak.deleteJavak.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchJavaks: (thenCallback) => dispatch(actions.fetchJavaks(thenCallback)),
        fetchParties: (thenCallback) => dispatch(actions.fetchParties(thenCallback)),
        deleteJavak: (javakId) => dispatch(actions.deleteJavak(javakId)),
        editJavak: (javak) => dispatch(actions.editJavak(javak))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Javaks);