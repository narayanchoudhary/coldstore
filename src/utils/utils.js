import React from 'react';
import moment from 'moment';
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
        if (row.deleteButton === 'no') return; // Do not create delete button for footer and opening balance etc
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
        
        if (filterValue)
            return filterValue.label;
        else {
            return '';
        }
    }
}

export const paginationOptions = (items) => {
    return {
        sizePerPageList: [{
            text: '5', value: 5
        }, {
            text: '12', value: 12
        }, {
            text: 'All', value: items ? items.length === 0 ? 1 : items.length : 1
        }]
    }
}

export const dateValidater = (newValue, row, column) => {
    var date = moment(newValue, 'DD-MM-YYYY', true);
    if (date.isValid()) {
        return true;
    } else {
        return {
            valid: false,
            message: 'Date is invalid'
        };
    }
}

export const rowClasses = (row, rowIndex) => {
    return 'capitalize';
};

export const getRentOfItem = (setups, itemId) => {
    // Find setup object of the item
    let setupObject = setups.find((setup) => {
        return setup.item === itemId
    });

    // Adding the if condition because setupObject will be undefined for the footer
    let rent = '';
    if (setupObject) {
        rent = setupObject.rent;
    }
    return rent;
}

export const getAvakHammaliOfItem = (setups, itemId) => {
    // Find setup object of the item
    let setupObject = setups.find((setup) => {
        return setup.item === itemId
    });

    // Adding the if condition because setupObject will be undefined for the footer
    let avakHammali = '';
    if (setupObject) {
        avakHammali = setupObject.avakHammali;
    }
    return avakHammali;
}

export const getJavakHammaliOfItem = (setups, itemId) => {
    // Find setup object of the item
    let setupObject = setups.find((setup) => {
        return setup.item === itemId
    });

    // Adding the if condition because the above setupObject will be undefined for the footer
    let javakHammali = '';
    if (setupObject) {
        javakHammali = setupObject.javakHammali;
    }
    return javakHammali;
}

export const headerSortingStyle = { backgroundColor: '#ccc' };