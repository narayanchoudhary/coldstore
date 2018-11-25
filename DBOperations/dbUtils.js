module.exports = {
    getItemRent: (setups, itemId) => {
        let itemRent = null;
        setups.forEach(setup => {
            if (setup.item === itemId) {
                itemRent = setup.rent;
            }
        });
        return parseFloat(itemRent);
    },
    getItemAvakHammali: (setups, itemId) => {
        let itemAvakHammali = null;
        setups.forEach(setup => {
            if (setup.item === itemId) {
                itemAvakHammali = setup.avakHammali;
            }
        });

        return parseFloat(itemAvakHammali);
    }
}