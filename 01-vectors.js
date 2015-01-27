/* jshint browser: true
   , strict: true
   , bitwise: true
   , eqeqeq: true
   , forin: true
   , freeze: true
   , latedef: true
   , newcap: true
   , noarg: true
   , undef: true
   , plusplus: true
*/

/* global Two */

// Returns a random integer from min (inclusive) to max (exclusive).
function randomInt(min, max) {
	"use strict";
	return Math.floor( Math.random() * (max-min)) + min;
}


var canvasElem = document.getElementById('twobox-canvas');
var two = new Two({
	type: Two.Types.webgl,
	width: canvasElem.clientWidth,
	height: canvasElem.clientHeight,
    fullscreen: false,
    autostart: true,
	overdraw: true
}).appendTo(canvasElem);

var darkener = two.makeRectangle(two.width/2, two.height/2,
								 two.width, two.height);
darkener.fill = "black";
darkener.opacity = 0.1;

var rect = two.makeRectangle(two.width / 2, two.height / 2, 50 ,50);
var mouse = new Two.Vector();
rect.stroke = "green";
rect.linewidth = 5;
rect.fill = "orange";
document.addEventListener( 'mousemove', function(e) {
	"use strict";
	mouse.x = e.clientX;
	mouse.y = e.clientY;
}, false );

two.bind('update', function() {
	"use strict";
	two.width  = canvasElem.clientWidth;
	two.height = canvasElem.clientHeight;
	//rect.translation.set(two.width/2, two.height/2);
	rect.translation.set(mouse.x, mouse.y);
    rect.rotation += 0.005;
});
