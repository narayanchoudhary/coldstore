import React, { Component, Fragment } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import { Redirect } from 'react-router-dom';
import { renderField, renderSelectField } from '../../../utils/fields';
import { required } from 'redux-form-validators';
import './addParty.css';
import SaveButton from '../../../components/UI/saveButton/saveButton';

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
        if (!values.phone) values.phone = ''; // if we do not do this then this will create problem while editing the phone number in parties.js     
        this.props.saveParty(values, () => {
            this.props.fetchParties(() => {
                this.setState({ redirectToParties: true })
            });
        });
    };

    render() {
        return (
            <Fragment>
                <h4 className="addPartyHeading"> Add Party </h4>
                <div className="addPartyForm">
                    {this.state.redirectToParties ? <Redirect to="/parties" /> : null}
                    <form onSubmit={this.handleSubmit(this.submit)}>
                        <Field name="name" type="text" placeholder="Enter Name" component={renderField} autoFocus />
                        <Field name="phone" placeholder="Enter Mobile Number" type="text" component={renderField} />
                        <Field name="address" component={renderSelectField} placeholder="Enter Address" options={this.props.addresses} validate={[required()]} />
                        <Field name="openingBalance" placeholder="Opening Balance" type="number" component={renderField} />
                        <Field name="side" type="radio" value="credit" component="input" /> credit &nbsp;
                    <Field name="side" type="radio" value="debit" component="input" /> debit
                    <div className="grid-item saveButtonGridItem">
                            <SaveButton disabled={this.submitting} />
                        </div>
                    </form>
                </div>
            </Fragment>
        )
    }
}

const Form = reduxForm({
    form: 'party',
    validate, // a unique identifier for this form,
    initialValues: { openingBalance: '0', side: 'credit' }
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