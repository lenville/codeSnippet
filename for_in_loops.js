/*
 * for_in loops are only supposed to be used for object looping
 */

for (key in object) {
    if (object.hasOwnProperty(key)) {
        // do something
    }
}

// Or we can do like this
for (key in onject) { // It contains loops for prototype chain
    // do something
}
