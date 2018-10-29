import React, { Component } from 'react'
import './dashboard.css';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

class Dashboard extends Component {
    componentDidMount() {
        this.props.fetchDashboard(() => {

        });
    }
    render() {
        return (
            <div className="dashboardContainer">
                <div className="stockGrid">
                    {
                        this.props.dashboard.map((dashboard) => {
                            return (
                                <div className="stockGridItem" key={dashboard._id}>
                                    <div className="itemName"> {dashboard.itemName} </div>
                                    <div className="itemStatus">
                                        <div className="TotalAvak">Total Avak: {dashboard.totalAvakPacket} </div>
                                        <div className="TotoalJavak">Total Javak: {dashboard.totalJavakLotsPacket} </div>
                                        <div className="currentStock">Current Stock: {dashboard.totalAvakPacket - dashboard.totalJavakLotsPacket} </div>
                                        <div className="varietyDescription">
                                            {
                                                dashboard.varietiesDescription.map(variety => {
                                                    return (
                                                        <div>
                                                            {variety.varietyName + ' : ' + variety.sumOfPackets}
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        <div className="typeDescription">
                                            <div>
                                                Chips Chamber:    {dashboard.typeDescription.totalChipsPacket}
                                            </div>
                                            <div>
                                                Rashan Chamber:    {dashboard.typeDescription.totalRashanPacket}
                                            </div>


                                        </div>
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
        dashboard: state.dashboard.dashboard
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchDashboard: (thenCallback) => dispatch(actions.fetchDashboard(thenCallback)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
