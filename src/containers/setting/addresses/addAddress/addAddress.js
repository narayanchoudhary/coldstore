import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../../store/actions';
import './addAddress.css';
import 'react-select/dist/react-select.css';
import { renderField } from '../../../../utils/fields';
import 'react-datepicker/dist/react-datepicker.css';
import { required } from 'redux-form-validators';


class addAddress extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.props.handleSubmit;
        this.submitting = this.props.submitting;
        this.state = {redirectToAddresses: false};
    }

    submit = (values) => {
        this.props.saveAddress(values, () => {
            this.props.fetchAddresses(() => {});
        });
        this.setState({ redirectToAddresses: true })
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit(this.submit)} className="avakForm">
                {this.state.redirectToAddresses ? <Redirect to="/settings/addresses" /> : null}
                <div className="grid-container">
                    <Field type="text" name="addressName" component={renderField} placeholder="Address Name" validate={[required()]} autoFocus/>
                    <div className="grid-item">
                        <button type="submit" className="btn btn-primary" disabled={this.submitting} value="Save"> Save </button>
                    </div>
                </div>
            </form>
        )
    }
}

const Form = reduxForm({
    form: 'addAddress',// a unique identifier for this form
})(addAddress);

const mapStateToProps = state => {
    return {

    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchAddresses: (thenCallback) => dispatch(actions.fetchAddresses(thenCallback)),
        saveAddress: (values, thenCallback) => dispatch(actions.saveAddress(values, thenCallback))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);