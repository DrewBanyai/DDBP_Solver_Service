const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);

//  NOTE: This project is based upon Academind's REST API with Node.js series on Youtube.