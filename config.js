//静态服务器配置，可同时配置多个，域名需host到127.0.0.1
exports.Server = {
    "m1-ite-dev01.m1.baidu.com": {
        //静态文件根目录
        "basePath": "D:/workspace/hrlms/web",
        //忽略的静态文件请求，与此正则匹配的请求将直接走转发规则（可选配置）
        "ignoreRegExp":  /\/js\/urls\.js/g
    },
    "platform.baidu.com": {
        //静态文件根目录
        "basePath": "D:/workspace/platform_new"
    },
    "peixun.baidu.com": {
        "basePath": "D:/workspace/peixun-planA-userweb"
    },
    "daxueshaxiang.baidu.com": {
        "basePath": "D:/workspace/peixun-shaxiang-xy/shaxiang-resource"
    },
    //服务器端口号，可选配置，默认为80
    "port": 80
};
//转发规则——静态服务器没有响应的或者忽略的请求将根据一下规则转发
exports.TranspondRules = {
    "m1-ite-dev01.m1.baidu.com": {
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
    "platform.baidu.com": {
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
                "host": "platform.baidu.com",
                "port": "80",
                "path": "/"
            }
        }
    },
    "peixun.baidu.com": {
        targetServer: {
            "host": "10.237.24.15",
            "port": "8035"
        },
        regExpPath: {
        }
    }
};