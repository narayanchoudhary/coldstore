import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../../store/actions';
import './addYear.css';
import 'react-select/dist/react-select.css';
import { renderField } from '../../../../utils/fields';
import 'react-datepicker/dist/react-datepicker.css';
import { required } from 'redux-form-validators';


class addYear extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.props.handleSubmit;
        this.submitting = this.props.submitting;
        this.state = {redirectToYears: false};
    }

    submit = (values) => {
        this.props.saveYear(values);
        this.setState({ redirectToYears: true })
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit(this.submit)} className="avakForm">
                {this.state.redirectToYears ? <Redirect to="/settings/years" /> : null}
                <div className="grid-container setting">
                    <Field type="text" name="year" component={renderField} placeholder="Year Name" validate={[required()]} autoFocus/>
                    <div className="grid-item">
                        <button type="submit" className="btn btn-primary" disabled={this.submitting} value="Save"> Save </button>
                    </div>
                </div>
            </form>
        )
    }
}

const Form = reduxForm({
    form: 'year',// a unique identifier for this form
})(addYear);

const mapStateToProps = state => {
    return {

    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveYear: (values) => dispatch(actions.saveYear(values))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);