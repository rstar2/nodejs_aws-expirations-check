/**
 * @param {String} text
 */
exports.capitalize = (text) => {
    if (!text) return text;

    return ('' + text.charAt(0)).toUpperCase() + text.substring(1);
};
