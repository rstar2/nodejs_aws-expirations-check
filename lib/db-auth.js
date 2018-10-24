
const { promisify, } = require('util');

const dynamodb_TableName = process.env.AWS_DYNAMODB_AUTH;

// initialize a DynamoDB client for the specific region
const dynamodbUtils = require('../utils/dynamodb')(process.env.AWS_REGION);

const uuid = require('uuid');
const bcrypt = require('bcryptjs');

const dbGet = async () => {
    const params = {
        TableName: dynamodb_TableName,
        Limit: 1000,
    };
    return dynamodbUtils.exec('scan', params);
};

const dbAdd = async (data) => {
    const Item = {
        id: uuid.v1(),
        name: data.name,
        expiresAt: data.expiresAt,
        createdAt: Date.now(),
    };
    const params = {
        TableName: dynamodb_TableName,
        Item,
    };

    return dynamodbUtils.exec('put', params)
        // return the newly added item
        .then(() => ({ Item, }));
};

/**
 * @param {{email: String, name: String, password: String}} body 
 * @return {Promise}
 */
const register = (body) => {
    const { email, name, password, } = body;

    if (!email || !password || !name)
        return Promise.reject('Missing credentials.');

    // promisify(bcrypt.hash)(password)
    return validateUser(email)
        .then(user => validatePassword(password, user.password).then(() => user));
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

    return validateUser(id).then(user => !!user);
};

const validateUser = (email) => {
    return User.findOne({ email })
        .then(user => !user ? Promise.reject('User with that email does not exits.') : user);
};

const validatePassword = (eventPassword, userPassword) => {
    return promisify(bcrypt.compare)(eventPassword, userPassword)
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
