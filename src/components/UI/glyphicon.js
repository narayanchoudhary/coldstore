import React, { Component } from 'react'

class Glyphicon extends Component {
    render () {
        let classes = ['glyphicon'];
        if(this.props.type === 'name') {
            classes.push('glyphicon-user')
        }else if(this.props.type === 'phone') {
            classes.push('glyphicon-earphone')                     
        }else if(this.props.type === 'address') {
            classes.push('glyphicon-home')                      
        }else if(this.props.type === 'receiptNumber') {
            classes.push('glyphicon-tag')
        }else if(this.props.type === 'date') {
            classes.push('glyphicon-time')
        }else if(this.props.type === 'party') {
            classes.push('glyphicon-user')
        }else if(this.props.type === 'item') {
            classes.push('glyphicon-grain')
        }else if(this.props.type === 'variety') {
            classes.push('glyphicon-filter')
        }else if(this.props.type === 'size') {
            classes.push('glyphicon-signal')
        }else if(this.props.type === 'privateMarka') {
            classes.push('glyphicon-tag')
        }else if(this.props.type === 'packet') {
            classes.push('glyphicon-oil')
        }else if(this.props.type === 'weight') {
            classes.push('glyphicon-dashboard')
        }else if(this.props.type === 'motorNumber') {
            classes.push('glyphicon-bed')
        }else if(this.props.type === 'remark') {
            classes.push('glyphicon-edit')
        }else if(this.props.type === 'chamber') {
            classes.push('glyphicon-gift')
        }else if(this.props.type === 'floor') {
            classes.push('glyphicon-align-justify')
        }else if(this.props.type === 'rack') {
            classes.push('glyphicon-equalizer')
        }else if(this.props.type === 'merchant') {
            classes.push('glyphicon-user')
        }
        return (
            <i className={classes.join(" ")}></i>
        )
    }
}

export default Glyphicon