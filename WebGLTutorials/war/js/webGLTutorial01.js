/*   © 2013 Thomas P Moyer  */ 

function webGLStart01() {
	//AL("cme@ webGLTutorial01.js webGLStart");
	var canvas = document.getElementById("tutorial01-canvas0");
	initGL(canvas);
	//AL("post initGL");
	customizeGL01();
	//AL("post customizeShaders");
	initShaders01();
	//AL("post initShaders");
	initBuffers01();
	//AL("post initBuffers");
	drawScene01();
	//AL("post initDrawscene the first");
	var elem = document.getElementById("xyzpry0");
	if(null!=elem)elem.innerHTML=xyzpryPrint();
	
	canvas = document.getElementById("tutorial01-canvas1");
	initGL(canvas);
	customizeGL01();
	initShaders01();	
	initBuffers01();
	drawScene01();
	var elem = document.getElementById("xyzpry1");
	if(null!=elem)elem.innerHTML=xyzpryPrint();
}

function customizeGL01() {
	//AL("customizeGL01");
	gl[gl.at].clearColor(0.0, 0.0, 0.0, 1.0);
	gl[gl.at].enable   (gl.DEPTH_TEST);
	gl[gl.at].frontFace(gl.CCW);
	gl[gl.at].cullFace (gl.BACK);
	if(null != document.getElementById('setCullFace')){
		gl[gl.at].enable(gl.CULL_FACE);
		document.getElementById(sprintf("%s%d",'cullFace',gl.at)).value=" Disable CullFace ";
	}
}

function initShaders01() {
	//AL("cme@ initShaders01");	
	var   vertexShader = getShader(  "vertex-shader0");
	var fragmentShader = getShader("fragment-shader0");
	//AL("post getShaders");
	
	gl[gl.at].shaderProgram = gl[gl.at].createProgram();
	gl[gl.at].attachShader(gl[gl.at].shaderProgram,   vertexShader);
	gl[gl.at].attachShader(gl[gl.at].shaderProgram, fragmentShader);
	gl[gl.at].linkProgram (gl[gl.at].shaderProgram);
	if (!gl[gl.at].getProgramParameter(gl[gl.at].shaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}
	gl[gl.at].useProgram(gl[gl.at].shaderProgram);
	
	gl[gl.at].puMvm               = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uMvm"              );
	gl[gl.at].puPerspectiveMatrix = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uPerspectiveMatrix");
	gl[gl.at].paXYZ               = gl[gl.at].getAttribLocation (gl[gl.at].shaderProgram, "aXYZ"              );
	gl[gl.at].enableVertexAttribArray(gl[gl.at].paXYZ);
}

function initBuffers01() {
	var xyzs = [ 0.0, 0.0, 0.0, //  first line start
	             0.0, 0.0, 2.0, //  first line end
	             0.2, 0.0, 0.0, //  second line start   (and point)
	             0.2, 0.0, 2.0  //  second line end
	           ];
	gl[gl.at].linesXYZs = gl[gl.at].createBuffer();
	gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].linesXYZs);
	gl[gl.at].bufferData(gl.ARRAY_BUFFER, new Float32Array(xyzs), gl.STATIC_DRAW);
	
	/*                          lines              lines               triangles                    */
	xyzs = [ 0.0, 0.0, 1.0, /*  first line start                       first triangle first  vertex */ 
	        -1.0, 0.0,-1.0, /*  first line end    second line start    first triangle second vertex */
	         1.0, 0.0,-1.0, /*  second line end   third  line start    first triangle end           */
	         0.0, 0.0, 1.0  /*  third line  end   fourth line start    second triangle first vertex */
            ];
	gl[gl.at].triangleXYZs = gl[gl.at].createBuffer();
	gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].triangleXYZs);
	gl[gl.at].bufferData(gl.ARRAY_BUFFER, new Float32Array(xyzs), gl.STATIC_DRAW);
	
	/*             triangle strip   first triangle                            second triangle */
	xyzs = [-1.0, 0.0, 1.0,  /*  starts here                                               */
	         1.0, 0.0, 1.0,  /*  second point                             first point      */
	        -1.0, 0.0,-1.0,  /*  done! note: is ClockWize from South      second point     */
	         1.0, 0.0,-1.0   /*								              done!  note: is CCW from South */
	       ];
	gl[gl.at].squareXYZs = gl[gl.at].createBuffer();
	gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].squareXYZs);
	gl[gl.at].bufferData(gl.ARRAY_BUFFER, new Float32Array(xyzs), gl.STATIC_DRAW);
	gl[gl.at].squareXYZs.numItems = xyzs.length/3;
}	

