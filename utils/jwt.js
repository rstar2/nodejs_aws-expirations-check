const jwt = require('jsonwebtoken');

const jwtOptionsDef = {
    expiresIn: 86400,  // 24 hours in seconds - could be 
};

module.exports = (jwtSecret, jwtOptions = jwtOptionsDef) => {
    return {
        /**
         * @param {String} id
         * @returns {Promise<String>}
         */
        sign: sign.bind(this, jwtSecret, jwtOptions),

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
const sign = (jwtSecret, jwtOptions, id) => {
    const payload = { id, iat: Date.now()};
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
