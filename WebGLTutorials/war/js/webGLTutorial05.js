/*   © 2013 Thomas P Moyer  */ 
 
function webGLStart05() {
	//AL("cme@ webGLTutorial05.js webGLStart");
	window.resizeTo( 1100,700);
	var canvas = document.getElementById("tutorial05-canvas0");
	initGL(canvas);
	gl.lower05At=gl.at;
	canvas = document.getElementById("tutorial05-canvas1");
	initGL(canvas);
	gl.upper05At=gl.at;
	//AL("gl.lower05At="+gl.lower05At+" gl.upper05At="+gl.upper05At);
	
	if(0==gl.lower05At){
		var slider = selection = $( "#directionalLightXYZSlider").slider( "value" );
		var angle= Math.PI*(100-slider)/100.;
		gl[gl.lower05At].directionalLightXYZ = vec3.createFrom(Math.cos(angle),-.3,Math.sin(angle));//AL(vec3.printS3(gl[gl.lower05At].directionalLightXYZ)+" initial directionalLightXYZ");
		gl[gl.upper05At].directionalLightXYZ = vec3.createFrom(Math.cos(angle),-.3,Math.sin(angle));//AL(vec3.printS3(gl[gl.upper05At].directionalLightXYZ)+" initial directionalLightXYZ");
		
	} else {
		gl[gl.lower05At].directionalLightXYZ         = vec3.createFrom(0.0,0.0,1.0);
		gl[gl.upper05At].directionalLightXYZ         = vec3.createFrom(0.0,0.0,1.0);
		
	}
	
	gl.rotationDegrees05=0.;
	gl.animationCount05=0;
	gl.animationHalt05=false;
	gl.animationHaltAt05=-1; /* negative never stops (till rollover post 4 billion). */
	//gl.animationHaltAt05=20;
	gl.lastTime05 = 0;
	gl.sayOnce05=false;
	gl.talkon05=false;
	gl.talkon05=true;
	gl.RPM = 10.;
	gl.shininess05=5.;
	
	gl[gl.lower05At].lighting           = true;
	gl[gl.lower05At].directionalLight   = true;
	gl[gl.lower05At].pointLight         = false;
	gl[gl.lower05At].materials          = true;
	gl[gl.lower05At].specularHighlights = true;
	gl[gl.lower05At].negativeDiffuse    = true;
	gl[gl.lower05At].ambientLightRGB             = vec3.createFrom(0.2,0.2,0.2);
	gl[gl.lower05At].directionalLightSpecularRGB = vec3.createFrom(1.0,1.0,1.0);
	gl[gl.lower05At].directionalLightDiffuseRGB  = vec3.createFrom(1.0,1.0,1.0);
	gl[gl.lower05At].pointLightXYZ = vec3.createFrom(  0.0,  6.0,  1.0);                  //AL(vec3.printS3(gl[gl.lower05At].pointLightXYZ)      +" initial gl[gl.lower05At].pointLightXYZ");
	gl[gl.lower05At].pointLightSpriteXYZ = gl[gl.lower05At].createBuffer(); /* the buffer for the white emissive dot that flies around */
	gl[gl.lower05At].pointLightSpecularRGB       = vec3.createFrom(0.8,0.8,0.8);
	gl[gl.lower05At].pointLightDiffuseRGB        = vec3.createFrom(0.8,0.8,0.8);
	
	gl[gl.upper05At].lighting           = true;
	gl[gl.upper05At].directionalLight   = true;
	gl[gl.upper05At].pointLight         = false;
	gl[gl.upper05At].materials          = true;
	gl[gl.upper05At].specularHighlights = true;
	gl[gl.upper05At].negativeDiffuse    = true;
	gl[gl.upper05At].ambientLightRGB             = vec3.createFrom(0.2,0.2,0.2);
	gl[gl.upper05At].directionalLightSpecularRGB = vec3.createFrom(1.0,1.0,1.0);
	gl[gl.upper05At].directionalLightDiffuseRGB  = vec3.createFrom(1.0,1.0,1.0);
	gl[gl.upper05At].pointLightXYZ = vec3.createFrom(  0.0,  6.0,  1.0);                  //AL(vec3.printS3(gl[gl.lower05At].pointLightXYZ)      +" initial gl[gl.lower05At].pointLightXYZ");
	gl[gl.upper05At].pointLightSpriteXYZ = gl[gl.upper05At].createBuffer(); /* the buffer for the white emissive dot that flies around */
	gl[gl.upper05At].pointLightSpecularRGB       = vec3.createFrom(0.8,0.8,0.8);
	gl[gl.upper05At].pointLightDiffuseRGB        = vec3.createFrom(0.8,0.8,0.8);
	
	gl[gl.lower05At].numCriticalJsons2BDone=1;
	gl[gl.upper05At].numCriticalJsons2BDone=1;
	//loadTeapot(false);
	//checkoutTeapotJsons(false);
	loadFacetedSphere05(true); /* true === isLastJson*/	
	
	gl.at=gl.lower05At;
	initShaders05();
	customizeGL05(); /* uniforms are set in this, so must come after initShaders */
	
	gl.at=gl.upper05At;
	initShaders05();
	customizeGL05();/* uniforms are set in this, so must come after initShaders */
	

	setAmbientUniforms (gl.lower05At);
	setDirectionalLight(gl.lower05At);
	setPointLight      (gl.lower05At);

	setAmbientUniforms (gl.upper05At);
	setDirectionalLight(gl.upper05At);
	setPointLight      (gl.upper05At);
	
	setCheckMarks();
	
	tick05();
}
function customizeGL05() {
	//AL("customizeGL02");
	if(0==gl.lower05At){
		gl[gl.at].clearColor(0.5, 0.5, 0.5, 1.0);
	} else {
		gl[gl.at].clearColor(0.0, 0.0, 0.0, 1.0);
	}
	gl[gl.at].enable   (gl.DEPTH_TEST);
	gl[gl.at].frontFace(gl.CCW); 
	gl[gl.at].cullFace (gl.BACK); 
	if(null != document.getElementById('setCullFace')){
		//AL("setting CULL_FACE from null!=setCullFace");
		gl[gl.at].enable(gl.CULL_FACE);
		document.getElementById("cullFaces").value=" Enable CullFace ";
	} else {
		//AL("disabling CULL_FACE");
		gl[gl.at].disable(gl.CULL_FACE);
	}
	
	//gl[gl.lower05At].jsonsDone=true;
	//gl[gl.upper05At].jsonsDone=true;
	gl[gl.lower05At].texturesDone=true;
	gl[gl.upper05At].texturesDone=true;
	
	switch (gl.at%2){
	case 0:
		//xyzprySetInDegrees(   0, -13,   0,  0,  0, 90);   /* 13 units South, flat and level (roof is up),  facing North */
		/* the teapot can be viewed from 43 units away */
		//xyzprySetInDegrees(   0, -43,   0,  0,  0, 90);   /* 13 units South, flat and level (roof is up),  facing North */
		//xyzprySetInDegrees(   0,  0 ,  13,-90,  0, 90);   /* 13 units Up, pointing straight down,(roof is north) */
		xyzprySetInDegrees(   0,  2, 2.657,-90,  0, 90);
		xyzprySet2Home0();	
		if(0==gl.lower05At){
			//xyzprySetInDegrees(   0,  6, 18.125,-90,  0, 90);
			//xyzprySetInDegrees(   0,  2, 2.657,-90,  0, 90);
			xyzprySetInDegrees(0.000, -11.378, 12.962,-37.969, 0.000, 90.000);
		}	
		//AL("case0");
		//xyzpryLogView();
		xyzprySet2Home();
		gl[gl.at].deltaMove=1./8;
	break;
	case 1:
		xyzprySetInDegrees(  0., -2.666,0.447,-9.141,  0, 90);
		
		xyzprySet2Home0();
		if(1==gl.upper05At){
			//xyzprySetInDegrees(   0,  -15,  8.5, -21.445,  0,90);    /* 13 units North, flat and level (roof is up), facing South */
			//xyzprySetInDegrees(   0,  -30.,  0., 0.,  0.,90.);
			//xyzprySetInDegrees(   0,  -4.,  0., 0.,  0.,90.);
			xyzprySetInDegrees(1.184,-1.956,1.443,-31.726,2.321,121.157);
		}
		xyzprySet2Home();
		//AL("case1");
		//xyzpryLogView();
		gl[gl.at].deltaMove=1./8;
	
	break;
	default:
		alert("customize05 attempted to use a non existant context "+gl.at);
	}
}

