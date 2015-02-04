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

var sketch00 = function() {
	"use strict";
	// Returns a random integer from min (inclusive) to max
	// (exclusive).
	function randomInt(min, max) {
		return Math.floor( Math.random() * (max-min)) + min;
	}
	// Returns a normal deviate using the ratio-of-uniforms method
	// from Numerical Recipes.
	function randomRatioOfUniforms() {
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
	// Returns a random normal deviate.
	function randomNormal() {
		return randomRatioOfUniforms();
	}
	// Returns a deviate from a Gaussian distribution, using the
	// provided mean (mu) and standard distribution (sigma)
	function randomGaussian(mu, sigma) {
		return mu + sigma*randomNormal();
	}

	function sketchProc(pjs) {
		function newWalker() {
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

		pjs.size(640, 480);
		var walker = newWalker();
		pjs.draw = function() {
			if (!pjs.focused) {
				pjs.noStroke();
				pjs.fill(0,0,0,128);
				pjs.rect(pjs.width/2-30, pjs.height/2-10, 60, 20);
				pjs.fill(255);
				pjs.textAlign(pjs.CENTER);
				pjs.text("Click me!", pjs.width/2, pjs.height/2);
				return;
			}
			pjs.background(0);
			pjs.fill(204, 102, 0);
			pjs.rect(pjs.mouseX, pjs.mouseY, 10, 10);
			
			walker.step();
			walker.draw();
		};
	}

	var m_canvasElem = document.getElementById("00-canvas");
	var m_pjs = new Processing(m_canvasElem, sketchProc);
}();
