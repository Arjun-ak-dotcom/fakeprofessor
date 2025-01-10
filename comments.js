// Create web server
// Load the comments from a file
// Respond to a POST request by adding a comment to the file
// Respond to a GET request by returning all comments

const fs = require('fs');
const http = require('http');
const path = require('path');

const commentsPath = path.resolve(__dirname, 'comments.json');

// Read comments from the file
function readComments() {
    try {
        return JSON.parse(fs.readFileSync(commentsPath, 'utf8'));
    } catch (err) {
        return [];
    }
}

// Save comments to the file
function saveComments(comments) {
    fs.writeFileSync(commentsPath, JSON.stringify(comments), 'utf8');
}

// Create the server
const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/comments') {
        // Handle GET /comments
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(readComments()));
    } else if (req.method === 'POST' && req.url === '/comments') {
        // Handle POST /comments
        let body = '';
        req.on('data', data => {
            body += data;
        });
        req.on('end', () => {
            let comments = readComments();
            comments.push(JSON.parse(body));
            saveComments(comments);
            res.end();
        });
    } else {
        res.statusCode = 404;
        res.end();
    }
});

// Start the server
server.listen(3000);

// Log a message to the console
console.log('Server running at http://localhost:3000/');