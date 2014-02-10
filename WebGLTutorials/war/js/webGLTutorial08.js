/* © 2013 Thomas P Moyer  */ 
function colorEncrypt(int){
	
	
	
} 
function webGLStart08() {
	//AL("cme@ webGLTutorial08.js webGLStart");
	window.resizeTo( 1100,700);
	var canvas = document.getElementById("tutorial08-canvas0");
	initGL(canvas);
	gl.lower08At=gl.at;
	canvas = document.getElementById("tutorial08-canvas1");
	initGL(canvas);
	gl.upper08At=gl.at;
	//AL("gl.lower08At="+gl.lower08At+" gl.upper08At="+gl.upper08At);
	
	//loadTeapot(false);
//	checkoutTeapotJsons(false);
	loadFacetedSphere08(true); /* true === isLastJson*/	
	
	gl.at=gl.lower08At;
	initShaders08();
	gl.at=gl.upper08At;
	initShaders08();
	
	customizeGL08();/* uniforms are set in this, so must come after initShaders */
	
	tick08();
}
function customizeGL08() {
	/**/AL("customizeGL08");
	
	gl.rotationDegrees08=0.;
	gl.animationCount08=0;
	gl.animationHalt08=false;
	gl.animationHaltAt08=-1; /* negative never stops (till rollover post 4 billion). */
	gl.constructHalt08=true;
	gl.constructAt08=0;
	gl.constructHaltAt08=-1;
	gl.constructHalt082=true;
	gl.constructAt082=0;
	gl.constructHaltAt082=-1;
	//gl.animationHaltAt08=20;
	gl.lastTime08 = 0;
	gl.sayOnce08=false;
	gl.talkon08=false;
	gl.talkon08=true;
	gl.RPM = 10.;
	gl.shininess08=5.;
	
	gl[gl.lower08At].lighting           = true;
	gl[gl.lower08At].directionalLight   = true;
	gl[gl.lower08At].pointLight         = false;
	gl[gl.lower08At].materials          = true;
	gl[gl.lower08At].specularHighlights = true;
	gl[gl.lower08At].negativeDiffuse    = true;
	gl[gl.lower08At].ambientLightRGB             = vec3.createFrom(0.2,0.2,0.2);
	gl[gl.lower08At].directionalLightSpecularRGB = vec3.createFrom(1.0,1.0,1.0);
	gl[gl.lower08At].directionalLightDiffuseRGB  = vec3.createFrom(1.0,1.0,1.0);
	gl[gl.lower08At].pointLightXYZ = vec3.createFrom(  0.0,  6.0,  1.0);                  //AL(vec3.printS3(gl[gl.lower08At].pointLightXYZ)      +" initial gl[gl.lower08At].pointLightXYZ");
	gl[gl.lower08At].pointLightSpriteXYZ = gl[gl.lower08At].createBuffer(); /* the buffer for the white emissive dot that flies around */
	gl[gl.lower08At].pointLightSpecularRGB       = vec3.createFrom(0.8,0.8,0.8);
	gl[gl.lower08At].pointLightDiffuseRGB        = vec3.createFrom(0.8,0.8,0.8);
	
	if(0==gl.lower08At){
		var slider = selection = $( "#directionalLightXYZSlider").slider( "value" );
		var angle= Math.PI*(100-slider)/100.;
		gl[gl.lower08At].directionalLightXYZ = vec3.createFrom(Math.cos(angle),-.3,Math.sin(angle));//AL(vec3.printS3(gl[gl.lower08At].directionalLightXYZ)+" initial directionalLightXYZ");
		gl[gl.upper08At].directionalLightXYZ = vec3.createFrom(Math.cos(angle),-.3,Math.sin(angle));//AL(vec3.printS3(gl[gl.upper08At].directionalLightXYZ)+" initial directionalLightXYZ");
		
	} else {
		gl[gl.lower08At].directionalLightXYZ         = vec3.createFrom(0.0,0.0,1.0);
		gl[gl.upper08At].directionalLightXYZ         = vec3.createFrom(0.0,0.0,1.0);
	}
	
	gl[gl.upper08At].lighting           = true;
	gl[gl.upper08At].directionalLight   = true;
	gl[gl.upper08At].pointLight         = false;
	gl[gl.upper08At].materials          = true;
	gl[gl.upper08At].specularHighlights = true;
	gl[gl.upper08At].negativeDiffuse    = true;
	gl[gl.upper08At].ambientLightRGB             = vec3.createFrom(0.2,0.2,0.2);
	gl[gl.upper08At].directionalLightSpecularRGB = vec3.createFrom(1.0,1.0,1.0);
	gl[gl.upper08At].directionalLightDiffuseRGB  = vec3.createFrom(1.0,1.0,1.0);
	gl[gl.upper08At].pointLightXYZ = vec3.createFrom(  0.0,  6.0,  1.0);                  //AL(vec3.printS3(gl[gl.lower08At].pointLightXYZ)      +" initial gl[gl.lower08At].pointLightXYZ");
	gl[gl.upper08At].pointLightSpriteXYZ = gl[gl.upper08At].createBuffer(); /* the buffer for the white emissive dot that flies around */
	gl[gl.upper08At].pointLightSpecularRGB       = vec3.createFrom(0.8,0.8,0.8);
	gl[gl.upper08At].pointLightDiffuseRGB        = vec3.createFrom(0.8,0.8,0.8);
	
	for(gl.at=gl.lower08At;gl.at<=gl.upper08At;gl.at++){
		if(0==gl.lower08At){
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
		//gl[gl.at].jsonsDone=true;
		gl[gl.at].texturesDone=true;
		
	}
	
	
	/*********************************************/
	//AL("setting homes");
	gl.at=gl.lower08At;
	//xyzprySetInDegrees(   0, -13,   0,  0,  0, 90);   /* 13 units South, flat and level (roof is up),  facing North */
	/* the teapot can be viewed from 43 units away */
	//xyzprySetInDegrees(   0, -43,   0,  0,  0, 90);   /* 13 units South, flat and level (roof is up),  facing North */
	//xyzprySetInDegrees(   0,  0 ,  13,-90,  0, 90);   /* 13 units Up, pointing straight down,(roof is north) */
	xyzprySetInDegrees(   0,  2, 2.657,-90,  0, 90);
	xyzprySet2Home0();	
	if(0==gl.lower08At){
		xyzprySetInDegrees(   0,  6, 18.125,-90,  0, 90);
	} else {
		xyzprySetInDegrees(   1,  6, 18.125,-90,  0, 90);
	}
	xyzprySet2Home();
	gl[gl.at].deltaMove=1./8;
	
	/*********************************************/
	
	gl.at=gl.upper08At;
	xyzprySetInDegrees(  -4., -2.666,0.447,-9.141,  0, 90);
	xyzprySet2Home0();
	if(1==gl.upper08At){
		//xyzprySetInDegrees(   0,  -15,  8.5, -21.445,  0,90);    /* 13 units North, flat and level (roof is up), facing South */
		//xyzprySetInDegrees(   0,  -30.,  0., 0.,  0.,90.);
		xyzprySetInDegrees(   0,  -4.,  0., 0.,  0.,90.);
	} else {
		xyzprySetInDegrees(   1,  6, 18.125,-90,  0, 90);
	}
	xyzprySet2Home();
	//AL("case1");
	gl[gl.at].deltaMove=1./8;
	/*********************************************/
	//AL("set home");
	gl.at=gl.lower08At;
	//xyzpryLogView();
	gl.at=gl.upper08At;
	//xyzpryLogView();
 	
	setAmbientUniforms (gl.lower08At);
	setDirectionalLight(gl.lower08At);
	setPointLight      (gl.lower08At);
	
	setAmbientUniforms (gl.upper08At);
	setDirectionalLight(gl.upper08At);
	setPointLight      (gl.upper08At);
	
	setCheckMarks();
}

function initShaders08() {
	var   vertexShader = getShader(  "vertex-shader3");
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

function loadFacetedSphere08(isLastJson) {
	//AL("cme@ loadFacetedSphere gl.animationCount08="+gl.animationCount08);
	var requestA = new XMLHttpRequest();
//	requestA.open("GET", "json/Spheres/IcosahedralSphere20.json");
//	requestA.open("GET", "json/Spheres/IcosahedralSphere80.json");
//	requestA.open("GET", "json/Spheres/IcosahedralSphere320.json");
//	requestA.open("GET", "json/Spheres/IcosahedralSphere1280.json");
	requestA.open("GET", "json/Spheres/IcosahedralSphere5120.json");
	requestA.onreadystatechange = function () {
		if (requestA.readyState == 4) {
			//AL("A inside loadSphere requestgl.animationCount08="+gl.animationCount08+" "+gl.lower08At);
			//AL("requestA.responseText="+requestA.responseText);
			var sayVarList = false;
			//sayVarList=true; gl.counter=0; /* the gl.couner is used internally by the jsoanReviverVarList function */
			var parsedJson=JSON.parse(requestA.responseText,(sayVarList?jsonReviverVarList:null));
			handleLoadedStripSphere(parsedJson,gl[gl.lower08At],gl.lower08At);
			//AL("B inside loadSphere requestgl.animationCount08="+gl.animationCount08);
			handleLoadedStripSphere(parsedJson,gl[gl.upper08At],gl.upper08At);
			elem=document.getElementById("loadingtext");
			if(null!=elem)elem.textContent = "";
			if(isLastJson){
				gl[gl.lower08At].jsonsDone=true;
				gl[gl.upper08At].jsonsDone=true;
				//AL("gl["+gl.at+"].jsonsDone="+(gl[gl.at].jsonsDone?"true":"false"));
			}
		}
	};
	//AL("about to request.send()");
	requestA.send();
	//AL("back from request.send()");
}
function handleLoadedStripSphere(parsedJson,glSubAt,at) {
	//AL("cme@ handleLoadedSphere( with gl.at="+at+")");
	var sayAVar = false; /* toggle for the console output of a variable */
	
	gl[at].sphereTrianglesFaceXYZs = gl[at].createBuffer();
	gl[at].bindBuffer(gl.ARRAY_BUFFER, gl[at].sphereTrianglesFaceXYZs);
	for(var ii=0;ii<parsedJson.trianglesFaceXYZs.length;ii++){
		parsedJson.trianglesFaceXYZs[ii]*=.95;
	}
	gl[at].bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedJson.trianglesFaceXYZs), gl.STATIC_DRAW);
	gl[at].sphereTrianglesFaceXYZs.itemSize = 3;
	gl[at].sphereTrianglesFaceXYZs.numItems = parsedJson.trianglesFaceXYZs.length / gl[at].sphereTrianglesFaceXYZs.itemSize;


	gl[at].sphereTrianglesFaceNormals = gl[at].createBuffer();
	gl[at].bindBuffer(gl.ARRAY_BUFFER, gl[at].sphereTrianglesFaceNormals);
	gl[at].bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedJson.trianglesFaceNormals), gl.STATIC_DRAW);
	gl[at].sphereTrianglesFaceNormals.itemSize = 3;
	gl[at].sphereTrianglesFaceNormals.numItems = parsedJson.trianglesFaceNormals.length / gl[at].sphereTrianglesFaceNormals.itemSize;
	
	gl[at].sphereTrianglesFaceIndices = gl[at].createBuffer();
	gl[at].bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl[at].sphereTrianglesFaceIndices);
	gl[at].bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parsedJson.trianglesFaceIndices), gl.STATIC_DRAW);
	gl[at].sphereTrianglesFaceIndices.itemSize = 1;
	gl[at].sphereTrianglesFaceIndices.numItems = parsedJson.trianglesFaceIndices.length / gl[at].sphereTrianglesFaceIndices.itemSize;
	gl.constructAt082=gl[at].sphereTrianglesFaceIndices.numItems;
	
	//sayAVar=true;
	if(  (0==at)
	   &&(true==sayAVar)
	  ){
		AL("parsedJson.trianglesFaceXYZs [0]="+parsedJson.trianglesFaceXYZs [0]);
		AL("parsedJson.trianglesFaceNormals[0]="+parsedJson.trianglesFaceNormals[0]);
		AL("going for "+(gl[at].sphereTrianglesFaceXYZs.length / 3) +" points");
		AL("          X      Y      Z     |   U      V      W  |");
		for(var ii=0;ii<gl[at].sphereTrianglesFaceXYZs.numItems;ii++){
			//AL("going for ii="+ii);
			r=Math.sqrt( (parsedJson.trianglesFaceNormals[(3*ii)+ 0]*parsedJson.trianglesFaceNormals[(3*ii)+ 0])
			            +(parsedJson.trianglesFaceNormals[(3*ii)+ 1]*parsedJson.trianglesFaceNormals[(3*ii)+ 1])
			            +(parsedJson.trianglesFaceNormals[(3*ii)+ 2]*parsedJson.trianglesFaceNormals[(3*ii)+ 2])
			           );
			AL(sprintf("%2d %d %2d (%6.3f,%6.3f,%6.3f) (%6.3f,%6.3f,%6.3f) %5.3f %s"
				,Math.floor(ii/3)
				,ii%3
				,ii	
				,parsedJson.trianglesFaceXYZs [(3*ii)+ 0]
				,parsedJson.trianglesFaceXYZs [(3*ii)+ 1]
				,parsedJson.trianglesFaceXYZs [(3*ii)+ 2]
				,parsedJson.trianglesFaceNormals[(3*ii)+ 0]
				,parsedJson.trianglesFaceNormals[(3*ii)+ 1]
				,parsedJson.trianglesFaceNormals[(3*ii)+ 2]
				,r
				,2==ii%3?"\n":""
			));
		}
	}
	
	gl[at].sphereStripVertexXYZs = gl[at].createBuffer();
	gl[at].bindBuffer(gl.ARRAY_BUFFER, gl[at].sphereStripVertexXYZs);
	gl[at].bufferData(gl.ARRAY_BUFFER, new  Float32Array(parsedJson.stripVertexXYZs), gl.STATIC_DRAW);
	gl[at].sphereStripVertexXYZs.itemSize = 3;
	gl[at].sphereStripVertexXYZs.numItems = parsedJson.stripVertexXYZs.length / gl[at].sphereStripVertexXYZs.itemSize;
	//sayAVar=true;
	if(  (0==at)
	   &&(true==sayAVar)
	  ){
		/* AL("parsedJson.stripVertexXYZs[0]="+parsedJson.stripVertexXYZs [0]); */
		AL("going for "+gl[at].sphereStripVertexXYZs.numItems +" points");
		AL("          X      Y      Z  ");
		for(var ii=0;ii<gl[at].sphereStripVertexXYZs.numItems;ii++){
			//AL("going for ii="+ii);
			r=Math.sqrt( (parsedJson.stripVertexXYZs[(3*ii)+ 0]*parsedJson.stripVertexXYZs[(3*ii)+ 0])
			            +(parsedJson.stripVertexXYZs[(3*ii)+ 1]*parsedJson.stripVertexXYZs[(3*ii)+ 1])
			            +(parsedJson.stripVertexXYZs[(3*ii)+ 2]*parsedJson.stripVertexXYZs[(3*ii)+ 2])
			           );
			AL(sprintf("%2d %d %2d (%6.3f,%6.3f,%6.3f) %5.3f %s"
				,Math.floor(ii/3)
				,ii%3
				,ii	
				,parsedJson.stripVertexXYZs[(3*ii)+ 0]
				,parsedJson.stripVertexXYZs[(3*ii)+ 1]
				,parsedJson.stripVertexXYZs[(3*ii)+ 2]
				,r
				,2==ii%3?"\n":""
			));
		}
	}
	
	gl[at].sphereStripEdgeIndices = gl[at].createBuffer();
	gl[at].bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl[at].sphereStripEdgeIndices);
	gl[at].bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parsedJson.edgeStripIndices), gl.STATIC_DRAW);
	gl[at].sphereStripEdgeIndices.itemSize = 1;
	gl[at].sphereStripEdgeIndices.numItems = parsedJson.edgeStripIndices.length / gl[at].sphereStripEdgeIndices.itemSize;
	
	gl[at].sphereStripFaceIndices = gl[at].createBuffer();
	gl[at].bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl[at].sphereStripFaceIndices);
	gl[at].bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parsedJson.faceStripIndices), gl.STATIC_DRAW);
	gl[at].sphereStripFaceIndices.itemSize = 1;
	gl[at].sphereStripFaceIndices.numItems = parsedJson.faceStripIndices.length / gl[at].sphereStripFaceIndices.itemSize;
	gl.constructAt08=gl[at].sphereStripFaceIndices.numItems;
	
	//AL("at end of handelJSON at="+at);
}
function drawScene08() {
	//if(true==gl.talkon08)AL(sprintf("drawScene08 with gl.at=%2d gl.animationCount08=%3d",gl.at,gl.animationCount08));
	gl[gl.at].viewport(0, 0, gl[gl.at].viewportWidth, gl[gl.at].viewportHeight);
	gl[gl.at].clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	//AL("gl.at="+gl.at);	
	if (false === gl[gl.at].jsonsDone){
		//AL("early return gl.at="+gl.at);
		return;
	}
	//if(20==gl.animationCount08)AL(sprintf("drawScene08 past the nulls with gl.at=%2d gl.animationCount08=%3d",gl.at,gl.animationCount08));
	
	/**/if(20==gl.animationCount08)AL("gl.constructAt08="+gl.constructAt08);
	mat4.perspective(45, gl[gl.at].viewportWidth / gl[gl.at].viewportHeight, 0.1, 100.0, gl[gl.at].perspectiveMatrix);

	//drawTeapot();  /* before un-commenting this, be sure to also uncomment the loadTeapot() function */

	setMatrixUniforms08();
	
	var lightXYZ=vec3.create();
	if(gl[gl.at].directionalLight){
//		vec3.set(gl[gl.at].directionalLightXYZ,lightXYZ);
//		vec3.scale(lightXYZ,1000000000.);
//		mat4.multiplyVec3(gl[gl.at].mvm,lightXYZ);
//		vec3.normalize(lightXYZ);
//		//if(20==gl.animationCount08)AL(sprintf("gl[%d] gl[gl.at].directionalLightXYZ norm =%s",gl.at,vec3.printS3(lightXYZ)));
//		gl[gl.at].uniform3fv(gl[gl.at].puDirectionalLightXYZ,lightXYZ);
	} else {
		/**/if(20==gl.animationCount08)AL("false == directionalLight08");
	}
	if(gl[gl.at].pointLight){
		lightXYZ = vec3.createFrom(
			     4*Math.cos(deg2Rad*gl.rotationDegrees08)
			,6+ (4*Math.sin(deg2Rad*gl.rotationDegrees08))
			,2+ (3*Math.sin(deg2Rad*gl.rotationDegrees08*3.))
		);
		gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].pointLightSpriteXYZ);
		gl[gl.at].bufferData(gl.ARRAY_BUFFER, new Float32Array(lightXYZ), gl.STATIC_DRAW);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ , 3, gl.FLOAT, false, 0,  0);
		
		gl[gl.at].uniform3f(gl[gl.at].puMaterialEmissiveRGB,1.,1.,1.);
		gl[gl.at].drawArrays(gl.POINTS, 0, 1);
		gl[gl.at].uniform3f(gl[gl.at].puMaterialEmissiveRGB,0.,0.,0.);
		
		mat4.multiplyVec3(gl[gl.at].mvm,lightXYZ);
		//if(20==gl.animationCount08)AL(sprintf("gl[%d] gl[gl.lower08At].pointLightXYZ norm =%s",gl.at,vec3.printS3(lightXYZ)));
		gl[gl.at].uniform3fv(gl[gl.at].puPointLightXYZ,lightXYZ);
	}


	gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].sphereStripVertexXYZs);
	gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ   , gl[gl.at].sphereStripVertexXYZs.itemSize, gl.FLOAT, false, 0, 0);
	gl[gl.at].vertexAttribPointer(gl[gl.at].paNormal, gl[gl.at].sphereStripVertexXYZs.itemSize, gl.FLOAT, false, 0, 0);
	gl[gl.at].bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl[gl.at].sphereStripFaceIndices);
	if((0==gl.at)&&20==gl.animationCount08){
		AL(sprintf("@398 %5d %5d"
			,gl[gl.at].sphereStripVertexXYZs   .numItems
			,gl[gl.at].sphereStripFaceIndices  .numItems
			)
		);
		AL(sprintf("@404 %5d %5d"
			,gl[gl.at].sphereStripVertexXYZs   .itemSize
			,gl[gl.at].sphereStripFaceIndices  .itemSize
			)
		);
	}
	
	glPushMatrix();
		mat4.translate(gl[gl.at].mvm, [-6, 0, 0]);
		var counter=0;
		for(var jj=0;jj<7;jj++){
			for(var ii=0;ii<7;ii++){
				if(  (0==gl.lower08At)	
				   ||(  (0!=gl.lower08At)         /* show only the brass on left window on WegGLTutorials */
				      &&(gl.at == gl.lower08At)
				      &&(3==ii)
				      &&(1==jj)
				     )
				   ||(  (0!=gl.lower08At)      /* show only the emerald on right small window on WegGLTutorials */
				      &&(gl.at == gl.upper08At)
				      &&(3==ii)
				      &&(0==jj)
				     )
				  ){
//			setGLMaterial(gl.at,gl[gl.at].materials?ii+(7*jj):999);
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
					gl[gl.at].uniform1f (gl[gl.at].puMaterialShininess  ,gl[gl.at].materials?gl[gl.at].materialShininess:gl.shininess08);
					//AL("gl.at="+gl.at+" ");
					glPushMatrix();
						mat4.translate(gl[gl.at].mvm, [2*ii,2*jj, 0]);
						//AL(sprintf("gl.rotationDegrees08=%8.3f",gl.rotationDegrees08));
						mat4.rotate(gl[gl.at].mvm, deg2Rad*gl.rotationDegrees08, [0, 1, 0]); /* if this function gets NaN, nothing draws */
						setMatrixUniforms08();
//						gl[gl.at].drawElements(gl.TRIANGLES     ,gl[gl.at].sphereTrianglesFaceIndices.numItems, gl.UNSIGNED_SHORT, 0);
//				gl[gl.at].drawElements(gl.TRIANGLE_STRIP,gl[gl.at].sphereStripFaceIndices.numItems, gl.UNSIGNED_SHORT, 0);
						gl[gl.at].drawElements(gl.TRIANGLE_STRIP,gl.constructAt08, gl.UNSIGNED_SHORT, 0);
//						gl[gl.at].drawElements(gl.TRIANGLE_STRIP,12, gl.UNSIGNED_SHORT, 0);
					glPopMatrix();
				}
				counter++;
			}
		}
	glPopMatrix();
	
	/* this section works, just did not need it after getting the stripe to work */
