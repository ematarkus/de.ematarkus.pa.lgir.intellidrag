(function() {
  lgir.draggableCommand = function(mdevent, delay, responders) {
    var dragTime = new Date().getTime() + delay;
    var dragging = false;
    var polling = true;

    var startX = mdevent.offsetX;
    var startY = mdevent.offsetY;

    var setDragging = function(drag) {
      dragging = drag;
      polling = !drag;
    }
    var cancelDragging = function() {
      dragging = false;
      polling = false;
    }

    input.capture(mdevent.holodeck.div, function (event) {
      lgir.scaleMouseEvent(event);

      event.holodeck = mdevent.holodeck;
      //if (model.showTimeControls())
        //model.endCommandMode();
        
      if ((event.type === 'mousemove') && polling && ((new Date().getTime()) >= dragTime)) {
        polling = false;
        dragging = true;
        responders.start(event, setDragging, cancelDragging);
      }
      else if ((event.type === 'mouseup') && (event.button === mdevent.button)) {
        input.release();
        if (dragging) {
          var dx = Math.abs(event.offsetX-startX);
          var dy = Math.abs(event.offsetY-startY);
          if(Math.sqrt( Math.pow(dx, 2) + Math.pow(dy, 2) )>=10) {
            responders.end(event);
          } else {
            responders.end(event);
            responders.click(event);
          }
        } else {
          responders.click(event);
        }
      }
      else if ((event.type === 'keydown') && (event.keyCode === keyboard.esc)) {
        input.release();
        responders.cancel(event);
      }
    });
  }
})();
