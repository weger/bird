//静态服务器配置，可同时配置多个，域名需host到127.0.0.1
exports.Server = {
    "80": {
        //静态文件根目录
        "basePath": "D:/workspace/hrlms",
        "debug": true
        //忽略的静态文件请求，与此正则匹配的请求将直接走转发规则（可选配置）
        //,"ignoreRegExp":  /\/js\/urls\.js/g
    },
    "8081": {
        //静态文件根目录
        "basePath": "D:/workspace/hrlms"
        //忽略的静态文件请求，与此正则匹配的请求将直接走转发规则（可选配置）
        //,"ignoreRegExp":  /\/js\/urls\.js/g
    },
    "8046": {
        //静态文件根目录
        "basePath": "D:/workspace/platform_new"
    }
};
//转发规则——静态服务器没有响应的或者忽略的请求将根据一下规则转发
exports.TranspondRules = {
    "80": {
        //目标服务器的ip和端口，域名也可，但注意不要被host了
        targetServer: {
            "host": "10.44.67.14",
            "port": "8045"
        },
        //特殊请求转发，可选配置，内部的host、port和attachHeaders为可选参数
        regExpPath: {
            "/hrlms/rs": {
                //"host": "10.44.67.14",
                //"port": "8045",
                //"attachHeaders": {"app-id": 5},
                "path": "/hrlms/rs"
            }
        }
    },
    "8081": {
        //目标服务器的ip和端口，域名也可，但注意不要被host了
        targetServer: {
            "host": "10.48.55.14",
            "port": "8000"
        },
        //特殊请求转发，可选配置，内部的host、port和attachHeaders为可选参数
        regExpPath: {
            "/hrlms/rs": {
                //"attachHeaders": {"app-id": 5},
                "path": "/hrlms/rs"
            }
        }
    },
    "8046": {
        //目标服务器的ip和端口，域名也可，但注意不要被host了
        targetServer: {
            "host": "10.44.67.14",
            "port": "8045"
        },
        //特殊请求转发，可选配置，内部的host、port和attachHeaders为可选参数
        regExpPath: {
            "/platform/rs": {
                "path": "/platform/rs"
            },
            "/platform": {
                "host": "127.0.0.1",
                "port": "8046",
                "path": "/"
            }
        }
    },
    "ajaxOnly": false
};
