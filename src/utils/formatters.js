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