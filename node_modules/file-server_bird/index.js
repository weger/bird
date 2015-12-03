var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");
var mime = require("./mime").types;
var zlib = require("zlib");
var config = require("./config");
var utils = require("./utils");

module.exports = {
    start: function (params, callback) {
        var servers = params || {};
        var serverList = [];
        for (var i in servers) {
            var server = http.createServer(function (req, res) {
                var port = req.headers.host.split(":")[1] || 80;
                var pathname = url.parse(req.url).pathname;
                var realPath = "";
                if (pathname.slice(-1) === "/") {
                    pathname += config.Default.file;
                }
                realPath = path.join(servers[port].basePath, path.normalize(pathname.replace(/\.\./g, "")));
                //匹配忽略列表，若匹配直接抛给回调函数
                if (servers[port].ignoreRegExp && req.url.match(servers[port].ignoreRegExp)) {
                    console.log("ignore request:" + req.url);
                    if (typeof callback === "function") {
                        callback(req, res);
                    }
                    return false;
                }

                var pathHandle = function (realPath) {
                    fs.stat(realPath, function (err, stats) {
                        if (err) {
                            if (typeof callback === "function") {
                                callback(req, res);
                            } else {
                                //console.log(req.url + " 404");
                                res.writeHead(404, {"Content-Type": "text/plain"});
                                res.write("This request URL " + pathname + " was not found on this server.");
                                res.end();
                            }
                        } else {
                            if (stats.isDirectory()) {
                                realPath = path.join(realPath, "/", config.Welcome.file);
                                pathHandle(realPath);
                            } else {
                                res.setHeader('Accept-Ranges', 'bytes');
                                var ext = path.extname(realPath);
                                ext = ext ? ext.slice(1) : 'unknown';
                                var contentType = mime[ext] || "text/plain";
                                res.setHeader("Content-Type", contentType);
                                var lastModified = stats.mtime.toUTCString();
                                var ifModifiedSince = "If-Modified-Since".toLowerCase();
                                res.setHeader("Last-Modified", lastModified);
                                //jsp动态文件简单支持
                                if (ext === "jsp") {
                                    var content = fs.readFileSync(realPath, "utf-8");
                                    content = content.replace(/<%@ page.*|.*%>/g, "");
                                    content = content.replace(/<jsp:include page="(.*)"\/>/g, function (strpath) {
                                        return fs.readFileSync(path.join(path.dirname(realPath), strpath.replace(/^[^"]+"|"[^"]+$/g,"")), "utf-8");
                                    });
                                    res.write(content);
                                    res.end();
                                    return false;
                                }

                                if (servers[port].debug) {
                                    config.Expires.maxAge = 0;
                                }

                                if (ext.match(config.Expires.fileMatch)) {
                                    var expires = new Date();
                                    expires.setTime(expires.getTime() + config.Expires.maxAge * 1000);
                                    res.setHeader("Expires", expires.toUTCString());
                                    res.setHeader("Cache-Control", "max-age=" + config.Expires.maxAge);
                                }
                                if (req.headers[ifModifiedSince] && lastModified === req.headers[ifModifiedSince]) {
                                    //console.log(req.url + " 304");
                                    res.writeHead(304, "Not Modified");
                                    res.end();
                                } else {
                                    var compressHandle = function (raw, statusCode, reasonPhrase) {
                                        var stream = raw;
                                        var acceptEncoding = req.headers['accept-encoding'] || "";
                                        var matched = ext.match(config.Compress.match);
                                        if (matched && acceptEncoding.match(/\bgzip\b/)) {
                                            res.setHeader("Content-Encoding", "gzip");
                                            stream = raw.pipe(zlib.createGzip());
                                        } else if (matched && acceptEncoding.match(/\bdeflate\b/)) {
                                            res.setHeader("Content-Encoding", "deflate");
                                            stream = raw.pipe(zlib.createDeflate());
                                        }
                                        //console.log(req.url + " " + statusCode);
                                        res.writeHead(statusCode, reasonPhrase);
                                        stream.pipe(res);
                                    };
                                    var raw = {};
                                    if (req.headers["range"]) {
                                        var range = utils.parseRange(req.headers["range"], stats.size);
                                        if (range) {
                                            res.setHeader("Content-Range", "bytes " + range.start + "-" + range.end + "/" + stats.size);
                                            res.setHeader("Content-Length", (range.end - range.start + 1));
                                            raw = fs.createReadStream(realPath, {"start": range.start, "end": range.end});
                                            compressHandle(raw, 206, "Partial Content");
                                        } else {
                                            //console.log(req.url + " 416");
                                            res.removeHeader("Content-Length");
                                            res.writeHead(416, "Request Range Not Satisfiable");
                                            res.end();
                                        }
                                    } else {
                                        raw = fs.createReadStream(realPath);
                                        compressHandle(raw, 200, "Ok");
                                    }
                                }
                            }
                        }
                    });
                };
                pathHandle(realPath);
            });

            server.listen(i);

            console.log("A server runing at port: " + i + ".");

            serverList.push(server);
        }
    }
};
