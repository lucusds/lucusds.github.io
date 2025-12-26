const express = require('express');
const path = require('path');
const http = require('http');
const { WebSocketServer } = require('ws');
const fs = require('fs');
const app = express();
const port = 3000;
const server = http.createServer(app);

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the current directory
app.use(express.static(__dirname));

// Opprett WebSocket-server
const wss = new WebSocketServer({ server });
wss.on('connection', (ws) => {
    console.log('WebSocket connection established');
});

// Send live-reload-melding til alle klienter
const broadcastReload = () => {
    wss.clients.forEach((client) => {
        if (client.readyState === 1) { // WebSocket er åpen
            client.send('reload');
        }
    });
};

// Routing til ulike filer, legg inn egne ved å kopiere en av app.get-funkjonene
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


// Start HTTP- og WebSocket-server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});