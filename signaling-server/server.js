const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        console.log(`Received : ${message}`);
        ws.send(`Server says : ${message}`)
    })

    ws.on('close', () => {
        console.log('Client disconnected');
    })

});

console.log('WebSocket Server is running on port 8080');