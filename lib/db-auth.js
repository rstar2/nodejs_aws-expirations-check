const { promisify, } = require('util');

const uuid = require('uuid');
const bcrypt = require('bcryptjs');

const PASS_SALT = process.env.AUTH_PASSWORD_SALT;

// const dynamodb_TableName = process.env.AWS_DYNAMODB_AUTH;
// //initialize a DynamoDB client for the specific region
// const dynamodbUtils = require('../utils/dynamodb')(process.env.AWS_REGION);
// const dbGet = async () => {
//     const params = {
//         TableName: dynamodb_TableName,
//         Limit: 1000,
//     };
//     return dynamodbUtils.exec('scan', params);
// const dbAdd = async (data) => {
//     const Item = {
//         id: uuid.v1(),
//         name: data.name,
//         expiresAt: data.expiresAt,
//         createdAt: Date.now(),
//     };
//     const params = {
//         TableName: dynamodb_TableName,
//         Item,
//     };

//     return dynamodbUtils.exec('put', params)
//         // return the newly added item
//         .then(() => ({ Item, }));
// };

const db = require('./users.json');
/**
 * @param {{ email: String, name: String, hashPass: String }}
 * @return {Promise}
 */
const doAdd = ({ email, name, hashPass, }) => {
    const id = uuid.v1();
    db[id] = {
        email, name, hashPass,
    };
    return Promise.resolve();
};

/**
 * @param {String} email 
 * @return {Promise}
 */
const doGetByEmail = (email) => {
    const user = db.find(user => user.email === email);
    return Promise.resolve(user);
};

/**
 * @param {String} id 
 * @return {Promise}
 */
const doGet = (id) => {
    const user = db[id];
    return Promise.resolve(user);
};

/**
 * @param {{email: String, name: String, password: String}} body 
 * @return {Promise}
 */
const register = (body) => {
    const { email, name, password, } = body;

    if (!email || !password || !name)
        return Promise.reject('Missing credentials.');

    return validateNoUser(email)
        .then(() => promisify(bcrypt.hash)(password, PASS_SALT))
        .then(hashPass => doAdd({ email, name, hashPass, }));
};

/**
 * @param {{email: String, password: String}} body 
 * @return {Promise}
 */
const login = (body) => {
    const { email, password, } = body;

    if (!email || !password)
        return Promise.reject('Missing credentials.');

    return validateUser(email)
        .then(user => validatePassword(password, user.password).then(() => user));
};


/**
 * @param {String} id 
 * @return {Promise}
 */
const authorize = (id) => {
    return doGet(id).then(user => !!user);
};

/**
 * @param {String} email
 * @return {Promise}
 */
const validateUser = (email) => {
    return doGetByEmail(email)
        .then(user => !user ? Promise.reject(`User with that email ${email} does not exits.`) : user);
};

/**
 * @param {String} email
 * @return {Promise}
 */
const validateNoUser = (email) => {
    // const user = db.find(user => user.email === email);
    // return Promise.resolve(user)
    //     .then(user => user ? Promise.reject(`User with that email ${email} already exits.`) : user);

    return validateUser(email)
        .then(() => Promise.reject(`User with that email ${email} already exits.`),
            () => true);
};

/**
 * @param {String} password
 * @param {String} hashPass
 * @return {Promise}
 */
const validatePassword = (password, hashPass) => {
    return promisify(bcrypt.compare)(password, hashPass)
        .then(valid => !valid ? Promise.reject('The credentials do not match.') : true);
};

// This is not needed patter for DynamoDB as the actions over it with 'aws-sdk' imply DB connection
// but the DB implementation is changed to MongoDB for instance then there's needed first a "connection" part
module.exports = () => {
    const db = {
        register,
        login,
        authorize,
    };
    return Promise.resolve(db);
};