function initShaders05() {
	var   vertexShader = getShader(  "vertex-shader2");
	var fragmentShader = getShader("fragment-shader2");
	
	gl[gl.at].shaderProgram = gl[gl.at].createProgram();
	gl[gl.at].attachShader(gl[gl.at].shaderProgram,  vertexShader);
	gl[gl.at].attachShader(gl[gl.at].shaderProgram, fragmentShader);
	gl[gl.at].linkProgram (gl[gl.at].shaderProgram);
	if (!gl[gl.at].getProgramParameter(gl[gl.at].shaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}
	gl[gl.at].useProgram(gl[gl.at].shaderProgram);
	
	gl[gl.at].paXYZ          = gl[gl.at].getAttribLocation(gl[gl.at].shaderProgram,"aXYZ"         );
	gl[gl.at].paNormal       = gl[gl.at].getAttribLocation(gl[gl.at].shaderProgram,"aNormal"      );
	gl[gl.at].enableVertexAttribArray(gl[gl.at].paXYZ);
	gl[gl.at].enableVertexAttribArray(gl[gl.at].paNormal);
	
	gl[gl.at].puPerspectiveMatrix      = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram,"uPerspectiveMatrix"      );
	gl[gl.at].puMvm                    = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram,"uMvm"                    );
	gl[gl.at].puNormal                 = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram,"uNormal"                 );

	gl[gl.at].puUseLighting            = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram,"uUseLighting"            );
	gl[gl.at].puUseDirectionalLight    = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram,"uUseDirectionalLight"    );
	gl[gl.at].puUsePointLight          = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram,"uUsePointLight"          );
	gl[gl.at].puShowSpecularHighlights = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram,"uShowSpecularHighlights" );
	gl[gl.at].puShowNegativeDiffuse    = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram,"uShowNegativeDiffuse"    );

	gl[gl.at].puAmbientLightRGB        = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram,"uAmbientLightRGB"        );

	gl[gl.at].puDirectionalLightXYZ         = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uDirectionalLightXYZ"        );
	gl[gl.at].puDirectionalLightSpecularRGB = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uDirectionalLightSpecularRGB");
	gl[gl.at].puDirectionalLightDiffuseRGB  = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uDirectionalLightDiffuseRGB" );
	
	gl[gl.at].puPointLightXYZ          = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram,"uPointLightXYZ"          );
	gl[gl.at].puPointLightSpecularRGB  = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram,"uPointLightSpecularRGB"  );
	gl[gl.at].puPointLightDiffuseRGB   = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram,"uPointLightDiffuseRGB"   );
	
	gl[gl.at].puMaterialAmbientRGB     = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uMaterialAmbientRGB"    );
	gl[gl.at].puMaterialSpecularRGB    = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uMaterialSpecularRGB"   );
	gl[gl.at].puMaterialDiffuseRGB     = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uMaterialDiffuseRGB"    );
	gl[gl.at].puMaterialShininess      = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uMaterialShininess"     );
	gl[gl.at].puMaterialEmissiveRGB    = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uMaterialEmissiveRGB"   );
}

function loadFacetedSphere05(isLastJson) {
	//AL("cme@ loadFacetedSphere gl.animationCount05="+gl.animationCount05);
	var requestA = new XMLHttpRequest();
//	requestA.open("GET", "json/Faceted/Icosahedral20.json");
//	requestA.open("GET", "json/Faceted/Icosahedral80.json");
	requestA.open("GET", "json/Faceted/Icosahedral320.json");
//	requestA.open("GET", "json/Faceted/Icosahedral1280.json");
//	requestA.open("GET", "json/Faceted/Icosahedral5120.json");
//	requestA.open("GET", "json/Faceted/Icosahedral20480.json");
	requestA.onreadystatechange = function () {
		if (requestA.readyState == 4) {
			//AL("A inside loadSphere requestgl.animationCount05="+gl.animationCount05+" "+gl.lower05At);
			//AL("requestA.responseText="+requestA.responseText);
			//gl.sayVarList=true; gl.counter=0;/* the gl.couner is used internally by the jsoanReviverVarList function */
			var parsedJson=JSON.parse(requestA.responseText,(gl.sayVarList?jsonReviverVarList:null));
			var xyzs    = [];
			var normals = [];
			var uvs     = [];
			var numTriangleVertices=parsedJson.trianglesIndices.length;
			var numTriangles=numTriangleVertices/3;
			var numVertices=parsedJson.XYZs.length/3;
			handleJsonExpansion(parsedJson,xyzs,normals,uvs,numTriangleVertices,numTriangles,numVertices);
			//for(var ii=0;ii<numVertices;ii++){
			//	AL(sprintf("%4d %9.6f %9.6f %9.6f",ii,parsedJson.XYZs[ii*3],parsedJson.XYZs[ii*3+1],parsedJson.XYZs[ii*3+2]));   
			//}
			handleLoadedSphere05(gl[gl.lower05At],gl.lower05At,xyzs,normals,uvs,numTriangleVertices,numTriangles,numVertices);
			gl[gl.lower05At].numCriticalJsonsDone++;
			//AL("B inside loadSphere requestgl.animationCount05="+gl.animationCount05);
			handleLoadedSphere05(gl[gl.upper05At],gl.upper05At,xyzs,normals,uvs,numTriangleVertices,numTriangles,numVertices);
			gl[gl.upper05At].numCriticalJsonsDone++;
			elem=document.getElementById("loadingtext");
			if(null!=elem)elem.textContent = "";
		}
	};
	//AL("about to request.send()");
	requestA.send();
	//AL("back from request.send()");
}

