import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../../store/actions';
import VarietiesDescription from '../../../dashboard/varietyDescription/varietyDescription';


class Status extends Component {

    componentDidMount = () => {
        this.props.fetchStatusOfSingleParty(this.props.partyId, () => { });
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.partyId !== this.props.partyId)
            this.props.fetchStatusOfSingleParty(nextProps.partyId, () => { });
    }

    render() {
        return (
            <Fragment>
                <div className="itemGrid">
                    {
                        this.props.partyStatus.map((partyStatus) => {
                            return (
                                <div className="itemGridItem" key={partyStatus._id}>
                                    <div className={"itemName " + partyStatus.itemName}> {partyStatus.itemName} </div>
                                    <div className='typeGrid' >
                                        {
                                            partyStatus.typeList.map(typeList => {
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
                                        Total: {partyStatus.totalAvakPacket} - {partyStatus.totalJavakLotsPacket} = {partyStatus.totalAvakPacket - partyStatus.totalJavakLotsPacket}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        partyStatus: state.party.statusOfSingleParty
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchStatusOfSingleParty: (partyId, thenCallback) => dispatch(actions.fetchStatusOfSingleParty(partyId, thenCallback)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Status);