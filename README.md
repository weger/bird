bird
====

一个提供了代理和数据mock功能，同时支持php、jsp静态语法解析的文件资源服务器，配置方便，对前端开发提供本地化webserver环境的支持。


主要功能：
-------------
1.  webserver
2.  php、jsp的支持
3.  proxy代理
4.  数据模拟


使用说明：
-------------
1.将代码clone到本地
````
git clone https://github.com/weger/bird
````
2.修改配置文件
````
//静态服务器配置，可同时配置多个，域名需host到127.0.0.1
exports.Server = {
    "8081": {
        //静态文件根目录
        "basePath": "/Users/zhang/projects/webroot",
        // 是否开启调试模式，true(表示server端不缓存)，false（反之）
        "debug": true,
        //忽略的静态文件请求，与此正则匹配的请求将直接走转发规则（可选配置）
        "ignoreRegExp":  /\/js\/urls\.js/g
    }
};
//转发规则——静态服务器没有响应的或者忽略的请求将根据一下规则转发
exports.TranspondRules = {
    "8081": {
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
    "ajaxOnly": false
};
````
3.执行命令
````
node app
````
