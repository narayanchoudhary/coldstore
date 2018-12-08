import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../../store/actions';
import './addVariety.css';
import 'react-select/dist/react-select.css';
import { renderField } from '../../../../utils/fields';
import 'react-datepicker/dist/react-datepicker.css';
import { required } from 'redux-form-validators';


class addVariety extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.props.handleSubmit;
        this.submitting = this.props.submitting;
        this.state = {redirectToVarieties: false};
    }

    submit = (values) => {
        this.props.saveVariety(values, () => {
            this.props.fetchVarieties(() => {
                this.setState({ redirectToVarieties: true })
            });
        });
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit(this.submit)} className="avakForm">
                {this.state.redirectToVarieties ? <Redirect to="/settings/varieties" /> : null}
                <div className="grid-container setting">
                    <Field type="text" name="varietyName" component={renderField} placeholder="Variety Name" validate={[required()]} autoFocus/>
                    <div className="grid-item">
                        <button type="submit" className="btn btn-primary" disabled={this.submitting} value="Save"> Save </button>
                    </div>
                </div>
            </form>
        )
    }
}

const Form = reduxForm({
    form: 'addVariety',// a unique identifier for this form
})(addVariety);

const mapStateToProps = state => {
    return {

    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveVariety: (values, thenCallback) => dispatch(actions.saveVariety(values, thenCallback)),
        fetchVarieties: (thenCallback) => dispatch(actions.fetchVarieties(thenCallback))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);