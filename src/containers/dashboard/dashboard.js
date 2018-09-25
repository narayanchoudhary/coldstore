import React, { Component } from 'react'
import './dashboard.css';
class Dashboard extends Component {
    render() {
        return (
            <div className="dashboardContainer">
                <div className="stockGrid">
                    <div className="stockGridItem">
                        <div className="itemName"> Jyoti </div>
                        <div className="itemStatus">
                            <div className="TotalAvak">Total Avak: 1000 </div>
                            <div className="TotoalJavak">Total Javak: 700 </div>
                            <div className="currentStock">Current Stock: 300 </div>
                        </div>
                    </div>
                    <div className="stockGridItem">2</div>
                    <div className="stockGridItem">3</div>
                    <div className="stockGridItem">4</div>
                </div>
            </div>
        )
    }
}

export default Dashboard;