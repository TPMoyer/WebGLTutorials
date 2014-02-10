/*   © 2013 Thomas P Moyer  */ 

function webGLStart04() {
	//AL("cme@ webGLTutorial04.js webGLStart04");
	gl.at=gl.length-1;
	var canvas = document.getElementById("tutorial04-canvas0");
	initGL(canvas);
	gl.lower04At=gl.at;
	customizeGL02();
	initShaders02();
	
	gl.cube0Rotation = 0; /* rotation variable for the top cube                         */
	//gl.cube0Rotation =170; /* alternate start so that I can fiddle with the last move */
	gl.cube1Rotation = 0;  /* rotation variable for the other three seemingly cubes     */
	gl.cube0RPM = 2;       /* speed for top cube to spin                                */
	gl.cube1RPM = 6;       /* speed for other cubes to spin                             */
	gl.cube0Direction=1;   /* after a rotation, cube0 reverses spin direction           */
	gl.animationCount=0;   /* how many passes thru the animate function have occured    */
	gl.movementHalt=false; /* In the animate function, code can be uncommented to halt  */
						   /* some animateCount calls to drawScene04.                   */
	gl.lastTime04 = 0;     /* time rememberer so motions appear smooth                  */
	gl.slowDown =50;       /* used to slow the avalanche of logger writes from drawScene*/
	gl[gl.lower04At].alternatePosition=false; /* toggle between two viewpoints for left canvas */
	
	initBuffers04();	
	drawScene04();
	
	var elem = document.getElementById("xyzpry0");
	if(null!=elem)elem.innerHTML=xyzpryPrint();
	
	gl.at=gl.length-1;
	canvas = document.getElementById("tutorial04-canvas1");
	initGL(canvas);
	gl.upper04At=gl.at;
	customizeGL02();
	initShaders02();
	initBuffers04();
	drawScene04();
	
	var elem = document.getElementById("xyzpry1");
	if(null!=elem)elem.innerHTML=xyzpryPrint();
	
	tick04();
}

