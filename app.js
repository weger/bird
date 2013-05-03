var fileServer = require("file-server_bird");
var HttpTranspondBird = require("http-transpond_bird");
var serverSettings = require("./config.js").Server;

var httpTranspond = new HttpTranspondBird();

fileServer.start(serverSettings, httpTranspond.transpond);