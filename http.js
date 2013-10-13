/**http.js
 * Version : 0.1.0
 * Authors : Lenville
 * Site: lenville.com 
 * New Features: 将get与post方法合并为ajax
 *               更正非JSON的get数据处理Bug
 *               精简代码，优化代码实现
 * History:
 *      0.0.3 修改0.0.2版本的post方法的控制方式改为传入options
 *            修改0.0.2版本的post方法的控制方式改为传入options
 *            优化代码实现
 *		0.0.2 简化代码，重新进行封装
 *		0.0.1 仿照moment.js写http.js的post传递信息+回传 & jsonp实现
 */

define (function (require, exports) {

	try{
		document.domain = "qq.com";
	}catch(ex){
		// console.log(ex);
	}

	var	
		/*↓常量*/
		_count = 0,
		_TIMEOUT = 10000,
		_OVERTIME_CODE = 404,
		_OVERTIME_MSG = "超时",
		getMode, cbName, timer,
		node, tempnode,
		iframe, form, cfg = {},

		/*↓Regular Expression*/
		_RE_URL = /callback=\?/,
		_RE_READY_STATE = /loaded|complete|undefined/,

		/*↓节点操作*/
		_doc = document,
		_head = _doc.head ||
				_doc.getElementsByTagName("head")[0] ||
				_doc.documentElement,
		_body = _doc.body ||
				_doc.getElementsByTagName("body")[0] ||
				_doc.documentElement,

		_elementCreate = function (element, parent, params) {
			tempnode = _doc.createElement(element);
			tempnode.id = [element, _count].join("_");
			tempnode.name = [element, _count].join("_");
			for(var i in params){
				if(params.hasOwnProperty(i)){
					tempnode.setAttribute(i, params[i]);
				}
			}
			parent.appendChild(tempnode);
			return tempnode;
		},
		_defaultCb = function (data) {
			console.log(data);
		},

		/*↓基本设置*/
		_config = {
			method: "GET",
			charset: "utf-8",
			timeout: _TIMEOUT,
			data: {stocklist: "ok"},
			callback: _defaultCb,
			context: {}
		};

	/*Dora.ajax(url, [settings])*/
	exports.ajax = function (url, config) {
		$.extend(cfg, _config, config);
		cbName = [cfg.method, _count++].join("_");

		if (cfg.method === "POST") {

			iframe = _elementCreate("iframe", _body, {
				"style": "display: none"
			});
			form = _elementCreate("form", _body, {
				"method": "post",
				"action": url,
				"target": ["iframe", _count].join("_")
			});

			if(!("_callback" in cfg.data)){
				cfg.data._callback = cbName;
			}

			for(var i in cfg.data){
				if(cfg.data.hasOwnProperty(i)){
					tempnode = {};
					tempnode.type = "hidden";
					tempnode.name = i;
					tempnode.value = cfg.data[i];
					_elementCreate("input", form, tempnode);
					tempnode = null;
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
				_body.removeChild(iframe);
				_body.removeChild(form);
				iframe = undefined;
				form = undefined;
				window[cbName]({
					code: _OVERTIME_CODE,
					msg: _OVERTIME_MSG
				});
			}, cfg.timeout);

			
		} else if (cfg.method === "GET") {
			getMode = _RE_URL.test(url),	// 有callback为True，否则为False

			node = _elementCreate("script", _head, {
				"src": getMode ? url.replace("callback=?", "callback=" + cbName) : url,
				"async": true,
				"id": cbName,
				"type": "text/javascript",
				"charset": cfg.charset
			});

			node.onload = node.onerror = node.onreadystatechange = function() {
				if (_RE_READY_STATE.test(node.readyState)) {
					window[cbName] = function(){
						clearTimeout(timer);
						node.onload = node.onerror = node.onreadystatechange = null;
						_head.removeChild(node);
						node = undefined;
						cfg.callback(window[cfg.context]);
					};
					window[cbName]();
				}
			};

			timer = setTimeout(function(){
				node.onload = node.onerror = node.onreadystatechange = null;
				_head.removeChild(node);
				cfg.callback({
					code: _OVERTIME_CODE,
					msg: _OVERTIME_MSG
				});
				window[cbName] = null;
			}, cfg.timeout);
		}		
	};
});
