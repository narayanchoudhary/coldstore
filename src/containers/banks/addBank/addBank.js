import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import './addBank.css';
import 'react-select/dist/react-select.css';
import { renderField } from '../../../utils/fields';
import 'react-datepicker/dist/react-datepicker.css';
import { required } from 'redux-form-validators';


class addBank extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.props.handleSubmit;
        this.submitting = this.props.submitting;
        this.state = { redirectToBanks: false };
    }

    submit = (values) => {
        this.props.saveBank(values, () => {
            this.props.fetchBanks(() => {
                this.setState({ redirectToBanks: true })
            });
        });
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit(this.submit)} className="avakForm">
                {this.state.redirectToBanks ? <Redirect to="/settings/banks" /> : null}
                <div className="grid-container">
                    <Field type="text" name="bankName" component={renderField} placeholder="Bank Name" validate={[required()]} autoFocus />
                    <Field type="text" name="ifsc" component={renderField} placeholder="IFSC" validate={[required()]} />
                    <Field type="number" name="openingBalance" component={renderField} placeholder="Opening Balance" />
                    <div className="grid-item">
                        <Field name="side" type="radio" value="credit" component="input" /> credit &nbsp;
                        <Field name="side" type="radio" value="debit" component="input" /> debit
                    </div>
                    <div className="grid-item">
                        <button type="submit" className="btn btn-primary" disabled={this.submitting} value="Save"> Save </button>
                    </div>
                </div>
            </form>
        )
    }
}

const Form = reduxForm({
    form: 'addBank',// a unique identifier for this form
    initialValues: { openingBalance: '0', side: 'credit' }
})(addBank);

const mapStateToProps = state => {
    return {

    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveBank: (values, thenCallback) => dispatch(actions.saveBank(values, thenCallback)),
        fetchBanks: (thenCallback) => dispatch(actions.fetchBanks(thenCallback)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);