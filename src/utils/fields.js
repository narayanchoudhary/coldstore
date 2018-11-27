import React, { Component } from 'react'
import 'react-select/dist/react-select.css';
import Select from 'react-select';

export const renderField = ({ input, label, type, meta: { touched, error, warning }, ...rest }) => {
    return (
        <div className={input.name + " grid-item"} >
            <div className="form-group myFormGroup">
                <label htmlFor={input.name}>{input.name}</label>

                <input
                    {...input}
                    className="form-control"
                    type={type}
                    {...rest}
                />

            </div>
            {touched && ((error && <span className='errorMessage' >{error}</span>) || (warning && <span>{warning}</span>))}
        </div>
    )
}

export class renderSelectField extends Component {
    render() {
        return (
            <div className={this.props.input.name + " grid-item"} >
                <div className="form-group myFormGroup">
                    <label htmlFor={this.props.input.name}>{this.props.input.name}</label>

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