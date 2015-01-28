/* jshint node: true
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

// Returns a pair of normal deviates using the Marsaglia polar
// algorithm.  Callers can cache the second return value and use it
// for a subsquent request; it can also be safely ignored, if
// performance isn't super crucial.
function randomMarsaglia() {
	"use strict";
	var cached = null;
	return function() {
		if (cached !== null) {
			var out = cached;
			cached = null;
			return out;
		}
		var u, v, s, a, x, y;
		do {
			u = Math.random() * 2 - 1;
			v = Math.random() * 2 - 1;
			s = u * u + v * v;
		} while (s >= 1 || s === 0);
		a = Math.sqrt(-2.0 * Math.log(s) / s);
		
		x = u * a;
		y = v * a;

		cached = y;
		return x;
	};
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
function randomGaussian(mean, sd) {
	"use strict";
	return mean + sd*randomNormal();
}

var deviates = [];
var idev;
for (idev=0; idev < 10000000; idev += 1) {
	deviates[idev] = randomNormal();
}
console.log("stddev(deviates): %d", standardDeviation(deviates));
