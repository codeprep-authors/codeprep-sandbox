const Server = require("./src/server");

var server = new Server();
var port = process.env.PORT || 3000;

server.start(port);

