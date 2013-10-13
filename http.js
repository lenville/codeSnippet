//! http.js
//! Version : 0.0.1
//! Authors : Lenville
//! Site: lenville.com
//! New Features: 仿照moment.js写http.js的post传递信息+回传 & jsonp实现

(function (undefined) {

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
		Constructors
	************************************/

	//HTTP Prototype Object
	function HTTP(config) {
		extend(this, config);
	}

	/************************************
		Top Level Functions
	************************************/

	http.prototype.getJson = function (url, callback) {
		var script = document.createElement("script");
		script.setAttribute("src", url+'?callback='+callback);
		document.head.appendChild(script);
	};

	http.prototype.post = function (url, data, fn, timeout) {

		var timeout = timeout || _TIMEOUT,
			timeStamp = new Date().getTime(),
			callback = 'callback_' + timeStamp,
			timer,
			iframe,
			form,
			hiddenField;

		window[callback] = function(data){
			clearTimeout(timer);
			fn(data);

			//清理
			var gcList = [timeStamp, 'sender'];//存放预清理节点ID
			for (var i in gcList) {
				if(gcList[i]){
					var x = document.getElementById(gcList[i]);
					x.parentNode.removeChild(x);
				}
			}
			window[callback] = null;
		};
		
		iframe = document.createElement("iframe");
			iframe.setAttribute("id", timeStamp);
			iframe.setAttribute("name", timeStamp);
			iframe.setAttribute("style", "display: none;");

		form = document.createElement("form");
			form.setAttribute("id", "sender");
			form.setAttribute("method", "post");
			form.setAttribute("action", url);
			form.setAttribute("target", timeStamp);

		hiddenField = document.createElement("input");
			hiddenField.setAttribute("type", "hidden");
			hiddenField.setAttribute("name", "_callback");
			hiddenField.setAttribute("value", callback);

			form.appendChild(hiddenField);

		for(var key in data){
			if(data.hasOwnProperty(key)){
				hiddenField = document.createElement("input");
					hiddenField.setAttribute("type", "hidden");
					hiddenField.setAttribute("name", key);
					hiddenField.setAttribute("value", data[key]);

				form.appendChild(hiddenField);
			}
		}
		
		document.body.appendChild(form);
		document.body.appendChild(iframe);

		form.submit();

		//超时
		timer = setTimeout(function(){
			window[callback]({
				code: OVERTIME_CODE,
				msg: OVERTIME_MSG
			});
		},timeout);

	};

	/************************************
		http Prototype
	************************************/

	extend(http.fn = Http.protype, {
		send: function(opt, callback) {
			switch(true){
				case opt['method'] == "POST" || opt['method'] == "post":
					postData(opt['url'], opt['data'], callback);
				case opt['method'] == "GET" || opt['method'] == "get";
					getData(opt['url'], opt['data'], callback);
			}
		}
	})


	// CommonJS module is defined
	if (hasModule) {
		module.exports = http;
	}
	/*global ender:false */
	if (typeof ender === 'undefined') {
		// here, `this` means `window` in the browser, or `global` on the server
		// add `http` as a global object via a string identifier,
		// for Closure Compiler "advanced" mode
		this['http'] = http;
	}
	/*global define:false */
	if (typeof define === "function" && define.amd) {
		define("http", [], function () {
			return http;
		});
	}
}).call(this);
