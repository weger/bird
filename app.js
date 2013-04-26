var fileServer = require("file-server_bird");

fileServer.start({
    "basePath": "D:/workspace/peixun-shaxiang-xy/shaxiang-resource"
}, function (req, res) {
    res.writeHead(404, {"Content-Type": "text/plain"});
    res.write("This request URL was not found on this server.");
    res.end();
});