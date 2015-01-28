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

// Returns a normal deviate using the ratio-of-uniforms method from
// Numerical Recipes.
function randomRatioOfUniforms() {
	"use strict";
	var u, v, x, y, q;
	do {
		u = Math.random();
		v = 1.7156 * (Math.random() - 0.5);
		x = u - 0.449871;
		y = Math.abs(v) + 0.386595;
		q = x*x + y*(0.19600*y - 0.25472*x);
	} while (q > 0.27597 && (q > 0.27846 || v*v > -4.0 * Math.log(u)*u*u));
	return v/u;
}
function randomNormal() {
	"use strict";
	return randomRatioOfUniforms();
}
// Returns a deviate from a Gaussian distribution, using the provided mean (mu)
// and standard distribution (sigma)
function randomGaussian(mu, sigma) {
	"use strict";
	return mu + sigma*randomNormal();
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
	//
	// TODO: for lower values, the old contents never seem to
	// disappear completely...
	var darkener = two.makeRectangle(two.width/2, two.height/2,
									 two.width,   two.height);
	darkener.fill = "black";
	darkener.opacity = 0.5; // tune me to adjust the fade speed
}

//var rect = two.makeRectangle(two.width / 2, two.height / 2, 50 ,50);
//rect.stroke = "green";
//rect.linewidth = 5;
//rect.fill = "orange";

function newWalker() {
	"use strict";
	var m_line = two.makeLine(two.width/2, two.height/2,
							  two.width/2, two.height/2);
	m_line.linewidth = 3;
	m_line.stroke = "yellow";
	return {
		step: function() {
			var monteCarlo = function() {
				while(true) {
					var r1 = Math.random();
					var probability = r1;
					var r2 = Math.random();
					if (r2 < probability)
						return r1;
				}
			};
			var stepSize = 30 * (1-monteCarlo());
			m_line.vertices[0].copy(m_line.vertices[1]);
			m_line.vertices[1].set(
				m_line.vertices[1].x + stepSize*(Math.random()*2-1),
				m_line.vertices[1].y + stepSize*(Math.random()*2-1)
			);
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
