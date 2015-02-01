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

var sketch01 = function() {
	"use strict";
	function sketchProc(pjs) {
		var Mover = function() {
			var m_pos = new pjs.PVector(pjs.width/2, pjs.height/2);
			var m_vel = new pjs.PVector(10, 0);
			var m_acc = new pjs.PVector(0, 10);
			return {
				update: function(dt) {
					// x = 0.5att + v0t + x0
					var newPos = new pjs.PVector(m_acc.x, m_acc.y);
					newPos.mult(0.5 * dt);
					newPos.add(m_vel);
					newPos.mult(dt);
					newPos.add(m_pos);
					
					newPos.x = newPos.x % pjs.width;
					newPos.y = newPos.y % pjs.height;
					// v = v0 + at
					var newVel = new pjs.PVector(m_acc.x, m_acc.y);
					newVel.mult(dt);
					newVel.add(m_vel);
					// terminal velocity
					newVel.limit(100);
					
					m_pos = newPos;
					m_vel = newVel;
				},
				draw: function() {
					pjs.fill(0,255,0);
					pjs.rect(m_pos.x, m_pos.y, 10, 10);
				}
			};
		};
		var m_mover = new Mover();
		
		var m_lastTime = new Date() / 1000;
		pjs.size(640, 480);
		pjs.draw = function() {
			var newTime = new Date() / 1000;
			var dt = newTime - m_lastTime;
			m_lastTime = newTime;
			
			pjs.background(0);
			var center = new pjs.PVector(pjs.width/2, pjs.height/2);
			var mouse = new pjs.PVector(pjs.mouseX, pjs.mouseY);
			pjs.stroke(255,255,0);
			pjs.line(center.x, center.y, mouse.x, mouse.y);

			m_mover.update(dt);
			m_mover.draw();
		};
	}
	var m_canvasElem = document.getElementById("01-canvas");
	var m_pjs = new Processing(m_canvasElem, sketchProc);
}();
