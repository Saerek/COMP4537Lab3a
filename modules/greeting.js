const messages = require('../lang/en/en');
const { getDate } = require('./utils');

class GreetingService {
    getGreetingMessage(name) {
        const date = getDate(); 
        return `<span style="color:blue">${messages.greet(name, date)}</span>`;
    }
}

module.exports = { GreetingService };
