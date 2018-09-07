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

export const addressFormatter = (addresses) => {
    return (cell, row) => {
        addresses.forEach((address) => {
            if (address.value === cell) {
                cell = address.label;
            }
        });
        return (
            <span>{cell}</span>
        );
    }
}

export const partyFormatter = (party) => {
    return (cell, row) => {
        party.forEach((party) => {
            if (party.value === cell) {
                cell = party.label;
            }
        });
        return (
            <span>{cell}</span>
        );
    }
}