export const snakeToCamel = (key) => {
    return key.replace(/_([a-z0-9])/g, function (group) {
        return group[1].toUpperCase();
    });
};

export const camelToSnake = (key) => {
    return key.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
};

/**
 * Convert snakecase to camelcase
 * @param {Object} data
 */
export const serializeKeys = (data) => {
    if (typeof data !== 'object' || data == null) return data;

    Object.keys(data).forEach((key) => {
        if (/_([a-z0-9])/.test(key)) {
            data[snakeToCamel(key)] = serializeKeys(data[key]);
            delete data[key];
        } else {
            data[key] = serializeKeys(data[key]);
        }
    });

    return data;
};

/**
 * Convert camelcase to snakecase
 * @param {Object} data
 */
export const deserializeKeys = (data) => {
    if (typeof data !== 'object' || data == null) return data;
    Object.keys(data).forEach((key) => {
        if (/([a-z0-9])([A-Z])/.test(key)) {
            data[camelToSnake(key)] = deserializeKeys(data[key]);
            delete data[key];
        } else {
            data[key] = deserializeKeys(data[key]);
        }
    });

    return data;
};

/**
 * convert number to string with comma with 1000
 * @param {Number} x
 * @return {string}
 */
export const numberWithCommas = (x) => {
    return x.toLocaleString()
};
