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

/* global Processing
   , PerlinSimplex
*/

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

var pjs = null;

function newWalker() {
	"use strict";
	var m_x0 = 0, m_y0 = 0, m_x1 = 0, m_y1 = 0;
	var m_tx = 0, m_ty = 10000;
	PerlinSimplex.noiseDetail(4,0);
	return {
		draw: function() {
			pjs.stroke(255, 255, 0);
			pjs.strokeWeight(3);
			pjs.line(m_x0, m_y0, m_x1, m_y1);
		},
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
			m_x0 = m_x1;
			m_y0 = m_y1;
			m_x1 = pjs.width  * PerlinSimplex.noise(m_tx, 0);
			m_y1 = pjs.height * PerlinSimplex.noise(m_ty, 0);
			m_tx += 0.01;
			m_ty += 0.01;
		},
	};
}
var walker = newWalker();

function sketchProc(pjs) {
	"use strict";
	// Override draw function, by default it will be called 60 times per second
	pjs.size(640, 480);
	pjs.draw = function() {
		// determine center and max clock arm length
		var centerX = pjs.width / 2, centerY = pjs.height / 2;
		var maxArmLength = Math.min(centerX, centerY);
		
		function drawArm(position, lengthScale, weight) {
			pjs.strokeWeight(weight);
			pjs.stroke(0,0,255);
			pjs.line(centerX, centerY,
							centerX + Math.sin(position * 2 * Math.PI) * lengthScale * maxArmLength,
							centerY - Math.cos(position * 2 * Math.PI) * lengthScale * maxArmLength);
		}
		
		// erase background
		pjs.background(0);
		/*
		var now = new Date();
		
		// Moving hours arm by small increments
		var hoursPosition = (now.getHours() % 12 + now.getMinutes() / 60) / 12;
		drawArm(hoursPosition, 0.5, 5);
		
		// Moving minutes arm by small increments
		var minutesPosition = (now.getMinutes() + now.getSeconds() / 60) / 60;
		drawArm(minutesPosition, 0.80, 3);
		
		// Moving hour arm by second increments
		var secondsPosition = now.getSeconds() / 60;
		drawArm(secondsPosition, 0.90, 1);
		*/
		pjs.fill(204, 102, 0);
		pjs.rect(pjs.mouseX, pjs.mouseY, 10, 10);

		walker.step();
		walker.draw();
	};
}
var canvasElem = document.getElementById("my-canvas");
pjs = new Processing(canvasElem, sketchProc);