//	gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].sphereTrianglesFaceXYZs);
//	gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ, gl[gl.at].sphereTrianglesFaceXYZs.itemSize, gl.FLOAT, false, 0, 0);
//	gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].sphereTrianglesFaceNormals);
//	gl[gl.at].vertexAttribPointer(gl[gl.at].paNormal, gl[gl.at].sphereTrianglesFaceNormals.itemSize, gl.FLOAT, false, 0, 0);
//	gl[gl.at].bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl[gl.at].sphereTrianglesFaceIndices);
//	if((0==gl.at)&&20==gl.animationCount08){
//		AL(sprintf("@450 %5d %5d %5d"
//			,gl[gl.at].sphereTrianglesFaceXYZs   .numItems
//			,gl[gl.at].sphereTrianglesFaceNormals.numItems
//			,gl[gl.at].sphereTrianglesFaceIndices.numItems
//			)
//		);
//		AL(sprintf("@456 %5d %5d %5d"
//			,gl[gl.at].sphereTrianglesFaceXYZs   .itemSize
//			,gl[gl.at].sphereTrianglesFaceNormals.itemSize
//			,gl[gl.at].sphereTrianglesFaceIndices.itemSize
//			)
//		);
//	}		
//	glPushMatrix();
//		mat4.translate(gl[gl.at].mvm, [-6, 0, 0]);
//		var counter=0;
//		for(var jj=0;jj<7;jj++){
//			for(var ii=0;ii<7;ii++){
//				if(  (0==gl.lower08At)	
//				   ||(  (0!=gl.lower08At)         /* show only the brass on left window on WegGLTutorials */
//				      &&(gl.at == gl.lower08At)
//				      &&(3==ii)
//				      &&(1==jj)
//				     )
//				   ||(  (0!=gl.lower08At)      /* show only the emerald on right small window on WegGLTutorials */
//				      &&(gl.at == gl.upper08At)
//				      &&(1==ii)
//				      &&(0==jj)
//				     )
//				  ){
//					setGLMaterial(gl.at,999);
//					//AL(sprintf("gl[%d]=materialAmbientRGB=%s",gl.at,vec3.printS3(gl[gl.at].materialAmbientRGB)));
//					gl[gl.at].uniform3fv(gl[gl.at].puMaterialAmbientRGB ,gl[gl.at].materialAmbientRGB );
//					gl[gl.at].uniform3fv(gl[gl.at].puMaterialDiffuseRGB ,gl[gl.at].materialDiffuseRGB );
//					gl[gl.at].uniform3fv(gl[gl.at].puMaterialSpecularRGB,gl[gl.at].materialSpecularRGB);
//					gl[gl.at].uniform1f (gl[gl.at].puMaterialShininess  ,gl[gl.at].materials?gl[gl.at].materialShininess:gl.shininess08);
//					//AL("gl.at="+gl.at+" ");
//					glPushMatrix();
//						mat4.translate(gl[gl.at].mvm, [2*ii,2*jj, 0]);
//						//AL(sprintf("gl.rotationDegrees08=%8.3f",gl.rotationDegrees08));
//						mat4.rotate(gl[gl.at].mvm, deg2Rad*gl.rotationDegrees08, [0, 1, 0]); /* if this function gets NaN, nothing draws */
//						setMatrixUniforms08();
////						gl[gl.at].drawElements(gl.TRIANGLES     ,gl[gl.at].sphereTrianglesFaceIndices.numItems, gl.UNSIGNED_SHORT, 0);
//				gl[gl.at].drawElements(gl.TRIANGLES     ,gl.constructAt082, gl.UNSIGNED_SHORT, 0);
//					glPopMatrix();
//				}
//				counter++;
//			}
//		}
//	glPopMatrix();
	
	var elem = document.getElementById(sprintf("xyzpry%d",gl.at));
	//AL("elem="+elem+" "+sprintf("xyzpry%d",gl.at));
	if(null!=elem)elem.innerHTML=xyzpryPrint();
	elem = document.getElementById(sprintf("stepTurn%d",gl.at));
	if(null!=elem)elem.innerHTML=sprintf(" step=%8.3f &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; turn=pi/%d",gl[gl.at].deltaMove,gl[gl.at].deltaTurnPiOver);

	elem = document.getElementById("construct08");
	if(null!=elem)elem.innerHTML=sprintf("Construt   At %4d",gl.constructAt08);
	elem = document.getElementById("construct082");
	if(null!=elem)elem.innerHTML=sprintf("Construt2 At %4d from %4d",Math.floor((gl.constructAt082-1)/3),gl.constructAt082);

	
	if(20==gl.animationCount08){
		//AL("at end of drawScene08");
		gl.talkon08=false;
	}
}
function setMatrixUniforms08() {
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

function animate08() {
	var timeNow = new Date().getTime();
	/**/if(-1!=gl.animationHaltAt08)AL("animateCount="+gl.animationCount08+" vs gl.animationHaltAt08="+gl.animationHaltAt08);
	if (gl.lastTime08 != 0) {
		var elapsed = timeNow - gl.lastTime08;
		if(gl.animationHaltAt08==gl.animationCount08){
			gl.animationHalt08=true;
		}	
		if(false==gl.animationHalt08){
			gl.rotationDegrees08 +=  gl.RPM * elapsed *.006;
			if(360.<gl.rotationDegrees08)gl.rotationDegrees08-=360.;
			if(  0.>gl.rotationDegrees08)gl.rotationDegrees08+=360.;
			gl.animationCount08++;
		}
		if(gl.constructHaltAt08==gl.constructCount08){
			gl.constructHalt08=true;
		}	
		if(false==gl.constructHalt08){
			gl.constructAt08++;
			if(gl[gl.at].sphereStripFaceIndices.numItems<gl.constructAt08)gl.constructAt08=3;
		}
		if(gl.constructHaltAt082==gl.constructCount082){
			gl.constructHalt082=true;
		}	
		if(false==gl.constructHalt082){
			gl.constructAt082+=3;
			if(gl[gl.at].sphereTrianglesFaceIndices.numItems<gl.constructAt082)gl.constructAt082=3;
		}
	}
	gl.lastTime08 = timeNow;
}
function tick08() {
	if(  (false==gl.animationHalt08)
	   ||(false==gl.constructHalt08)
	   ||(false==gl.constructHalt082)
	){
		requestAnimFrame(tick08);
	}
	gl.at=gl.lower08At;
	drawScene08();
	gl.at=gl.upper08At;
	drawScene08();
	
	animate08();
}
function reDraw(){
	/* general utility, needed when animation is turned off, or else your will not see any changes */
	gl.at=gl.lower08At;
	drawScene08();
	gl.at=gl.upper08At;
	drawScene08();
}
/****************  the teapot deprecated in favor of the spheres ************************/ 
function loadTeapot(isLastJson) {
	//AL("cme@ loadTeapot gl.animationCount08="+gl.animationCount08);
	var request = new XMLHttpRequest();
	request.open("GET", "json/Teapot/Teapot.json");
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			//AL(sprintf("%3d loadTeapot() request readyState==4",gl.animationCount08));
			var sayVarList = false;
			//sayVarList=true;
			var parsedJson=JSON.parse(request.responseText,(sayVarList?jsonReviverVarList:null));
			handleLoadedTeapot(parsedJson,gl.lower08At);
			handleLoadedTeapot(parsedJson,gl.upper08At);
			if(isLastJson){
				gl[gl.lower08At].jsonsDone=true;
				gl[gl.upper08At].jsonsDone=true;
				//AL("gl["+gl.at+"].jsonsDone="+(gl[gl.at].jsonsDone?"true":"false"));
			}
		}
	};
	//AL(sprintf("%3d loadTeapot() pre  requedt.send()",gl.animationCount08));
	request.send();
	//AL(sprintf("%3d loadTeapot() post requedt.send()",gl.animationCount08));
}
function handleLoadedTeapot(parsedJson,at) {
	//AL(sprintf("handelLoadedTeapot(at=%d) parsedJson.vertexXYZs.length=%d",at,parsedJson.vertexXYZs.length));
	
	gl[at].teapotXYZs = gl[at].createBuffer();
	gl[at].bindBuffer(gl.ARRAY_BUFFER, gl[at].teapotXYZs);
	gl[at].bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedJson.vertexXYZs), gl.STATIC_DRAW);
	gl[at].teapotXYZs.itemSize = 3;
	gl[at].teapotXYZs.numItems = parsedJson.vertexXYZs.length / gl[at].teapotXYZs.itemSize;
	//if(at==gl.lower08At)AL(sprintf("teapotXYZs   .numItems=%5d",gl[at].teapotXYZs.numItems));
	
	gl[at].teapotNormals = gl[at].createBuffer();
	gl[at].bindBuffer(gl.ARRAY_BUFFER, gl[at].teapotNormals);
	gl[at].bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedJson.vertexNormals), gl.STATIC_DRAW);
	gl[at].teapotNormals.itemSize = 3;
	gl[at].teapotNormals.numItems = parsedJson.vertexNormals.length / gl[at].teapotNormals.itemSize;
	//if(at==gl.lower08At)AL(sprintf("teapotNormals.numItems=%5d",gl[at].teapotNormals.numItems));
	
	gl[at].teapotIndices = gl[at].createBuffer();
	gl[at].bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl[at].teapotIndices);
	gl[at].bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parsedJson.trianglesIndices), gl.STATIC_DRAW);
	gl[at].teapotIndices.itemSize = 1;
	gl[at].teapotIndices.numItems = parsedJson.trianglesIndices.length / gl[at].teapotIndices.itemSize;
	//if(at==gl.lower08At)AL(sprintf("teapotIndices.numItems=%5d  devidedby3=%d",gl[at].teapotIndices.numItems,gl[at].teapotIndices.numItems/3));
	
	document.getElementById("loadingtext").textContent = "";
}
function drawTeapot() {
	glPushMatrix();
		//xyzpryLogView();
		//mat4.rotate(gl[gl.at].mvm, deg2Rad*23.4, [1, 0, -1]);
		
		//AL(sprintf("gl.rotationDegrees08=%8.3f",gl.rotationDegrees08));
		mat4.rotate(gl[gl.at].mvm, deg2Rad*gl.rotationDegrees08, [0, 1, 0]); /* if this function gets NaN, nothing draws */
		
		gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].teapotXYZs);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ, gl[gl.at].teapotXYZs.itemSize, gl.FLOAT, false, 0, 0);
		
		gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].teapotNormals);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paNormal, gl[gl.at].teapotNormals.itemSize, gl.FLOAT, false, 0, 0);
		
		gl[gl.at].bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl[gl.at].teapotIndices);
		setMatrixUniforms08();
	//	gl[gl.at].drawElements(gl.TRIANGLES, gl[gl.at].teapotIndices.numItems, gl.UNSIGNED_SHORT, 0);
	glPopMatrix();	
}
/***************************************   end of teapot ******************************/

