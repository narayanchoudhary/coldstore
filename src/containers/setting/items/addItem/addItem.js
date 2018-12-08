import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../../store/actions';
import './addItem.css';
import 'react-select/dist/react-select.css';
import { renderField } from '../../../../utils/fields';
import 'react-datepicker/dist/react-datepicker.css';
import { required } from 'redux-form-validators';


class addItem extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.props.handleSubmit;
        this.submitting = this.props.submitting;
        this.state = { redirectToItems: false };
    }

    submit = (values) => {
        this.props.saveItem(values, () => {
            this.props.fetchItems(() => { });// load items in redux
            this.setState({ redirectToItems: true })
        });
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit(this.submit)} className="avakForm">
                {this.state.redirectToItems ? <Redirect to="/settings/items" /> : null}
                <div className="grid-container setting">
                    <Field type="text" name="itemName" component={renderField} placeholder="Item Name" validate={[required()]} autoFocus />
                    <div className="grid-item">
                        <button type="submit" className="btn btn-primary" disabled={this.submitting} value="Save"> Save </button>
                    </div>
                </div>
            </form>
        )
    }
}

const Form = reduxForm({
    form: 'item',// a unique identifier for this form
})(addItem);

const mapStateToProps = state => {
    return {

    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveItem: (values, thenCallback) => dispatch(actions.saveItem(values, thenCallback)),
        fetchItems: (values, thenCallback) => dispatch(actions.fetchItems(values, thenCallback)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);