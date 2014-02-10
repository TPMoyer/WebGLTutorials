/*   © 2013 Thomas P Moyer  */

function webGLStart03() {
	//AL("cme@ webGLTutorial03.js webGLStart");
	gl.at=gl.length-1;
	var canvas = document.getElementById("tutorial03-canvas0");
	initGL(canvas);
	customizeGL02();
	initShaders02();
	initBuffers02();
	
	gl.rPoint      = 0;
	gl.rLine       = 0;
	gl.rThreeLines = 0;
	gl.rTri        = 0;
	gl.rSquare     = 0;
	gl.lastTime = 0;
	
	drawScene03();
	
	var elem = document.getElementById("xyzpry0");
	if(null!=elem)elem.innerHTML=xyzpryPrint();
	
	gl.at=gl.length-1;
	canvas = document.getElementById("tutorial03-canvas1");
	initGL(canvas);
	customizeGL02();
	initShaders02();
	initBuffers02();
	drawScene03();
	
	var elem = document.getElementById("xyzpry1");
	if(null!=elem)elem.innerHTML=xyzpryPrint();
	
	tick03();
}

function drawScene03() {
	//AL(sprintf("cme@ drawScene03(gl.at=%d) gl.rPoint=%7.3f gl.rLine=%7.3f rThreeLine=%7.3f gl.rTri=%7.3f gl.rSquare=%7.3f",rad2Deg*gl.rPoint,rad2Deg*gl.rLine,rad2Deg*gl.rThreeLines,gl.at,rad2Deg*gl.rTri,rad2Deg*gl.rSquare));
	
	gl[gl.at].viewport(0, 0, gl[gl.at].viewportWidth, gl[gl.at].viewportHeight);
	gl[gl.at].clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	
	mat4.perspective(30, gl[gl.at].viewportWidth / gl[gl.at].viewportHeight, 0.1, 100.0, gl[gl.at].perspectiveMatrix);
	//documentMvmXyzpry();
	
	switch (gl.at%2){
	case 0: 
		xyzprySetInDegrees(   0, -12,   0,  0,  0, 90);   /* 12 units South, flat and level (roof is up),  facing North */
		//xyzpryLogView();
	break;
	case 1: 
		xyzprySetInDegrees(   0,  12,   0,  0,  0,270);    /* 12 units North, flat and level (roof is up), facing South */
		//xyzpryLogView();
	break;
	default:
		alert("drawScene03 attempted to use a non existant context "+gl.at);
	}
	
	glPushMatrix();	
		mat4.translate(gl[gl.at].mvm, [-2.5, 0.0, 1.5 ]);  /* shift to the West and Up in prep for drawing the point */
		mat4.rotate(gl[gl.at].mvm, deg2Rad*gl.rPoint, [ 0, 1, 0 ]);
		gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].lineXYZRGBAs);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ , 3, gl.FLOAT, false,28, 0);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paRGBA, 4, gl.FLOAT, false,28,12);
		setMatrixUniforms03();
		gl[gl.at].drawArrays(gl.POINTS, 2, 1);
	glPopMatrix();
	
	glPushMatrix();
		mat4.translate(gl[gl.at].mvm, [-1.6, 0.0, 0.5 ]);  /* shift to the East for drawing the lines  */
		mat4.rotate(gl[gl.at].mvm, deg2Rad*gl.rLine, [ 0, 1, 0 ]);
		gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].lineXYZRGBAs);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ , 3, gl.FLOAT, false,28, 0);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paRGBA, 4, gl.FLOAT, false,28,12);
		setMatrixUniforms03();
		gl[gl.at].drawArrays(gl.LINES, 0, 4);
	glPopMatrix();
	
	glPushMatrix();
		mat4.translate(gl[gl.at].mvm, [1.5, 0.0, 1.5 ]);  /* shift further to the East and draw the three lines */
		mat4.rotate(gl[gl.at].mvm, deg2Rad*gl.rThreeLines, [ 1, 1, 1 ]);
		gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].triangleXYZRGBAs);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ , 3, gl.FLOAT, false,28, 0);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paRGBA, 4, gl.FLOAT, false,28,12);
		setMatrixUniforms03();
		gl[gl.at].drawArrays(gl.LINE_STRIP, 0, 4);
	glPopMatrix();
	
	glPushMatrix();
		mat4.translate(gl[gl.at].mvm, [-1.5, 0.0,-1.5 ]);  /* shift to the West and Down.  draw the triangle */
		mat4.rotate(gl[gl.at].mvm, deg2Rad*gl.rTri, [ 0, 0, 1 ]);
		gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].triangleXYZRGBAs);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ , 3, gl.FLOAT, false,28, 0);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paRGBA, 4, gl.FLOAT, false,28,12);
		setMatrixUniforms03();
		gl[gl.at].drawArrays(gl.TRIANGLES, 0, 3);
	glPopMatrix();
	
	glPushMatrix();
		mat4.translate(gl[gl.at].mvm, [1.5, 0.0, -1.5 ]);	/* shift to the East. to draw the square */
		mat4.rotate(gl[gl.at].mvm, deg2Rad*gl.rSquare, [ 1, 0, 0 ]);
		gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].squareXYZRGBAs);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ , 3, gl.FLOAT, false,28, 0);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paRGBA, 4, gl.FLOAT, false,28,12);
		setMatrixUniforms03();
		gl[gl.at].drawArrays(gl.TRIANGLE_STRIP, 0, gl[gl.at].squareXYZRGBAs.numItems);
	glPopMatrix();
}

function setMatrixUniforms03() {
	gl[gl.at].uniformMatrix4fv(gl[gl.at].puPerspectiveMatrix, false, gl[gl.at].perspectiveMatrix);
	gl[gl.at].uniformMatrix4fv(gl[gl.at].puMvm              , false, gl[gl.at].mvm);
}

function tick03() {
	//AL("cme@ tick03");
	requestAnimFrame(tick03);
	gl.at=(4<gl.length)?4:0;
	drawScene03();
	gl.at=(4<gl.length)?5:1;
	drawScene03();
	
	animate03();
}

function animate03() {
	//AL("cme@ animate03");
	var timeNow = new Date().getTime();
	if (gl.lastTime != 0) {
		var elapsed = timeNow - gl.lastTime;
		gl.rPoint      += (200*elapsed) / 1000.0;
		gl.rLine       += ( 65*elapsed) / 1000.0;
		gl.rThreeLines += ( 70*elapsed) / 1000.0;
		gl.rTri        += ( 80*elapsed) / 1000.0;
		gl.rSquare     += (110*elapsed) / 1000.0;
	}
	gl.lastTime = timeNow;
}

$(document).ready(function(){
	//AL("in ready 03");
	if(-1<document.getElementById("title").innerHTML.indexOf("tutorial03")){
		//AL("inside ready 03");
		$("input[id^=cullFace]").click(function (event) {
			//AL("inside03 button[id="+this.id+"]");
			var elem = document.getElementById(this.id);
			//AL("looking at elem.value="+elem.value);
			gl.at=parseInt(this.id.charAt(this.id.length-1));
			//AL("whichCanvas="+gl.at);
			if(-1<elem.value.indexOf("Enable")){
				elem.value=" Disable CullFace ";
				gl[gl.at].enable(gl.CULL_FACE);
				//AL("enabling CULL_FACE on 03 canvas "+gl.at);
			} else {
				elem.value="  Enable CullFace ";
				gl[gl.at].disable(gl.CULL_FACE);
				//AL("disabling CULL_FACE on canvas "+gl.at);
			}
			drawScene03();
		});
	}
});