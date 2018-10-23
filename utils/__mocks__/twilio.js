// create a mock object for the twilio-utils

module.exports = (accountSid, authToken, fromSender) => {

    return {
        /**
		 * Sends SMS to a phone (For trial accounts this 'to' must be verified phone number)
		 * @param {String} to
		 * @param {String} message
		 * @returns {Promise<MessageResource>}
		 */
        sendSMS(to, message) {
            console.log(`Send SMS to ${to} : ${message}`);
            return Promise.resolve();
        },
    };
};
