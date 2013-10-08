/*
 * some comparison methods in JS
 */

// Original Values like
//      string, number, boolean, null, undefined

if (typeof name === "string") {
if (typeof count === "number") {
if (typeof found === "boolean" && found) {
if (typeof variable === "undefined") {
    // do something
}


// Reference Values like
//      Date, RegExp, Error
    
if (value instanceof Date) {
if (value instanceof RegExp) {
if (value instanceof Error) {
    // do something
}


// Functions

if (typeof myFunc === "function") {     // IE9+(include IE9)
if ("querySelectorAll" in document) {   // IE8-(include IE8)
    // do something
}


// Array

function isArray(value) { // IE8-(include IE8)
    // duck typing recommended by Douglas Crockford
    return typeof value.sort === "function";

    // or

    // raised by Juriy Zaytsev (Kangax)
    return Object.prototype.toString.call(value) === "[object Array]";
}

// IE 9+, Firefox 4+, Safari 5+, Opera 10.5+, Chrome
//      all support Array.isArray()

// the final version is

function isArray(value) {
    if (typeof Array.isArray == "function") {
        return Array.isArray(value);
    } else {
        return Object.prototype.toString.call(value) === "[object Array]";
    }
}


// Attributes

// include inheritance
if (*** in object) {
    // do something
}

// not include inheritance
if (object.hasOwnProperty(***)) {
    // do something
}

// and if you dont's sure if that is a DOM object
if ("hasOwnProperty" in object && object.hasOwnProperty(***)) {
    // do something
}