function handleJsonExpansion(parsedJson,xyzs,normals,uvs,numTriangleVertices,numTriangles,numVertices){
	var ii;
	//AL("numVertices="+numVertices+" numTriangleVertices="+numTriangleVertices);
	for(ii=0;ii<numTriangleVertices;ii++){
		xyzs.push(parsedJson.XYZs[parsedJson.trianglesIndices[ii]*3  ]);
		xyzs.push(parsedJson.XYZs[parsedJson.trianglesIndices[ii]*3+1]);
		xyzs.push(parsedJson.XYZs[parsedJson.trianglesIndices[ii]*3+2]);
	}
	//for(var ii=0;ii<numVertices;ii++){
	//	AL(sprintf("XYZ%4d %9.6f %9.6f %9.6f",ii,parsedJson.XYZs[ii*3],parsedJson.XYZs[ii*3+1],parsedJson.XYZs[ii*3+2]));   
	//}
	//for(var ii=0;ii<numTriangleVertices;ii++){
	//	AL(sprintf("xyz %4d %9.6f %9.6f %9.6f",ii,xyzs[ii*3],xyzs[ii*3+1],xyzs[ii*3+2]));   
	//}
	
	/* Three copies of each face normal, for the 3 corners of the triangles */
	/* The normals have same order as the triangles formed by the trianglesIndices */
	for(ii=0;ii<numTriangles;ii++){ 
		normals.push(parsedJson.trianglesNormals[ii*3  ]);
		normals.push(parsedJson.trianglesNormals[ii*3+1]);
		normals.push(parsedJson.trianglesNormals[ii*3+2]);
		normals.push(parsedJson.trianglesNormals[ii*3  ]);
		normals.push(parsedJson.trianglesNormals[ii*3+1]);
		normals.push(parsedJson.trianglesNormals[ii*3+2]);
		normals.push(parsedJson.trianglesNormals[ii*3  ]);
		normals.push(parsedJson.trianglesNormals[ii*3+1]);
		normals.push(parsedJson.trianglesNormals[ii*3+2]);
	}
	
//	for(ii=0;ii<numTriangleVertices;ii++){ 
//		uvs.push(parsedJson.trianglesUVs[parsedJson.trianglesUVIndices[ii]*2  ]);
//		uvs.push(parsedJson.trianglesUVs[parsedJson.trianglesUVIndices[ii]*2+1]);
//	}
	//for(ii=0;ii<numTriangleVertices;ii++){ 
	//	AL(sprintf("%4d %9.6f %9.6f %9.6f",ii,parsedJson.XYZs[ii*3],parsedJson.XYZs[ii*3+1],parsedJson.XYZs[ii*3+2]));   
	//}
	
//	for(ii=0;ii<numTriangles;ii++){ 
//		AL(sprintf(
//			"%4d (%9.6f,%9.6f,%9.6f)(%9.6f,%9.6f,%9.6f)(%9.6f,%9.6f,%9.6f) (%6.3f,%6.3f,%6.3f)"
//			,ii
//			,xyzs[ii*9]
//			,xyzs[ii*9+1]
//			,xyzs[ii*9+2]
//			,xyzs[ii*9+3]
//			,xyzs[ii*9+4]
//			,xyzs[ii*9+5]
//			,xyzs[ii*9+6]
//			,xyzs[ii*9+7]
//			,xyzs[ii*9+8]
//			,normals[ii*9]
//			,normals[ii*9+1]
//			,normals[ii*9+2]
//			)
//		);
//	}	
	
//	for(ii=0;ii<numTriangles;ii++){ 
//		AL(sprintf(
//			"%4d (%9.6f,%9.6f,%9.6f)(%9.6f,%9.6f,%9.6f)(%9.6f,%9.6f,%9.6f) (%9.6f,%9.6f)(%9.6f,%9.6f)(%9.6f,%9.6f)"
//			,ii
//			,xyzs[ii*9]
//			,xyzs[ii*9+1]
//			,xyzs[ii*9+2]
//			,xyzs[ii*9+3]
//			,xyzs[ii*9+4]
//			,xyzs[ii*9+5]
//			,xyzs[ii*9+6]
//			,xyzs[ii*9+7]
//			,xyzs[ii*9+8]
//			,uvs[ii*6]
//			,uvs[ii*6+1]
//			,uvs[ii*6+2]
//			,uvs[ii*6+3]
//			,uvs[ii*6+4]
//			,uvs[ii*6+5]
//			)
//		);   
//	}	
	
//	trianglesNormals
//	#    60 jsonVarList trianglesIndices
//	#    30 jsonVarList trianglesUVs
//	#    60 jsonVarList trianglesUVIndices
//	#    12 jsonVarList earthElevations
}
function handleLoadedSphere05(glSubAt,at,xyzs,normals,uvs,numTriangleVertices,numTriangles,numVertices) {
	//AL("cme@ handleLoadedSphere( with gl.at="+at+")");
	var sayAVar = false; /* toggle for the console output of a variable */
	
	                                   gl[at].sphereTrianglesXYZs = gl[at].createBuffer();
	gl[at].bindBuffer(gl.ARRAY_BUFFER, gl[at].sphereTrianglesXYZs); /* not an array of indices, so not an ELEMENT_ARRAY_BUFFER */
	gl[at].bufferData(gl.ARRAY_BUFFER, new Float32Array(xyzs), gl.STATIC_DRAW);
	gl[at].sphereTrianglesXYZs.itemSize = 3;
	gl[at].sphereTrianglesXYZs.numItems = numTriangleVertices;
	//if(0==at)AL("gl["+at+"].sphereTrianglesXYZs.numItems="+gl[at].sphereTrianglesXYZs.numItems);
	
	                                   gl[at].sphereTrianglesNormals = gl[at].createBuffer();
	gl[at].bindBuffer(gl.ARRAY_BUFFER, gl[at].sphereTrianglesNormals);/* not an array of indices, so not an ELEMENT_ARRAY_BUFFER */
	gl[at].bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	gl[at].sphereTrianglesNormals.itemSize = 3;
	gl[at].sphereTrianglesNormals.numItems = numTriangleVertices;
	//if(0==at)AL("gl["+at+"].sphereTrianglesNormals.numItems="+gl[at].sphereTrianglesNormals.numItems);
	
	//sayAVar=true;
	if(  (0==at)
	   &&(true==sayAVar)
	  ){
		AL("going for "+(gl[at].sphereTrianglesXYZs.numItems / 3) +" triangles");
		AL("          X      Y      Z     |   U      V      W  |");
		for(var ii=0;ii<gl[at].sphereTrianglesXYZs.numItems;ii++){
			//AL("going for ii="+ii);
			r=Math.sqrt( (normals[(3*ii)+ 0]*normals[(3*ii)+ 0])
			            +(normals[(3*ii)+ 1]*normals[(3*ii)+ 1])
			            +(normals[(3*ii)+ 2]*normals[(3*ii)+ 2])
			           );
			AL(sprintf("%2d %d %2d (%6.3f,%6.3f,%6.3f) (%6.3f,%6.3f,%6.3f) %5.3f %s"
				,Math.floor(ii/3)
				,ii%3
				,ii	
				,xyzs [(3*ii)+ 0]
				,xyzs [(3*ii)+ 1]
				,xyzs [(3*ii)+ 2]
				,normals[(3*ii)+ 0]
				,normals[(3*ii)+ 1]
				,normals[(3*ii)+ 2]
				,r
				,2==ii%3?"\n":""
			));
		}
	}
	//AL("at end of handelJSON at="+at);
}
function drawScene05() {
	//if(true==gl.talkon05)AL(sprintf("drawScene05 with gl.at=%2d gl.animationCount05=%3d",gl.at,gl.animationCount05));
	gl[gl.at].viewport(0, 0, gl[gl.at].viewportWidth, gl[gl.at].viewportHeight);
	gl[gl.at].clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	//AL("gl.at="+gl.at);	
	if (gl[gl.at].numCriticalJsons2BDone  > gl[gl.at].numCriticalJsonsDone){	
		//AL("early return gl.at="+gl.at);
		return;
	}
	//if(20==gl.animationCount05)AL(sprintf("drawScene05 past the nulls with gl.at=%2d gl.animationCount05=%3d",gl.at,gl.animationCount05));
	
	mat4.perspective(45, gl[gl.at].viewportWidth / gl[gl.at].viewportHeight, 0.1, 100.0, gl[gl.at].perspectiveMatrix);

	//drawTeapot();  /* before un-commenting this, be sure to also uncomment the loadTeapot() function */

	setMatrixUniforms05();
	
	var lightXYZ=vec3.create();
	if(gl[gl.at].directionalLight){
		vec3.set(gl[gl.at].directionalLightXYZ,lightXYZ);
		vec3.scale(lightXYZ,1000000000.);
		mat4.multiplyVec3(gl[gl.at].mvm,lightXYZ);
		vec3.normalize(lightXYZ);
		//if(20==gl.animationCount05)AL(sprintf("gl[%d] gl[gl.at].directionalLightXYZ norm =%s",gl.at,vec3.printS3(lightXYZ)));
		gl[gl.at].uniform3fv(gl[gl.at].puDirectionalLightXYZ,lightXYZ);
	} else {
		//if(20==gl.animationCount05)AL("false == directionalLight05");
	}
	if(gl[gl.at].pointLight){
		lightXYZ = vec3.createFrom(
			     5*Math.cos(deg2Rad*gl.rotationDegrees05)
			,6+ (5*Math.sin(deg2Rad*gl.rotationDegrees05))
			,2+ (3*Math.sin(deg2Rad*gl.rotationDegrees05*3.))
		);
		gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].pointLightSpriteXYZ);
		gl[gl.at].bufferData(gl.ARRAY_BUFFER, new Float32Array(lightXYZ), gl.STATIC_DRAW);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ , 3, gl.FLOAT, false, 0,  0);
		
		gl[gl.at].uniform3f(gl[gl.at].puMaterialEmissiveRGB,1.,1.,1.);
		gl[gl.at].drawArrays(gl.POINTS, 0, 1);
		gl[gl.at].uniform3f(gl[gl.at].puMaterialEmissiveRGB,0.,0.,0.);
		
		mat4.multiplyVec3(gl[gl.at].mvm,lightXYZ);
		//if(20==gl.animationCount05)AL(sprintf("gl[%d] gl[gl.lower05At].pointLightXYZ norm =%s",gl.at,vec3.printS3(lightXYZ)));
		gl[gl.at].uniform3fv(gl[gl.at].puPointLightXYZ,lightXYZ);
	}
	
	gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].sphereTrianglesXYZs);
	gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ, gl[gl.at].sphereTrianglesXYZs.itemSize, gl.FLOAT, false, 0, 0);
	
	gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].sphereTrianglesNormals);
	gl[gl.at].vertexAttribPointer(gl[gl.at].paNormal, gl[gl.at].sphereTrianglesNormals.itemSize, gl.FLOAT, false, 0, 0);
	
	
	glPushMatrix();
		mat4.translate(gl[gl.at].mvm, [-6, 0, 0]);
		var counter=0;
		for(var jj=0;jj<7;jj++){
			for(var ii=0;ii<7;ii++){
				if(  (0==gl.lower05At)	
				   ||(  (0!=gl.lower05At)         /* show only the brass on left window on WegGLTutorials */
				      &&(gl.at == gl.lower05At)
				      &&(3==ii)
				      &&(1==jj)
				     )
				   ||(  (0!=gl.lower05At)      /* show only the emerald on right small window on WegGLTutorials */
				      &&(gl.at == gl.upper05At)
				      &&(3==ii)
				      &&(0==jj)
				     )
				  ){
					var color=ii+(7*jj);
					switch(color){
						case 0:
							color=3;
							break;
						case 1:
							color=4;
							break;
						case 2:
							color=0;
							break;
						case 3:
							color=1;
							break;
						case 4:
							color=2;
							break;
						default:
							break;
					}
					setGLMaterial(gl.at,color);
					setGLMaterial(gl.at,gl[gl.at].materials?color:999);
					//AL(sprintf("gl[%d]=materialAmbientRGB=%s",gl.at,vec3.printS3(gl[gl.at].materialAmbientRGB)));
					gl[gl.at].uniform3fv(gl[gl.at].puMaterialAmbientRGB ,gl[gl.at].materialAmbientRGB );
					gl[gl.at].uniform3fv(gl[gl.at].puMaterialDiffuseRGB ,gl[gl.at].materialDiffuseRGB );
					gl[gl.at].uniform3fv(gl[gl.at].puMaterialSpecularRGB,gl[gl.at].materialSpecularRGB);
					gl[gl.at].uniform1f (gl[gl.at].puMaterialShininess  ,gl[gl.at].materials?gl[gl.at].materialShininess:gl.shininess05);
					//AL("gl.at="+gl.at+" ");
					glPushMatrix();
						mat4.translate(gl[gl.at].mvm, [2*ii,2*jj, 0]);
						//AL(sprintf("gl.rotationDegrees05=%8.3f",gl.rotationDegrees05));
						mat4.rotate(gl[gl.at].mvm, deg2Rad*gl.rotationDegrees05, [0, 1, 0]); /* if this function gets NaN, nothing draws */
						setMatrixUniforms05();
						//gl[gl.at].drawElements(gl.TRIANGLES     ,gl[gl.at].sphereTrianglesXYZs.numItems, gl.UNSIGNED_SHORT, 0);
						gl[gl.at].drawArrays(gl.TRIANGLES     ,0,gl[gl.at].sphereTrianglesXYZs.numItems);
					glPopMatrix();
				}
				counter++;
			}
		}
	glPopMatrix();
	
	var elem = document.getElementById(sprintf("xyzpry%d",gl.at));
	//AL("elem="+elem+" "+sprintf("xyzpry%d",gl.at));
	if(null!=elem)elem.innerHTML=xyzpryPrint();
	elem = document.getElementById(sprintf("stepTurn%d",gl.at));
	if(null!=elem)elem.innerHTML=sprintf(" step=%8.3f &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; turn=pi/%d",gl[gl.at].deltaMove,gl[gl.at].deltaTurnPiOver);

	if(20==gl.animationCount05){
		//AL("at end of drawScene05");
		gl.talkon05=false;
	}
}
function setMatrixUniforms05() {
	gl[gl.at].uniformMatrix4fv(gl[gl.at].puPerspectiveMatrix, false, gl[gl.at].perspectiveMatrix);
	gl[gl.at].uniformMatrix4fv(gl[gl.at].puMvm, false, gl[gl.at].mvm);
	
	var normalViewMatrix = mat3.create();
	mat4.toInverseMat3(gl[gl.at].mvm, normalViewMatrix);
	mat3.transpose(normalViewMatrix);
	//AL(sprintf("%8.3f %8.3f %8.3f\n  %8.3f %8.3f %8.3f\n  %8.3f %8.3f %8.3f\n"
	//		,normalViewMatrix[ 0],normalViewMatrix[ 1],normalViewMatrix[ 2]
	//		,normalViewMatrix[ 3],normalViewMatrix[ 4],normalViewMatrix[ 5]
	//		,normalViewMatrix[ 6],normalViewMatrix[ 7],normalViewMatrix[ 8]
	//	)
	//);
	gl[gl.at].uniformMatrix3fv(gl[gl.at].puNormal, false, normalViewMatrix);
}

