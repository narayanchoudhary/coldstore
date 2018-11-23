import React, { Component } from 'react'
import './dashboard.css';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import VarietiesDescription from './varietyDescription/varietyDescription';
import Popup from "reactjs-popup";
import PartiesWithRemainingPackets from './partiesWithRemainingPacket/partiesWithRemainingPakcets';

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showPartiesWithRemainingPackets: false,
            headingOfPopup: null, // heading of the popup of remaining packets
        };
    }

    showPartiesWithRemainingPackets = (row) => {
        let data = {
            variety: row.variety._id,
            type: row.type,
            item: row.item._id,
        };
        let headingOfPopup = row.item.itemName + ' ' + row.type + ' ' + row.variety.varietyName;
        this.props.fetchPartiesWithRemainingPackets(data, (partiesWithRemainingPackets) => {
            this.setState({
                ...this.state,
                showPartiesWithRemainingPackets: true,
                headingOfPopup: headingOfPopup,
            });
        });
    }

    hidePartiesWithRemaingPackets = (event) => {
        this.setState({
            ...this.state,
            showPartiesWithRemainingPackets: false,
        });
    }

    componentDidMount() {
        this.props.fetchDashboard(() => {

        });
    }

    render() {
        return (
            <div className="dashboardContainer">
                {
                    <Popup
                        open={this.state.showPartiesWithRemainingPackets}
                        onClose={this.hidePartiesWithRemaingPackets}
                        modal
                        closeOnDocumentClick
                    >
                        <PartiesWithRemainingPackets
                            partiesWithRemainingPackets={this.props.partiesWithRemainingPackets}
                            headingOfPopup={this.state.headingOfPopup}
                        />
                    </Popup>
                }
                <div className="itemGrid">
                    {
                        this.props.dashboard.map((dashboard) => {
                            return (
                                <div className="itemGridItem" key={dashboard._id}>
                                    <div className={"itemName " + dashboard.itemName}> {dashboard.itemName} </div>
                                    <div className='typeGrid' >
                                        {
                                            dashboard.typeList.map(typeList => {
                                                return (
                                                    <div className="typeGridItem" key={typeList.type}>
                                                        <div className="typeName">{typeList.type}</div>
                                                        <VarietiesDescription
                                                            data={typeList.varietyList}
                                                            showPartiesWithRemainingPackets={this.showPartiesWithRemainingPackets}
                                                        />
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className="total">
                                        Total: {dashboard.totalAvakPacket} - {dashboard.totalJavakLotsPacket} = {dashboard.totalAvakPacket - dashboard.totalJavakLotsPacket}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        dashboard: state.dashboard.dashboard,
        partiesWithRemainingPackets: state.dashboard.partiesWithRemainingPackets,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchDashboard: (thenCallback) => dispatch(actions.fetchDashboard(thenCallback)),
        fetchPartiesWithRemainingPackets: (data, thenCallback) => dispatch(actions.fetchPartiesWithRemainingPackets(data, thenCallback)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
