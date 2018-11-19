import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { rowClasses } from '../../../utils/utils';
import './varietyDescription.css';
export default class Sidebar extends Component {
    render() {
        let columns = [
            {
                dataField: 'varietyName',
                text: 'Variety',
            }, {
                dataField: 'totalAvakOfVariety',
                text: 'Avak',
            }, {
                dataField: 'totalJavakOfVariety',
                text: 'Javak',
            }, {
                dataField: 'balance',
                text: 'Balance',
            }
        ];
        return (
            <BootstrapTable
                columns={columns}
                keyField='varietyName'
                data={this.props.data}
                wrapperClasses="javaksTableWrapper"
                bordered
                hover
                striped
                noDataIndication="No Javak"
                rowClasses={rowClasses}
            />
        )
    }
}