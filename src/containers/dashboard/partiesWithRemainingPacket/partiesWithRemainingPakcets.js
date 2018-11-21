import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { rowClasses } from '../../../utils/utils';
import { Link } from 'react-router-dom';
import Aux from '../../../components/Auxilary/Auxilary';
import './partiesWithRemainingPackets.css';

class PartiesWithRemainingPackets extends Component {

    partyFormatter = (cell, row) => {
        return (
            <Link to={"/parties/singleParty/" + row.partyId} >
                {cell}
            </Link>
        )
    }

    render() {
        let columns = [
            {
                dataField: 'party',
                text: 'Party',
                sort: true,
                formatter: this.partyFormatter
            }, {
                dataField: 'balance',
                text: 'Balance',
                sort: true,
            }
        ];
        return (
            <Aux>
                <div className="partiesWithRemainingPacketsWrapper" >
                    <div className="headingOfPopup">
                        {this.props.headingOfPopup}
                    </div>
                    <BootstrapTable
                        columns={columns}
                        keyField='party'
                        data={this.props.partiesWithRemainingPackets}
                        wrapperClasses="tableWrapper    "
                        bordered
                        hover
                        striped
                        noDataIndication="No item"
                        rowClasses={rowClasses}
                    />
                </div>
            </Aux>
        )
    }
}

export default PartiesWithRemainingPackets;