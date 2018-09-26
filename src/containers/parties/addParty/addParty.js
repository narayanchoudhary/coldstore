import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import { Redirect } from 'react-router-dom';
import { renderField, renderSelectField } from '../../../utils/fields';
import { required } from 'redux-form-validators';
import './addParty.css';

const validate = values => {
    const errors = {}
    if (!values.name) {
        errors.name = 'Please Enter a name';
    } else if (values.name.length > 40) {
        errors.name = 'Name 40 characters se kam hona chahiye';
    }

    if (!values.number) {
        //nothing
    } else if (values.number.length !== 10) {
        errors.number = 'Enter 10 numbers';
    }

    if (!values.address) {
        errors.address = 'Please Enter Address'
    } else if (values.address.length > 20) {
        errors.address = 'Address 40 characters se kam hona chahiye';
    }

    if (!values.openingBalance) {
        errors.openingBalance = "Please Enter opening Balance"
    }
    return errors;
}

class addParty extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.props.handleSubmit;
        this.state = { redirectToParties: false };
    }

    submit = (values) => {
        values.address = values.address.value;
        this.props.saveParty(values, () => {
            this.props.fetchParties(() => {
                this.setState({ redirectToParties: true })
            });
        });
    };

    render() {
        return (
            <div className="addParty container">
                {this.state.redirectToParties ? <Redirect to="/parties" /> : null}
                <form onSubmit={this.handleSubmit(this.submit)} className="well form-horizontal">
                    <fieldset>
                        <legend>Add party</legend>
                        <div className="form-group">
                            <label className="col-md-4 control-label">Name</label>
                            <div className="col-md-4 inputGroupContainer">
                                <Field
                                    name="name"
                                    type="text"
                                    placeholder="Name"
                                    component={renderField}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-md-4 control-label">Phone</label>
                            <div className="col-md-4 inputGroupContainer">
                                <Field
                                    name="phone"
                                    placeholder="9300050840"
                                    type="text"
                                    component={renderField}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-md-4 control-label">Address</label>
                            <div className="col-md-4 inputGroupContainer">
                                <Field
                                    name="address"
                                    component={renderSelectField}
                                    placeholder="Address"
                                    options={this.props.addresses}
                                    validate={[required()]}
                                />

                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-md-4 control-label">Opening Balance</label>
                            <div className="col-md-4 inputGroupContainer">
                                <Field
                                    name="openingBalance"
                                    placeholder="Opening Balance"
                                    type="number"
                                    component={renderField}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-md-4 control-label"></label>
                            <div className="col-md-4 inputGroupContainer">
                                <Field
                                    name="transactionType"
                                    type="radio"
                                    value="credit"
                                    component="input"
                                /> credit &nbsp;
                                <Field
                                    name="transactionType"
                                    type="radio"
                                    value="debit"
                                    component="input"
                                /> debit
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-md-4 control-label"></label>
                            <div className="col-md-4">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={this.submitting}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </fieldset>
                </form>
            </div>
        )
    }
}

const Form = reduxForm({
    form: 'party',
    validate, // a unique identifier for this form,
    initialValues: { openingBalance: '0', transactionType: 'credit' }
})(addParty);

const mapStateToProps = state => {
    return {
        addresses: state.address.options
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveParty: (values, thenCallback) => dispatch(actions.saveParty(values, thenCallback)),
        fetchParties: (thenCallback) => dispatch(actions.fetchParties(thenCallback)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);