import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../../store/actions';
import './addSize.css';
import 'react-select/dist/react-select.css';
import { renderField } from '../../../../utils/fields';
import 'react-datepicker/dist/react-datepicker.css';
import { required } from 'redux-form-validators';


class addSize extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.props.handleSubmit;
        this.submitting = this.props.submitting;
        this.state = {redirectToSizes: false};
    }

    submit = (values) => {
        this.props.saveSize(values);
        this.setState({ redirectToSizes: true })
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit(this.submit)} className="avakForm">
                {this.state.redirectToSizes ? <Redirect to="/settings/sizes" /> : null}
                <div className="grid-container setting">
                    <Field type="text" name="sizeName" component={renderField} placeholder="Size Name" validate={[required()]} autoFocus/>
                    <div className="grid-item">
                        <button type="submit" className="btn btn-primary" disabled={this.submitting} value="Save"> Save </button>
                    </div>
                </div>
            </form>
        )
    }
}

const Form = reduxForm({
    form: 'addSize',// a unique identifier for this form
})(addSize);

const mapStateToProps = state => {
    return {

    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveSize: (values) => dispatch(actions.saveSize(values))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);