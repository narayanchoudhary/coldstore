import React, { Component } from 'react'

class Glyphicon extends Component {
    render() {
        let classes = ['glyphicon'];
        if (this.props.type === 'name') {
            classes.push('glyphicon-user')
        } else if (this.props.type === 'phone') {
            classes.push('glyphicon-earphone')
        } else if (this.props.type === 'address' || this.props.type === 'addressName' || this.props.type === 'addressOfMerchant') {
            classes.push('glyphicon-home')
        } else if (this.props.type === 'receiptNumber') {
            classes.push('glyphicon-tag')
        } else if (this.props.type === 'date') {
            classes.push('glyphicon-time')
        } else if (this.props.type === 'party') {
            classes.push('glyphicon-user')
        } else if (this.props.type === 'item' || this.props.type === 'itemName') {
            classes.push('glyphicon-grain')
        } else if (this.props.type === 'variety' || this.props.type === 'varietyName') {
            classes.push('glyphicon-filter')
        } else if (this.props.type === 'size' || this.props.type === 'sizeName') {
            classes.push('glyphicon-signal')
        } else if (this.props.type === 'privateMarka') {
            classes.push('glyphicon-tag')
        } else if (this.props.type === 'packet') {
            classes.push('glyphicon-oil')
        } else if (this.props.type === 'weight') {
            classes.push('glyphicon-dashboard')
        } else if (this.props.type === 'motorNumber') {
            classes.push('glyphicon-bed')
        } else if (this.props.type === 'remark') {
            classes.push('glyphicon-edit')
        } else if (this.props.type === 'chamber') {
            classes.push('glyphicon-gift')
        } else if (this.props.type === 'floor') {
            classes.push('glyphicon-align-justify')
        } else if (this.props.type === 'rack') {
            classes.push('glyphicon-equalizer')
        } else if (this.props.type === 'merchant') {
            classes.push('glyphicon-user')
        } else if (this.props.type === 'amount') {
            classes.push('glyphicon-usd')
        } else if (this.props.type === 'bank') {
            classes.push('glyphicon-piggy-bank')
        } else if (this.props.type === 'checkNumber') {
            classes.push('glyphicon-check')
        } else if (this.props.type === 'openingBalance') {
            classes.push('glyphicon-usd')
        } else if (this.props.type === 'year') {
            classes.push('glyphicon-calendar')
        } else if (this.props.type === 'bankName') {
            classes.push('glyphicon-home')
        } else if (this.props.type === 'ifsc') {
            classes.push('glyphicon-qrcode')
        } else if (this.props.type === 'expenseCategory' || this.props.type === 'expenseCategoryName') {
            classes.push('glyphicon-tags')
        }else if (this.props.type === 'type') {
            classes.push('glyphicon-cutlery')
        }else if (this.props.type === 'rentType') {
            classes.push('glyphicon-credit-card')
        }else if (this.props.type === 'motorBhada') {
            classes.push('glyphicon-plane')
        }

        return (
            <i className={classes.join(" ")}></i>
        )
    }
}

export default Glyphicon