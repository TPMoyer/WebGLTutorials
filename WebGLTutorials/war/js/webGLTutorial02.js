/*   © 2013 Thomas P Moyer  */ 

function webGLStart02() {
	//AL("cme@ webGLTutorial02.js webGLStart");
	gl.at=gl.length-1;
	var canvas = document.getElementById("tutorial02-canvas0");
	initGL(canvas);
	//AL("post initGL");
	customizeGL02();
	//AL("post customizeShaders");
	initShaders02();
	//AL("post initShaders");spr
	initBuffers02();
	//AL("post initBuffers");
	drawScene02();
	//AL("post initDrawscene the first");
	
	var elem = document.getElementById("xyzpry0");
	if(null!=elem)elem.innerHTML=xyzpryPrint();
	
	gl.at=gl.length-1;
	canvas = document.getElementById("tutorial02-canvas1");
	initGL(canvas);
	customizeGL02();
	initShaders02();	
	initBuffers02();
	drawScene02();
	
	elem = document.getElementById("xyzpry1");
	if(null!=elem)elem.innerHTML=xyzpryPrint();
	
}

function customizeGL02() {
	//AL("customizeGL02");
	gl[gl.at].clearColor(0.0, 0.0, 0.0, 1.0);
	gl[gl.at].enable   (gl.DEPTH_TEST);
	gl[gl.at].frontFace(gl.CCW); 
	gl[gl.at].cullFace (gl.BACK); 
	if(null != document.getElementById('setCullFace')){
		//AL("setting CULL_FACE from null!=setCullFace");
		gl[gl.at].enable(gl.CULL_FACE);
		document.getElementById(sprintf("%s%d",'cullFace',gl.at)).value=" Disable CullFace ";
	} else {
		//AL("disabling CULL_FACE");
		gl[gl.at].disable(gl.CULL_FACE);	
	}
}

function initShaders02() {
	//AL("cme@ initShaders02");
	var   vertexShader = getShader(  "vertex-shader1");
	//AL("post getShaders vertex");
	var fragmentShader = getShader("fragment-shader1");
	//AL("post getShaders fragment");	
	
	gl[gl.at].shaderProgram = gl[gl.at].createProgram();
	gl[gl.at].attachShader(gl[gl.at].shaderProgram,   vertexShader);
	gl[gl.at].attachShader(gl[gl.at].shaderProgram, fragmentShader);
	gl[gl.at].linkProgram (gl[gl.at].shaderProgram);
	if (!gl[gl.at].getProgramParameter(gl[gl.at].shaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}
	gl[gl.at].useProgram(gl[gl.at].shaderProgram);
	
	gl[gl.at].paXYZ               = gl[gl.at].getAttribLocation (gl[gl.at].shaderProgram, "aXYZ"              );
	gl[gl.at].enableVertexAttribArray(gl[gl.at].paXYZ );
	
	gl[gl.at].paRGBA              = gl[gl.at].getAttribLocation (gl[gl.at].shaderProgram, "aRGBA"             );
	gl[gl.at].enableVertexAttribArray(gl[gl.at].paRGBA);
	
	gl[gl.at].puPerspectiveMatrix = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uPerspectiveMatrix");
	gl[gl.at].puMvm               = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uMvm"              );
	
}

function initBuffers02() {
	//AL("cme@ initBuffers02");
	/*                lines            vertex colors          line start                   vertex colors */
	var xyzrgbas = [ 0.0, 0.0, 0.0,  0.5, 0.5, 1.0, 1.0, //  first line start               calm blue 
	                 0.0, 0.0, 2.0,  0.5, 0.5, 1.0, 1.0, //  first line end                 calm blue 
	                 0.2, 0.0, 0.0,  1.0, 0.0, 0.0, 1.0, //  second line start (and Point)  red       
	                 0.2, 0.0, 2.0,  0.0, 1.0, 0.0, 1.0  //  second line end                green     
	                 ];	
	gl[gl.at].lineXYZRGBAs = gl[gl.at].createBuffer();
	gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].lineXYZRGBAs);
	gl[gl.at].bufferData(gl.ARRAY_BUFFER, new Float32Array(xyzrgbas), gl.STATIC_DRAW);
	
	/*           line Strip       vertex colors          line start     line end     vertex colors           */
	xyzrgbas = [ 0.0, 0.0, 1.0,  1.0, 0.0, 0.0, 1.0, //   first                      red     start
	            -1.0, 0.0,-1.0,  0.0, 1.0, 0.0, 1.0, //   second          first      green   second point
	             1.0, 0.0,-1.0,  0.0, 0.0, 1.0, 1.0, //   third           second     blue    3rd point
	             0.0, 0.0, 1.0,  1.0, 0.0, 1.0, 1.0  //                   third      magenta end of 3rd line
	           ];
	gl[gl.at].triangleXYZRGBAs = gl[gl.at].createBuffer();
	gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].triangleXYZRGBAs);
	gl[gl.at].bufferData(gl.ARRAY_BUFFER, new Float32Array(xyzrgbas), gl.STATIC_DRAW);
	gl[gl.at].triangleXYZRGBAs.numItems = xyzrgbas.length/7;
	
	/*           triangle strip   vertex colors         first triangle             second triangle          color   */
	xyzrgbas = [-1.0, 0.0, 1.0,  0.5, 0.5, 1.0, 1.0, // starts here                                         calm blue
	            -1.0, 0.0,-1.0,  0.5, 0.5, 1.0, 1.0, // second point               next to last point       calm blue
	             1.0, 0.0, 1.0,  0.5, 0.5, 1.0, 1.0, // done! is CCW from South    last point               calm blue
	             1.0, 0.0,-1.0,  0.5, 0.5, 1.0, 1.0  //                            done! is CW from South   calm blue
	       ];
	gl[gl.at].squareXYZRGBAs = gl[gl.at].createBuffer();
	gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].squareXYZRGBAs);
	gl[gl.at].bufferData(gl.ARRAY_BUFFER, new Float32Array(xyzrgbas), gl.STATIC_DRAW);
	gl[gl.at].squareXYZRGBAs.numItems = xyzrgbas.length/7;
}

