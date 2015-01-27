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

function isArray(obj) {
	"use strict";
	return Object.prototype.toString.apply(obj) === '[object Array]';
}

function standardDeviation(arr) {
	"use strict";
	if (!isArray(arr) || arr.length === 0) {
		return 0.0;
	}
	var iElem, mean = 0.0;
	for(iElem=0; iElem<arr.length; iElem+=1) {
		mean += arr[iElem];
	}
	mean /= arr.length;
	var stddev = 0.0;
	for(iElem=0; iElem<arr.length; iElem+=1) {
		var variance = (arr[iElem] - mean);
		stddev += variance*variance;
	}
	return Math.sqrt(stddev/arr.length);
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

var mouse = new Two.Vector();
document.addEventListener( 'mousemove', function(e) {
	"use strict";
	mouse.x = e.clientX;
	mouse.y = e.clientY;
}, false );

if (two.overdraw) {
	// Draw a full-screen quad to fade the existing framebuffer over
	// time. Must be the first object in the scene!
	var darkener = two.makeRectangle(two.width/2, two.height/2,
									 two.width,   two.height);
	darkener.fill = "black";
	darkener.opacity = 0.001; // tune me to adjust the fade speed
}

//var rect = two.makeRectangle(two.width / 2, two.height / 2, 50 ,50);
//rect.stroke = "green";
//rect.linewidth = 5;
//rect.fill = "orange";

function newWalker() {
	"use strict";
	var m_rect = two.makeRectangle(two.width/2, two.height/2, 5,5);
	m_rect.linewidth = 0.01;
	m_rect.fill = "yellow";
	return {
		step: function() {
			var oldTrans = m_rect.translation.clone();
			oldTrans.x += randomInt(-1, 2);
			oldTrans.y += randomInt(-1, 2);
			m_rect.translation.copy(oldTrans);
		},
	};
}
var walker = newWalker();

two.bind('update', function() {
	"use strict";
	two.width  = canvasElem.clientWidth;
	two.height = canvasElem.clientHeight;

	walker.step();
	
	//rect.translation.set(two.width/2, two.height/2);

	//rect.translation.set(mouse.x, mouse.y);
    //rect.rotation += 0.005;
});
