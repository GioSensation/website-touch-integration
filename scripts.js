window.addEventListener('load', function() {
	
	// FastClick magic
	FastClick.attach(document.body);
	
});

var fingerPainter = {};

fingerPainter.getRandomColor = function() {
	var v = function() {
		return Math.floor(Math.random() * 255);
	};
	return 'rgb(' + [v(), v(), v()] + ')';
};

fingerPainter.colorPicker = (function() {
	var colorsWrapper = null,
		colorsContainer = null,
		activeColor,
		originX = 0,
		colorsX = 0,
		colorsOriginX = 0,
		leftBound = 0;
		
		var getTransformProperty = function() {
			var property = ['transform', 'webkitTransform', 'mozTransform'].filter(function(prefix) {
				return document.body.style.hasOwnProperty(prefix);
			})[0];
			getTransformProperty = function() {
				return property;
			};
		};
		
		var generateColors = function () {
			var colorSwatch;
			// Generate 20 random colors
			for (var i = 1; i < 20; i++) {
				colorSwatch = document.createElement('li');
				colorSwatch.style.backgroundColor = fingerPainter.getRandomColor();
				colorsContainer.appendChild(colorSwatch);
			}
			// Calculate the furthest distance the colors can be swiped to the left
			leftBound = colorsWrapper.getBoundingClientRect().width - colorsContainer.getBoundingClientRect().width;
		};
		
		var setupTouchEvents = function () {
			colorsContainer.addEventListener('click', function(event) {
				activeColor = event.target.style.backgroundColor;
			});
			// Swipe through the colors
			colorsWrapper.addEventListener('touchstart', function(event) {
				originX = event.targetTouches[0].pageX;
				colorsOriginX = colorsX;
			});
			colorsWrapper.addEventListener('touchmove', function(event) {
				// Prevent default behavior of scrolling elements
				event.preventDefault();
				var deltaX = event.targetTouches[0].pageX - originX;
				colorsX = colorsOriginX + deltaX;
				
				if (colorsX > 0) {
					colorsX = 0;
				} else if (colorsX < leftBound) {
					colorsX = leftBound;
				}
				colorsContainer.style[getTransformProperty()] = 'translate3d(' + colorsX + 'px, 0, 0)';
			});
		};
		
		return {
			init: function () {
				colorsWrapper = document.querySelector('#colors');
				colorsContainer = colorsWrapper.querySelector('ol');
				generateColors();
				setupTouchEvents();
			},
			getActiveColor: function () {
				return activeColor;
			}
		};
})();

fingerPainter.init = function () {
	var canvas = document.querySelector('canvas'),
		canvasDimensions = canvas.getBoundingClientRect(),
		ctx = canvas.getContext('2d');
		
		ctx.lineWidth = 20;
		ctx.lineCap = 'round';
		canvas.addEventListener('touchstart', function(event) {
			ctx.strokeStyle = ctx.fillStyle = fingerPainter.colorPicker.getActiveColor();
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
			// Prevent default behavior of scrolling elements
			event.preventDefault();
			// Get a reference to the first touch placed
			var touch = event.touches[0];
			// Draw a line to the new location
			ctx.lineTo(touch.pageX - canvasDimensions.left, touch.pageY - canvasDimensions.top);
			ctx.stroke();
		});
		fingerPainter.colorPicker.init();
};

document.addEventListener('DOMContentLoaded', fingerPainter.init);
