const http = require('http');
const app = require('./app');
const tcpPortUsed = require('tcp-port-used');

const generateDataController = require('./api/controllers/generateData');

let port = parseInt(process.env.PORT || 3000);

const server = http.createServer(app);

let determinePort = async () => {
    let portInUse = await tcpPortUsed.check(port, '127.0.0.1');
    if (!portInUse) { console.log(`Port ${port} is free...`); return true; }
    console.log(`Port ${port} is in use, iterating to next port...`)
    port += 1;
    return false;
};

let startServer = async () => {
    while (!(await determinePort())) {}
    console.log(`Starting service on port ${port}`);
    server.listen(port);

    if (process.env.AUTO === "true") { generateDataController.generateData(); }
};

startServer();


//  NOTE: This project is based upon Academind's REST API with Node.js series on Youtube.