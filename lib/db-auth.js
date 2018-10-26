const { promisify, } = require('util');

const uuid = require('uuid');
const bcrypt = require('bcryptjs');

const PASS_SALT = process.env.AUTH_PASSWORD_SALT;

const dynamodb_TableName = process.env.AWS_DYNAMODB_AUTH;
// initialize a DynamoDB client for the specific region
const dynamodbUtils = require('../utils/dynamodb')(process.env.AWS_REGION);

/**
 * @param {{ email: String, name: String, hashPass: String }}
 * @return {Promise}
 */
const doAdd = async ({ email, name, hashPass, }) => {
    const Item = {
        id: uuid.v1(),
        createdAt: Date.now(),
        email,
        name,
        password: hashPass,
    };
    const params = {
        TableName: dynamodb_TableName,
        Item,
    };

    return dynamodbUtils.exec('put', params)
        // return the newly added user
        .then(() => Item);
};

/**
 * @param {String} email 
 * @return {Promise}
 */
const doGetByEmail = async (email) => {
    const params = {
        FilterExpression: '#e = :e',
        ExpressionAttributeNames: {
            '#e': 'email',
        },
        ExpressionAttributeValues: {
            ':e': email,
        },
        
        TableName: dynamodb_TableName,
    };
    return dynamodbUtils.exec('scan', params)
        // returned data is { Items, Count, ScannedCount}
        // .then(data => console.dir(data) || data)
        .then(({ Items, Count, }) => Count > 0 ? Items[0] : null);
};

/**
 * @param {String} id 
 * @return {Promise}
 */
const doGet = async (id) => {
    const params = {
        Key: {
            id,
        },
        TableName: dynamodb_TableName,
    };
    return dynamodbUtils.exec('get', params)
        // returned data is { Item }
        .then(data => console.dir(data) || data)
        .then(({ Item, }) => Item);
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
        .then(user => console.dir(user) || user)
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
        // reject if there's NO such user, otherwise return it (pass it through)
        .then(user => user || Promise.reject(`User with that email ${email} does not exits.`));
};

/**
 * @param {String} email
 * @return {Promise<Boolean>}
 */
const validateNoUser = (email) => {
    return doGetByEmail(email)
        // reject if there's ALREADY such user, otherwise return null (not relevant the resolve value)
        .then(user => user && Promise.reject(`User with that email ${email} already exits.`));
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
