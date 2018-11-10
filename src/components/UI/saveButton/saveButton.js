import React from 'react';
import './saveButton.css';

const saveButton = (props) => {
    return (
        <button
            type="submit"
            className="btn btn-primary saveButtonInner"
            disabled={props.disabled}
            value="Save"
        >
            Save

        </button>
    );
};

export default saveButton;