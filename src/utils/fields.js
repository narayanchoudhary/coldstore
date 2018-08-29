import React, { Component } from 'react'
import Glyphicon from '../components/UI/glyphicon';
import 'react-select/dist/react-select.css';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import moment from 'moment';

export const renderField = ({ input, label, type, meta: { touched, error, warning }, ...rest }) => {
    return (
        <div className="grid-item">
            <div className="input-group">
                <span className="input-group-addon">
                    <Glyphicon type={input.name} />
                </span>
                {
                    type === 'date'
                        ? <input
                            {...input}
                            className="form-control"
                            type={type}
                            {...rest}
                            format="MM/dd/yyyy"
                        />
                        : <input
                            {...input}
                            className="form-control"
                            type={type}
                            {...rest}
                        />
                }
            </div>
            {touched && ((error && <span className='errorMessage' >{error}</span>) || (warning && <span>{warning}</span>))}
        </div>
    );
}

export class renderSelectField extends Component {
    render() {
        return (
            <div className="grid-item">
                <div className="input-group">
                    <span className="input-group-addon">
                        <Glyphicon type={this.props.input.name} />
                    </span>
                    <Select
                        {...this.props}
                        value={this.props.input.value}
                        onChange={(value) => this.props.input.onChange(value)}
                        onBlur={() => this.props.input.onBlur(this.props.input.value)}
                        options={this.props.options}
                    />
                </div>
                {this.props.meta.touched && ((this.props.meta.error && <span className="errorMessage" >{this.props.meta.error}</span>) || (this.props.meta.warning && <span>{this.props.meta.warning}</span>))}
            </div>
        )
    }
}

export const renderDatePicker = ({ input, placeholder, defaultValue, meta: { touched, error } }) => (
    <div className="grid-item">
        <div className="input-group">
            <span className="input-group-addon">
                <Glyphicon type={input.name} />
            </span>
            <DatePicker {...input} dateForm="MM/DD/YYYY" selected={input.value ? moment(input.value) : null} />
        </div>
        {touched && ((error && <span className='errorMessage' >{error}</span>))}
    </div>
);