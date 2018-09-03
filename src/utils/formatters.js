import React from 'react';

export const itemFormatter = (items) => {
    return (cell, row) => {
        items.forEach((item) => {
            if (item.value === cell) {
                cell = item.label;
            }
        });
        return (
            <span>{cell}</span>
        );
    }
}

export const varietyFormatter = (varieties) => {
    return (cell, row) => {
        varieties.forEach((variety) => {
            if (variety.value === cell) {
                cell = variety.label;
            }
        });
        return (
            <span>{cell}</span>
        );
    }
}

export const sizeFormatter = (sizes) => {
    return (cell, row) => {
        sizes.forEach((size) => {
            if (size.value === cell) {
                cell = size.label;
            }
        });
        return (
            <span>{cell}</span>
        );
    }
}