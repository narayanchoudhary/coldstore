import React, { Component, Fragment } from 'react';
import { } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import { Type, } from 'react-bootstrap-table2-editor';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { connect } from 'react-redux';
import * as actions from '../../../../store/actions';
import './javaks.css';
import { columnFormatter, rowClasses, filterValue } from '../../../../utils/utils';

class JavaksOfSingleMerchant extends Component {

    componentDidMount() {
        this.props.fetchJavaksOfSingleMerchant(this.props.merchantId, () => { });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.merchantId !== this.props.merchantId) {
            this.props.fetchJavaksOfSingleMerchant(nextProps.merchantId, () => { });
        }
    }

    render() {

        const columns = [{
            dataField: '_id',
            text: 'ID',
            hidden: true
        }, {
            dataField: 'receiptNumber',
            text: 'R No',
            sort: true,
        }, {
            dataField: 'type',
            text: 'Type',
            sort: true,
            formatter: columnFormatter(this.props.type),
            editor: {
                type: Type.SELECT,
                options: this.props.type
            },
            filterValue: filterValue(this.props.type)
        }, {
            dataField: 'date',
            text: 'Date',
            sort: true,
        }, {
            dataField: 'party',
            text: 'Party',
            sort: true,
            formatter: columnFormatter(this.props.parties),
            filterValue: filterValue(this.props.parties),
            filter: textFilter()
        }, {
            dataField: 'sumOfPacketsOfJavakLots',
            text: 'Total Packet',
            sort: true,
            editable: false,
        }, {
            dataField: 'totalWeight',
            text: 'Weight',
            sort: true,
            editable: false,
        }, {
            dataField: 'totalRent',
            text: 'Rent',
            sort: true,
            editable: false,
        }];

        return (
            <Fragment>

                <BootstrapTable
                    columns={columns}
                    keyField='_id'
                    data={this.props.javaksOfSingleMerchant}
                    wrapperClasses="tableWrapper"
                    bordered
                    hover
                    striped
                    noDataIndication={'No javaks'}
                    rowClasses={rowClasses}
                    filter={filterFactory()}
                />
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        javaksOfSingleMerchant: state.javak.javaksOfSingleMerchant,
        parties: state.party.options,
        type: state.item.typeOptions,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchJavaksOfSingleMerchant: (partyId, thenCallback) => dispatch(actions.fetchJavaksOfSingleMerchant(partyId, thenCallback)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(JavaksOfSingleMerchant);