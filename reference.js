;(function (name, definition) {
	var hasDefine = typeof define === 'function',
		hasExports = typeof module !== 'undefinded' && module.exports;
	
	if (hasDefine) {
		define(definition);
	} else if (hasExports) {
		module.exports = definition();
	} else {
		this[name] = definition();
	}
})('hello', function () {
	var hello = function () {};
	return hello;
});
