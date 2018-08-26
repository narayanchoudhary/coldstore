import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../../store/actions';
import './addSetup.css';
import 'react-select/dist/react-select.css';
import { renderField } from '../../../../fields';
import 'react-datepicker/dist/react-datepicker.css';
import { required } from 'redux-form-validators';


class addSetup extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.props.handleSubmit;
        this.submitting = this.props.submitting;
        this.state = {redirectToSetups: false};
    }

    submit = (values) => {
        this.props.saveSetup(values);
        this.setState({ redirectToSetups: true })
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit(this.submit)} className="avakForm">
                {this.state.redirectToSetups ? <Redirect to="/settings/setups" /> : null}
                <div className="grid-container">
                    <Field type="text" name="name" component={renderField} placeholder="name" validate={[required()]} autoFocus/>
                    <div className="grid-item">
                        <button type="submit" className="btn btn-primary" disabled={this.submitting} value="Save"> Save </button>
                    </div>
                </div>
            </form>
        )
    }
}

const Form = reduxForm({
    form: 'addSetup',// a unique identifier for this form
})(addSetup);

const mapStateToProps = state => {
    return {

    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveSetup: (values) => dispatch(actions.saveSetup(values))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);