/********  stuff below is GUI related *************************************************/
function setCheckMarks() {
	/* in this app both the canvases will always have the same lighting, so all the checkboxes apply to both */
	$("input[id^=lighting]").each(function (event) {
		//AL("id="+this.id+" "+gl[gl.lower08At].lighting);
		$(this).prop("checked",gl[gl.lower08At].lighting);
	});
	$("input[id^=directionalLight]").each(function (event) {
		//AL("id="+this.id+" "+gl[gl.lower08At].directionalLight);
		$(this).prop("checked",gl[gl.lower08At].directionalLight);
	});
	$("input[id^=pointLight]").each(function (event) {
		//AL("id="+this.id+" "+gl[gl.lower08At].pointLight);
		$(this).prop("checked",gl[gl.lower08At].pointLight);
	});
	$("input[id^=materials]").each(function (event) {
		//AL("id="+this.id+" "+gl[gl.lower08At].materials);
		$(this).prop("checked",gl[gl.lower08At].materials);
	});
	$("input[id^=specularHighlights]").each(function (event) {
		//AL("id="+this.id+" "+gl[gl.lower08At].specularHighlights);
		$(this).prop("checked",gl[gl.lower08At].specularHighlights);
	});
	$("input[id^=negativeDiffuse]").each(function (event) {
		//AL("id="+this.id+" "+gl[gl.lower08At].negativeDiffuse);
		$(this).prop("checked",gl[gl.lower08At].negativeDiffuse);
	});
}

