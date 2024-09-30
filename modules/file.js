const fs = require('fs');
const path = require('path');

class FileService {
    constructor() {
        this.filePath = path.join(__dirname, '../file.txt');  // Define the file path
    }

    // Appends text to the file
    appendToFile(text, callback) {
        fs.appendFile(this.filePath, `${text}\n`, callback);
    }

    // Reads the file content
    readFile(filePath, callback) {
        fs.readFile(filePath, 'utf8', callback);
    }
}

module.exports = { FileService };
