//This file uses ChatGPT

const http = require('http');
const url = require('url');
const path = require('path');
const { GreetingService } = require('./modules/greeting');
const { FileService } = require('./modules/file');

class ServerController {
    constructor() {
        this.greetingService = new GreetingService();
        this.fileService = new FileService();
    }

    // Main request handler
    static handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;
        const query = parsedUrl.query;

        res.setHeader('Content-Type', 'text/html');

        if (pathname === '/') {
            res.writeHead(302, { Location: '/getDate/?name=Guest' });
            res.end();
        } else if (pathname.includes('/writeFile')) {
            this.writeFile(query.text, res);
        } else if (pathname.includes('/readFile')) {
            const filePath = path.join(__dirname, 'file.txt');
            this.readFile(filePath, res);
        } else if (pathname.includes('/getDate')) {
            this.greetUser(query, res);
        } else {
            this.handleNotFound(res);
        }
    }

    // Greeting handler (delegates to GreetingService)
    static greetUser(query, res) {
        const name = query.name || 'Guest';  // Use 'Guest' if no name provided
        const greetingMessage = new GreetingService().getGreetingMessage(name);  // Generate greeting
        res.writeHead(200);
        res.end(greetingMessage);
    }

    // Write to file handler
    static writeFile(text, res) {
        const fileService = new FileService();
        text = text || 'No text provided';
        fileService.appendToFile(text, (err) => {
            if (err) {
                res.writeHead(500);
                res.end('Error writing to file');
            } else {
                res.writeHead(200);
                res.end('Text appended successfully');
            }
        });
    }

    // Read file handler
    static readFile(filePath, res) {
        const fileService = new FileService();
        fileService.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(`<pre>${data}</pre>`);
            }
        });
    }

    // 404 handler
    static handleNotFound(res) {
        res.writeHead(404);
        res.end('Not Found');
    }
}

const server = http.createServer((req, res) => ServerController.handleRequest(req, res));

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});