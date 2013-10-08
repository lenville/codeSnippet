/*
 * the addListener function suprported IE6+
 */


function addListener(target, type, handler) {
    if (target.addEventListener) {
        
        // The third argument: useCapture - boolean
        //      True: handling while capturing
        //      False: handling while bubbling
        target.addEventListener(type, handler, false);
    } else if (target.attachEvent) {
        target.attachEvent("on" + type + handler);
    } else {
        target["on" + type] = handler;
    }
}
