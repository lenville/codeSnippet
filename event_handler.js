/*
 * Good choice of handling events
 */

 var handler = {
    
    handleClick: function(event) {
        
        // assuming that event supporting DOM Level2
        event.preventDefault();
        event.stopPropagation();

        // pass into the application logic
        this.showPopup(event.clientX, event.clientY);
    },

    showPopup: function(x, y) {
        var popup = document.getElementById("popup");
        popup.style.left = x + "px";
        popup.style.top = y + "px";
        popup.className = "reveal";
    }
 };

 addListener(element, "click", function(event) {
    handler.handleClick(event);
 })
