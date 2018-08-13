import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import './singleParty.css';
import CONST from '../../../constants';
import JavakLots from './javakLots/javakLots';
import Aux from '../../../components/Auxilary/Auxilary';
import Transactions from './transactions/transactions';

class SingleParty extends Component {

    state = {
        party: null,
        avaks: [],
        javakLots: [],
        javaks: [],
        totalJavakPacket: null,
        totalRent: 0
    };

    getFooterData = (avaks) => {
        // Do not create footer if no avaks
        if (avaks.length === 0) {
            return;
        }

        let totalPacket = 0;
        let totalWeight = 0;
        avaks.forEach((avak) => {
            totalPacket += parseInt(avak.packet);
            totalWeight += parseInt(avak.weight);
        });

        let footer = {
            _id: 'footer',
            packet: totalPacket,
            weight: totalWeight
        }

        this.setState({totalRent: totalWeight*CONST.SETTINGS.RENT});
        return footer;
    }

    componentDidMount() {
        this.props.fetchAvaksByPartyId(this.props.match.params.partyId, (response) => {
            // Extract avaks ids
            let avakIds = [];
            response.data.forEach((avak) => {
                avakIds.push(avak._id);
            });
            // Add footer in the table
            let footer = this.getFooterData(response.data);
            if(footer) {
                response.data.push(footer);
            }
            // Get javak Lots of the above avak Ids
            this.props.fetchJavakLotsByAvakIds(avakIds, (response) => {
                let totalJavakPacket = 0;
                response.data.forEach((javak) => {
                    totalJavakPacket += parseInt(javak.packet);
                });
                this.setState({ javakLots: response.data, totalJavakPacket: totalJavakPacket });
            });
            this.setState({ avaks: response.data });
        });

        // fetch party details
        this.props.fetchParty(this.props.match.params.partyId, (response) => {
            this.setState({ party: response.data });
        });

        this.props.fetchJavaksByPartyId(this.props.match.params.partyId, (response) => {
            // Calculate javak packet total
            this.setState({ javaks: response.data, });
        });
    }

    handleClickOnDelete = (avakId) => {
        this.props.deleteAvak(avakId);
        this.props.fetchAvaksByPartyId(this.props.match.params.partyId, (response) => {
            this.setState({ avaks: response.data });
        });
    }

    createDeleteButton = (cell, row) => {
        if (cell === 'footer') return '';
        return (
            <button
                className="btn btn-danger btn-xs"
                onClick={() => this.handleClickOnDelete(cell)}
            >
                Delete
            </button>
        );
    }

    getAvakRent = (cell, row) => {
        return (
            row.weight * CONST.SETTINGS.RENT
        );
    }

