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
			var m_pos = new pjs.PVector(pjs.random(pjs.width),
										pjs.random(pjs.height));
			var m_color = [pjs.random(256), pjs.random(256), pjs.random(256)];
			var m_vel = new pjs.PVector(10, 0);
			var m_acc = new pjs.PVector(0, 10);
			return {
				update: function(dt) {
					var mousePos = new pjs.PVector(pjs.mouseX, pjs.mouseY);
					m_acc = pjs.PVector.sub(mousePos, m_pos);
					m_acc.normalize();
					m_acc.mult(400);
					// x = 0.5att + v0t + x0
					// x = x0 + (t * (v0 + (0.5*t * a)))
					m_pos.add(pjs.PVector.mult(
						pjs.PVector.add(m_vel,
										pjs.PVector.mult(m_acc, 0.5*dt)
									   ),
						dt) );
					// v = v0 + at
					m_vel.add( pjs.PVector.mult(m_acc, dt) );
					m_vel.limit(200);
				},
				draw: function() {
					pjs.noStroke();
					pjs.fill(m_color[0], m_color[1], m_color[2]);
					pjs.rect(m_pos.x, m_pos.y, 10, 10);
				}
			};
		};

		pjs.size(640, 480);
		var m_movers = [];
		var m_iMover = 0;
		for(m_iMover=0; m_iMover<50; m_iMover += 1) {
			m_movers.push(new Mover());
		}
		var m_lastTime = new Date() / 1000;
		pjs.draw = function() {
			var newTime = new Date() / 1000;
			var dt = newTime - m_lastTime;
			m_lastTime = newTime;
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
			var center = new pjs.PVector(pjs.width/2, pjs.height/2);
			var mouse = new pjs.PVector(pjs.mouseX, pjs.mouseY);
			pjs.stroke(255,255,0);
			pjs.line(center.x, center.y, mouse.x, mouse.y);

			for(m_iMover=0; m_iMover<m_movers.length; m_iMover += 1) {
				m_movers[m_iMover].update(dt);
				m_movers[m_iMover].draw();
			}
		};
	}
	var m_canvasElem = document.getElementById("01-canvas");
	var m_pjs = new Processing(m_canvasElem, sketchProc);
}();
