const jwt = require('jsonwebtoken');

const jwtOptionsDef = {
    expiresIn: 86400,  // 24 hours in seconds
};

module.exports = (jwtSecret, jwtOptions = jwtOptionsDef) => {
    return {
        /**
         * @param {String} id
         * @returns {Promise<String>}
         */
        create: create.bind(this, jwtSecret, jwtOptions),

        /**
         * @param {String} jsonWebToken
         * @returns {Promise<String>}
         */
        verify: verify.bind(this, jwtSecret),
    };
};

/**
 * 
 * @param {String} jwtSecret 
 * @param {Object} jwtOptions 
 * @param {String} id
 * @returns {Promise<String>}
 */
const create = (jwtSecret, jwtOptions, id) => {
    const payload = { id, };
    const token = jwt.sign(payload, jwtSecret, jwtOptions);
    return Promise.resolve(token);
};

/**
 * 
 * @param {String} jwtSecret 
 * @param {Object} jsonWebToken 
 * @returns {Promise<String>}
 */
const verify = (jwtSecret, jsonWebToken) => {
    return new Promise((resolve, reject) => {
        jwt.verify(jsonWebToken, jwtSecret, (err, decode) => {
            if (err) {
                return reject(err);
            }

            resolve(decode.id);
        });
    });
};