    cellEdit = cellEditFactory({
        mode: 'click',
        blurToSave: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
            this.props.editAvak(row);
        },
        nonEditableRows: () => [this.state.avaks.length - 1]
    });

    rowClasses = (row, rowIndex) => {
        let rowClasses = 'capitalize';
        if (row._id === 'footer') {
            rowClasses += ' tableFooter';
        }
        return rowClasses;
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

    javakLotsFormatter = (cell, row) => {
        if (row._id === 'footer') return this.state.totalJavakPacket;
        return (
            <JavakLots
                key={row._id}
                javakLots={this.state.javakLots.filter((javakLot) => javakLot.avakId === row._id)}
                javaks={this.state.javaks}
            />
        );
    }

    packetFormatter = (cell, row) => {
        let sumJavakLots = 0;
        this.state.javakLots.forEach((javakLot) => {
            if (row._id !== 'footer') {
                if (javakLot.avakId === row._id)
                    sumJavakLots += parseInt(javakLot.packet);
            } else {
                sumJavakLots += parseInt(javakLot.packet);
            }
        });
        let display = <div>{cell} - {sumJavakLots} = {cell - sumJavakLots}</div>
        return (
            display
        );
    }

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
        }, {
            dataField: 'date',
            text: 'Date',
            sort: true,
            headerSortingStyle,
        }, {
            dataField: 'party',
            text: 'Party',
            sort: true,
            headerSortingStyle,
            hidden: true
        }, {
            dataField: 'item',
            text: 'Item',
            sort: true,
            headerSortingStyle,
            editor: {
                type: Type.SELECT,
                options: CONST.ITEMS
            }
        }, {
            dataField: 'variety',
            text: 'Variety',
            sort: true,
            headerSortingStyle,
            editor: {
                type: Type.SELECT,
                options: CONST.VARIETIES
            },
            classes: (cell, row, rowIndex, colIndex) => {
                if (cell === 'lr') return 'lr';
            }
        }, {
            dataField: 'size',
            text: 'Size',
            sort: true,
            headerSortingStyle,
            editor: {
                type: Type.SELECT,
                options: CONST.SIZES
            }
        }, {
            dataField: 'packet',
            text: 'Packet',
            sort: true,
            headerSortingStyle,
            formatter: this.packetFormatter,
        }
            , {
            dataField: '',
            text: 'Javak',
            sort: true,
            headerSortingStyle,
            editable: false,
            formatter: this.javakLotsFormatter,
            classes: 'p-0 totalJavakPacket'
        }
            , {
            dataField: 'weight',
            text: 'Weight',
            sort: true,
            headerSortingStyle,
        }, {
            dataField: 'rent',// rent is not in database
            text: 'Rent',
            sort: true,
            headerSortingStyle,
            formatter: this.getAvakRent
        }, {
            dataField: 'chamber',
            text: 'Chamber',
            sort: true,
            headerSortingStyle,
        }, {
            dataField: 'floor',
            text: 'Floor',
            sort: true,
            headerSortingStyle,
        }, {
            dataField: 'rack',
            text: 'Rack',
            sort: true,
            headerSortingStyle,
        }, {
            dataField: 'privateMarka',
            text: 'Marka',
            sort: true,
            headerSortingStyle,
        }, {
            dataField: 'motorNumber',
            text: 'M No',
            sort: true,
            headerSortingStyle,
            classes: 'motor-no'
        }, {
            dataField: '_id',
            text: 'Action',
            formatter: this.createDeleteButton
        }];

        return (
            <Aux>
                <div className="partyAccount avaksContainer">
                    <h3 className="partyName" >{this.state.party ? this.state.party.name : null}</h3>
                    <BootstrapTable
                        columns={columns}
                        keyField='_id'
                        data={this.state.avaks}
                        wrapperClasses="avaksTableWrapper"
                        bordered
                        hover
                        striped
                        cellEdit={this.cellEdit}
                        noDataIndication="No items"
                        rowClasses={this.rowClasses}
                    />
                </div>
                <Transactions
                    partyId={this.props.match.params.partyId}
                    totalRent={this.state.totalRent}
                />
            </Aux>
        )
    }
}

const mapStateToProps = state => {
    return {
        fetchError: state.avak.avaks.error,
        deleteAvakError: state.avak.deleteAvak.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchAvaksByPartyId: (partyId, thenCallback) => dispatch(actions.fetchAvaksByPartyId(partyId, thenCallback)),
        fetchJavaksByPartyId: (partyId, thenCallback) => dispatch(actions.fetchJavaksByPartyId(partyId, thenCallback)),
        fetchParty: (partyId, thenCallback) => dispatch(actions.fetchParty(partyId, thenCallback)),
        fetchParties: (type, thenCallback) => dispatch(actions.fetchParties(type, thenCallback)),
        deleteAvak: (avakId) => dispatch(actions.deleteAvak(avakId)),
        editAvak: (avak) => dispatch(actions.editAvak(avak)),
        fetchJavakLotsByAvakIds: (avakIds, thenCallback) => dispatch(actions.fetchJavakLotsByAvakIds(avakIds, thenCallback)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleParty);