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

export const paginationOptions = (items) => {
    return {
        sizePerPageList: [{
            text: '11', value: 11
        }, {
            text: '12', value: 12
        }, {
            text: 'All', value: items ? items.length === 0 ? 1 : items.length : 1
        }]
    }
}