function animate05() {
	var timeNow = new Date().getTime();
	//if(-1!=gl.animationHaltAt05)AL("animateCount="+gl.animationCount05+" vs gl.animationHaltAt05="+gl.animationHaltAt05);
	if (gl.lastTime05 != 0) {
		var elapsed = timeNow - gl.lastTime05;
		if(gl.animationHaltAt05==gl.animationCount05){
			gl.animationHalt05=true;
		}	
		gl.rotationDegrees05 +=  gl.RPM * elapsed *.006;
		if(360.<gl.rotationDegrees05)gl.rotationDegrees05-=360.;
		if(  0.>gl.rotationDegrees05)gl.rotationDegrees05+=360.;
		gl.animationCount05++;
	}
	gl.lastTime05 = timeNow;
}
function tick05() {
	if(false==gl.animationHalt05){
		requestAnimFrame(tick05);
	}
	gl.at=(8<gl.length)?8:0;
	drawScene05();
	gl.at=(8<gl.length)?9:1;
	drawScene05();
	
	animate05();
}
function reDraw(){
	/* general utility, needed when animation is turned off, or else your will not see any changes */
	gl.at=gl.lower05At;
	drawScene05();
	gl.at=gl.upper05At;
	drawScene05();
}
/****************  the teapot deprecated in favor of the spheres ************************/ 
function loadTeapot(isLastJson) {
	//AL("cme@ loadTeapot gl.animationCount05="+gl.animationCount05);
	var request = new XMLHttpRequest();
	/**/request.open("GET", "json/Teapot/GitHubTeapot.json");
	//request.open("GET", "json/Teapot/SmallLidTeapot.json");
	//request.open("GET", "json/Teapot/TeapotNEF.json");
	//request.open("GET", "json/Teapot/TeapotNEFT.json");
	//request.open("GET", "json/Teapot/WebGLMMOTeapot.json");
	//request.open("GET", "json/Teapot/Teapot.json");
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			//AL(sprintf("%3d loadTeapot() request readyState==4",gl.animationCount05));
			//gl.sayVarList=true;gl.counter=0;/* the gl.couner is used internally by the jsoanReviverVarList function */
			var parsedJson=JSON.parse(request.responseText,(gl.sayVarList?jsonReviverVarList:null));
			handleLoadedTeapot(parsedJson,gl.lower05At);
			handleLoadedTeapot(parsedJson,gl.upper05At);
			if(isLastJson){
				gl[gl.lower05At].jsonsDone=true;
				gl[gl.upper05At].jsonsDone=true;
				//AL("gl["+gl.at+"].jsonsDone="+(gl[gl.at].jsonsDone?"true":"false"));
			}
		}
	};
	//AL(sprintf("%3d loadTeapot() pre  requedt.send()",gl.animationCount05));
	request.send();
	//AL(sprintf("%3d loadTeapot() post requedt.send()",gl.animationCount05));
}
function handleLoadedTeapot(parsedJson,at) {
	//AL(sprintf("handelLoadedTeapot(at=%d) parsedJson.vertexXYZs.length=%d",at,parsedJson.vertexXYZs.length));
	
	gl[at].teapotXYZs = gl[at].createBuffer();
	gl[at].bindBuffer(gl.ARRAY_BUFFER, gl[at].teapotXYZs);
	gl[at].bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedJson.vertexXYZs), gl.STATIC_DRAW);
	gl[at].teapotXYZs.itemSize = 3;
	gl[at].teapotXYZs.numItems = parsedJson.vertexXYZs.length / gl[at].teapotXYZs.itemSize;
	//if(at==gl.lower05At)AL(sprintf("teapotXYZs   .numItems=%5d",gl[at].teapotXYZs.numItems));
	
	gl[at].teapotNormals = gl[at].createBuffer();
	gl[at].bindBuffer(gl.ARRAY_BUFFER, gl[at].teapotNormals);
	gl[at].bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedJson.vertexNormals), gl.STATIC_DRAW);
	gl[at].teapotNormals.itemSize = 3;
	gl[at].teapotNormals.numItems = parsedJson.vertexNormals.length / gl[at].teapotNormals.itemSize;
	//if(at==gl.lower05At)AL(sprintf("teapotNormals.numItems=%5d",gl[at].teapotNormals.numItems));
	
	gl[at].teapotIndices = gl[at].createBuffer();
	gl[at].bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl[at].teapotIndices);
	gl[at].bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parsedJson.trianglesIndices), gl.STATIC_DRAW);
	gl[at].teapotIndices.itemSize = 1;
	gl[at].teapotIndices.numItems = parsedJson.trianglesIndices.length / gl[at].teapotIndices.itemSize;
	//if(at==gl.lower05At)AL(sprintf("teapotIndices.numItems=%5d  devidedby3=%d",gl[at].teapotIndices.numItems,gl[at].teapotIndices.numItems/3));
	
	document.getElementById("loadingtext").textContent = "";
}
function drawTeapot() {
	glPushMatrix();
		//xyzpryLogView();
		//mat4.rotate(gl[gl.at].mvm, deg2Rad*23.4, [1, 0, -1]);
		
		//AL(sprintf("gl.rotationDegrees05=%8.3f",gl.rotationDegrees05));
		mat4.rotate(gl[gl.at].mvm, deg2Rad*gl.rotationDegrees05, [0, 1, 0]); /* if this function gets NaN, nothing draws */
		
		gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].teapotXYZs);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ, gl[gl.at].teapotXYZs.itemSize, gl.FLOAT, false, 0, 0);
		
		gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].teapotNormals);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paNormal, gl[gl.at].teapotNormals.itemSize, gl.FLOAT, false, 0, 0);
		
		gl[gl.at].bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl[gl.at].teapotIndices);
		setMatrixUniforms05();
	//	gl[gl.at].drawElements(gl.TRIANGLES, gl[gl.at].teapotIndices.numItems, gl.UNSIGNED_SHORT, 0);
	glPopMatrix();	
}
/***************************************   end of teapot ******************************/