function initBuffers04() {
	//AL("cme@ initBuffers04");
	
	/* this is the T shape triangle strip, which we animate folding into a cube and back to an T. */
	xyzrgbas=[
  /*X  Y  Z  R B B A  index */
	0, 0, 1, 1,0,0,1,/*  0                                                                                        1st point of 1st triangle on East        */
	0, 0, 0, 0,1,0,1,/*  1                                              2nd point in 1st triangle on East         1st point of 2nd triangle on East        */
	1, 0, 1, 0,0,1,1,/*  2 3nd point in 1st triangle on East            2nd point in 2nd trianble on East         1st point of 1st triangle on North       */
	1, 0, 0, 1,0,0,1,/*  3 3rd point in 2nd triangle on East            2nd point in 1st triangle on North        1st point in 2nd triangle on North       */
	2, 0, 1, 0,1,0,1,/*  4 3rd point in 1st triangle on North           2nd point in 2nd triangle on North        1st point in 1st triangle on West        */
	2, 0, 0, 0,0,1,1,/*  5 3rd point in 2nd triangle on North           2nd point in 1st triangle on West         1st point in 2nd triangle on West        */
	3, 0, 1, 1,0,0,1,/*  6 3rd point in 1st triangle on West            2nd point in 2nd triangle on West         1st point in 1st triangle on South       */
	3, 0, 0, 0,1,0,1,/*  7 3rd point in 2nd triangle on West            2nd point in 1st triangle on South        1st point in 2nd triangle on South       */
	4, 0, 1, 0,0,1,1,/*  8 3rd point in 1st triangle on South           2nd point in 2nd triangle on South        1st point in zero area triangle  8, 9,10 */
	4, 0, 0, 1,0,0,1,/*  9 3rd point in 2nd triangle on South           2nd point in zero area triangle  8, 9,10  1st point in zero area triangle  9,10,11 */
	4, 0, 0, 0,0,1,1,/* 10 copy of 9 XYZ: a double point                2nd point in zero area triangle  9,10,11  1st point in 1st triangle on bottom      */
	3, 0, 0, 1,0,0,1,/* 11 3rd point of zero area triangle              2nd point in 1st triangle on bottom       1st point in 2nd triangle on bottom      */
	4, 0,-1, 0,1,0,1,/* 12 3rd point on 1st triangle on bottom          2nd point in 2nd triangle on Top          1st point in zero area triangle 12,13,14 */
	3, 0,-1, 0,0,1,1,/* 13 3rd point on 2nd triangle on bottom          2nd point in zero area triangle 13,14,15  1st point in zero area triangle 13,14,15 */
	3, 0,-1, 0,0,1,1,/* 14 copy of 13 XYZ: our first double point: go invisible                                   1st point in zero area triangle 14,15,16 */
	4, 0, 1, 0,0,1,1,/* 15 3rd point zero area triangle 13,14,15                                                  1nd point in zero area triangle 15,16,17 */
	4, 0, 1, 0,0,1,1,/* 16 copy of 15 XYZ, this is the second double point: go visible                            1nd point of 1st triangle on top         */
	4, 0, 2, 1,0,0,1,/* 17 3rd point in zero area triangle 15,16,17     2nd point in 1st triangle on top          1rd point on 2nd triangle on top         */
	3, 0, 1, 0,1,0,1,/* 18 3rd point in 1st triangle on top             2nd point in 2nd triangle on top                                                   */
	3, 0, 2, 0,0,1,1,/* 19 3rd point to 2nd triangle on top                                                                                                */
	];
	gl[gl.at].strip0XYZRGBAs = gl[gl.at].createBuffer();
	gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].strip0XYZRGBAs);
	gl[gl.at].bufferData(gl.ARRAY_BUFFER, new Float32Array(xyzrgbas), gl.STATIC_DRAW);
	gl[gl.at].strip0Length=xyzrgbas.length/7;
	//AL("strip0Length="+gl[gl.at].strip0Length);
	
	/* this is a triangle strip folded into the cube at the top which does not use the tricks shown in the block above */
	xyzrgbas=[
	 1,-1, 1,  1,0,0,1, /*  0                                                                                        1st point of 1st triangle on East        */
	 1,-1,-1,  0,1,0,1, /*  1                                            2nd point in 1st triangle on East           1st point of 2nd triangle on East        */
	 1, 1, 1,  0,0,1,1, /*  2 3rd point in 1st triangle on East           2nd point in 2nd triangle on East          1st point of 1st triangle on North       */
	 1, 1,-1,  1,0,0,1, /*  3 3rd point in 2nd triangle on East           2nd point in 1st triangle on North         1st point in 2nd triangle on North       */
	-1, 1, 1,  0,1,0,1, /*  4 3rd point in 1st triangle on North          2nd point in 2nd triangle on North         1st point in 1st triangle on West        */
	-1, 1,-1,  0,0,1,1, /*  5 3rd point in 2nd triangle on North          2nd point in 1st triangle on West          1st point in 2nd triangle on West        */
	-1,-1, 1,  1,0,0,1, /*  6 3rd point in 1st triangle on West           2nd point in 2nd triangle on West          1st point in 1st triangle on South       */
	-1,-1,-1,  0,1,0,1, /*  7 3rd point in 2nd triangle on West           2nd point in 1st triangle on South         1st point in 2nd triangle on South       */
	 1,-1, 1,  0,0,1,1, /*  8 3rd point in 1st triangle on South          2nd point in 2nd triangle on South         1st point in triangle back2  Top           waste */
	 1,-1,-1,  1,0,0,1, /*  9 3rd point in 2nd triangle on South          2nd point in triangle back2  Top           1st point of zero area triangle South&Top  waste */
	-1,-1, 1,  0,1,0,1, /* 10 3rd point in triangle back2  Top            3rd point of zero area triangle South&Top  1st point in 1st triangle on Top         */
	 1,-1, 1,  0,0,1,1, /* 11 3rd point of zero area triangle South&Top   2nd point in 1st triangle on Top           1st point in 2nd triangle on Top         */
	-1, 1, 1,  1,0,0,1, /* 12 3rd point on 1st triangle on Top            2nd point in 2nd triangle on Top           1st point in 1st triangle 2get2 Bottom   */
	 1, 1, 1,  0,1,0,1, /* 13 3rd point on 2nd triangle on Top            2nd point of 1st triangle 2get2 Bottom     1st point in 2nd triangle 2get2 Bottom   */
	-1, 1,-1,  0,0,1,1, /* 14 3rd point on 1st triangle 2get2 Bottom      2nd point on 2nd triangle 2get2 Bottom     1nd point of 1st triangle on Bottom      */
	 1, 1,-1,  1,0,0,1, /* 15 3rd point on 2nd triangle 2get2 Bottom      2nd point on 1st triangle on Bottom        1rd point on 2nd triangle on Bottom      */
	-1,-1,-1,  0,1,0,1, /* 16 3rd point on 1st triangle on Bottom         2nd point on 2nd triangle on Bottom                                                 */
	 1,-1,-1,  0,0,1,1  /* 17 3rd point to 1st triangle on Bottom                                                                                             */
	];
	gl[gl.at].strip1XYZRGBAs = gl[gl.at].createBuffer();
	gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].strip1XYZRGBAs);
	gl[gl.at].bufferData(gl.ARRAY_BUFFER, new Float32Array(xyzrgbas), gl.STATIC_DRAW);
	gl[gl.at].strip1Length=xyzrgbas.length/7;
	//AL("strip1Length="+gl[gl.at].strip1Length);
	
	/* interested in covering a big area with an array of triangles?
	 *  A single triangle strip will do the job if you know how to fold it back along the next row.
	 *  to serpentine over the surface.
	 */
	xyzrgbas=[
	0.0, 0.0, 1.0,  1,0,0,1, /*  0  moveing west to east, between Z=1 and Z=0                    */
	0.0, 0.0, 0.0,  0,1,0,1, /*  1                                                               */
	1.0, 0.0, 1.0,  0,0,1,1, /*  2                                                               */
	1.0, 0.0, 0.0,  1,0,0,1, /*  3                                                               */
	2.0, 0.0, 1.0,  0,1,0,1, /*  4                                                               */
	2.0, 0.0, 0.0,  0,0,1,1, /*  5                                                               */
	3.0, 0.0, 1.0,  1,0,0,1, /*  6                                                               */
	3.0, 0.0, 0.0,  0,1,0,1, /*  7  about to make the turn                                       */
	2.9, 0.1, 1.0,  0,0,1,1, /*  8  3,0,1 would be the real case, of making a zero area triangle.*/
	3.0, 0.0, 2.0,  1,0,0,1, /*  9   now moving East to West,  between Z=2 and Z=1               */
	3.0, 0.0, 1.0,  0,1,0,1, /* 10                                                               */
	2.0, 0.0, 2.0,  0,0,1,1, /* 11                                                               */
	2.0, 0.0, 1.0,  1,0,0,1, /* 12                                                               */
	1.0, 0.0, 2.0,  0,1,0,1, /* 13                                                               */
	1.0, 0.0, 1.0,  0,0,1,1, /* 14                                                               */
	0.0, 0.0, 2.0,  1,0,0,1, /* 15                                                               */
	0.0, 0.0, 1.0,  0,1,0,1  /* 16                                                               */
	];
	gl[gl.at].strip2XYZRGBAs = gl[gl.at].createBuffer();
	gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].strip2XYZRGBAs);
	gl[gl.at].bufferData(gl.ARRAY_BUFFER, new Float32Array(xyzrgbas), gl.STATIC_DRAW);
	gl[gl.at].strip2Length=xyzrgbas.length/7;
	//AL("strip2Length="+gl[gl.at].strip2Length);
	
	xyzrgbas=[
	 1,-1, 1,  1.0, 0.0, 0.0, 1,  /*  0   point 0   color East    Red     */
	 1,-1, 1,  0.0, 1.0, 0.0, 1,  /*  1   point 0   color South   Green   */
	 1,-1, 1,  0.0, 0.0, 1.0, 1,  /*  2   point 0   color Top     Blue    */
	
	 1,-1,-1,  1.0, 0.0, 0.0, 1,  /*  3   point 1   color East    Red     */
	 1,-1,-1,  0.0, 1.0, 0.0, 1,  /*  4   point 1   color South   Green   */
	 1,-1,-1,  0.0, 1.0, 1.0, 1,  /*  5   point 1   color Bottom  Cyan    */
	
	 1, 1, 1,  1.0, 0.0, 0.0, 1,  /*  6   point 2   color East    Red     */
	 1, 1, 1,  1.0, 0.0, 1.0, 1,  /*  7   point 2   color North   Magenta */
	 1, 1, 1,  0.0, 0.0, 1.0, 1,  /*  8   point 2   color Top     Blue    */
	
	 1, 1,-1,  1.0, 0.0, 0.0, 1,  /*  9   point 3   color East    Red     */
	 1, 1,-1,  1.0, 0.0, 1.0, 1,  /* 10   point 3   color North   Magenta */
	 1, 1,-1,  0.0, 1.0, 1.0, 1,  /* 11   point 3   color Bottom  Cyan    */
	
	-1, 1, 1,  1.0, 0.0, 1.0, 1,  /* 12   point 4   color North  Magenta  */
	-1, 1, 1,  1.0, 1.0, 0.0, 1,  /* 13   point 4   color West   Yellow   */
	-1, 1, 1,  0.0, 0.0, 1.0, 1,  /* 14   point 4   color Top    Blue     */
	
	-1, 1,-1,  1.0, 0.0, 1.0, 1,  /* 15   point 5   color North   Magenta */
	-1, 1,-1,  1.0, 1.0, 0.0, 1,  /* 16   point 5   color West    Yellow  */
	-1, 1,-1,  0.0, 1.0, 1.0, 1,  /* 17   point 5   color Bottom  Cyan    */
	
	-1,-1, 1,  1.0, 1.0, 0.0, 1,  /* 18   point 6   color West    Yellow  */
	-1,-1, 1,  0.0, 1.0, 0.0, 1,  /* 19   point 6   color South   Green   */
	-1,-1, 1,  0.0, 0.0, 1.0, 1,  /* 20   point 6   color Top     Blue    */
	
	-1,-1,-1,  1.0, 1.0, 0.0, 1,  /* 21   point 7   color West    Yellow  */
	-1,-1,-1,  0.0, 1.0, 0.0, 1,  /* 22   point 7   color South   Green   */
	-1,-1,-1,  0.0, 1.0, 1.0, 1   /* 23   point 7   color Bottom  Cyan    */
	];
	gl[gl.at].tri0XYZRGBAs = gl[gl.at].createBuffer();
	gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].tri0XYZRGBAs);
	gl[gl.at].bufferData(gl.ARRAY_BUFFER, new Float32Array(xyzrgbas), gl.STATIC_DRAW);
	gl[gl.at].tri0Length=xyzrgbas.length/7;
	//AL("tri0Length="+gl[gl.at].tri0Length);
	
	xyzrgbas=[
	 1,-1, 1,  0.5, 0.5, 1.0, 1.0,  /*  0   point 0   calm blue East   */
	 1,-1, 1,  0.5, 0.5, 1.0, 1.0,  /*  1   point 0   calm blue South  */
	 1,-1, 1,  0.5, 0.5, 1.0, 1.0,  /*  2   point 0   calm blue Top    */
	
	 1,-1,-1,  0.5, 0.5, 1.0, 1.0,  /*  3   point 1   calm blue East   */
	 1,-1,-1,  0.5, 0.5, 1.0, 1.0,  /*  4   point 1   calm blue South  */
	 1,-1,-1,  0.5, 0.5, 1.0, 1.0,  /*  5   point 1   calm blue Bottom */
	
	 1, 1, 1,  0.5, 0.5, 1.0, 1.0,  /*  6   point 2   calm blue East   */
	 1, 1, 1,  0.5, 0.5, 1.0, 1.0,  /*  7   point 2   calm blue North  */
	 1, 1, 1,  0.5, 0.5, 1.0, 1.0,  /*  8   point 2   calm blue Top    */
	
	 1, 1,-1,  0.5, 0.5, 1.0, 1.0,  /*  9   point 3   calm blue East   */
	 1, 1,-1,  0.5, 0.5, 1.0, 1.0,  /* 10   point 3   calm blue North  */
	 1, 1,-1,  0.5, 0.5, 1.0, 1.0,  /* 11   point 3   calm blue Bottom */
	
	-1, 1, 1,  0.5, 0.5, 1.0, 1.0,  /* 12   point 4   calm blue North  */
	-1, 1, 1,  0.5, 0.5, 1.0, 1.0,  /* 13   point 4   calm blue West   */
	-1, 1, 1,  0.5, 0.5, 1.0, 1.0,  /* 14   point 4   calm blue Top    */
	
	-1, 1,-1,  0.5, 0.5, 1.0, 1.0,  /* 15   point 5   calm blue North  */
	-1, 1,-1,  0.5, 0.5, 1.0, 1.0,  /* 16   point 5   calm blue West   */
	-1, 1,-1,  0.5, 0.5, 1.0, 1.0,  /* 17   point 5   calm blue Bottom */
	
	-1,-1, 1,  0.5, 0.5, 1.0, 1.0,  /* 18   point 6   calm blue West   */
	-1,-1, 1,  0.5, 0.5, 1.0, 1.0,  /* 19   point 6   calm blue South  */
	-1,-1, 1,  0.5, 0.5, 1.0, 1.0,  /* 20   point 6   calm blue Top    */
	
	-1,-1,-1,  0.5, 0.5, 1.0, 1.0,  /* 21   point 7   calm blue West   */
	-1,-1,-1,  0.5, 0.5, 1.0, 1.0,  /* 22   point 7   calm blue South  */
	-1,-1,-1,  0.5, 0.5, 1.0, 1.0,  /* 23   point 7   calm blue Bottom */
	];
	gl[gl.at].tri1XYZRGBAs = gl[gl.at].createBuffer();
	gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].tri1XYZRGBAs);
	gl[gl.at].bufferData(gl.ARRAY_BUFFER, new Float32Array(xyzrgbas), gl.STATIC_DRAW);
	gl[gl.at].tri1Length=xyzrgbas.length/7;
	//AL("tri1Length="+gl[gl.at].tri1Length);
	
	var indices = [
	 0,  3,  6,    6,  3,  9,  //  0 thru  5  East    Red
	 7, 10, 12,   12, 10, 15,  //  6 thru 11  North   Magenta
	13, 16, 18,   18, 16, 21,  // 12 thru 17  West    Yellow
	19, 22,  1,    1, 22,  4,  // 18 thru 23  South   Green
	20,  2, 14,   14,  2,  8,  // 24 thru 29  Top	  Blue
	17, 11,  5,   17,  5, 23   // 30 thru 35  Bottom  Cyan
	];
	gl[gl.at].tri0indices = gl[gl.at].createBuffer();
	gl[gl.at].bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl[gl.at].tri0indices);
	gl[gl.at].bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	gl[gl.at].tri0IndicesLength=indices.length;
	//AL("tri0IndicesLength="+gl[gl.at].tri0IndicesLength);
	//	for(var ii=0;ii<gl[gl.at].tri0IndexLength;ii++){
	//		AL("indices["+ii+"]="+indices[ii]);
	//	}
	
	var indices1 = [
	19, 22,  1,    1, 22,  4,  //   0 thru  5    1st          South   Green
	 0,  3,  6,    6,  3,  9,  //   6 thru 11    1st          East    Red	
	17, 11,  5,   17,  5, 23,  //  12 thru 17    1st 2nd      Bottom  Cyan
	 7, 10, 12,   12, 10, 15,  //  18 thru 23        2nd      North   Magenta	
	13, 16, 18,   18, 16, 21,  //  24 thru 29        2nd 3rd  West    Yellow
	19, 22,  1,    1, 22,  4,  //  30 thru 35            3rd  South   Green
	20,  2, 14,   14,  2,  8,  //  36 thru 41            3rd  Top	  Blue
	];
	gl[gl.at].tri1indices = gl[gl.at].createBuffer();
	gl[gl.at].bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl[gl.at].tri1indices);
	gl[gl.at].bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices1), gl.STATIC_DRAW);
	gl[gl.at].tri1IndicesLength=indices1.length;
	//AL("tri1indices1Length="+gl[gl.at].tri1indices1Length);
	//	for(var ii=0;ii<gl[gl.at].tri1IndexLength;ii++){
	//		AL("indices1["+ii+"]="+indices1[ii]);
	//	}
}

