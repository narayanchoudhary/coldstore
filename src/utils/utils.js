import React from 'react';

// generates the value to be shown in the cell of the columns of the table
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

// generates filter value to be passed in the column object of a table
export const filterValue = (items) => {
    return (cell, row) => {
        let filterValue = items.filter(item => {
            return item.value === cell;
        })[0];
        return filterValue.label;
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