/********  stuff below is GUI related *************************************************/
function setCheckMarks() {
	/* in this app both the canvases will always have the same lighting, so all the checkboxes apply to both */
	$("input[id^=lighting]").each(function (event) {
		//AL("id="+this.id+" "+gl[gl.lower05At].lighting);
		$(this).prop("checked",gl[gl.lower05At].lighting);
	});
	$("input[id^=directionalLight]").each(function (event) {
		//AL("id="+this.id+" "+gl[gl.lower05At].directionalLight);
		$(this).prop("checked",gl[gl.lower05At].directionalLight);
	});
	$("input[id^=pointLight]").each(function (event) {
		//AL("id="+this.id+" "+gl[gl.lower05At].pointLight);
		$(this).prop("checked",gl[gl.lower05At].pointLight);
	});
	$("input[id^=materials]").each(function (event) {
		//AL("id="+this.id+" "+gl[gl.lower05At].materials);
		$(this).prop("checked",gl[gl.lower05At].materials);
	});
	$("input[id^=specularHighlights]").each(function (event) {
		//AL("id="+this.id+" "+gl[gl.lower05At].specularHighlights);
		$(this).prop("checked",gl[gl.lower05At].specularHighlights);
	});
	$("input[id^=negativeDiffuse]").each(function (event) {
		//AL("id="+this.id+" "+gl[gl.lower05At].negativeDiffuse);
		$(this).prop("checked",gl[gl.lower05At].negativeDiffuse);
	});
}

/**************************************   Ambient Light  ***************************************/
function handleAmbientChange(cp) {
	//AL("Ambient ColorPicker Changed, new value = " + cp.value +" "+vec3.printS3(hexToRgb(cp.value)));
	gl[gl.lower05At].ambientLightRGB  = hexToRgb(cp.value);
	gl[gl.upper05At].ambientLightRGB = gl[gl.lower05At].ambientLightRGB;
	setAmbientUniforms(gl.lower05At);
	setAmbientUniforms(gl.upper05At);
	reDraw();
}

/**************************************  Directional Light ***************************************/
function handleDXYZSliderSlide(e, ui){
	var angle = Math.PI*(100-ui.value)/100.;
	gl[gl.lower05At].directionalLightXYZ = vec3.createFrom(Math.cos(angle),-0.3,Math.sin(angle));
	gl[gl.upper05At].directionalLightXYZ = gl[gl.lower05At].directionalLightXYZ; 
	//AL(sprintf("(%s) DLightSlider %3d angle=%8.3f ",vec3.printS3(gl[gl.at].directionalLightXYZ),ui.value,angle*rad2Deg));
	setDirectionalLight(gl.lower05At);
	setDirectionalLight(gl.upper05At);
	reDraw();
}
function handleDirectionalSpecularChange(cp) {
	//AL("Directional Specular ColorPicker Changed, new value = " + cp.value +" "+vec3.printS3(hexToRgb(cp.value)));
	gl[gl.lower05At].directionalLightSpecularRGB  = hexToRgb(cp.value);
	gl[gl.upper05At].directionalLightSpecularRGB = gl[gl.lower05At].directionalLightSpecularRGB;
	setDirectionalLight(gl.lower05At);
	setDirectionalLight(gl.upper05At);
	reDraw();
}
function handleDirectionalDiffuseChange(cp) {
	//AL("Directional Diffuse ColorPicker Changed, new value = " + cp.value +" "+vec3.printS3(hexToRgb(cp.value)));
	gl[gl.lower05At].directionalLightDiffuseRGB  = hexToRgb(cp.value);
	gl[gl.upper05At].directionalLightDiffuseRGB = gl[gl.lower05At].directionalLightDiffuseRGB;
	setDirectionalLight(gl.lower05At);
	setDirectionalLight(gl.upper05At);
	reDraw();
}
/****************************************  Point Light  ******************************************/
function handlePointSpecularChange(cp) {
	//AL("Point Specular ColorPicker Changed, new value = " + cp.value +" "+vec3.printS3(hexToRgb(cp.value)));
	gl[gl.lower05At].pointLightSpecularRGB  = hexToRgb(cp.value);
	gl[gl.upper05At].pointLightSpecularRGB= gl[gl.lower05At].pointLightSpecularRGB;
	setPointLight(gl.lower05At);
	setPointLight(gl.upper05At);
	reDraw();
}
function handlePointDiffuseChange(cp) {
	//AL("Point Diffuse ColorPicker Changed, new value = " + cp.value +" "+vec3.printS3(hexToRgb(cp.value)));
	gl[gl.lower05At].pointLightDiffuseRGB  = hexToRgb(cp.value);
	gl[gl.upper05At].pointLightDiffuseRGB = gl[gl.lower05At].pointLightDiffuseRGB;
	setPointLight(gl.lower05At);
	setPointLight(gl.upper05At);
	reDraw();
}

