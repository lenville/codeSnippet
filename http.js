//! http.js
//! Version : 0.0.2
//! Authors : Lenville
//! Site: lenville.com
//! New Features: 简化代码，进行高层次封装
//! History: 
//!		0.0.1 仿照moment.js写http.js的post传递信息+回传 & jsonp实现

define(function (require, exports) {

	/************************************
		常量 // Constants
	************************************/

	//常量设置
	var OVERTIME_CODE = 404,
		OVERTIME_MSG = "超时",
		_TIMEOUT = 10000;
	

	/************************************
		初始化 // Initialize
	************************************/

	//缩域设置
	document.domain = "qq.com";

	/************************************
		Top Level Functions
	************************************/
	
	exports.getJson = function (url, fn, timeout) {
		var timeout = timeout || _TIMEOUT,					//超时初始化
			rand = (Math.random().toString().substr(2, 5)),	//取随机数
			callback = 'callback_' + rand,					//取回调名称
			timer,											//其它杂项初始化
			script = document.createElement("script");
		script.setAttribute("src", url+'?callback='+callback);
		document.head.appendChild(script);

		window[callback] = function(data){
			clearTimeout(timer);
			fn(data);
			window[callback] = null;
		}
		//超时
		timer = setTimeout(function(){
			window[callback]({
				code: OVERTIME_CODE,
				msg: OVERTIME_MSG
			});
		},timeout);
	};

	exports.post = function (url, data, fn, timeout) {
		
		var timeout = timeout || _TIMEOUT,					//超时初始化
			form, iframe, input = [],						//
			rand = (Math.random().toString().substr(2, 5)),	//取随机数
			callback = 'callback_' + rand,					//取回调名称
			timer, counter;									//其它杂项初始化

		/**/
		var elementCreate = function(element, parent, params){
			var temp_element = document.createElement(element);
			for(var key in params){
				if(params.hasOwnProperty(key)){
					temp_element.setAttribute(key, params[key]);
				}
			}
			parent.appendChild(temp_element);
			key=null;
			return temp_element;
		}

		window[callback] = function(data){
			clearTimeout(timer);
			fn(data);

			// 清理
/*待更改：这样写是否OK，是否保留删除节点的功能*/
			var gcList = ["frame" + "_" + rand, "form" + "_" + rand];//存放预清理节点ID
			for (var i in gcList) {
				if(gcList[i]){
					var x = document.getElementById(gcList[i]);
					x.parentNode.removeChild(x);
				}
			}
			window[callback] = null;
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
				"action": url,
				"target": "frame" + "_" + rand
			}
		);

		if(!("_callback" in data)){
			data["_callback"] = callback;
		}

		for(counter in data){
			var temp_obj = {};
			temp_obj.type = "hidden";
			temp_obj.name = counter;
			temp_obj.value = data[counter];
			elementCreate("input", form, temp_obj);
			temp_obj = null;
		}

		form.submit();

		//超时
		timer = setTimeout(function(){
			window[callback]({
				code: OVERTIME_CODE,
				msg: OVERTIME_MSG
			});
		},timeout);

	};
});
