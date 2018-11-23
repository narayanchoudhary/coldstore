import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import './javakLots.css';

export default class JavakLots extends Component {

    merchantFormatter = (cell, row) => {
        return (
            <div title={row.remark} >
                {cell}
            </div>
        );
    };

    columns = [{
        dataField: '_id',
        text: 'ID',
        hidden: true
    }, {
        dataField: 'date',
        text: 'Date',
    }, {
        dataField: 'javakReceiptNumber',
        text: 'No',
    }, {
        dataField: 'packet',
        text: 'Packet',
    }, {
        dataField: 'merchant',
        text: 'Merchant',
        formatter: this.merchantFormatter,  
    }];

    render() {

        return (
            <BootstrapTable
                columns={this.columns}
                keyField='_id'
                data={this.props.javakLots}
                wrapperClasses="tableWrapper javakLotsInsidePartyAccount"
                bordered
                hover
                striped
                noDataIndication="-"
            />
        )
    }
}