function drawScene01() {
	//AL("cmd@ drawScene01(gl.at="+gl.at+")");
	
	gl[gl.at].viewport(0, 0, gl[gl.at].viewportWidth, gl[gl.at].viewportHeight);
	gl[gl.at].clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	mat4.perspective(30, gl[gl.at].viewportWidth / gl[gl.at].viewportHeight, 0.1, 100.0, gl[gl.at].perspectiveMatrix);
	//documentMvmXyzpry();
	
	switch (gl.at){
	case 0:
		xyzprySetInDegrees(   0, -12,   0,  0,  0, 90);   /* 12 units South, flat and level (roof is up),  facing North */
		//xyzprySetInDegrees(   0, -32,   0,  0,  0, 90);  /* when I was iterating thru how to place the objects, it was useful to be a bit further back */
		//xyzpryLogView();
	break;
	case 1:
		xyzprySetInDegrees(   0,  12,   0,  0,  0,270);    /* 12 units North, flat and level (roof is up), facing South */
		//xyzpryLogView();
	break;
	default:
		alert("drawScene01 attempted to use a non existant context "+gl.at);
	}
	
	mat4.translate(gl[gl.at].mvm, [-2.5, 0.0, 1.5 ]);  /* shift to the West and Up in prep for drawing the point*/
	gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].linesXYZs);
	gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ, 3, gl.FLOAT, false, 0, 0);
	setMatrixUniforms01();
	gl[gl.at].drawArrays(gl.POINTS, 2, 1);
	
	mat4.translate(gl[gl.at].mvm, [0.9, 0.0,-1.0 ]);  /* shift to the East for drawing the two lines */
	//gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].linesXYZs);
	//gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ, 3, gl.FLOAT, false, 0, 0);
	setMatrixUniforms01();
	gl[gl.at].drawArrays(gl.LINES, 0, 4);
	
	mat4.translate(gl[gl.at].mvm, [3.1, 0.0, 1.0 ]);  /* shift further to the East and draw the three lines*/
	gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].triangleXYZs);
	gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ, 3, gl.FLOAT, false, 0, 0);
	setMatrixUniforms01();
	gl[gl.at].drawArrays(gl.LINE_STRIP, 0, 4); /* Line_strip with 4 or line_Loop with 3 both drarw the same */
	//gl[gl.at].drawArrays(gl.LINE_LOOP, 0, 3);
	
	mat4.translate(gl[gl.at].mvm, [-3.0, 0.0,-3.0 ]);  /* shift to the West and Down.  draw the triangle */
	//gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].triangleXYZs);
	//gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ, 3, gl.FLOAT, false, 0, 0);
	setMatrixUniforms01();
	gl[gl.at].drawArrays(gl.TRIANGLES, 0, 3);
	
	mat4.translate(gl[gl.at].mvm, [3.0, 0.0, 0.0 ]);	/* shift to the East. to draw the square */
	gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].squareXYZs);
	gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ, 3, gl.FLOAT, false, 0, 0);
	setMatrixUniforms01();
	gl[gl.at].drawArrays(gl.TRIANGLE_STRIP, 0, gl[gl.at].squareXYZs.numItems);
}

function setMatrixUniforms01() {
	gl[gl.at].uniformMatrix4fv(gl[gl.at].puPerspectiveMatrix, false, gl[gl.at].perspectiveMatrix);
	gl[gl.at].uniformMatrix4fv(gl[gl.at].puMvm, false, gl[gl.at].mvm);
}
function AL(message){
	/* Ajax Logging */
	$.ajax({type:"POST",url:"WebGLTutorials",data:"2log="+message});
}
$(document).ready(function(){
	if(-1<document.getElementById("title").innerHTML.indexOf("tutorial01")){
		//AL("inside ready 01");
		$("input[id^=cullFace]").click(function (event) {
			//AL("inside01 button[id="+this.id+"]");
			var elem = document.getElementById(this.id);
			//AL("looking at elem.value="+elem.value);
			gl.at=parseInt(this.id.charAt(this.id.length-1));
			//AL("whichCanvas="+gl.at);
			if(-1<elem.value.indexOf("Enable")){
				elem.value=" Disable CullFace ";
				gl[gl.at].enable(gl.CULL_FACE);
				//AL("enabling CULL_FACE on 01 canvas "+gl.at);
			} else {
				elem.value="  Enable CullFace ";
				gl[gl.at].disable(gl.CULL_FACE);
				//AL("disabling CULL_FACE on canvas "+gl.at);
			}
			drawScene01();
		});
	}
});
