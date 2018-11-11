import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import './singleParty.css';
import JavakLots from './javakLots/javakLots';
import Aux from '../../../components/Auxilary/Auxilary';
import Transactions from './transactions/transactions';
import { createDeleteButton, rowClasses, headerSortingStyle, columnFormatter, getRentOfItem, getAvakHammaliOfItem, getJavakHammaliOfItem } from "../../../utils/utils";

class SingleParty extends Component {

    state = {
        party: null,
        javakLots: [],
        javaks: [],
        totalJavakPacket: null,
        totalRent: 0,
        totalAvakHammali: 0,
        javakHammali: 0
    };

    componentDidMount() {
        this.props.fetchAvaksByPartyId(this.props.match.params.partyId, () => {
            // Get javak Lots of the above avak Ids
            this.props.fetchJavakLotsByAvakIds(this.props.avakIdsOfSingleParty, (response) => {
                // Calculate total packet
                let totalJavakPacket = 0;
                response.data.forEach((javak) => {
                    totalJavakPacket += parseInt(javak.packet, 10);
                });
                this.setState({ javakLots: response.data, totalJavakPacket: totalJavakPacket });
            });
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

    rentFormatter = (cell, row) => {
        let rent = '';
        rent = row.weight * getRentOfItem(this.props.setups, row.item);
        rent = Math.round(rent);
        return rent;
    }

    cellEdit = cellEditFactory({
        mode: 'click',
        blurToSave: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
            this.props.editAvak(row, () => {
                this.props.fetchAvaksByPartyId(this.props.match.params.partyId, () => {

                });
            });
        },
        nonEditableRows: () => [this.props.avaksOfSingleParty.length - 1]
    });

    rowClasses = (row, rowIndex) => {
        let rowClasses = 'capitalize';
        if (row._id === 'footer') {
            rowClasses += ' tableFooter';
        }
        return rowClasses;
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

    getTotalAvakHammali = (avaks) => {
        let avakHammali = 0;
        avaks.forEach((avak) => {
            avakHammali += (avak.packet * getAvakHammaliOfItem(this.props.setups, avak.item));
        });

        return avakHammali;
    }

    getTotalRent = (avaks) => {
        let totalRent = 0;
        avaks.forEach((avak) => {
            totalRent += (avak.weight * getRentOfItem(this.props.setups, avak.item));
        });
        return Math.round(totalRent);
    }

    getTotalJavakHammali = (javakLots) => {
        let javakHammali = 0;
        javakLots.forEach((javakLot) => {
            javakHammali += (javakLot.packet * getJavakHammaliOfItem(this.props.setups, javakLot.itemId));
        });

        return javakHammali;
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
            formatter: columnFormatter(this.props.items),
            editor: {
                type: Type.SELECT,
                options: this.props.items
            }
        },{
            dataField: 'type',
            text: 'Type',
            sort: true,
            headerSortingStyle
        }, {
            dataField: 'variety',
            text: 'Variety',
            sort: true,
            headerSortingStyle,
            formatter: columnFormatter(this.props.varieties),
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
            formatter: columnFormatter(this.props.sizes),
            editor: {
                type: Type.SELECT,
                options: this.props.sizes
            }
        }, {
            dataField: 'packet',
            text: 'Packet',
            sort: true,
            headerSortingStyle,
        }, {
            dataField: '',
            text: 'Javak',
            sort: true,
            headerSortingStyle,
            editable: false,
            formatter: this.javakLotsFormatter,
            classes: 'totalJavakPacket'
        },{
            dataField: 'totalJavakPacket',
            text: 'Javak',
            sort: true,
            editable: false,
        }, {
            dataField: 'balance',
            text: 'Balance',
            sort: true,
            headerSortingStyle,
            editable: false,
        }, {
            dataField: 'weight',
            text: 'Weight',
            sort: true,
            headerSortingStyle,
        }, {
            dataField: 'rent',// rent is not in database
            text: 'Rent',
            sort: true,
            headerSortingStyle,
            formatter: this.rentFormatter
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
            formatter: createDeleteButton(this.handleClickOnDelete)
        }];



        return (
            <Aux>
                <div className="partyAccount avaksContainer">
                    <h3 className="partyName" >{this.state.party ? this.state.party.name : null}</h3>
                    <BootstrapTable
                        columns={columns}
                        keyField='_id'
                        data={this.props.avaksOfSingleParty}
                        wrapperClasses="avaksTableWrapper"
                        bordered
                        hover
                        striped
                        cellEdit={this.cellEdit}
                        noDataIndication="No items"
                        rowClasses={rowClasses}
                    />
                </div>
                <Transactions
                    partyId={this.props.match.params.partyId}
                    totalRent={this.getTotalRent(this.props.avaksOfSingleParty)}
                    totalAvakHammali={this.getTotalAvakHammali(this.props.avaksOfSingleParty)}
                />
            </Aux>
        )
    }
}

const mapStateToProps = state => {
    return {
        items: state.item.options,
        varieties: state.variety.options,
        sizes: state.size.options,
        setups: state.setup.setups,
        avaksOfSingleParty: state.avak.avaksOfSingleParty,
        avakIdsOfSingleParty: state.avak.avakIdsOfSingleParty,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchAvaksByPartyId: (partyId, thenCallback) => dispatch(actions.fetchAvaksByPartyId(partyId, thenCallback)),
        fetchJavaksByPartyId: (partyId, thenCallback) => dispatch(actions.fetchJavaksByPartyId(partyId, thenCallback)),
        fetchParty: (partyId, thenCallback) => dispatch(actions.fetchParty(partyId, thenCallback)),
        fetchParties: (type, thenCallback) => dispatch(actions.fetchParties(type, thenCallback)),
        deleteAvak: (avakId) => dispatch(actions.deleteAvak(avakId)),
        editAvak: (avak, thenCallback) => dispatch(actions.editAvak(avak, thenCallback)),
        fetchJavakLotsByAvakIds: (avakIds, thenCallback) => dispatch(actions.fetchJavakLotsByAvakIds(avakIds, thenCallback)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleParty);