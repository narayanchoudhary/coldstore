import React from 'react';

export const columnFormatter = (options) => {
    return (cell, row) => {
        options.forEach((option) => {
            if (option.value === cell) {
                cell = option.label;
            }
        });
        return (
            <span>{cell}</span>
        );
    }
}

export const createDeleteButton = (handleClickOnDelete) => {
    return (cell, row) => {
        return (
            <button
                className="btn btn-danger btn-xs"
                onClick={() => handleClickOnDelete(cell)}
            >
                Delete
        </button>
        );
    }
}