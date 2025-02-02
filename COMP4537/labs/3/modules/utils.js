const messages = require('../lang/messages/en');

function getDate() {
    const time = new Date().toString();
    return `${time}`;
}

module.exports = { getDate };
