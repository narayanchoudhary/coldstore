import React from 'react';
import { Field } from 'redux-form';
import { renderField } from '../../utils/fields';
import { required, date } from 'redux-form-validators';
import './dateField';

const DateField = () => {
    return (
        <Field
            autoFocus
            type="text"
            name="date"
            component={renderField}
            placeholder="Date"
            validate={[required(), date({ format: 'dd-mm-yyyy', '<=': 'today' })]}
            onFocus={e => setTimeout(() => { e.target.setSelectionRange(0, 2) }, 100)}
        />
    );
};

export default DateField;