/**************************************   Ambient Light  ***************************************/
function handleAmbientChange(cp) {
	//AL("Ambient ColorPicker Changed, new value = " + cp.value +" "+vec3.printS3(hexToRgb(cp.value)));
	gl[gl.lower08At].ambientLightRGB  = hexToRgb(cp.value);
	gl[gl.upper08At].ambientLightRGB = gl[gl.lower08At].ambientLightRGB;
	setAmbientUniforms(gl.lower08At);
	setAmbientUniforms(gl.upper08At);
	reDraw();
}

/**************************************  Directional Light ***************************************/
function handleDXYZSliderSlide(e, ui){
	var angle = Math.PI*(100-ui.value)/100.;
	gl[gl.lower08At].directionalLightXYZ = vec3.createFrom(Math.cos(angle),-0.3,Math.sin(angle));
	gl[gl.upper08At].directionalLightXYZ = gl[gl.lower08At].directionalLightXYZ; 
	//AL(sprintf("(%s) DLightSlider %3d angle=%8.3f ",vec3.printS3(gl[gl.at].directionalLightXYZ),ui.value,angle*rad2Deg));
	setDirectionalLight(gl.lower08At);
	setDirectionalLight(gl.upper08At);
	reDraw();
}
function handleDirectionalSpecularChange(cp) {
	//AL("Directional Specular ColorPicker Changed, new value = " + cp.value +" "+vec3.printS3(hexToRgb(cp.value)));
	gl[gl.lower08At].directionalLightSpecularRGB  = hexToRgb(cp.value);
	gl[gl.upper08At].directionalLightSpecularRGB = gl[gl.lower08At].directionalLightSpecularRGB;
	setDirectionalLight(gl.lower08At);
	setDirectionalLight(gl.upper08At);
	reDraw();
}
function handleDirectionalDiffuseChange(cp) {
	//AL("Directional Diffuse ColorPicker Changed, new value = " + cp.value +" "+vec3.printS3(hexToRgb(cp.value)));
	gl[gl.lower08At].directionalLightDiffuseRGB  = hexToRgb(cp.value);
	gl[gl.upper08At].directionalLightDiffuseRGB = gl[gl.lower08At].directionalLightDiffuseRGB;
	setDirectionalLight(gl.lower08At);
	setDirectionalLight(gl.upper08At);
	reDraw();
}
/****************************************  Point Light  ******************************************/
function handlePointSpecularChange(cp) {
	//AL("Point Specular ColorPicker Changed, new value = " + cp.value +" "+vec3.printS3(hexToRgb(cp.value)));
	gl[gl.lower08At].pointLightSpecularRGB  = hexToRgb(cp.value);
	gl[gl.upper08At].pointLightSpecularRGB= gl[gl.lower08At].pointLightSpecularRGB;
	setPointLight(gl.lower08At);
	setPointLight(gl.upper08At);
	reDraw();
}
function handlePointDiffuseChange(cp) {
	//AL("Point Diffuse ColorPicker Changed, new value = " + cp.value +" "+vec3.printS3(hexToRgb(cp.value)));
	gl[gl.lower08At].pointLightDiffuseRGB  = hexToRgb(cp.value);
	gl[gl.upper08At].pointLightDiffuseRGB = gl[gl.lower08At].pointLightDiffuseRGB;
	setPointLight(gl.lower08At);
	setPointLight(gl.upper08At);
	reDraw();
}

