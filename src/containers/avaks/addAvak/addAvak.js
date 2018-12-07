import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import './addAvak.css';
import 'react-select/dist/react-select.css';
import { renderField, renderSelectField } from '../../../utils/fields';
import 'react-datepicker/dist/react-datepicker.css';
import { required } from 'redux-form-validators';
import Aux from '../../../components/Auxilary/Auxilary';
import SaveButton from '../../../components/UI/saveButton/saveButton';
import DateField from '../../../components/dateField/dateField';
import PartySelector from '../../../components/partySelector/partySelector';
import { formValueSelector } from "redux-form";
const selector = formValueSelector("avakForm");

const overWeight = (value, allValues, props) => {
    let warning = undefined;
    if (value && allValues.weight) {
        if (allValues.weight / value > 72) {
            warning = <span className="warning">Over Weight</span>;
        } else if (allValues.weight / value < 45) {
            warning = <span className="warning">Under Weight</span>;
        } else {
            warning = undefined;
        }
    }
    return warning;
}

class addAvak extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.props.handleSubmit;
        this.submitting = this.props.submitting;
        this.change = this.props.change;
        this.state = {};
    }

    componentDidMount() {
        this.props.fetchLastAvak((lastAvak) => {
            this.props.filterPartiesByAddress(this.props.parties, lastAvak.address, () => { });
            this.props.fetchNewReceiptNumber(lastAvak.type.value, () => {
            });
        });
    }

    submit = (values) => {
        values.address = values.address.value;
        values.type = values.type.value;
        values.party = values.party.value;
        values.size = values.size.value;
        values.item = values.item.value;
        values.variety = values.variety.value;
        values.yearId = this.props.currentYear.value; // Add current year 

        // doing this shit so that we dont face any problem while editing the avaks
        if (!values.privateMarka) values.privateMarka = '';
        if (!values.motorNumber) values.motorNumber = '';

        this.props.saveAvak(values, () => {
            this.setState({ redirectToAvaks: true })
        });
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.itemFieldValue !== nextProps.itemFieldValue || this.props.packetFieldValue !== nextProps.packetFieldValue) {
            this.setAvakHammali(nextProps);
        }
    }

    setAvakHammali = (props) => {
        if (props.itemFieldValue.value) {
            props.fetchDefaultAvakHammaliRateOfItem(props.itemFieldValue.value, (defaultAvakHammaliRate) => {
                let avakHammali = defaultAvakHammaliRate * props.packetFieldValue;
                if (isNaN(avakHammali)) avakHammali = 0; // Packet can be undefined
                this.change('avakHammali', avakHammali);
            })
        }
    }

    render() {
        return (
            <Aux>
                <form onSubmit={this.handleSubmit(this.submit)} className="avakForm">
                    {this.state.redirectToAvaks ? <Redirect to="/avaks" /> : null}
                    <p className="newReceiptNumber">Reciept Number: {this.props.newReceiptNumber}</p>
                    <div className="grid-container">
                        <Field name="item" component={renderSelectField} placeholder="Item" options={this.props.items} validate={[required()]} />
                        <Field name="type" component={renderSelectField} placeholder="Type" options={this.props.type} validate={[required()]} onChange={(type) => this.props.fetchNewReceiptNumber(type.value, () => { })} />
                        <DateField />
                        <PartySelector change={this.props.change} />
                        <Field name="variety" component={renderSelectField} placeholder="Variety" options={this.props.varieties} validate={[required()]} />
                        <Field name="size" component={renderSelectField} placeholder="Size" options={this.props.sizes} validate={[required()]} />
                        <Field type="text" name="privateMarka" component={renderField} placeholder="Priavate Marka" />
                        <Field type="number" name="packet" component={renderField} placeholder="Packet" min="0" validate={[required()]} warn={overWeight} />
                        <Field type="number" name="weight" component={renderField} placeholder="Weight" min="0" validate={[required()]} />
                        <Field type="text" name="motorNumber" component={renderField} placeholder="Motor Number" className="uppercase form-control" />
                        <Field type="text" name="remark" component={renderField} placeholder="Remark" />
                        <Field type="number" name='chamber' component={renderField} placeholder="Chamber" validate={[required()]} />
                        <Field type="number" name='floor' component={renderField} placeholder="Floor" validate={[required()]} />
                        <Field type="text" name='rack' component={renderField} placeholder="Racks" validate={[required()]} />
                        <Field type="number" name="avakHammali" component={renderField} placeholder="Avak Hammali" min="0" validate={[required()]} />
                        <Field type="number" name="motorBhada" component={renderField} placeholder="Motor Bhada" min="0" validate={[required()]} />
                        <div className="grid-item saveButtonGridItem">
                            <SaveButton disabled={this.submitting} />
                        </div>
                    </div>
                </form>
            </Aux>
        )
    }
}

const Form = reduxForm({
    form: 'avakForm',// a unique identifier for this form
    keepDirtyOnReinitialize: true,
    enableReinitialize: true,
    updateUnregisteredFields: true,
})(addAvak);

const mapStateToProps = state => {
    return {
        parties: state.party.options,
        filteredParties: state.party.filteredPartiesOptions,
        currentYear: state.year.currentYear,
        items: state.item.options,
        varieties: state.variety.options,
        sizes: state.size.options,
        addresses: state.address.options,
        type: state.item.typeOptions,
        initialValues: state.avak.lastAvak,
        newReceiptNumber: state.avak.newReceiptNumber,
        itemFieldValue: selector(state, "item"),
        packetFieldValue: selector(state, "packet"),
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveAvak: (values, thenCallback) => dispatch(actions.saveAvak(values, thenCallback)),
        filterPartiesByAddress: (parties, address, thenCallback) => dispatch(actions.filterPartiesByAddress(parties, address, thenCallback)),
        fetchLastAvak: (thenCallback) => dispatch(actions.fetchLastAvak(thenCallback)),
        fetchNewReceiptNumber: (type, thenCallback) => dispatch(actions.fetchNewReceiptNumber(type, thenCallback)),
        fetchDefaultAvakHammaliRateOfItem: (itemId, thenCallback) => dispatch(actions.fetchDefaultAvakHammaliRateOfItem(itemId, thenCallback)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);