/**************************************   shininess  ***************************************/
function handleShininessSliderSlide(e, ui){
	gl.shininess05=ui.value/10;
	//AL("ShininessSliderSlide on the move "+ui.value +" becomming "+gl.shininess05);
	reDraw();
}
/************************************** the onReady functions ************************************/
$(document).ready(function(){
	//AL("in ready 05");
	if(-1<document.getElementById("title").innerHTML.indexOf("tutorial05")){
		//AL("inside ready for tutorial05");
		$('#tutorial05Tabs').tabs({
			active: 0,
			collapsible: false
		});
		$("input[id^=step05]").click(function (event) {
			//AL("inside05 button[id="+this.id+"]");
			//AL("looking at this.id="+this.id);
			gl.at=parseInt(this.id.charAt(this.id.length-1));
			//AL("whichCanvas="+gl.at);
			//AL("step this.id="+this.id+" this.id.substring(7,9)="+this.id.substring(7,9));
			if(   (this.id.substring(7,9) == "dn")
			   &&(.0005<gl[gl.at].deltaMove)		
			  ){
				gl[gl.at].deltaMove/=2;
				//AL("setting gl["+gl.at+"].deltaMove="+gl[gl.at].deltaMove);
			} 
			if(  (this.id.substring(7,9) == "up")
			   &&(128>gl[gl.at].deltaMove)		
			  ){
				gl[gl.at].deltaMove*=2;
				//AL("setting gl["+gl.at+"].deltaMove="+gl[gl.at].deltaMove);
			}
			document.getElementById(0==gl.at?"tutorial05-canvas0":"tutorial05-canvas1").focus();
			drawScene05();
		});	
		$("input[id^=turn05]").click(function (event) {
			//AL("looking at this.id="+this.id);
			gl.at=parseInt(this.id.charAt(this.id.length-1));
			//AL("whichCanvas="+gl.at);
			//AL("turn this.id="+this.id+" this.id.substring(7,9)="+this.id.substring(7,9));
			if(   (this.id.substring(7,9) == "dn")
			   &&(4048>gl[gl.at].deltaTurnPiOver)		
			  ){
				gl[gl.at].deltaTurnPiOver*=2;
				//AL("setting gl["+gl.at+"].deltaTurnPiOver="+gl[gl.at].deltaTurnPiOver);
			} 
			if(  (this.id.substring(7,9) == "up")
			   &&(4<gl[gl.at].deltaTurnPiOver)		
			  ){
				gl[gl.at].deltaTurnPiOver/=2;
				//AL("setting gl["+gl.at+"].deltaTurnPiOver="+gl[gl.at].deltaTurnPiOver);
			}
			document.getElementById(0==gl.at?"tutorial05-canvas0":"tutorial05-canvas1").focus();
			drawScene05();
		});
		$("input[id^=home05]").click(function (event) {
			//AL("looking at elem.id="+ this.id);
			gl.at=parseInt(this.id.charAt(this.id.length-2));
			//AL("whichCanvas="+gl.at);
			if(0==parseInt(this.id.charAt(this.id.length-1))){
				//AL("last char ==0 "+this.id.charAt(this.id.length-1));
				goHome();
			} else {
				//AL("last char !=0 "+this.id.charAt(this.id.length-1));
				goHome0();
			}
			document.getElementById(0==gl.at?"tutorial05-canvas0":"tutorial05-canvas1").focus();
			drawScene05();
		});
		 $("#directionalLightXYZSlider").slider({
			animate: true,
			value: 50,
			slide: handleDXYZSliderSlide
		});
		 $("#shininessSlider1").slider({
			animate: true,
			value:50,
			slide: handleShininessSliderSlide
		});
		 $("#shininessSlider2").slider({
			animate: true,
			value:50,
			slide: handleShininessSliderSlide
		}); 
		$("input[id^=lighting]").click(function (event) {
			gl[gl.lower05At].lighting  = document.getElementById(this.id).checked;
			gl[gl.upper05At].lighting = gl[gl.lower05At].lighting;
			//AL("checkBox "+this.id+" incomming is "+gl[gl.lower05At].lighting);
			gl[gl.lower05At].uniform1i(gl[gl.lower05At].puUseLighting,gl[gl.lower05At].lighting);
			gl[gl.upper05At].uniform1i(gl[gl.upper05At].puUseLighting,gl[gl.upper05At].lighting);
			setCheckMarks();
			reDraw();
		});
		$("input[id^=directionalLight]").click(function (event) {
			gl[gl.lower05At].directionalLight  = document.getElementById(this.id).checked;
			gl[gl.upper05At].directionalLight = gl[gl.lower05At].directionalLight;
			//AL("checkBox "+this.id+" incomming is "+gl[gl.lower05At].directionalLight);
			setCheckMarks();
			setDirectionalLight(gl.lower05At);
			setDirectionalLight(gl.upper05At);
			reDraw();
		});
		$("input[id^=pointLight]").click(function (event) {
			gl[gl.lower05At].pointLight  = document.getElementById(this.id).checked;
			gl[gl.upper05At].pointLight = gl[gl.lower05At].pointLight;
			//AL("checkBox "+this.id+" incomming is "+gl[gl.lower05At].pointLight);
			if(true==gl[gl.upper05At].pointLight){
				gl.at=gl.lower05At;
				xyzprySetInDegrees(   0,  6 ,  18.5,-90,  0, 90);
				gl.at=gl.upper05At;
				xyzprySetInDegrees(   0,  -13.125, 2.75, 0,  0, 90);
			}
			setCheckMarks();
			setPointLight(gl.lower05At);
			setPointLight(gl.upper05At);
			reDraw();
		});
		$("input[id^=materials]").click(function (event) {
			gl[gl.lower05At].materials = document.getElementById(this.id).checked;
			gl[gl.upper05At].material = gl[gl.lower05At].material;
			//AL("checkBox "+this.id+" incomming is "+gl[gl.lower05At].materials);
			if(true==gl[gl.lower05At].materials){
				document.getElementById("shiner1").style.display = 'none';
				document.getElementById("shiner2").style.display = 'none';
				
//				gl[gl.lower05At].directionalLightSpecularRGB = vec3.createFrom(1.0,1.0,1.0);
//				gl[gl.lower05At].directionalLightDiffuseRGB  = vec3.createFrom(1.0,1.0,1.0);
//				gl[gl.lower05At].pointLightSpecularRGB       = vec3.createFrom(0.8,0.8,0.8);
//				gl[gl.lower05At].pointLightDiffuseRGB        = vec3.createFrom(0.8,0.8,0.8);
//				
//				gl[gl.upper05At].directionalLightSpecularRGB = vec3.createFrom(1.0,1.0,1.0);
//				gl[gl.upper05At].directionalLightDiffuseRGB  = vec3.createFrom(1.0,1.0,1.0);
//				gl[gl.upper05At].pointLightSpecularRGB       = vec3.createFrom(0.8,0.8,0.8);
//				gl[gl.upper05At].pointLightDiffuseRGB        = vec3.createFrom(0.8,0.8,0.8);
				
				//AL("into true0");
				$("#directionalSpecular").spectrum("set", "#FFFFFF");		
				$("#directionalDiffuse" ).spectrum("set", "#FFFFFF");
				$("#pointSpecular").spectrum("set", "#FFFFFF");
				$("#pointDiffuse" ).spectrum("set", "#FFFFFF");
				$("#ambient1").spectrum("set", "#333333");
				$("#ambient2").spectrum("set", "#333333");
			} else {
				document.getElementById("shiner1").style.display = 'block';
				document.getElementById("shiner2").style.display = 'block';
				
//				gl[gl.lower05At].directionalLightSpecularRGB = vec3.createFrom(0.0,1.0,0.0);
//				gl[gl.lower05At].directionalLightDiffuseRGB  = vec3.createFrom(0.5,0.5,0.5);
//				gl[gl.lower05At].pointLightSpecularRGB       = vec3.createFrom(0.0,0.0,1.0);
//				gl[gl.lower05At].pointLightDiffuseRGB        = vec3.createFrom(0.5,0.5,0.5);
//				
//				gl[gl.upper05At].directionalLightSpecularRGB = vec3.createFrom(0.0,1.0,0.0);
//				gl[gl.upper05At].directionalLightDiffuseRGB  = vec3.createFrom(0.5,0.5,0.5);
//				gl[gl.upper05At].pointLightSpecularRGB       = vec3.createFrom(0.0,0.0,1.0);
//				gl[gl.upper05At].pointLightDiffuseRGB        = vec3.createFrom(0.5,0.5,0.5);
				
				$("#directionalSpecular").spectrum("set", "#00FF00");
				$("#directionalDiffuse" ).spectrum("set", "#808080");
				$("#pointSpecular").spectrum("set", "#0000FF");
				$("#pointDiffuse" ).spectrum("set", "#808080");
				$("#ambient1").spectrum("set", "#333333");
				$("#ambient2").spectrum("set", "#333333");
			} 
			setCheckMarks();
//			setDirectionalLight(gl.lower05At);
//			setDirectionalLight(gl.upper05At);
//			setPointLight(gl.lower05At);
//			setPointLight(gl.upper05At);
//			setAmbientUniforms(gl.lower05At);
//			setAmbientUniforms(gl.upper05At);
			reDraw();
		});
		$("input[id^=specularHighlights]").click(function (event) {
			gl[gl.lower05At].specularHighlights = document.getElementById(this.id).checked;
			gl[gl.upper05At].specularHighlights = gl[gl.lower05At].specularHighlights;
			//AL("checkBox "+this.id+" incomming is "+gl[gl.lower05At].specularHighlights);
			gl[gl.lower05At].uniform1i(gl[gl.lower05At].puShowSpecularHighlights,gl[gl.lower05At].specularHighlights);
			gl[gl.upper05At].uniform1i(gl[gl.upper05At].puShowSpecularHighlights,gl[gl.upper05At].specularHighlights);
			setCheckMarks();
			reDraw();
		});
		$("input[id^=negativeDiffuse]").click(function (event) {
			gl[gl.lower05At].negativeDiffuse=checked  = document.getElementById(this.id).checked;
			gl[gl.upper05At].negativeDiffus = gl[gl.lower05At].negativeDiffus;
			//AL("checkBox "+this.id+" incomming is "+gl[gl.lower05At].negativeDiffuse);
			gl[gl.lower05At].uniform1i(gl[gl.lower05At].puShowNegativeDiffuse,gl[gl.lower05At].negativeDiffuse);
			gl[gl.upper05At].uniform1i(gl[gl.upper05At].puShowNegativeDiffuse,gl[gl.upper05At].negativeDiffuse);
			setCheckMarks();
			reDraw();
		});
		$("#ambient1").spectrum({
			preferredFormat: "hex6",
			showInput: true,
			clickoutFiresChange: true
		});
		$("#ambient2").spectrum({
			preferredFormat: "hex6",
			showInput: true,
			clickoutFiresChange: true
		});
		$("#directionalDiffuse").spectrum({
			preferredFormat: "hex6",
			showInput: true,
			clickoutFiresChange: true
		});
		$("#directionalSpecular").spectrum({
			preferredFormat: "hex6",
			showInput: true,
			clickoutFiresChange: true
		});
		$("#pointDiffuse").spectrum({
			preferredFormat: "hex6",
			showInput: true,
			clickoutFiresChange: true
		});
		$("#pointSpecular").spectrum({
			preferredFormat: "hex6",
			showInput: true,
			clickoutFiresChange: true
		});
		$("input[id^=cullFaces]").click(function (event) {
			//AL("inside05 button[id="+this.id+"]");
			var elem = document.getElementById(this.id);
			//AL("looking at elem.value="+elem.value);
			if(-1<elem.value.indexOf("Enable")){
				elem.value=" Disable CullFace ";
				gl[gl.lower05At].enable(gl.CULL_FACE);
				gl[gl.upper05At].enable(gl.CULL_FACE);
				//AL("enabling CULL_FACE on both canvases");
			} else {
				elem.value="  Enable CullFace ";
				gl[gl.lower05At].disable(gl.CULL_FACE);
				gl[gl.upper05At].disable(gl.CULL_FACE);
				//AL("disabling CULL_FACE on both canvases");
			}
			reDraw();
		});
	}
	$('canvas[id^="tutorial05-canvas"]')
	/*Mouse down override to prevent default browser controls from appearing */
	.mousedown(function(){
		$(this).focus(); 
		//AL("in canvas "+this.id+" substring="+this.id.substring(this.id.length-1));
		return false; 
	})
	.keyup(function(event) {
		/* alert("key UP on key "+event.keyCode); */
		if(16==event.keyCode){
			gl.shiftKeyDown=false;
		} 
	})	
	.keydown(function(event){
		/* alert(event.keyCode); */
		if(16==event.keyCode){
			gl.shiftKeyDown=true;
		} else {
			if(0==this.id.substring(this.id.length-1)){
				gl.at=gl.lower05At;
			} else {
				gl.at=gl.upper05At;	
			}
			//AL("event.keyCode="+event.keyCode+"  gl.at="+gl.at);
			
			gl.mvm0.set(gl[gl.at].mvm);
			gl.mvm1.set(gl[gl.at].mvm);
			
			switch(event.keyCode){
			case 70:  /* F key for forward */
			case 86 :  /* V Sorry folks... this is for backwards, my hands frequently hit this by mistake.*/
			case 66 :  /* B  for backward */	
				//AL("see F or B or V key for window "+gl.at);
				gl[gl.at].mvm[14]+=(event.keyCode==70?1:-1)*gl[gl.at].deltaMove;
				xyzpryFigure();
			  break;
			case 82 :  /* R for Roll */
			case 83 :  /* S for Roll, dont remembery why.backward */
			case 67 :  /* C  for counterRoll */
				//AL("see R or S for Roll or C for CounterRoll key for window "+gl.at);
				mat4.translate(gl[gl.at].mvm,[-gl.mvm0[14]*gl.mvm0[ 2],-gl.mvm0[14]*gl.mvm0[ 6],-gl.mvm0[14]*gl.mvm0[10]]); /* translate back to zero along the Forward vector */
				mat4.translate(gl[gl.at].mvm,[-gl.mvm0[13]*gl.mvm0[ 1],-gl.mvm0[13]*gl.mvm0[ 5],-gl.mvm0[13]*gl.mvm0[ 9]]); /* translate back to zero along the Up      vector */
				mat4.translate(gl[gl.at].mvm,[-gl.mvm0[12]*gl.mvm0[ 0],-gl.mvm0[12]*gl.mvm0[ 4],-gl.mvm0[12]*gl.mvm0[ 8]]); /* translate back to zero along the Left    vector */
				mat4.rotate   (gl[gl.at].mvm,(event.keyCode == 67?1:-1)*(Math.PI/gl[gl.at].deltaTurnPiOver),[gl.mvm0[ 2],gl.mvm0[ 6],gl.mvm0[10]]);/* rotate around the Forward vector */
				mat4.translate(gl[gl.at].mvm,[ gl.mvm1[14]*gl.mvm1[ 2], gl.mvm1[14]*gl.mvm1[ 6], gl.mvm1[14]*gl.mvm1[10]]); /* translate back to position along the old Forward vector */
				mat4.translate(gl[gl.at].mvm,[ gl.mvm1[13]*gl.mvm1[ 1], gl.mvm1[13]*gl.mvm1[ 5], gl.mvm1[13]*gl.mvm1[ 9]]); /* translate back to position  along the old Up      vector */
				mat4.translate(gl[gl.at].mvm,[ gl.mvm1[12]*gl.mvm1[ 0], gl.mvm1[12]*gl.mvm1[ 4], gl.mvm1[12]*gl.mvm1[ 8]]); /* translate back to position  along the old Left    vector */
				xyzpryFigure();
			break;
			case 38 :  /* Up or down Arrow on the little keypad   or the 8 or 2 key on the numeric keypad */
			case 40 :  /* Up or down Arrow on the little keypad   or the 8 or 2 key on the numeric keypad */
				//AL("see upArrow or downArrow for window "+gl.at);
				if(false==gl.shiftKeyDown){
					gl[gl.at].mvm[13]-= (event.keyCode==40?-1:1)*gl[gl.at].deltaMove;
					//AL("shift "+(event.keyCode==40?"Down":"Up") + " left is now "+gl[gl.at].mvm[13]);	
				} else {
					//AL("tilt "+(event.keyCode==40?"Up":"Down"));	
					mat4.translate(gl[gl.at].mvm,[-gl.mvm0[14]*gl.mvm0[ 2],-gl.mvm0[14]*gl.mvm0[ 6],-gl.mvm0[14]*gl.mvm0[10]]); /* translate back to zero along the Forward vector */
					mat4.translate(gl[gl.at].mvm,[-gl.mvm0[13]*gl.mvm0[ 1],-gl.mvm0[13]*gl.mvm0[ 5],-gl.mvm0[13]*gl.mvm0[ 9]]); /* translate back to zero along the Up      vector */
					mat4.translate(gl[gl.at].mvm,[-gl.mvm0[12]*gl.mvm0[ 0],-gl.mvm0[12]*gl.mvm0[ 4],-gl.mvm0[12]*gl.mvm0[ 8]]); /* translate back to zero along the Left    vector */
					mat4.rotate   (gl[gl.at].mvm,(event.keyCode==40?-1:1)*(Math.PI/gl[gl.at].deltaTurnPiOver),[gl.mvm0[ 0],gl.mvm0[ 4],gl.mvm0[8]]);/* rotate around the left vector */
					mat4.translate(gl[gl.at].mvm,[ gl.mvm1[14]*gl.mvm1[ 2], gl.mvm1[14]*gl.mvm1[ 6], gl.mvm1[14]*gl.mvm1[10]]); /* translate back to position along the old Forward vector */
					mat4.translate(gl[gl.at].mvm,[ gl.mvm1[13]*gl.mvm1[ 1], gl.mvm1[13]*gl.mvm1[ 5], gl.mvm1[13]*gl.mvm1[ 9]]); /* translate back to position  along the old Up      vector */
					mat4.translate(gl[gl.at].mvm,[ gl.mvm1[12]*gl.mvm1[ 0], gl.mvm1[12]*gl.mvm1[ 4], gl.mvm1[12]*gl.mvm1[ 8]]); /* translate back to position  along the old Left    vector */
				}
				xyzpryFigure();
			break;
			case 37 :  /* left Arrow on the little keypad   or the 4 key on the numeric keypad */
			case 39 :  /* right Arrow on the little keypad   or the 6 key on the numeric keypad */
				//AL("see leftArrow or rightArrow for window "+gl.at);
				if(false==gl.shiftKeyDown){	
					gl[gl.at].mvm[12]-= (event.keyCode==37?-1:1)*gl[gl.at].deltaMove;
					//AL("shift "+(event.keyCode==37?"Down":"Up") + " left is now "+gl[gl.at].mvm[13]);	
				} else {
					//AL("tilt "+(event.keyCode==37?"left":"right"));	
					mat4.translate(gl[gl.at].mvm,[-gl.mvm0[14]*gl.mvm0[ 2],-gl.mvm0[14]*gl.mvm0[ 6],-gl.mvm0[14]*gl.mvm0[10]]); /* translate back to zero along the Forward vector */
					mat4.translate(gl[gl.at].mvm,[-gl.mvm0[13]*gl.mvm0[ 1],-gl.mvm0[13]*gl.mvm0[ 5],-gl.mvm0[13]*gl.mvm0[ 9]]); /* translate back to zero along the Up      vector */
					mat4.translate(gl[gl.at].mvm,[-gl.mvm0[12]*gl.mvm0[ 0],-gl.mvm0[12]*gl.mvm0[ 4],-gl.mvm0[12]*gl.mvm0[ 8]]); /* translate back to zero along the Left    vector */
					mat4.rotate   (gl[gl.at].mvm,(event.keyCode==37?-1:1)*(Math.PI/gl[gl.at].deltaTurnPiOver),[gl.mvm0[ 1],gl.mvm0[ 5],gl.mvm0[9]]);/* rotate around the left vector */
					mat4.translate(gl[gl.at].mvm,[ gl.mvm1[14]*gl.mvm1[ 2], gl.mvm1[14]*gl.mvm1[ 6], gl.mvm1[14]*gl.mvm1[10]]); /* translate back to position along the old Forward vector */
					mat4.translate(gl[gl.at].mvm,[ gl.mvm1[13]*gl.mvm1[ 1], gl.mvm1[13]*gl.mvm1[ 5], gl.mvm1[13]*gl.mvm1[ 9]]); /* translate back to position  along the old Up      vector */
					mat4.translate(gl[gl.at].mvm,[ gl.mvm1[12]*gl.mvm1[ 0], gl.mvm1[12]*gl.mvm1[ 4], gl.mvm1[12]*gl.mvm1[ 8]]); /* translate back to position  along the old Left    vector */
				}
				xyzpryFigure();
			break;
			  
			default:
				/* no need to do anything, unless one is looking to code for a new key...  then uncomment the followint */
				AL("keycode for the (currently undefined action) key just struck is="+event.keyCode);
			}
			if(true==gl.animationHalt05){
				var thisId=document.activeElement.id;
				//AL("halted movement input.  gl.at keying off "+thisId+" left allBut1="+thisId.substring(0,thisId.length-1));
				if(thisId.substring(0,thisId.length-1) == "tutorial05-canvas"){
				    //AL("got inside.  trying for number "+Number(thisId.substring(thisId.length-1)));
					gl.at=Number(thisId.substring(thisId.length-1));;
					drawScene05();
				} 
			}
		}	
		return false; 
	});
});
function checkoutTeapotJsons(isLastJson) {
	//AL("cme@ checkoutTeapotJsons gl.animationCount05="+gl.animationCount05);
	var requestA = new XMLHttpRequest();
	var fid="json/Teapot/Teapot.json";
	requestA.open("GET", fid);
	requestA.onreadystatechange = function () {
		if (requestA.readyState == 4) {
			//AL("A inside loadSphere requestgl.animationCount05="+gl.animationCount05+" "+gl.lower05At);
			//AL("requestA.responseText="+requestA.responseText);
			/**/gl.sayVarList=true; gl.counter=0;/* the gl.couner is used internally by the jsoanReviverVarList function */
			var parsedJson=JSON.parse(requestA.responseText,(gl.sayVarList?jsonReviverVarList:null));
		}
	};
	//AL("about to request.send()");
	requestA.send();
	
	var requestB = new XMLHttpRequest();
	fid="json/Teapot/GitHubTeapot.json";
	requestB.open("GET", fid);
	requestB.onreadystatechange = function () {
		if (requestB.readyState == 4) {
			//AL("A inside loadSphere requestgl.animationCount05="+gl.animationCount05+" "+gl.lower05At);
			//AL("requestB.responseText="+requestB.responseText);
			/**/gl.sayVarList=true; gl.counter=0;/* the gl.couner is used internally by the jsoanReviverVarList function */
			var parsedJson=JSON.parse(requestB.responseText,(gl.sayVarList?jsonReviverVarList:null));
		}
	};
	//AL("about to request.send()");
	requestB.send();

	var requestC = new XMLHttpRequest();
	fid="json/Teapot/WebGLMMOTeapot.json";
	requestC.open("GET", fid);
	requestC.onreadystatechange = function () {
		if (requestC.readyState == 4) {
			//AL("A inside loadSphere requestgl.animationCount05="+gl.animationCount05+" "+gl.lower05At);
			//AL("requestC.responseText="+requestC.responseText);
			/**/gl.sayVarList=true; gl.counter=0;/* the gl.couner is used internally by the jsoanReviverVarList function */
			var parsedJson=JSON.parse(requestC.responseText,(gl.sayVarList?jsonReviverVarList:null));
		}
	};
	//AL("about to request.send()");
	requestC.send();
	//AL("back from request.send()");
	
	var requestD = new XMLHttpRequest();
	fid="json/Teapot/WebGLMMOTeapot.json";
	requestD.open("GET", fid);
	requestD.onreadystatechange = function () {
		if (requestD.readyState == 4) {
			//AL("A inside loadSphere requestgl.animationCount05="+gl.animationCount05+" "+gl.lower05At);
			//AL("requestC.responseText="+requestC.responseText);
			/**/gl.sayVarList=true; gl.counter=0;
			var parsedJson=JSON.parse(requestC.responseText,(gl.sayVarList?jsonReviverVarList:null));
		}
	};
	//AL("about to request.send()");
	
	requestD.send();
	//AL("back from request.send()");
	
	var requestE = new XMLHttpRequest();
	fid="json/Teapot/WebGLMMOTeapot.json";
	requestE.open("GET", fid);
	requestE.onreadystatechange = function () {
		if (requestE.readyState == 4) {
			//AL("A inside loadSphere requestgl.animationCount05="+gl.animationCount05+" "+gl.lower05At);
			//AL("requestC.responseText="+requestC.responseText);
			/**/gl.sayVarList=true; gl.counter=0;
			var parsedJson=JSON.parse(requestC.responseText,(gl.sayVarList?jsonReviverVarList:null));
		}
	};
	//AL("about to request.send()");
	requestE.send();
	//AL("back from request.send()");
}