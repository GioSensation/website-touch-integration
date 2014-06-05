window.addEventListener('load', function() {
	
	// FastClick magic
	FastClick.attach(document.body);
	
});

// Touch integration test
var fingerPainter = {};
fingerPainter.getRandomColor = function() {
	var v = function() {
		return Math.floor(Math.random() * 255);
	};
	return 'rgb(' + [v(), v(), v()] + ')';
};
fingerPainter.init = function() {
	var canvas = document.querySelector('canvas'),
		canvasDimensions = canvas.getBoundingClientRect(),
		ctx = canvas.getContext('2d');
	ctx.lineWidth = 20;
	ctx.lineCap = 'round';
	
	canvas.addEventListener('touchstart', function(event) {
		ctx.strokeStyle = ctx.fillStyle = fingerPainter.getRandomColor();
		
		// Initial dot for single taps
		ctx.beginPath();
		ctx.arc(event.targetTouches[0].pageX - canvasDimensions.left, event.targetTouches[0].pageY - canvasDimensions.top, 10, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();
		ctx.beginPath();
		
		// Set start point for drawing line
		ctx.moveTo(event.targetTouches[0].pageX - canvasDimensions.left, event.targetTouches[0].pageY - canvasDimensions.top);
	});
	
	canvas.addEventListener('touchmove', function(event) {
		event.preventDefault();
		
		// Get a reference to the first touch placed
		var touch = event.touches[0];
		
		// Draw a line to the new location
		ctx.lineTo(touch.pageX - canvasDimensions.left, touch.pageY - canvasDimensions.top);
		ctx.stroke();
	});
	
};

document.addEventListener('DOMContentLoaded', fingerPainter.init);
