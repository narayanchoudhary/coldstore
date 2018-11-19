import React, { Component } from 'react'
import './dashboard.css';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import VarietiesDescription from './varietyDescription/varietyDescription';

class Dashboard extends Component {
    componentDidMount() {
        this.props.fetchDashboard(() => {

        });
    }
    render() {
        return (
            <div className="dashboardContainer">
                <div className="itemGrid">
                    {
                        this.props.dashboard.map((dashboard) => {
                            console.log('dashboard: ', dashboard);
                            return (
                                <div className="itemGridItem" key={dashboard._id}>
                                    <div className={"itemName " + dashboard.itemName}> {dashboard.itemName} </div>
                                    <div className='typeGrid' >
                                        {
                                            dashboard.typeList.map(typeList => {
                                                return (
                                                    <div className="typeGridItem" key={typeList.type}>
                                                        <div className="typeName">{typeList.type}</div>
                                                        <VarietiesDescription data={typeList.varietyList} />
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
        dashboard: state.dashboard.dashboard
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchDashboard: (thenCallback) => dispatch(actions.fetchDashboard(thenCallback)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
