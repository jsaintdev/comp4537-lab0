const messages = require('../lang/messages/en');

function getDate(name) {
    const time = new Date().toString();
    return `<p class="bluemessage">${messages.greeting.replace('%name%', name).replace('%time%', time)}</p>`;
}

module.exports = { getDate };