function drawScene04() {
	//AL(sprintf("cme@ drawScene04(gl.at=%d) gl.animationCount=%4d gl.cube0Rotation=%7.3f gl.cube1Rotation=%7.3f",gl.at,animationCount,gl.cube0Rotation,gl.cube1Rotation));
	
	gl[gl.at].viewport(0, 0, gl[gl.at].viewportWidth, gl[gl.at].viewportHeight);
	gl[gl.at].clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	mat4.perspective(30, gl[gl.at].viewportWidth / gl[gl.at].viewportHeight, 0.1, 100.0, gl[gl.at].perspectiveMatrix);
	//documentMvmXyzpry();
	
	switch (gl.at%2){
	case 0:
		if(false==gl[gl.at].alternatePosition){
			xyzprySetInDegrees(   0, -20,   0,  0,  0, 90);   /* 12 units South, flat and level (roof is up),  facing North */
		} else {
			xyzprySetInDegrees(  16, -13,   7.5, -20,  0,140);
		}
		//xyzpryLogView();
	break;
	case 1:
		xyzprySetInDegrees(   0,  20,   0,  0,  0,270);    /* 12 units North, flat and level (roof is up), facing South */
		//xyzpryLogView();
	break;
	default:
		alert("drawScene04 attempted to use a non existant context "+gl.at);
	}
	
	glPushMatrix(); /* the unmoving T shaped triangle Strip   upper left*/
		gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].strip0XYZRGBAs);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ , 3, gl.FLOAT, false,28, 0);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paRGBA, 4, gl.FLOAT, false,28,12);
		mat4.translate(gl[gl.at].mvm, [-4.0, 0.0, 0.7 ]);	
		setMatrixUniforms04();
		gl[gl.at].drawArrays(gl.TRIANGLE_STRIP, 0, gl[gl.at].strip0Length);
	glPopMatrix();
	
	glPushMatrix(); /* the rectangular area cover... a strip which serpentines to cover an area */
		mat4.translate(gl[gl.at].mvm, [ -5.0, 0.0, 2.2 ]);	
		gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].strip2XYZRGBAs);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ , 3, gl.FLOAT, false,28, 0);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paRGBA, 4, gl.FLOAT, false,28,12);
		setMatrixUniforms04();
		gl[gl.at].drawArrays(gl.TRIANGLE_STRIP, 0, gl[gl.at].strip2Length);
	glPopMatrix();	
	
	glPushMatrix(); /* T shaped triangle Strip  on right   folds into cube*/
		gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].strip0XYZRGBAs);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ , 3, gl.FLOAT, false,28, 0);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paRGBA, 4, gl.FLOAT, false,28,12);
		//mat4.translate(gl[gl.at].mvm, [  .5, 0.0, 0.7 ]);
		mat4.translate(gl[gl.at].mvm, [  0.75, 0.0, 0.7 ]);
		foldit();
	glPopMatrix();
	
	glPushMatrix(); /* upper rotating cube made from triangle strip */
		mat4.translate(gl[gl.at].mvm, [ 2.0, 0.0, 3.5 ]);	
		gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].strip1XYZRGBAs);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ , 3, gl.FLOAT, false,28, 0);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paRGBA, 4, gl.FLOAT, false,28,12);
		mat4.rotate(gl[gl.at].mvm, deg2Rad*gl.cube0Rotation, [ 1, 1, 1 ]);
		//if(0==gl.at)AL(sprintf("gl.animationCount=%4d cube0Rotation=%9.3f",gl.animationCount,cube0Rotation));
		setMatrixUniforms04();
		gl[gl.at].drawArrays(gl.TRIANGLE_STRIP, 0, gl[gl.at].strip1Length);
	glPopMatrix();
	
	glPushMatrix(); /* spinning 1 color per face cube */
		mat4.translate(gl[gl.at].mvm, [ -2.5, 0.0, -1.2 ]);
		gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].tri0XYZRGBAs);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ , 3, gl.FLOAT, false,28, 0);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paRGBA, 4, gl.FLOAT, false,28,12);
		gl[gl.at].bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl[gl.at].tri0indices);
		mat4.rotate(gl[gl.at].mvm, deg2Rad*gl.cube1Rotation, [ 1, 1, 1 ]);
		setMatrixUniforms04();
		gl[gl.at].drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
	glPopMatrix();
	
	glPushMatrix(); /* spinning cube all one color */
		mat4.translate(gl[gl.at].mvm, [  0.0, 0.0, -3.5]);
		gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].tri1XYZRGBAs);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ , 3, gl.FLOAT, false,28, 0);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paRGBA, 4, gl.FLOAT, false,28,12);
		mat4.rotate(gl[gl.at].mvm, deg2Rad*gl.cube1Rotation, [ 1, 1, 1 ]);
		setMatrixUniforms04();
		gl[gl.at].drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
	glPopMatrix();
	
	glPushMatrix(); /* spinning 1 color per face seems-to-be-a cube */
		mat4.translate(gl[gl.at].mvm, [  2.5, 0.0, -1.2 ]);
		gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].tri0XYZRGBAs);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paRGBA, 4, gl.FLOAT, false,28,12);
		gl[gl.at].bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl[gl.at].tri1indices);
		mat4.rotate(gl[gl.at].mvm, deg2Rad*gl.cube1Rotation, [ 1, 1, 1 ]);
		setMatrixUniforms04();
		if(  (-130<gl.cube1Rotation)
		   &&(  -8>gl.cube1Rotation)
		  ){
			gl[gl.at].drawElements(gl.TRIANGLES, 18, gl.UNSIGNED_SHORT,  0);
			//if(0==gl.at)AL(sprintf("0 gl.gl.cube1Rotation=%9.3f",gl.cube1Rotation));
		} else
		if(  (-250<gl.cube1Rotation)
		   &&(  -8>gl.cube1Rotation)
		  ){
			gl[gl.at].drawElements(gl.TRIANGLES, 18, gl.UNSIGNED_SHORT, 24);
			//if(0==gl.at)AL(sprintf("1 gl.cube1Rotation=%9.3f",gl.cube1Rotation));
		} else {
			gl[gl.at].drawElements(gl.TRIANGLES, 18, gl.UNSIGNED_SHORT, 48);
			//if(0==gl.at)AL(sprintf("2 gl.cube1Rotation=%9.3f",gl.cube1Rotation));
		}
	glPopMatrix();
}

