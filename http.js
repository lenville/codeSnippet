/**http.js
 * Version : 0.1.3
 * Authors : Lenville
 * Site: lenville.com 
 * New Features: 改进GET方法功能
 * History:
 *      0.1.2 Fix Bugs
 *      0.1.1 变量定义迁至ajax内部
 *            GET方法调整以及两种GET实现的支持调整
 *      0.1.0 将get与post方法合并为ajax
 *            更正非JSON的get数据处理Bug
 *            精简代码，优化代码实现
 *      0.0.3 修改0.0.2版本的get方法的控制方式改为传入options
 *            修改0.0.2版本的post方法的控制方式改为传入options
 *            优化代码实现
 *      0.0.2 简化代码，重新进行封装
 *      0.0.1 仿照moment.js写http.js的post传递信息+回传 & jsonp实现
 */

define (function (require, exports) {

    var 
        /*常量*/
        _count = 0,
        _OVERTIME = {
            "code": 404,
            "msg": "超时"
        },

        /*Regular Expression*/
        _RE_READY_STATE = /loaded|complete|undefined/,

        /*节点操作*/
        _doc = document,
        _head = _doc.head ||
                _doc.getElementsByTagName("head")[0] ||
                _doc.documentElement,
        _body = _doc.body ||
                _doc.getElementsByTagName("body")[0] ||
                _doc.documentElement,

        _createElement = function (element, parent, params) {
            var tempnode = _doc.createElement(element),
                i;
            for(i in params){
                if(params.hasOwnProperty(i)){
                    tempnode.setAttribute(i, params[i]);
                }
            }
            parent.appendChild(tempnode);
            return tempnode;
        },

        /*默认设置*/
        _config = {
            "method": "GET",
            "jsonp": true      // True or False， 默认为 True
            "charset": "utf-8",
            "timeout": 10000,  // 默认10秒超时
            "data": {},
            "callback": function(){},
            "callbackHandler": ""
        };

        /**
        * exports.ajax(url, [config]) config默认为_config，可以传入任何key/value对覆盖
        *
        * 无callback的GET测试用例
          exports.ajax("http://qt.gtimg.cn/r=0.14779347437433898q=s_r_hkHSI,t_s_usDJI", {
              method: "GET",
              timeout: _TIMEOUT,
              callback: function(){console.log([window['s_r_hkHSI'], window['s_r_hkHSI']]);}
              
          });

        * 有callback的GET测试用例
          exports.ajax("http://ip.jsontest.com/?callback=?", {
              method: "GET",
              timeout: _TIMEOUT,
              callback: function(data){console.log(data);}
          });
            
        * POST测试用例
          //! 使用前将如下内容写入任意域中的  testURL
                    <script>
                        try{
            ↑→→→→→→→→→→     document.domain = "test.com";
            ↑               window.parent.<?php echo $_POST["_callback"]; ?>(
            ↑                   <?php
            ↑                       if (true) {
            ↑                           echo "{'code': 0, 'msg': 'success'}";
            ↑                       }else{
            ↑                           echo "{'code': 1, 'msg': 'fail'}";
            ↑                       }
            ↑                    ?>
            ↑               );
            ↑           }
            ↑           catch(err){}
            ↑       </script>
            调用时缩域设置：document.domain = "test.com"
            exports.ajax("    testURL    ", {
                method: "POST",
                timeout: _TIMEOUT,
                callback: function(data){console.log(data);}
            });
        */

    /**
    * @class 一个通信类
    * @constructor
    * @param {String} 通信地址
    * @param {Object} 通信配置
    * @return undefined
    */
    exports.ajax = function (url, config) {
        var getMode, cbName, timer,
            node, iframe, form,
            cfg = {}, i;

        $.extend(cfg, _config, config);
        cfg.method = cfg.method.toUpperCase();
        cbName = [cfg.method, _count++].join("_");

        if (cfg.method === "POST") {

            iframe = _createElement("iframe", _body, {
                "style": "display: none"
                "id": ["iframe", _count].join("_"),
                "name": ["iframe", _count].join("_")
            });
            form = _createElement("form", _body, {
                "method": "post",
                "action": url,
                "target": ["iframe", _count].join("_")
            });

            if(!("_callback" in cfg.data)){
                cfg.data._callback = cbName;
            }

            for(i in cfg.data){
                if(cfg.data.hasOwnProperty(i)){
                    _createElement("input", form, {
                        "type": "hidden",
                        "name": i,
                        "value": cfg.data[i]
                    });
                }
            }
            
            window[cbName] = function(data){
                clearTimeout(timer);
                _body.removeChild(iframe);
                _body.removeChild(form);
                iframe = undefined;
                form = undefined;
                cfg.callback(data);
            };

            form.submit();

            timer = setTimeout(function(){
                window[cbName](_OVERTIME);
            }, cfg.timeout);

        } else if (cfg.method === "GET") {

            getMode = /callback=\?/.test(url),      // 有callback为True，否则为False

            node = _doc.createElement('script');
            node.id = cbName;
            node.async = true;
            node.charset = cfg.charset;
            node.onload = node.onerror = node.onreadystatechange = function() {
                if (_RE_READY_STATE.test(node.readyState)) {
                    window[cbName]();               // #TOTEST
                }
            };
            node.src = getMode ? url.replace("callback=?", "callback=" + cbName) : url;

            window[cbName] = function(data){
                clearTimeout(timer);
                node.onload = node.onerror = node.onreadystatechange = null;
                _head.removeChild(node);
                node = undefined;
                cfg.callback(data);
            };

            _head.appendChild(node);

            timer = setTimeout(function(){
                window[cbName](_OVERTIME);
                window[cbName] = null;
            }, cfg.timeout);
        }       
    };
});