function drawScene02() {
	//AL("cme@ drawScene02(gl.at="+gl.at+")");
	
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
		alert("drawScene02 attempted to use a non existant context "+gl.at);
	}
	
	mat4.translate(gl[gl.at].mvm, [-2.5, 0.0, 1.5 ]);  /* shift to the West and Up in prep for drawing the point */
	gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].lineXYZRGBAs);
	gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ , 3, gl.FLOAT, false, 28,  0);
	gl[gl.at].vertexAttribPointer(gl[gl.at].paRGBA, 4, gl.FLOAT, false, 28, 12);
	setMatrixUniforms02();
	gl[gl.at].drawArrays(gl.POINTS, 2, 1);
	
	mat4.translate(gl[gl.at].mvm, [0.9, 0.0,-1.0 ]);  /* shift to the Ease for drawing the 2 lines  */
	gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].lineXYZRGBAs);
	gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ , 3, gl.FLOAT, false, 28, 0);
	gl[gl.at].vertexAttribPointer(gl[gl.at].paRGBA, 4, gl.FLOAT, false, 28,12);	
	setMatrixUniforms02();
	gl[gl.at].drawArrays(gl.LINES, 0, 4);
	
	mat4.translate(gl[gl.at].mvm, [3.1, 0.0, 1.0 ]);  /* shift further to the East and draw the three lines */
	gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].triangleXYZRGBAs);
	gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ , 3, gl.FLOAT, false, 28, 0);
	gl[gl.at].vertexAttribPointer(gl[gl.at].paRGBA, 4, gl.FLOAT, false, 28,12);
	setMatrixUniforms02();
	gl[gl.at].drawArrays(gl.LINE_STRIP, 0, 4);
	
	mat4.translate(gl[gl.at].mvm, [-3.0, 0.0,-3.0 ]);  /* shift to the West and Down.  draw the triangle */
	gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].triangleXYZRGBAs);
	gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ , 3, gl.FLOAT, false, 28, 0);
	gl[gl.at].vertexAttribPointer(gl[gl.at].paRGBA, 4, gl.FLOAT, false, 28,12);
	setMatrixUniforms02();
	gl[gl.at].drawArrays(gl.TRIANGLES, 0, 3);
	
	mat4.translate(gl[gl.at].mvm, [3.0, 0.0, 0.0 ]);	/* shift to the East. to draw the square */
	gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].squareXYZRGBAs);
	gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ , 3, gl.FLOAT, false, 28, 0);
	gl[gl.at].vertexAttribPointer(gl[gl.at].paRGBA, 4, gl.FLOAT, false, 28,12);
	setMatrixUniforms02();
	gl[gl.at].drawArrays(gl.TRIANGLE_STRIP, 0, gl[gl.at].squareXYZRGBAs.numItems);
}

function setMatrixUniforms02() {
	gl[gl.at].uniformMatrix4fv(gl[gl.at].puPerspectiveMatrix, false, gl[gl.at].perspectiveMatrix);
	gl[gl.at].uniformMatrix4fv(gl[gl.at].puMvm, false, gl[gl.at].mvm);
}

$(document).ready(function(){
	//AL("in ready 02");
	/* this works even with id being an undefined attribute name for <title> */
	if(-1<document.getElementById("title").innerHTML.indexOf("tutorial02")){
		//AL("inside ready 02");
		$("input[id^=cullFace]").click(function (event) {
			//AL("inside02 button[id="+this.id+"]");
			var elem = document.getElementById(this.id);
			//AL("looking at elem.value="+elem.value);
			gl.at=parseInt(this.id.charAt(this.id.length-1));
			//AL("whichCanvas="+gl.at);
			if(-1<elem.value.indexOf("Enable")){
				elem.value=" Disable CullFace ";
				gl[gl.at].enable(gl.CULL_FACE);
				//AL("enabling CULL_FACE on 02 canvas "+gl.at);
			} else {
				elem.value="  Enable CullFace ";
				gl[gl.at].disable(gl.CULL_FACE);
				//AL("disabling CULL_FACE on canvas "+gl.at);
			}
			drawScene02();
		});
	}
});