/**************************************   shininess  ***************************************/
function handleShininessSliderSlide(e, ui){
	gl.shininess08=ui.value/10;
	//AL("ShininessSliderSlide on the move "+ui.value +" becomming "+gl.shininess08);
	reDraw();
}
/************************************** the onReady functions ************************************/
$(document).ready(function(){
	//AL("in ready 08");
	if(-1<document.getElementById("title").innerHTML.indexOf("tutorial08")){
		//AL("inside ready for tutorial08");
		$('#tutorial08Tabs').tabs({
			active: 3,
			collapsible: false
		});
		$("input[id^=step08]").click(function (event) {
			//AL("inside08 button[id="+this.id+"]");
			//AL("looking at this.id="+this.id);
			gl.at=parseInt(this.id.charAt(this.id.length-1));
			//AL("whichCanvas="+gl.at);
			//AL("step this.id="+this.id+" this.id.substring(7,9)="+this.id.substring(7,9));
			if(   (this.id.substring(7,9) == "dn")
			   &&(.0008<gl[gl.at].deltaMove)		
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
			document.getElementById(0==gl.at?"tutorial08-canvas0":"tutorial08-canvas1").focus();
			drawScene08();
		});	
		$("input[id^=turn08]").click(function (event) {
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
			document.getElementById(0==gl.at?"tutorial08-canvas0":"tutorial08-canvas1").focus();
			drawScene08();
		});
		$("input[id^=home08]").click(function (event) {
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
			document.getElementById(0==gl.at?"tutorial08-canvas0":"tutorial08-canvas1").focus();
			drawScene08();
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
			gl[gl.lower08At].lighting  = document.getElementById(this.id).checked;
			gl[gl.upper08At].lighting = gl[gl.lower08At].lighting;
			//AL("checkBox "+this.id+" incomming is "+gl[gl.lower08At].lighting);
			gl[gl.lower08At].uniform1i(gl[gl.lower08At].puUseLighting,gl[gl.lower08At].lighting);
			gl[gl.upper08At].uniform1i(gl[gl.upper08At].puUseLighting,gl[gl.upper08At].lighting);
			setCheckMarks();
			reDraw();
		});
		$("input[id^=directionalLight]").click(function (event) {
			gl[gl.lower08At].directionalLight  = document.getElementById(this.id).checked;
			gl[gl.upper08At].directionalLight = gl[gl.lower08At].directionalLight;
			//AL("checkBox "+this.id+" incomming is "+gl[gl.lower08At].directionalLight);
			setCheckMarks();
			setDirectionalLight(gl.lower08At);
			setDirectionalLight(gl.upper08At);
			reDraw();
		});
		$("input[id^=pointLight]").click(function (event) {
			gl[gl.lower08At].pointLight  = document.getElementById(this.id).checked;
			gl[gl.upper08At].pointLight = gl[gl.lower08At].pointLight;
			//AL("checkBox "+this.id+" incomming is "+gl[gl.lower08At].pointLight);
			if(true==gl[gl.upper08At].pointLight){
				gl.at=gl.upper08At;
				xyzprySetInDegrees(   0,  -13.125, 2.75, 0,  0, 90);
			}
			setCheckMarks();
			setPointLight(gl.lower08At);
			setPointLight(gl.upper08At);
			reDraw();
		});
		$("input[id^=materials]").click(function (event) {
			gl[gl.lower08At].materials = document.getElementById(this.id).checked;
			gl[gl.upper08At].material = gl[gl.lower08At].material;
			//AL("checkBox "+this.id+" incomming is "+gl[gl.lower08At].materials);
			if(true==gl[gl.lower08At].materials){
				document.getElementById("shiner1").style.display = 'none';
				document.getElementById("shiner2").style.display = 'none';
				
				gl[gl.lower08At].directionalLightSpecularRGB = vec3.createFrom(1.0,1.0,1.0);
				gl[gl.lower08At].directionalLightDiffuseRGB  = vec3.createFrom(1.0,1.0,1.0);
				gl[gl.lower08At].pointLightSpecularRGB       = vec3.createFrom(0.8,0.8,0.8);
				gl[gl.lower08At].pointLightDiffuseRGB        = vec3.createFrom(0.8,0.8,0.8);
				
				gl[gl.upper08At].directionalLightSpecularRGB = vec3.createFrom(1.0,1.0,1.0);
				gl[gl.upper08At].directionalLightDiffuseRGB  = vec3.createFrom(1.0,1.0,1.0);
				gl[gl.upper08At].pointLightSpecularRGB       = vec3.createFrom(0.8,0.8,0.8);
				gl[gl.upper08At].pointLightDiffuseRGB        = vec3.createFrom(0.8,0.8,0.8);
				
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
				
				gl[gl.lower08At].directionalLightSpecularRGB = vec3.createFrom(0.0,1.0,0.0);
				gl[gl.lower08At].directionalLightDiffuseRGB  = vec3.createFrom(0.5,0.5,0.5);
				gl[gl.lower08At].pointLightSpecularRGB       = vec3.createFrom(0.0,0.0,1.0);
				gl[gl.lower08At].pointLightDiffuseRGB        = vec3.createFrom(0.5,0.5,0.5);
				
				gl[gl.upper08At].directionalLightSpecularRGB = vec3.createFrom(0.0,1.0,0.0);
				gl[gl.upper08At].directionalLightDiffuseRGB  = vec3.createFrom(0.5,0.5,0.5);
				gl[gl.upper08At].pointLightSpecularRGB       = vec3.createFrom(0.0,0.0,1.0);
				gl[gl.upper08At].pointLightDiffuseRGB        = vec3.createFrom(0.5,0.5,0.5);
				
				$("#directionalSpecular").spectrum("set", "#00FF00");
				$("#directionalDiffuse" ).spectrum("set", "#808080");
				$("#pointSpecular").spectrum("set", "#0000FF");
				$("#pointDiffuse" ).spectrum("set", "#808080");
				$("#ambient1").spectrum("set", "#333333");
				$("#ambient2").spectrum("set", "#333333");
			} 
			setCheckMarks();
			setDirectionalLight(gl.lower08At);
			setDirectionalLight(gl.upper08At);
			setPointLight(gl.lower08At);
			setPointLight(gl.upper08At);
			setAmbientUniforms(gl.lower08At);
			setAmbientUniforms(gl.upper08At);
			reDraw();
		});
		$("input[id^=specularHighlights]").click(function (event) {
			gl[gl.lower08At].specularHighlights = document.getElementById(this.id).checked;
			gl[gl.upper08At].specularHighlights = gl[gl.lower08At].specularHighlights;
			//AL("checkBox "+this.id+" incomming is "+gl[gl.lower08At].specularHighlights);
			gl[gl.lower08At].uniform1i(gl[gl.lower08At].puShowSpecularHighlights,gl[gl.lower08At].specularHighlights);
			gl[gl.upper08At].uniform1i(gl[gl.upper08At].puShowSpecularHighlights,gl[gl.upper08At].specularHighlights);
			setCheckMarks();
			reDraw();
		});
		$("input[id^=negativeDiffuse]").click(function (event) {
			gl[gl.lower08At].negativeDiffuse=checked  = document.getElementById(this.id).checked;
			gl[gl.upper08At].negativeDiffus = gl[gl.lower08At].negativeDiffus;
			//AL("checkBox "+this.id+" incomming is "+gl[gl.lower08At].negativeDiffuse);
			gl[gl.lower08At].uniform1i(gl[gl.lower08At].puShowNegativeDiffuse,gl[gl.lower08At].negativeDiffuse);
			gl[gl.upper08At].uniform1i(gl[gl.upper08At].puShowNegativeDiffuse,gl[gl.upper08At].negativeDiffuse);
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
		$("input[id=rotating]").click(function (event) {
			//AL("button "+this.id);
			var elem = document.getElementById(this.id);
			//AL("looking at elem.value="+elem.value);
			if(-1<elem.value.indexOf("Halt")){
				elem.value="ReStart";
				gl.animationHalt08=true;
				//AL("halting the tweening animation");
			} else {
				elem.value="  Halt ";
				gl.lastTime08=new Date().getTime();
				//AL("restarting the tweening animation");
				gl.animationHalt08=false;
				requestAnimFrame(tick08);
			}
		});

		$("input[id=rotateZero]").click(function (event) {
			//AL("button "+this.id);
			gl.rotationDegrees08=0.;
			requestAnimFrame(tick08);
		});
		$("input[id^=cullFaces]").click(function (event) {
			//AL("inside08 button[id="+this.id+"]");
			var elem = document.getElementById(this.id);
			//AL("looking at elem.value="+elem.value);
			if(-1<elem.value.indexOf("Enable")){
				elem.value=" Disable CullFace ";
				gl[gl.lower08At].enable(gl.CULL_FACE);
				gl[gl.upper08At].enable(gl.CULL_FACE);
				//AL("enabling CULL_FACE on both canvases");
			} else {
				elem.value="  Enable CullFace ";
				gl[gl.lower08At].disable(gl.CULL_FACE);
				gl[gl.upper08At].disable(gl.CULL_FACE);
				//AL("disabling CULL_FACE on both canvases");
			}
			reDraw();
		});
		$("input[id=constructing]").click(function (event) {
			//AL("button "+this.id);
			var elem = document.getElementById(this.id);
			//AL("looking at elem.value="+elem.value);
			if(-1<elem.value.indexOf("Halt")){
				elem.value="Construct ReStart";
				gl.constructHalt08=true;
				//AL("halting the construction cycling");
			} else {
				elem.value="Construct Halt ";
				//AL("starting the construction cycling");
				gl.constructHalt08=false;
				requestAnimFrame(tick08);
			}
		});
		$("input[id=constructIncrement]").click(function (event) {
			//AL("button "+this.id);
			gl.constructAt08++;
			if(gl[gl.at].sphereStripFaceIndices.numItems<gl.constructAt08)gl.constructAt08=3;
			requestAnimFrame(tick08);
		});
		$("input[id=constructDecrement]").click(function (event) {
			//AL("button "+this.id);
			gl.constructAt08--;
			if(2==gl.constructAt08){
				gl.constructAt08=gl[gl.at].sphereStripFaceIndices.numItems;
			}
			requestAnimFrame(tick08);
		});
		$("input[id=constructing2]").click(function (event) {
			//AL("button "+this.id);
			var elem = document.getElementById(this.id);
			//AL("looking at elem.value="+elem.value);
			if(-1<elem.value.indexOf("Halt")){
				elem.value="Construct2 ReStart";
				gl.constructHalt082=true;
				//AL("halting the construction cycling");
			} else {
				elem.value="Construct Halt ";
				//AL("starting the construction cycling");
				gl.constructHalt082=false;
				requestAnimFrame(tick08);
			}
		});
		$("input[id=constructIncrement2]").click(function (event) {
			//AL("button "+this.id);
			gl.constructAt082+=3;
			if(gl[gl.at].sphereTrianglesFaceIndices.numItems<gl.constructAt082)gl.constructAt082=3;
			requestAnimFrame(tick08);
		});
		$("input[id=constructDecrement2]").click(function (event) {
			//AL("button "+this.id);
			gl.constructAt082-=3;
			if(3>gl.constructAt082){
				gl.constructAt082=gl[gl.at].sphereTrianglesFaceIndices.numItems;
			}
			requestAnimFrame(tick08);
		});

	}
	$('canvas[id^="tutorial08-canvas"]')
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
				gl.at=gl.lower08At;
			} else {
				gl.at=gl.upper08At;	
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
			if(true==gl.animationHalt08){
				var thisId=document.activeElement.id;
				//AL("halted movement input.  gl.at keying off "+thisId+" left allBut1="+thisId.substring(0,thisId.length-1));
				if(thisId.substring(0,thisId.length-1) == "tutorial08-canvas"){
				    //AL("got inside.  trying for number "+Number(thisId.substring(thisId.length-1)));
					gl.at=Number(thisId.substring(thisId.length-1));;
					drawScene08();
				} 
			}
		}	
		return false; 
	});
});
function checkoutTeapotJsons(isLastJson) {
	//AL("cme@ loadFacetedSphere gl.animationCount08="+gl.animationCount08);
	var requestA = new XMLHttpRequest();
	requestA.open("GET", "json/Teapot/Teapot.json");
	requestA.onreadystatechange = function () {
		if (requestA.readyState == 4) {
			//AL("A inside loadSphere requestgl.animationCount08="+gl.animationCount08+" "+gl.lower08At);
			//AL("requestA.responseText="+requestA.responseText);
			var sayVarList = false;
			/**/sayVarList=true; gl.counter=0; /* the gl.couner is used internally by the jsoanReviverVarList function */
			var parsedJson=JSON.parse(requestA.responseText,(sayVarList?jsonReviverVarList:null));
//			handleLoadedSphere08(parsedJson,gl[gl.lower08At],gl.lower08At);
			//AL("B inside loadSphere requestgl.animationCount08="+gl.animationCount08);
//			handleLoadedSphere08(parsedJson,gl[gl.upper08At],gl.upper08At);
//			elem=document.getElementById("loadingtext");
//			if(null!=elem)elem.textContent = "";
			if(isLastJson){
				gl[gl.lower08At].jsonsDone=true;
				gl[gl.upper08At].jsonsDone=true;
				//AL("gl["+gl.at+"].jsonsDone="+(gl[gl.at].jsonsDone?"true":"false"));
			}
		}
	};
	//AL("about to request.send()");
	requestA.send();
	
	var requestB = new XMLHttpRequest();
	requestB.open("GET", "json/Teapot/GitHubTeapot.json");
	requestB.onreadystatechange = function () {
		if (requestB.readyState == 4) {
			//AL("A inside loadSphere requestgl.animationCount08="+gl.animationCount08+" "+gl.lower08At);
			//AL("requestB.responseText="+requestB.responseText);
			var sayVarList = false;
			/**/sayVarList=true; gl.counter=0; /* the gl.couner is used internally by the jsoanReviverVarList function */
			var parsedJson=JSON.parse(requestB.responseText,(sayVarList?jsonReviverVarList:null));
//			handleLoadedSphere08(parsedJson,gl[gl.lower08At],gl.lower08At);
			//AL("B inside loadSphere requestgl.animationCount08="+gl.animationCount08);
//			handleLoadedSphere08(parsedJson,gl[gl.upper08At],gl.upper08At);
//			elem=document.getElementById("loadingtext");
//			if(null!=elem)elem.textContent = "";
			if(isLastJson){
				gl[gl.lower08At].jsonsDone=true;
				gl[gl.upper08At].jsonsDone=true;
				//AL("gl["+gl.at+"].jsonsDone="+(gl[gl.at].jsonsDone?"true":"false"));
			}
		}
	};
	//AL("about to request.send()");
	requestB.send();

	var requestC = new XMLHttpRequest();
	requestC.open("GET", "json/Teapot/WebGLMMOTeapot.json");
	requestC.onreadystatechange = function () {
		if (requestC.readyState == 4) {
			//AL("A inside loadSphere requestgl.animationCount08="+gl.animationCount08+" "+gl.lower08At);
			//AL("requestC.responseText="+requestC.responseText);
			var sayVarList = false;
			/**/sayVarList=true; gl.counter=0; /* the gl.couner is used internally by the jsoanReviverVarList function */
			var parsedJson=JSON.parse(requestC.responseText,(sayVarList?jsonReviverVarList:null));
//			handleLoadedSphere08(parsedJson,gl[gl.lower08At],gl.lower08At);
			//AL("B inside loadSphere requestgl.animationCount08="+gl.animationCount08);
//			handleLoadedSphere08(parsedJson,gl[gl.upper08At],gl.upper08At);
//			elem=document.getElementById("loadingtext");
//			if(null!=elem)elem.textContent = "";
			if(isLastJson){
				gl[gl.lower08At].jsonsDone=true;
				gl[gl.upper08At].jsonsDone=true;
				//AL("gl["+gl.at+"].jsonsDone="+(gl[gl.at].jsonsDone?"true":"false"));
			}
		}
	};
	//AL("about to request.send()");
	requestC.send();
	//AL("back from request.send()");
}