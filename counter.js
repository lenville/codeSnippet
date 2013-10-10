function counter() {
    var n = 0;
    return {
        count: function() { return n++; }
        reset: function() { n = 0; }
    };
}

var c = counter();

c.count();
