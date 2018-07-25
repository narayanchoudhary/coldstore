module.exports = {
    convertToLowerCase: (obj) => {
        Object.keys(obj).forEach(function (key) {
            if (key === 'party') return; // Dont not convert party id to lower case
            if(typeof obj[key]  === 'string') {
                obj[key] = obj[key].toLowerCase();
            }
        })
        return obj;
    }
};