function foldit(){
	setMatrixUniforms04();
	gl[gl.at].drawArrays(gl.TRIANGLE_STRIP, 6, 4); /* south */
	//if(0==gl.animationCount%gl.slowDown)AL(sprintf("gl.cube0Rotation=%6.1f",gl.cube0Rotation));
	
	glPushMatrix();
		mat4.rotate(gl[gl.at].mvm, deg2Rad*(90<gl.cube0Rotation?90:gl.cube0Rotation), [ 1, 0, 0 ]);
		setMatrixUniforms04();
		gl[gl.at].drawArrays(gl.TRIANGLE_STRIP,10, 4); /* down */
	glPopMatrix();	
	
	
	glPushMatrix();		
		mat4.translate(gl[gl.at].mvm, [ 0.0, 0.0,1.0 ]);
		if(90<gl.cube0Rotation){
			mat4.rotate(gl[gl.at].mvm, deg2Rad*(180<gl.cube0Rotation?-90:-1*(gl.cube0Rotation-90)), [ 1, 0, 0 ]);
			//if(0==gl.animationCount%gl.slowDown)AL("inside Top Rotation");
		}
		mat4.translate(gl[gl.at].mvm, [ 0.0, 0.0,-1.0 ]);
		setMatrixUniforms04();
		gl[gl.at].drawArrays(gl.TRIANGLE_STRIP,16, 4); /* up */
	glPopMatrix();
	
	
	mat4.translate(gl[gl.at].mvm, [ 3.0, 0.0, 0.0 ]);
	if(180<gl.cube0Rotation){
		mat4.rotate(gl[gl.at].mvm, deg2Rad*-1.*(gl.cube0Rotation-180), [ 0, 0, 1 ]);
		//if(0==gl.animationCount%gl.slowDown)AL("inside Side Rotation0");
	}
	mat4.translate(gl[gl.at].mvm, [-3.0, 0.0, 0.0 ]);
	setMatrixUniforms04();
	gl[gl.at].drawArrays(gl.TRIANGLE_STRIP, 4, 4); /* west */
	
	
	mat4.translate(gl[gl.at].mvm, [ 2.0, 0.0, 0.0 ]);
	if(180<gl.cube0Rotation){
		mat4.rotate(gl[gl.at].mvm, deg2Rad*-1.*(gl.cube0Rotation-180), [ 0, 0, 1 ]);
		//if(0==gl.animationCount%gl.slowDown)AL("inside Side Rotation1");
	}
	mat4.translate(gl[gl.at].mvm, [-2.0, 0.0, 0.0 ]);
	setMatrixUniforms04();
	gl[gl.at].drawArrays(gl.TRIANGLE_STRIP, 2, 4); /* north */
	
	
	mat4.translate(gl[gl.at].mvm, [ 1.0, 0.0, 0.0 ]);
	if(180<gl.cube0Rotation){
		mat4.rotate(gl[gl.at].mvm, deg2Rad*-1.*(gl.cube0Rotation-180), [ 0, 0, 1 ]);
		//if(0==gl.animationCount%gl.slowDown)AL("inside Side Rotation2");
	}
	mat4.translate(gl[gl.at].mvm, [-1.0, 0.0, 0.0 ]);
	setMatrixUniforms04();
	gl[gl.at].drawArrays(gl.TRIANGLE_STRIP, 0, 4); /* east */
}

