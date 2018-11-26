import React, { Component, Fragment } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import './singleParty.css';
import JavakLots from './javakLots/javakLots';
import Transactions from './transactions/transactions';
import { createDeleteButton, rowClasses, headerSortingStyle, columnFormatter } from "../../../utils/utils";
import JavaksOfSingleMerchant from './javaks/javaks';
import commaNumber from 'comma-number';
class SingleParty extends Component {

    state = {
        party: {},
        javakLots: [],
        javaks: [],
        addressOfParty: {},
    };

    componentDidMount() {
        this.duplicateLogic(this.props);
    }

    duplicateLogic = (props) => {
        props.fetchAvaksByPartyId(props.match.params.partyId, (avakIdsOfSingleParty) => {
            props.fetchJavaksByPartyId(props.match.params.partyId, (javaks) => {
                props.fetchJavakLotsByAvakIds(avakIdsOfSingleParty, (javakLots) => {
                    props.fetchParty(props.match.params.partyId, (party) => {
                        let addressOfParty = this.props.addresses.filter(address => address.value === party.address)[0];
                        this.setState({ javakLots, party, javaks, addressOfParty });
                    });
                });
            });
        });
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.match.params.partyId !== this.props.match.params.partyId) {
            this.duplicateLogic(nextProps);
        }
    }

    handleClickOnDelete = (avakId) => {
        this.props.deleteAvak(avakId, () => {
            this.props.fetchAvaksByPartyId(this.props.match.params.partyId, () => {
            });
        });
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

    javakLotsFormatter = (cell, row) => {
        if (row._id === 'footer' || row._id === 'totals') return '';
        return (
            <JavakLots
                key={row._id}
                javakLots={this.state.javakLots.filter((javakLot) => javakLot.avakId === row._id)}
            />
        );
    }

    javakLotsHeaderFormatter = (column, columnIndex) => {
        let columns = [{
            dataField: 'date',
            Text: 'Date',
            classes: 'date',
        }, {
            dataField: 'receiptNumber',
            Text: 'RNo',
            classes: 'receiptNumber'
        }, {
            dataField: 'packet',
            Text: 'Packet',
            classes: 'packet',
        }, {
            dataField: 'merchant',
            Text: 'Merchant',
        }];
        return (
            <BootstrapTable
                columns={columns}
                keyField='date'
                data={[{
                    date: 'Date',
                    receiptNumber: 'Rno',
                    packet: 'Pckt',
                    merchant: 'Merchant',
                }]}
                wrapperClasses="javakLotsHeader"
                bordered
                rowClasses={rowClasses}

            />
        );
    }

    render() {

        const columns = [{
            dataField: '_id',
            text: 'ID',
            hidden: true
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
        }, {
            dataField: 'type',
            text: 'Type',
            sort: true,
            headerSortingStyle,
            formatter: columnFormatter(this.props.types),
            editor: {
                type: Type.SELECT,
                options: this.props.types
            },
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
            dataField: 'receiptNumber',
            text: 'R No',
            sort: true,
            headerSortingStyle,
        }, {
            dataField: 'packet',
            text: 'Packet',
            sort: true,
            headerSortingStyle,
        }, {
            dataField: '',
            text: 'Javak',
            headerSortingStyle,
            editable: false,
            formatter: this.javakLotsFormatter,
            classes: 'totalJavakPacket',
            headerFormatter: this.javakLotsHeaderFormatter,
        }, {
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
            formatter: (cell, row) => commaNumber(cell),
        }, {
            dataField: 'weight',
            text: 'Weight',
            sort: true,
            headerSortingStyle,
            formatter: (cell, row) => commaNumber(cell),
        }, {
            dataField: 'rent',
            text: 'Rent',
            sort: true,
            headerSortingStyle,
            editable: false,
            formatter: (cell, row) => commaNumber(cell),
        }, {
            dataField: 'avakHammali',
            text: 'Avak Hammali',
            sort: true,
            headerSortingStyle,
            editable: false,
            formatter: (cell, row) => commaNumber(cell),
        }, {
            dataField: 'chamber',
            text: 'Chamber',
            sort: true,
            headerSortingStyle,
            formatter: (cell, row) => commaNumber(cell),
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
            classes: 'motor-no',
            hidden: true,
        }, {
            dataField: '_id',
            text: 'Action',
            formatter: createDeleteButton(this.handleClickOnDelete)
        }];



        return (
            <Fragment>
                <div className="partyAccount">
                    <h3 className="partyName" >{this.state.party.name} <span className="addressOfparty">{this.state.addressOfParty.label}</span> </h3>
                    <BootstrapTable
                        columns={columns}
                        keyField='_id'
                        data={this.props.avaksOfSingleParty}
                        wrapperClasses="tableWrapper"
                        bordered
                        hover
                        striped
                        cellEdit={this.cellEdit}
                        noDataIndication="No items"
                        rowClasses={rowClasses}
                    />
                </div>
                <Transactions partyId={this.props.match.params.partyId} />
                <JavaksOfSingleMerchant merchantId={this.props.match.params.partyId} />
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        items: state.item.options,
        varieties: state.variety.options,
        sizes: state.size.options,
        types: state.item.typeOptions,
        setups: state.setup.setups,
        avaksOfSingleParty: state.avak.avaksOfSingleParty,
        avakIdsOfSingleParty: state.avak.avakIdsOfSingleParty,
        addresses: state.address.options,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchAvaksByPartyId: (partyId, thenCallback) => dispatch(actions.fetchAvaksByPartyId(partyId, thenCallback)),
        fetchJavaksByPartyId: (partyId, thenCallback) => dispatch(actions.fetchJavaksByPartyId(partyId, thenCallback)),
        fetchParty: (partyId, thenCallback) => dispatch(actions.fetchParty(partyId, thenCallback)),
        deleteAvak: (avakId, thenCallback) => dispatch(actions.deleteAvak(avakId, thenCallback)),
        editAvak: (avak, thenCallback) => dispatch(actions.editAvak(avak, thenCallback)),
        fetchJavakLotsByAvakIds: (avakIds, thenCallback) => dispatch(actions.fetchJavakLotsByAvakIds(avakIds, thenCallback)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleParty);