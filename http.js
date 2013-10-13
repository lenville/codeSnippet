//! http.js
//! Version : 0.0.3
//! Authors : Lenville
//! Site: lenville.com
//!	New Features: 修改0.0.2版本的post方法的控制方式改为传入options
//!			  	  修改0.0.2版本的post方法的控制方式改为传入options
//!			  	  优化代码实现
//!	History:
//!		0.0.2 简化代码，重新进行封装
//!		0.0.1 仿照moment.js写http.js的post传递信息+回传 & jsonp实现

define(function (require, exports) {

	/************************************
			常量 // Constants
	************************************/

	var OVERTIME_CODE = 404,
		OVERTIME_MSG = "超时",
		_TIMEOUT = 5000;

	/************************************
			Top Level Functions
	 ************************************	
		var options = {
			url: ,			// 必需
			charset: ,
			timeout: ,
			data: ,			// post模式必需
			context: 
		}
	************************************/

	exports.get = function (options, callback) {
		options = options || {};
		var rand = (Math.random().toString().substr(2,5)),
			cbName = options.cbName || "callback_" + rand,	// callback name
			timeout = options.timeout || _TIMEOUT,
			node = document.createElement("script"),
			urlPat = /callback=\?/,
			getMode = urlPat.test(options.url),	// 有callback为True，否则为False
			head = document.head || document.getElementsByTagName("head")[0] || 
				document.documentElement,
			temObj = {},
			timer, i;

		node.src = getMode ? options.url.replace("callback=\?", "callback=" + 
			cbName) : options.url;
		// callback pattern array
		node.cbPatArr = getMode ? "" : /q\=\s?/.exec(node.src);
		// callback pattern
		node.cbPat = getMode ? "" : node.src.substr(node.cbPatArr.index+2).split(",");
		node.async = true;
		node.id = cbName;
		node.type = "text/javascript";
		node.charset = options.charset || "utf-8";
		node.onload = node.onerror = node.onreadystatechange = function() {
			if (getMode) {
				timer = setTimeout(function(){
					head.removeChild(node);
					window[cbName]({
						code: OVERTIME_CODE,
						msg: OVERTIME_MSG
					});
					window[cbName] = null;
				},timeout);

				window[cbName] = function(data){
					clearTimeout(timer);
					callback(data);
					head.removeChild(node);
					window[cbName] = null;
				};
			} else {

				timer = setTimeout(function(){
					head.removeChild(node);
					callback({
						code: OVERTIME_CODE,
						msg: OVERTIME_MSG
					});
					window[cbName] = null;
				}, timeout);

				window[cbName] = function(){
					clearTimeout(timer);
					temObj = {};
					for(i in node.cbPat){
						temObj["v_"+node.cbPat[i]] = window["v_"+node.cbPat[i]];
					}
					callback(temObj);
					window[cbName] = null;
				};
				window[cbName]();	
			}
				
		};

		head.appendChild(node);
	};

	exports.post = function (options, callback) {
		options = options || {};
		document.domain = "qq.com";
		var timeout = options.timeout || _TIMEOUT,
			rand = (Math.random().toString().substr(2, 5)),
			cbName = "callback_" + rand,					// callback name
			temp_obj = {},
			form, iframe, timer, counter, temp_element, gcList, i, x;

		var elementCreate = function(element, parent, params){
			temp_element = document.createElement(element);
			for(counter in params){
				if(params.hasOwnProperty(counter)){
					temp_element.setAttribute(counter, params[counter]);
				}
			}
			parent.appendChild(temp_element);
			counter=null;
			return temp_element;
		}

		window[cbName] = function(data){
			clearTimeout(timer);
			callback(data);

			// 清理
/*待更改：这样写是否OK，是否保留删除节点的功能*/
			gcList = ["frame" + "_" + rand, "form" + "_" + rand];//存放预清理节点ID
			for (i in gcList) {
				if(gcList[i]){
					x = document.getElementById(gcList[i]);
					x.parentNode.removeChild(x);
				}
			}
			window[cbName] = null;
		};
		
		iframe = elementCreate("iframe", document.body, {
				"id": "frame" + "_" + rand,
				"name": "frame" + "_" + rand,
				"style": "display: none"
			}
		);

		form = elementCreate("form", document.body, {
				"id": "form" + "_" + rand,
				"name": "form" + "_" + rand,
				"method": "post",
				"action": options.url,
				"target": "frame" + "_" + rand
			}
		);

		if(!("_callback" in options.data)){
			options.data["_callback"] = cbName;
		}

		for(counter in options.data){
			temp_obj = {};
			temp_obj.type = "hidden";
			temp_obj.name = counter;
			temp_obj.value = options.data[counter];
			elementCreate("input", form, temp_obj);
			temp_obj = null;
		}

		form.submit();

		//超时
		timer = setTimeout(function(){
			window[cbName]({
				code: OVERTIME_CODE,
				msg: OVERTIME_MSG
			});
		},timeout);

	};
});