function setMatrixUniforms04() {
	gl[gl.at].uniformMatrix4fv(gl[gl.at].puPerspectiveMatrix, false, gl[gl.at].perspectiveMatrix);
	gl[gl.at].uniformMatrix4fv(gl[gl.at].puMvm, false, gl[gl.at].mvm);
}

function tick04() {
	//AL("cme@ tick04 with gl.length="+gl.length);
	
	//movetripout=false;
	if(  (false==gl.movementHalt)
	// ||(60>gl.animationCount++)
	  ){
		requestAnimFrame(tick04);
	}
	gl.at=(6<gl.length)?6:0;
	drawScene04();
	gl.at=(6<gl.length)?7:1;
	drawScene04();

	animate04();
}

function animate04() {
	//AL("cme@ animate03");
	var timeNow = new Date().getTime();
	if (gl.lastTime04 != 0) {
		var elapsed = timeNow - gl.lastTime04;
		gl.cube0Rotation  += gl.cube0Direction * gl.cube0RPM * elapsed *.006;
		//AL(sprintf("gl.cube0Rotation=%10.3f rotate=%10.3f elapsed",gl.cube0Rotation,rotate));
		gl.cube1Rotation -=  gl.cube1RPM * elapsed *.006;
		if(gl.cube1Rotation<=-360.)gl.cube1Rotation+=360.;
		//AL(sprintf("gl.animationCount=%4d gl.cube1Count=%5d gl.cube0Rotation=%9.3f gl.cube1Rotation=%9.3f",gl.animationCount,gl.cube1Count,gl.cube0Rotation,gl.cube1Rotation));
		
		/* this was used to see which angles showed the overlap problem with the loarish cube were the crossover points for the seems-to-be-a cube */
		//if(  (gl.cube1Rotation<-.932)
		//   &&(gl.animationCount>111)		
		// ){
		//	gl.movementHalt=true;
		//}	
		
		/* this was used to see which angles were the crossover points for the seems-to-be-a cube */
		//if(  (gl.cube1Rotation<-14.0)
		//   &&(gl.cube1Count>111)		
		// ){
		//	gl.movementHalt=true;
		//}	
		gl.animationCount++;
	}
	if(/**/(gl.cube0Rotation < 0.)
	   //(170>gl.cube0Rotation)
	   ||(270<gl.cube0Rotation)
	  ){
		gl.cube0Direction*=-1;
	}	
	//AL(sprintf("%7.3f",gl.cube0Rotation));
	gl.lastTime04 = timeNow;
}
function AL(message){
	$.ajax({type:"POST",url:"WebGLTutorials",data:"2log="+message});
}
$(document).ready(function(){
	//AL("in ready 04");
	if(-1<document.getElementById("title").innerHTML.indexOf("tutorial04")){
		//AL("inside ready 04");
		$("input[id^=cullFace]").click(function (event) {
			//AL("inside04 button[id="+this.id+"]");
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
			drawScene04();
		});
		$("input[id=swapPositions]").click(function (event) {
			//AL("button "+this.id +" incomming gl[gl.lower04At].aleternatePosition="+(gl[gl.lower04At].aleternatePosition?"TRUE":"FALSE"));
			if(false==gl[gl.lower04At].alternatePosition){
				this.value="Goto South Looking North";
				gl[gl.lower04At].alternatePosition=true;
			} else{
				this.value="GoTo SouthEastUp looking NorthWestDownALittle";
				gl[gl.lower04At].alternatePosition=false;
			}
		});
	}
});
