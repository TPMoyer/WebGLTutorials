/*   © 2013 Thomas P Moyer  */ 

function webGLStart07() {
	//AL("cme@ webGLTutorial07.js webGLStart");
	gl.animationCount07=0;
	var canvas;
	canvas = document.getElementById("tutorial07-canvas0");
	initGL(canvas);
	gl.lower07At=gl.at;
	
	canvas = document.getElementById("tutorial07-canvas1");
	initGL(canvas);
	gl.upper07At=gl.at;
	//AL("gl.lower07At="+gl.lower07At+" gl.upper07At="+gl.upper07At);
	
	gl[gl.lower07At].numCriticalJsons2BDone=2;
	gl[gl.upper07At].numCriticalJsons2BDone=2;
	gl[gl.lower07At].numCriticalTextures2BDone=1;
	gl[gl.upper07At].numCriticalTextures2BDone=1;
	gl[gl.lower07At].numSecondaryJsons2BDone=1;
	gl[gl.upper07At].numSecondaryJsons2BDone=1;
	gl[gl.lower07At].numSecondaryTextures2BDone=4;
	gl[gl.upper07At].numSecondaryTextures2BDone=4;
	initTextures(true);
	loadSphere();
	loadTeapot();
	
	gl.at=gl.lower07At;	initShaders();
	gl.at=gl.upper07At;	initShaders();
	customizeGL07();	
	tick07();
}
function initShaders() {
	var   vertexShader = getShader(  "vertex-shader4");/* getShader uses gl.at */
	var fragmentShader = getShader("fragment-shader3");/* getShader uses gl.at */
	
	gl.textureSay=false;
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
	gl[gl.at].paTextureCoord = gl[gl.at].getAttribLocation(gl[gl.at].shaderProgram,"aTextureCoord");
	gl[gl.at].enableVertexAttribArray(gl[gl.at].paXYZ);
	gl[gl.at].enableVertexAttribArray(gl[gl.at].paNormal);
	gl[gl.at].enableVertexAttribArray(gl[gl.at].paTextureCoord);
	
	gl[gl.at].puPerspectiveMatrix      = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram,"uPerspectiveMatrix"      );
	gl[gl.at].puMvm                    = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram,"uMvm"                    );
	gl[gl.at].puNormal                 = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram,"uNormal"                 );
	gl[gl.at].puSampler                = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram,"uSampler"                );

	gl[gl.at].puShowSpecularHighlights = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram,"uShowSpecularHighlights" );
	gl[gl.at].puShowNegativeDiffuse    = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram,"uShowNegativeDiffuse"    );
	gl[gl.at].puUseTextures            = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram,"uUseTextures"            );

	gl[gl.at].puUseFullEmissivity      = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram,"uUseFullEmissivity"      );

	gl[gl.at].puUseLighting            = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram,"uUseLighting"            );
	gl[gl.at].puAmbientLightRGB        = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram,"uAmbientLightRGB"        );
	
	gl[gl.at].puUseDirectionalLight         = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram,"uUseDirectionalLight"    );	
	gl[gl.at].puDirectionalLightXYZ         = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram,"uDirectionalLightXYZ"        );
	gl[gl.at].puDirectionalLightSpecularRGB = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram,"uDirectionalLightSpecularRGB");
	gl[gl.at].puDirectionalLightDiffuseRGB  = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram,"uDirectionalLightDiffuseRGB" );
	
	gl[gl.at].puUsePointLight          = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram,"uUsePointLight"          );	
	gl[gl.at].puPointLightXYZ          = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram,"uPointLightXYZ"          );
	gl[gl.at].puPointLightSpecularRGB  = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram,"uPointLightSpecularRGB"  );
	gl[gl.at].puPointLightDiffuseRGB   = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram,"uPointLightDiffuseRGB"   );
	
	gl[gl.at].puMaterialAmbientRGB     = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uMaterialAmbientRGB"    );
	gl[gl.at].puMaterialSpecularRGB    = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uMaterialSpecularRGB"   );
	gl[gl.at].puMaterialDiffuseRGB     = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uMaterialDiffuseRGB"    );
	gl[gl.at].puMaterialShininess      = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uMaterialShininess"     );
}

function customizeGL07() {
	//AL("customizeGL07");
	//gl[gl.lower07At].texture="galvanized";
	//gl[gl.upper07At].texture="galvanized";
	//gl[gl.lower07At].shape="teapot";
	//gl[gl.upper07At].shape="teapot";
	gl[gl.lower07At].texture="earth";
	gl[gl.upper07At].texture="earth";
	gl[gl.lower07At].shape="sphere";
	gl[gl.upper07At].shape=(0==gl.lower07At?"sphere":"teapot");
	
	gl.rotationDegrees07=0.;
	
	gl.animationHalt07=false;
	gl.animationHaltAt07=-1; /* negative never stops (till rollover post 4 billion). */
	gl.constructHalt07=true;
	gl.constructAt07=0;
	gl.constructHaltAt07=-1;
	gl.constructHalt072=true;
	gl.constructAt072=0;
	gl.constructHaltAt072=-1;
	gl.rotationSpeedFactor=1.;
	//gl.animationHaltAt07=20;
	gl.lastTime07 = 0;
	gl.sayOnce07=false;
	gl.talkon07=false;
	gl.talkon07=true;
	gl.RPM = 10.;
	gl.shininess07=5.;
	
	gl[gl.lower07At].lighting           = true;
	gl[gl.lower07At].directionalLight   = true;
	gl[gl.lower07At].pointLight         = true;
	gl[gl.lower07At].materials          = false;
	gl[gl.lower07At].specularHighlights = true;
	gl[gl.lower07At].negativeDiffuse    = true;
	gl[gl.lower07At].ambientLightRGB             = vec3.createFrom(0.2,0.2,0.2);
	gl[gl.lower07At].directionalLightSpecularRGB = vec3.createFrom(1.0,1.0,1.0);
	gl[gl.lower07At].directionalLightDiffuseRGB  = vec3.createFrom(1.0,1.0,1.0);
	gl[gl.lower07At].pointLightXYZ = vec3.createFrom(  0.0,  6.0,  1.0);                  //AL(vec3.printS3(gl[gl.lower07At].pointLightXYZ)      +" initial gl[gl.lower07At].pointLightXYZ");
	gl[gl.lower07At].pointLightSpriteXYZ = gl[gl.lower07At].createBuffer(); /* the buffer for the white emissive dot that flies around */
	gl[gl.lower07At].pointLightSpecularRGB       = vec3.createFrom(0.8,0.8,0.8);
	gl[gl.lower07At].pointLightDiffuseRGB        = vec3.createFrom(0.8,0.8,0.8);
	gl[gl.lower07At].showLines=false;
	
	//AL("pre directional");
	if(0==gl.lower07At){
		var slider = selection = $("#directionalLightXYZSlider").slider( "value" );
		var angle= Math.PI*(100-slider)/100.;
		//gl[gl.lower07At].directionalLightXYZ = vec3.createFrom(Math.cos(angle),-.3,Math.sin(angle));//AL(vec3.printS3(gl[gl.lower07At].directionalLightXYZ)+" initial directionalLightXYZ");
		//gl[gl.upper07At].directionalLightXYZ = vec3.createFrom(Math.cos(angle),-.3,Math.sin(angle));//AL(vec3.printS3(gl[gl.upper07At].directionalLightXYZ)+" initial directionalLightXYZ");
		gl[gl.lower07At].directionalLightXYZ = vec3.createFrom(Math.cos(angle),-Math.sin(angle),0.);//AL(vec3.printS3(gl[gl.lower07At].directionalLightXYZ)+" initial directionalLightXYZ");
		gl[gl.upper07At].directionalLightXYZ = vec3.createFrom(Math.cos(angle),-Math.sin(angle),0.);//AL(vec3.printS3(gl[gl.upper07At].directionalLightXYZ)+" initial directionalLightXYZ");
				
	} else {
		gl[gl.lower07At].directionalLightXYZ         = vec3.createFrom(0.0,0.0,1.0);
		gl[gl.upper07At].directionalLightXYZ         = vec3.createFrom(0.0,0.0,1.0);
	}
	//AL("post directional");
	
	gl[gl.upper07At].lighting           = true;
	gl[gl.upper07At].directionalLight   = true;
	gl[gl.upper07At].pointLight         = true;
	gl[gl.upper07At].materials          = false;
	gl[gl.upper07At].specularHighlights = true;
	gl[gl.upper07At].negativeDiffuse    = true;
	gl[gl.upper07At].ambientLightRGB             = vec3.createFrom(0.2,0.2,0.2);
	gl[gl.upper07At].directionalLightSpecularRGB = vec3.createFrom(1.0,1.0,1.0);
	gl[gl.upper07At].directionalLightDiffuseRGB  = vec3.createFrom(1.0,1.0,1.0);
	gl[gl.upper07At].pointLightXYZ = vec3.createFrom(  0.0,  6.0,  1.0);                  //AL(vec3.printS3(gl[gl.lower07At].pointLightXYZ)      +" initial gl[gl.lower07At].pointLightXYZ");
	gl[gl.upper07At].pointLightSpriteXYZ = gl[gl.upper07At].createBuffer(); /* the buffer for the white emissive dot that flies around */
	gl[gl.upper07At].pointLightSpecularRGB       = vec3.createFrom(0.8,0.8,0.8);
	gl[gl.upper07At].pointLightDiffuseRGB        = vec3.createFrom(0.8,0.8,0.8);
	gl[gl.upper07At].showLines=false;
	
	for(gl.at=gl.lower07At;gl.at<=gl.upper07At;gl.at++){
		if(0==gl.lower07At){
			gl[gl.at].clearColor(0.5, 0.5, 0.5, 1.0);
		} else {
			gl[gl.at].clearColor(0.0, 0.0, 0.0, 1.0);
		}
		gl[gl.at].enable   (gl.DEPTH_TEST);
		gl[gl.at].frontFace(gl.CCW); 
		gl[gl.at].cullFace (gl.BACK); 
		if(null != document.getElementById('cullFaces')){
			//AL("setting CULL_FACE from null!=setCullFace");
			document.getElementById("cullFaces").value=" Enable CullFace ";
		} else {
			//AL("disabling CULL_FACE");
		}
		gl[gl.at].disable(gl.CULL_FACE);
		//gl[gl.at].jsonsDone=true;
		//gl[gl.at].texturesDone=true;
	}
	/*********************************************/
	//AL("setting homes");
	gl.at=gl.lower07At;
	//xyzprySetInDegrees(   0, -13,   0,  0,  0, 90);   /* 13 units South, flat and level (roof is up),  facing North */
	/* the teapot can be viewed from 43 units away */
	//xyzprySetInDegrees(   0, -43,   0,  0,  0, 90);   /* 13 units South, flat and level (roof is up),  facing North */
	//xyzprySetInDegrees(   0,  0 ,  13,-90,  0, 90);   /* 13 units Up, pointing straight down,(roof is north) */
	//xyzprySetInDegrees(   0,-30.4,13.6,-23,  0, 90);
	xyzprySetInDegrees(   0,-32.,  0,  0,  0, 90);
	xyzprySet2Home0();	
	if(0==gl.lower07At){
		//		xyzprySetInDegrees(   0,  6, 18.125,-90,  0, 90);
		//xyzprySetInDegrees(   0,  0, 40,-90,  0, 90);
		//xyzprySetInDegrees(   0,-40.,  0,  0,  0, 90);
		//xyzprySetInDegrees(   0,-32.,  0,  0,  0, 90);
		xyzprySetInDegrees(   0,-30.4,13.6,-23,  0, 90);
	} else {
		//		xyzprySetInDegrees(   1,  6, 18.125,-90,  0, 90);
		//xyzprySetInDegrees(   0,  0, 40,-90,  0, 90);
		//xyzprySetInDegrees(   0, 40,  0,  0,  0,270);
		xyzprySetInDegrees(   0, -25.878, 11.137,  -23,  0,90); /* fills most of the square for the webGLTutorials url */
	}
	xyzprySet2Home();
	gl[gl.at].deltaMove=1./8;
	gl[gl.at].deltaMove=1.;
	//xyzpryLogView();	
	gl.at=gl.upper07At;
	//xyzprySetInDegrees(  0.,30.4,13.6,-23.,  0,270);
	xyzprySetInDegrees(   0,32.,  0,  0,  0,270);
	xyzprySet2Home0();
	if(1==gl.upper07At){
		//xyzprySetInDegrees(   0,  -15,  8.5, -21.445,  0,90);    /* 13 units North, flat and level (roof is up), facing South */
		//xyzprySetInDegrees(   0,  -30.,  0., 0.,  0.,90.);
		//yzprySetInDegrees(   0,  -4.,  0., 0.,  0.,90.);
		//xyzprySetInDegrees(   0,  0, 40,-90,  0, 90);
		//xyzprySetInDegrees(   0, 40,  0,  0,  0,270);
		//xyzprySetInDegrees(   0.262,32.272,23.202,-36.534,-6.006,270);
		//xyzprySetInDegrees(   0,-40.,  0,  0,  0, 90);
		//xyzprySetInDegrees(   0,32.,  0,  0,  0,270);
		xyzprySetInDegrees(  0.,30.4,13.6,-23.,  0,270);
		
	} else {
		//xyzprySetInDegrees(   1,  6, 18.125,-90,  0, 90);
		xyzprySetInDegrees(   0, 40,  0,  0,  0,270);
	}
	xyzprySet2Home();
	//xyzpryLogView();
	gl[gl.at].deltaMove=1./8;
	gl[gl.at].deltaMove=1.;
	/*********************************************/

	setAmbientUniforms (gl.lower07At);
	setDirectionalLight(gl.lower07At);
	setPointLight      (gl.lower07At);
	
	setAmbientUniforms (gl.upper07At);
	setDirectionalLight(gl.upper07At);
	setPointLight      (gl.upper07At);
	
	setGLMaterial(gl.lower07At,999);
	setGLMaterial(gl.upper07At,999);
	
	setCheckMarks();
/*	gl[gl.at].uniform1i(gl[gl.at].puUseANormal            ,gl[gl.at].aNormal); */
	gl[gl.at].uniform1i(gl[gl.at].puUseLighting           ,gl[gl.at].lighting);
	gl[gl.at].uniform1i(gl[gl.at].puUseDirectionalLight   ,gl[gl.at].directionalLight);
	gl[gl.at].uniform1i(gl[gl.at].puUsePointLight         ,gl[gl.at].pointLight);
	gl[gl.at].uniform1i(gl[gl.at].puShowSpecularHighlights,gl[gl.at].specularHighlights);
	gl[gl.at].uniform1i(gl[gl.at].puShowNegativeDiffuse   ,gl[gl.at].negativeDiffuse);
	
	var elem = document.getElementById("xyzpry0");
	if(null!=elem)elem.innerHTML=xyzpryPrint();	
	var elem = document.getElementById("xyzpry1");
	if(null!=elem)elem.innerHTML=xyzpryPrint();
	//AL("did make it to bottom of customize07");
}

function initTextures(critical) {
	//AL("cme& initTextures()");
	if(critical){
		gl[gl.lower07At].earthTexture = gl[gl.lower07At].createTexture();
		gl[gl.upper07At].earthTexture = gl[gl.upper07At].createTexture();
		var earthImage = new Image();
		earthImage.src = "images/textures/world.topo.bathy.200407.3x"+(0==gl.lower07At?"4096x2048_B35":"256x128_B50")+".jpg";
		earthImage.onload = function () {
			handleLoadedTexture(gl[gl.lower07At].earthTexture,gl.lower07At,earthImage);
			gl[gl.lower07At].numCriticalTexturesDone++;
			handleLoadedTexture(gl[gl.upper07At].earthTexture,gl.upper07At,earthImage);
			gl[gl.upper07At].numCriticalTexturesDone++;
			//AL("got earth texture");
		};
	} else
	if(0==gl.lower07At){ /* when we are doing the small show for the webGLTorials, no need for secondary textures */
		gl[gl.lower07At].neheTexture = gl[gl.lower07At].createTexture();
		gl[gl.upper07At].neheTexture = gl[gl.upper07At].createTexture();
		var neheImage = new Image();
		neheImage.src = "images/textures/nehe.gif";
		neheImage.onload = function () {
			handleLoadedTexture(gl[gl.lower07At].neheTexture,gl.lower07At,neheImage);
			gl[gl.lower07At].numSecondaryTexturesDone++;
			handleLoadedTexture(gl[gl.upper07At].neheTexture,gl.upper07At,neheImage);
			gl[gl.upper07At].numSecondaryTexturesDone++;
		};
		
		gl[gl.lower07At].glassTexture = gl[gl.lower07At].createTexture();
		gl[gl.upper07At].glassTexture = gl[gl.upper07At].createTexture();
		var glassImage = new Image();
		glassImage.src = "images/textures/glass.gif";
		glassImage.onload = function () {
			handleLoadedTexture(gl[gl.lower07At].glassTexture,gl.lower07At,glassImage);
			gl[gl.lower07At].numSecondaryTexturesDone++;
			handleLoadedTexture(gl[gl.upper07At].glassTexture,gl.upper07At,glassImage);
			gl[gl.upper07At].numSecondaryTexturesDone++;
		};
		
		gl[gl.lower07At].tahomaTexture = gl[gl.lower07At].createTexture();
		gl[gl.upper07At].tahomaTexture = gl[gl.upper07At].createTexture();
		var tahomaImage = new Image();
		tahomaImage.src = "images/textures/Font_Var_Part_1024_TAHOMA_400_121.png";
		tahomaImage.onload = function () {
			handleLoadedTexture(gl[gl.lower07At].tahomaTexture,gl.lower07At,tahomaImage);
			gl[gl.lower07At].numSecondaryTexturesDone++;
			handleLoadedTexture(gl[gl.upper07At].tahomaTexture,gl.upper07At,tahomaImage);
			gl[gl.upper07At].numSecondaryTexturesDone++;
		};
		
		gl[gl.lower07At].galvanizedTexture = gl[gl.lower07At].createTexture();
		gl[gl.upper07At].galvanizedTexture = gl[gl.upper07At].createTexture();
		var galvanizedImage = new Image();
		galvanizedImage.src = "images/textures/arroway.de_metal+structure+06_d100_flat.jpg";
		galvanizedImage.onload = function () {
			handleLoadedTexture(gl[gl.lower07At].galvanizedTexture,gl.lower07At,galvanizedImage);
			gl[gl.lower07At].numSecondaryTexturesDone++;
			handleLoadedTexture(gl[gl.upper07At].galvanizedTexture,gl.upper07At,galvanizedImage);
			gl[gl.upper07At].numSecondaryTexturesDone++;
		};
	}	
}

function handleLoadedTexture(texture,at,image) {
	//AL("handleLoadedTexture gl.animationCount07="+gl.animationCount07+" at="+at);
	gl[at].pixelStorei   (gl.UNPACK_FLIP_Y_WEBGL, true);
	gl[at].bindTexture   (gl.TEXTURE_2D, texture);
	//if(0==at)AL("image.width,height="+texture.image.width+","+texture.image.height);
//	gl[at].texImage2D    (gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	gl[at].texImage2D    (gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	gl[at].texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl[at].texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	gl[at].generateMipmap(gl.TEXTURE_2D);
	gl[at].bindTexture   (gl.TEXTURE_2D, null);
}

function loadTeapot() {
	//AL("cme@ loadTeapot gl.animationCount07="+gl.animationCount07);
	var request = new XMLHttpRequest();
	//request.open("GET", "json/Teapot/GitHubTeapot.json"); /* lid too small */
	//request.open("GET", "json/Teapot/SmallLidTeapot.json");
	//request.open("GET", "json/Teapot/TeapotNEF.json");
	//request.open("GET", "json/Teapot/TeapotNEFT.json"); /* lid too small */
	//request.open("GET", "json/Teapot/WebGLMMOTeapot.json");
	
	request.open("GET", "json/Teapot/Teapot.json");
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			//AL(sprintf("%3d loadTeapot() request readyState==4",gl.animationCount07));
			//gl.sayVarList=true; gl.counter=0; /* the gl.couner is used internally by the jsoanReviverVarList function */
			var parsedJson=JSON.parse(request.responseText,(gl.sayVarList?jsonReviverVarList:null));
			handleLoadedTeapot(parsedJson,gl.lower07At);gl[gl.lower07At].numCriticalJsonsDone++;
			handleLoadedTeapot(parsedJson,gl.upper07At);gl[gl.upper07At].numCriticalJsonsDone++;
			//AL("got teapot json "+gl[gl.lower07At].numCriticalJsonsDone+" "+gl[gl.upper07At].numCriticalJsonsDone );
		}
	};
	//AL(sprintf("%3d loadTeapot() pre  requedt.send()",gl.animationCount07));
	request.send();
	//AL(sprintf("%3d loadTeapot() post requedt.send()",gl.animationCount07));
	}

function handleLoadedTeapot(teapotData,at) {
	/* if this messes up try running the JSON.parse(request.responseText,jsonReviverVarList):   This will put the variable list on the console */
	//AL(sprintf("handelLoadedTeapot(at=%d) teapotData.vertexTextureCoordinates.length=%d",at,teapotData.vertexTextureCoords.length));
	
	gl[at].teapotXYZs = gl[at].createBuffer();
	gl[at].bindBuffer(gl.ARRAY_BUFFER, gl[at].teapotXYZs);
	gl[at].bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotData.vertexXYZs), gl.STATIC_DRAW);
	gl[at].teapotXYZs.itemSize = 3;
	gl[at].teapotXYZs.numItems = teapotData.vertexXYZs.length / gl[at].teapotXYZs.itemSize;
	
	gl[at].teapotNormals = gl[at].createBuffer();
	gl[at].bindBuffer(gl.ARRAY_BUFFER, gl[at].teapotNormals);
	gl[at].bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotData.vertexNormals), gl.STATIC_DRAW);
	gl[at].teapotNormals.itemSize = 3;
	gl[at].teapotNormals.numItems = teapotData.vertexNormals.length / gl[at].teapotNormals.itemSize;
	
	gl[at].teapotTextureCoords = gl[at].createBuffer();
	gl[at].bindBuffer(gl.ARRAY_BUFFER, gl[at].teapotTextureCoords);
	gl[at].bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotData.vertexTextureCoords), gl.STATIC_DRAW);
	gl[at].teapotTextureCoords.itemSize = 2;
	gl[at].teapotTextureCoords.numItems = teapotData.vertexTextureCoords.length / gl[at].teapotTextureCoords.itemSize;

	gl[at].teapotIndices = gl[at].createBuffer();
	gl[at].bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl[at].teapotIndices);
	gl[at].bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(teapotData.trianglesIndices), gl.STATIC_DRAW);
	gl[at].teapotIndices.itemSize = 1;
	gl[at].teapotIndices.numItems = teapotData.trianglesIndices.length / gl[at].teapotIndices.itemSize;
}
function loadSphere() {
	//AL("cme@ loadSphere gl.animationCount07="+gl.animationCount07);
	var request = new XMLHttpRequest();
	//request.open("GET", "json/Spheres/IcosahedralSphere5120.json");
	request.open("GET", "json/Spheres/IcosahedralSphere20480.json");
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			//AL(sprintf("%3d loadSphere() request readyState==4",gl.animationCount07));
			//gl.sayVarList=true; gl.counter=0; /* the gl.couner is used internally by the jsoanReviverVarList function */
			var parsedJson=JSON.parse(request.responseText,(gl.sayVarList?jsonReviverVarList:null));
			handleLoadedSphereNormals(parsedJson,gl.lower07At);
			handleLoadedSphereNormals(parsedJson,gl.upper07At);
			handleLoadedSphere(parsedJson,gl.lower07At);gl[gl.lower07At].numCriticalJsonsDone++;
			handleLoadedSphere(parsedJson,gl.upper07At);gl[gl.upper07At].numCriticalJsonsDone++;
			//AL("got sphere json "+gl[gl.lower07At].numCriticalJsonsDone+" "+gl[gl.upper07At].numCriticalJsonsDone );
		}
	};
	//AL(sprintf("%3d loadSphere() pre  requedt.send()",gl.animationCount07));
	request.send();
	//AL(sprintf("%3d loadSphere() post requedt.send()",gl.animationCount07));
}
function handleLoadedSphereNormals(SphereData,at) {
	/* if this messes up try running the JSON.parse(request.responseText,jsonReviverVarList):   This will put the variable list on the console */
	//AL(sprintf("handelLoadedSphere(at=%d) SphereData.XYZs.length=%d",at,SphereData.XYZs.length));
	                                   gl[at].sphereNormals = gl[at].createBuffer();
	gl[at].bindBuffer(gl.ARRAY_BUFFER, gl[at].sphereNormals);
	gl[at].bufferData(gl.ARRAY_BUFFER, new Float32Array(SphereData.XYZs), gl.STATIC_DRAW);
	gl[at].sphereNormals.itemSize = 3;
	gl[at].sphereNormals.numItems = SphereData.XYZs.length / gl[at].sphereNormals.itemSize;
	//AL("numItems="+gl[at].sphereNormals.numItems);
}
function handleLoadedSphere(SphereData,at) {
	/* if this messes up try running the JSON.parse(request.responseText,jsonReviverVarList):   This will put the variable list on the console */
	//AL(sprintf("handelLoadedSphere(at=%d) SphereData.vertexTextureCoordinates.length=%d",at,SphereData.vertexTextureCoords.length));
	
	gl[at].sphereXYZs = gl[at].createBuffer();
	gl[at].bindBuffer(gl.ARRAY_BUFFER, gl[at].sphereXYZs);
	//AL("SphereData.XYZs.length="+SphereData.XYZs.length);
	if(at==gl.lower07At){
		for(var ii=0;ii<SphereData.XYZs.length;ii++){
			SphereData.XYZs[ii]*=10.;
		}
	}
	gl[at].bufferData(gl.ARRAY_BUFFER, new Float32Array(SphereData.XYZs), gl.STATIC_DRAW);
	gl[at].sphereXYZs.itemSize = 3;
	gl[at].sphereXYZs.numItems = SphereData.XYZs.length / gl[at].sphereXYZs.itemSize;
	//AL("gl["+at+"]sphereXYZs.itemSize="+gl[at].sphereXYZs.itemSize);
	
	/* because I wanted to have a smooth, non-facited earth, (and because my xyz's needed to be 10X'ed to match the teapot), I set the normals into their own function */ 
//	                                   gl[at].sphereNormals = gl[at].createBuffer();
//	gl[at].bindBuffer(gl.ARRAY_BUFFER, gl[at].sphereNormals);
//	gl[at].bufferData(gl.ARRAY_BUFFER, new Float32Array(SphereData.trianglesNormals), gl.STATIC_DRAW);
//	gl[at].sphereNormals.itemSize = 3;
//	gl[at].sphereNormals.numItems = SphereData.trianglesNormals.length / gl[at].sphereNormals.itemSize;
	
	                                   gl[at].sphereTextureCoords = gl[at].createBuffer();
	gl[at].bindBuffer(gl.ARRAY_BUFFER, gl[at].sphereTextureCoords);
	gl[at].bufferData(gl.ARRAY_BUFFER, new Float32Array(SphereData.trianglesUVs), gl.STATIC_DRAW);
	gl[at].sphereTextureCoords.itemSize = 2;
	gl[at].sphereTextureCoords.numItems = SphereData.trianglesUVs.length / gl[at].sphereTextureCoords.itemSize;
	
	                                           gl[at].sphereIndices = gl[at].createBuffer();
	gl[at].bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl[at].sphereIndices);
	gl[at].bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(SphereData.trianglesIndices), gl.STATIC_DRAW);
	gl[at].sphereIndices.itemSize = 1;
	gl[at].sphereIndices.numItems = SphereData.trianglesIndices.length / gl[at].sphereIndices.itemSize;

	/* to allow the outlines of the triangles to be visible, they need to be a little bit higher than the earth surface */
	gl[at].sphereLines = gl[at].createBuffer();
	gl[at].bindBuffer(gl.ARRAY_BUFFER, gl[at].sphereLines);
	//AL("SphereData.XYZs.length="+SphereData.XYZs.length);
	var lines = [];
	for(var ii=0;ii<SphereData.XYZs.length;ii++){
		lines.push(SphereData.XYZs[ii]*1.01);
	}	
	gl[at].bufferData(gl.ARRAY_BUFFER, new Float32Array(lines), gl.STATIC_DRAW);
	gl[at].sphereLines.itemSize = 3;
	gl[at].sphereLines.numItems = SphereData.XYZs.length / gl[at].sphereLines.itemSize;
	//AL("gl["+at+"]sphereLines.itemSize="+gl[at].sphereLines.itemSize);
	
                                               gl[at].sphereLineIndices = gl[at].createBuffer();
	gl[at].bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl[at].sphereLineIndices);
	gl[at].bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(SphereData.linesIndices), gl.STATIC_DRAW);
	gl[at].sphereLineIndices.itemSize = 1;
	gl[at].sphereLineIndices.numItems = SphereData.linesIndices.length / gl[at].sphereLineIndices.itemSize;
	//AL("sphereLineIndices.numItems="+gl[at].sphereLineIndices.numItems);
	//AL("atEndOf handleLoadedSphere("+at+")");

}

function setMatrixUniforms() {
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

function drawScene07() {
	//AL(sprintf("drawScene07 with gl.at=%2d gl.animationCount07=%3d",gl.at,gl.animationCount07));
	gl[gl.at].viewport(0, 0, gl[gl.at].viewportWidth, gl[gl.at].viewportHeight);
	gl[gl.at].clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	if (  (gl[gl.at].numCriticalJsons2BDone    > gl[gl.at].numCriticalJsonsDone)
	    ||(gl[gl.at].numCriticalTextures2BDone > gl[gl.at].numCriticalTexturesDone)
	   ) {
		if((gl.at==gl.lower07At)&&(20==gl.animationCount07))AL("even at 20=gl.animationCount07 we are at early return.  gl["+gl.at+"].tractionIteration="+gl[gl.at].tractionIteration);
		return;
	} else {
		//if((gl.at==gl.lower07At)&&(20==gl.animationCount07))AL(sprintf("drawScene07 past the nulls with gl.at=%2d gl.animationCount07=%3d",gl.at,gl.animationCount07));
		if(gl[gl.at].tractionIteration===-1){ /* this will execute only once */
			elem=document.getElementById("loadingtext");
			if(null!=elem)elem.textContent = "";
			gl[gl.at].tractionIteration=gl.animationCount07;
			initTextures(false);
		}
	}
	
	
	mat4.perspective(45, gl[gl.at].viewportWidth / gl[gl.at].viewportHeight, 0.1, 100.0, gl[gl.at].perspectiveMatrix);
	setMatrixUniforms();
	
	var lightXYZ=vec3.create();
	if(gl[gl.at].directionalLight){
		vec3.set(gl[gl.at].directionalLightXYZ,lightXYZ);
		vec3.scale(lightXYZ,1000000000.);
		mat4.multiplyVec3(gl[gl.at].mvm,lightXYZ);
		vec3.normalize(lightXYZ);
		//if((20==gl.animationCount07)&&(0==gl.at))AL(sprintf("gl[%d] gl[gl.at].directionalLightXYZ norm =%s",gl.at,vec3.printS3(lightXYZ)));
		gl[gl.at].uniform3fv(gl[gl.at].puDirectionalLightXYZ,lightXYZ);
	} else {
		/**/if((20==gl.animationCount07)&&(0==gl.at))AL("false == directionalLight07");
	}
	if(  gl[gl.at].pointLight
	   &&(0==gl.lower07At)
	  ){
		//if((20==gl.animationCount07)&&(0==gl.at))AL("we have pointlight");
		lightXYZ = vec3.createFrom(
			     13*Math.cos(deg2Rad*gl.rotationDegrees07*.12)
			,0+ (13*Math.sin(deg2Rad*gl.rotationDegrees07*.12))
			,0+ ( 1*Math.sin(deg2Rad*gl.rotationDegrees07*3.))
		);
		gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].pointLightSpriteXYZ);
		gl[gl.at].bufferData(gl.ARRAY_BUFFER, new Float32Array(lightXYZ), gl.STATIC_DRAW);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ , 3, gl.FLOAT, false, 0,  0);
		
		gl[gl.at].uniform1i(gl[gl.at].puUseFullEmissivity,1);
		gl[gl.at].drawArrays(gl.POINTS, 0, 1);
		gl[gl.at].uniform1i(gl[gl.at].puUseFullEmissivity,0);
		
		mat4.multiplyVec3(gl[gl.at].mvm,lightXYZ);
		//if(20==gl.animationCount07)AL(sprintf("gl[%d] gl[gl.lower07At].pointLightXYZ norm =%s",gl.at,vec3.printS3(lightXYZ)));
		gl[gl.at].uniform3fv(gl[gl.at].puPointLightXYZ,lightXYZ);
	}
	

	
	gl[gl.at].uniform1i(gl[gl.at].puUseTextures, gl[gl.at].texture != "none");
	gl[gl.at].activeTexture(gl.TEXTURE0);
	if (gl[gl.at].texture == "earth") {
		gl[gl.at].bindTexture(gl.TEXTURE_2D, gl[gl.at].earthTexture);
	} else if (gl[gl.at].texture == "galvanized") {
		gl[gl.at].bindTexture(gl.TEXTURE_2D, gl[gl.at].galvanizedTexture);
	} else if (gl[gl.at].texture == "nehe") {
		gl[gl.at].bindTexture(gl.TEXTURE_2D, gl[gl.at].neheTexture);
	} else if (gl[gl.at].texture == "glass") {
		gl[gl.at].bindTexture(gl.TEXTURE_2D, gl[gl.at].glassTexture);
	} else if (gl[gl.at].texture == "tahoma") {
		//if(true==gl.textureSay)AL("in tahomaTexture");
		gl[gl.at].bindTexture(gl.TEXTURE_2D, gl[gl.at].tahomaTexture);
	}
	//if((20==gl.animationCount07)&&(0==gl.at))AL("texture="+texture);
	gl.textureSay=false;
	
	glPushMatrix();
		gl[gl.at].uniform1i(gl[gl.at].puSampler, 0);
		gl[gl.at].uniform1f (gl[gl.at].puMaterialShininess  ,gl[gl.at].materials?gl[gl.at].materialShininess:gl.shininess07);
		if(gl[gl.at].shape == "teapot"){
			mat4.rotate(gl[gl.at].mvm, deg2Rad*90., [1, 0, 0]);	
			mat4.rotate(gl[gl.at].mvm, deg2Rad*23.4, [1, 0, -1]);
			mat4.rotate(gl[gl.at].mvm, deg2Rad*gl.rotationDegrees07, [0, 1, 0]);
			gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].teapotXYZs);
			gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ, gl[gl.at].teapotXYZs.itemSize, gl.FLOAT, false, 0, 0);
			
			gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].teapotTextureCoords);
			gl[gl.at].vertexAttribPointer(gl[gl.at].paTextureCoord, gl[gl.at].teapotTextureCoords.itemSize, gl.FLOAT, false, 0, 0);
			
			gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].teapotNormals);
			gl[gl.at].vertexAttribPointer(gl[gl.at].paNormal, gl[gl.at].teapotNormals.itemSize, gl.FLOAT, false, 0, 0);
			
			gl[gl.at].bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl[gl.at].teapotIndices);
			setMatrixUniforms();
			gl[gl.at].drawElements(gl.TRIANGLES, gl[gl.at].teapotIndices.numItems, gl.UNSIGNED_SHORT, 0);
		} else
		if(gl[gl.at].shape == "sphere"){
			//mat4.rotate(gl[gl.at].mvm, deg2Rad*23.4, [1, 0, -1]);
			mat4.rotate(gl[gl.at].mvm, deg2Rad*gl.rotationDegrees07, [0, 0, 1]);
			gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].sphereXYZs);
			gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ, gl[gl.at].sphereXYZs.itemSize, gl.FLOAT, false, 0, 0);
			
			gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].sphereTextureCoords);
			gl[gl.at].vertexAttribPointer(gl[gl.at].paTextureCoord, gl[gl.at].sphereTextureCoords.itemSize, gl.FLOAT, false, 0, 0);
			
			gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].sphereNormals);
			gl[gl.at].vertexAttribPointer(gl[gl.at].paNormal, gl[gl.at].sphereNormals.itemSize, gl.FLOAT, false, 0, 0);
			
			gl[gl.at].bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl[gl.at].sphereIndices);
			setMatrixUniforms();
			gl[gl.at].drawElements(gl.TRIANGLES, gl[gl.at].sphereIndices.numItems, gl.UNSIGNED_SHORT, 0);
			
//			if(true==gl[gl.at].showLines){
//				gl[gl.at].bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl[gl.at].sphereLineIndices);
//				setMatrixUniforms();
//				gl[gl.at].drawElements(gl.LINES, gl[gl.at].sphereLineIndices.numItems, gl.UNSIGNED_SHORT, 0);
//			}
			if(true==gl[gl.at].showLines){
				gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].sphereXYZs);
				gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ, gl[gl.at].sphereXYZs.itemSize, gl.FLOAT, false, 0, 0);
				
				
				gl[gl.at].bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl[gl.at].sphereLineIndices);
				setMatrixUniforms();
				gl[gl.at].uniform1i(gl[gl.at].puUseFullEmissivity,1);	
				gl[gl.at].drawElements(gl.LINES, gl[gl.at].sphereLineIndices.numItems, gl.UNSIGNED_SHORT, 0);
				gl[gl.at].uniform1i(gl[gl.at].puUseFullEmissivity,0);
			}
		}
	glPopMatrix();
	
//	var elem = document.getElementById(sprintf("xyzpry%d",gl.at));
//	//AL("elem="+elem+" "+sprintf("xyzpry%d",gl.at));
//	if(null!=elem)elem.innerHTML=xyzpryPrint();
	
	var elem = document.getElementById(sprintf("xyzpry%d",gl.at));
	//AL("elem="+elem+" "+sprintf("xyzpry%d",gl.at));
	if(null!=elem)elem.innerHTML=xyzpryPrint();
	elem = document.getElementById(sprintf("stepTurn%d",gl.at));
	if(null!=elem)elem.innerHTML=sprintf(" step=%8.3f &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; turn=pi/%d",gl[gl.at].deltaMove,gl[gl.at].deltaTurnPiOver);

}

function animate() {
	var timeNow = new Date().getTime();
	if (gl.lastTime07 != 0) {
		var elapsed = timeNow - gl.lastTime07;
		gl.rotationDegrees07 += 0.05 * elapsed*gl.rotationSpeedFactor;
		/* this was used to see which angles were the crossover points for the seems-to-be-a cube */
		if(gl.animationHaltAt07==gl.animationCount07){
			gl.animationHalt07=true;
		}	
		gl.animationCount07++;
	}
	gl.lastTime07 = timeNow;
}

function tick07() {
	if(false==gl.animationHalt07){
		requestAnimFrame(tick07);
	}
	gl.at=gl.lower07At;
	drawScene07();
	gl.at=gl.upper07At;
	drawScene07();
	
	animate();
}
function reDraw(){
	/* general utility, needed when animation is turned off, or else your will not see any changes */
	gl.at=gl.lower07At;
	drawScene07();
	gl.at=gl.upper07At;
	drawScene07();
}
function AL(message){
	$.ajax({type:"POST",url:"WebGLTutorials",data:"2log="+message});
}
/********  stuff below is GUI related *************************************************/
function setCheckMarks() {
	/* in this app both the canvases will always have the same lighting, so all the checkboxes apply to both */
	$("input[id^=lighting]").each(function (event) {
		//AL("id="+this.id+" "+gl[gl.lower07At].lighting);
		$(this).prop("checked",gl[gl.lower07At].lighting);
	});
	$("input[id^=directionalLight]").each(function (event) {
		//AL("id="+this.id+" "+gl[gl.lower07At].directionalLight);
		$(this).prop("checked",gl[gl.lower07At].directionalLight);
	});
	$("input[id^=pointLight]").each(function (event) {
		//AL("id="+this.id+" "+gl[gl.lower07At].pointLight);
		$(this).prop("checked",gl[gl.lower07At].pointLight);
	});
	$("input[id^=materials]").each(function (event) {
		//AL("id="+this.id+" "+gl[gl.lower07At].materials);
		$(this).prop("checked",gl[gl.lower07At].materials);
	});
	$("input[id^=specularHighlights]").each(function (event) {
		//AL("id="+this.id+" "+gl[gl.lower07At].specularHighlights);
		$(this).prop("checked",gl[gl.lower07At].specularHighlights);
	});
	$("input[id^=negativeDiffuse]").each(function (event) {
		//AL("id="+this.id+" "+gl[gl.lower07At].negativeDiffuse);
		$(this).prop("checked",gl[gl.lower07At].negativeDiffuse);
	});
}

/**************************************   Ambient Light  ***************************************/
function handleAmbientChange(cp) {
	//AL("Ambient ColorPicker Changed, new value = " + cp.value +" "+vec3.printS3(hexToRgb(cp.value)));
	gl[gl.lower07At].ambientLightRGB  = hexToRgb(cp.value);
	gl[gl.upper07At].ambientLightRGB = gl[gl.lower07At].ambientLightRGB;
	setAmbientUniforms(gl.lower07At);
	setAmbientUniforms(gl.upper07At);
	reDraw();
}

/**************************************  Directional Light ***************************************/
function handleDXYZSliderSlide(e, ui){
	var angle = Math.PI*(100-ui.value)/100.;
	//gl[gl.lower07At].directionalLightXYZ = vec3.createFrom(Math.cos(angle),-0.3,Math.sin(angle));
	gl[gl.lower07At].directionalLightXYZ = vec3.createFrom(Math.cos(angle),-Math.sin(angle),0.);
	gl[gl.upper07At].directionalLightXYZ = gl[gl.lower07At].directionalLightXYZ; 
	//AL(sprintf("(%s) DLightSlider %3d angle=%8.3f ",vec3.printS3(gl[gl.at].directionalLightXYZ),ui.value,angle*rad2Deg));
	setDirectionalLight(gl.lower07At);
	setDirectionalLight(gl.upper07At);
	reDraw();
}
function handleDirectionalSpecularChange(cp) {
	//AL("Directional Specular ColorPicker Changed, new value = " + cp.value +" "+vec3.printS3(hexToRgb(cp.value)));
	gl[gl.lower07At].directionalLightSpecularRGB  = hexToRgb(cp.value);
	gl[gl.upper07At].directionalLightSpecularRGB = gl[gl.lower07At].directionalLightSpecularRGB;
	setDirectionalLight(gl.lower07At);
	setDirectionalLight(gl.upper07At);
	reDraw();
}
function handleDirectionalDiffuseChange(cp) {
	//AL("Directional Diffuse ColorPicker Changed, new value = " + cp.value +" "+vec3.printS3(hexToRgb(cp.value)));
	gl[gl.lower07At].directionalLightDiffuseRGB  = hexToRgb(cp.value);
	gl[gl.upper07At].directionalLightDiffuseRGB = gl[gl.lower07At].directionalLightDiffuseRGB;
	setDirectionalLight(gl.lower07At);
	setDirectionalLight(gl.upper07At);
	reDraw();
}
/****************************************  Point Light  ******************************************/
function handlePointSpecularChange(cp) {
	//AL("Point Specular ColorPicker Changed, new value = " + cp.value +" "+vec3.printS3(hexToRgb(cp.value)));
	gl[gl.lower07At].pointLightSpecularRGB  = hexToRgb(cp.value);
	gl[gl.upper07At].pointLightSpecularRGB= gl[gl.lower07At].pointLightSpecularRGB;
	setPointLight(gl.lower07At);
	setPointLight(gl.upper07At);
	reDraw();
}
function handlePointDiffuseChange(cp) {
	//AL("Point Diffuse ColorPicker Changed, new value = " + cp.value +" "+vec3.printS3(hexToRgb(cp.value)));
	gl[gl.lower07At].pointLightDiffuseRGB  = hexToRgb(cp.value);
	gl[gl.upper07At].pointLightDiffuseRGB = gl[gl.lower07At].pointLightDiffuseRGB;
	setPointLight(gl.lower07At);
	setPointLight(gl.upper07At);
	reDraw();
}

/**************************************   shininess  ***************************************/
function handleShininessSliderSlide(e, ui){
	gl.shininess07=ui.value/10; /* this gets used/set in the onDraw function */
	//AL("ShininessSliderSlide on the move "+ui.value +" becomming "+gl.shininess07);
	reDraw();
}
/**************************************  Rotation Speed ***************************************/
function handleRotationSpeedSliderSlide(e, ui){
	if(ui.value < 5){ gl.rotationSpeedFactor=0.;
	}
	else{
		gl.rotationSpeedFactor=1+(2.*((ui.value-5.)/47.5)-1.);
	}
	//AL(sprintf("slider at %6.3ff  %6.3f %6.3f",ui.value,gl.rotationSpeedFactor,((ui.value-5.)/47.5) ));
	reDraw();
}
/************************************** the onReady functions ************************************/
$(document).ready(function(){
	//AL("in ready 07");
	if(-1<document.getElementById("title").innerHTML.indexOf("tutorial07")){
		//AL("inside ready for tutorial07");
		$('#tutorial07Tabs').tabs({
			active: 0,
			collapsible: false
		});
		$("input[id^=lighting]").click(function (event) {
			gl[gl.lower07At].lighting  = document.getElementById(this.id).checked;
			gl[gl.upper07At].lighting = gl[gl.lower07At].lighting;
			//AL("checkBox "+this.id+" incomming is "+gl[gl.lower07At].lighting);
			gl[gl.lower07At].uniform1i(gl[gl.lower07At].puUseLighting,gl[gl.lower07At].lighting);
			gl[gl.upper07At].uniform1i(gl[gl.upper07At].puUseLighting,gl[gl.upper07At].lighting);
			//setCheckMarks();
			reDraw();
		});
//		$("input[id^=textures]").click(function (event) {
//			gl[gl.lower07At].useTextures  = document.getElementById(this.id).checked;
//			gl[gl.upper07At].useTextures = gl[gl.lower07At].useTextures;
//			//AL("checkBox "+this.id+" incomming is "+gl[gl.lower07At].useTextures);
//			gl[gl.lower07At].uniform1i(gl[gl.lower07At].puUseTextures,gl[gl.lower07At].useTextures);
//			gl[gl.upper07At].uniform1i(gl[gl.upper07At].puUseTextures,gl[gl.upper07At].useTextures);
//			//setCheckMarks();
//			reDraw();
//		});
		$("input[id^=tex]").click(function (event) {
			var switchVar=parseFloat(this.id.substring(this.id.length-2,this.id.length));
			//AL("inside tex (texture) radio button[id="+this.id+"] num="+switchVar+" from "+(this.id.length-2)+" "+this.id.length);
			switch(switchVar){
				case 0://texture="none";
					gl[gl.lower07At].texture="none";
					gl[gl.upper07At].texture="none";
					break;
				case 1://texture="Galvanized";
					gl[gl.lower07At].texture="galvanized";
					gl[gl.upper07At].texture="galvanized";
					break;
				case 2://texture="Earth";
					gl[gl.lower07At].texture="earth";
					gl[gl.upper07At].texture="earth";
					break;
				case 3://texture="NeHe";
					gl[gl.lower07At].texture="nehe";
					gl[gl.upper07At].texture="nehe";
					break;
				case 4://texture="StainedGlass";
					gl[gl.lower07At].texture="glass";
					gl[gl.upper07At].texture="glass";
					break;
				case 5:
					gl[gl.lower07At].texture="tahoma";
					gl[gl.upper07At].texture="tahoma";
					break;
				default://texture="Galvanized";
					gl[gl.lower07At].texture="galvanized";
					gl[gl.upper07At].texture="galvanized";
			}
			gl.textureSay=true;
			reDraw();
		});	
		$("input[id^=shape]").click(function (event) {
			var switchVar=parseFloat(this.id.substring(this.id.length-2,this.id.length));
			//AL("inside shape radio button[id="+this.id+"] num="+switchVar);
			switch(switchVar){
				case 0://shape="none";
					gl[gl.lower07At].shape="teapot";
					gl[gl.upper07At].shape="teapot";
					break;
				case 1://shape="Galvanized";
					gl[gl.lower07At].shape="sphere";
					gl[gl.upper07At].shape="sphere";
					gl.at=gl.lower07At;
					xyzprySetInDegrees(   0,-40,  0,  0,  0, 90);
					gl.at=gl.upper07At;
					xyzprySetInDegrees(   0, 40,  0,  0,  0,270);
					break;
				case 2://shape="Earth";
					gl[gl.lower07At].shape="cube";
					gl[gl.upper07At].shape="cube";
					break;
				case 3://shape="NeHe";
					gl[gl.lower07At].shape="icosahedron";
					gl[gl.upper07At].shape="icosahedron";
					break;
				default://shape="Galvanized";
					gl[gl.lower07At].shape="teapot";
					gl[gl.upper07At].shape="teapot";
			}
			reDraw();
		});	
		$("input[id=sphereLines]").click(function (event) {
			var checked=this.checked;
			//AL("inside sphereLines button checked="+checked);
			gl[gl.lower07At].showLines=checked;
			gl[gl.upper07At].showLines=checked;
			if(checked){
				gl.rotationSpeedFactor*=.1;
			} else {
				gl.rotationSpeedFactor*=10.;
			}
			reDraw();
		});	
		$("input[id^=step07]").click(function (event) {
			//AL("inside07 button[id="+this.id+"]");
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
			document.getElementById(0==gl.at?"tutorial07-canvas0":"tutorial07-canvas1").focus();
			drawScene07();
		});	
		$("input[id^=turn07]").click(function (event) {
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
			document.getElementById(0==gl.at?"tutorial07-canvas0":"tutorial07-canvas1").focus();
			drawScene07();
		});
		$("input[id^=home07]").click(function (event) {
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
			document.getElementById(0==gl.at?"tutorial07-canvas0":"tutorial07-canvas1").focus();
			drawScene07();
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
		$("#rotationSpeedSlider").slider({
			animate: true,
			value: 50,
			slide: handleRotationSpeedSliderSlide
		});		
		$("input[id^=directionalLight]").click(function (event) {
			gl[gl.lower07At].directionalLight  = document.getElementById(this.id).checked;
			gl[gl.upper07At].directionalLight = gl[gl.lower07At].directionalLight;
			//AL("checkBox "+this.id+" incomming is "+gl[gl.lower07At].directionalLight);
			setCheckMarks();
			setDirectionalLight(gl.lower07At);
			setDirectionalLight(gl.upper07At);
			reDraw();
		});
		$("input[id^=pointLight]").click(function (event) {
			gl[gl.lower07At].pointLight  = document.getElementById(this.id).checked;
			gl[gl.upper07At].pointLight = gl[gl.lower07At].pointLight;
			//AL("checkBox "+this.id+" incomming is "+gl[gl.lower07At].pointLight);
//			if(true==gl[gl.upper07At].pointLight){
//				gl.at=gl.lower07At;
//				xyzprySetInDegrees(   0,  6 ,  18.5,-90,  0, 90);
//				gl.at=gl.upper07At;
//				xyzprySetInDegrees(   0,  -13.125, 2.75, 0,  0, 90);
//			}
			setCheckMarks();
			setPointLight(gl.lower07At);
			setPointLight(gl.upper07At);
			reDraw();
		});
		$("input[id^=materials]").click(function (event) {
			gl[gl.lower07At].materials = document.getElementById(this.id).checked;
			gl[gl.upper07At].material = gl[gl.lower07At].material;
			//AL("checkBox "+this.id+" incomming is "+gl[gl.lower07At].materials);
			if(true==gl[gl.lower07At].materials){
				document.getElementById("shiner1").style.display = 'none';
				document.getElementById("shiner2").style.display = 'none';
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

				AL("launching from spectrum set");
				$("#directionalSpecular").spectrum("set", "#00FF00");
				$("#directionalDiffuse" ).spectrum("set", "#808080");
				$("#pointSpecular").spectrum("set", "#0000FF");
				$("#pointDiffuse" ).spectrum("set", "#808080");
				$("#ambient1").spectrum("set", "#333333");
				$("#ambient2").spectrum("set", "#333333");
			} 
			setCheckMarks();
			reDraw();
		});
		$("input[id^=specularHighlights]").click(function (event) {
			gl[gl.lower07At].specularHighlights = document.getElementById(this.id).checked;
			gl[gl.upper07At].specularHighlights = gl[gl.lower07At].specularHighlights;
			//AL("checkBox "+this.id+" incomming is "+gl[gl.lower07At].specularHighlights);
			gl[gl.lower07At].uniform1i(gl[gl.lower07At].puShowSpecularHighlights,gl[gl.lower07At].specularHighlights);
			gl[gl.upper07At].uniform1i(gl[gl.upper07At].puShowSpecularHighlights,gl[gl.upper07At].specularHighlights);
			setCheckMarks();
			reDraw();
		});
		$("input[id^=negativeDiffuse]").click(function (event) {
			gl[gl.lower07At].negativeDiffuse=checked  = document.getElementById(this.id).checked;
			gl[gl.upper07At].negativeDiffus = gl[gl.lower07At].negativeDiffus;
			//AL("checkBox "+this.id+" incomming is "+gl[gl.lower07At].negativeDiffuse);
			gl[gl.lower07At].uniform1i(gl[gl.lower07At].puShowNegativeDiffuse,gl[gl.lower07At].negativeDiffuse);
			gl[gl.upper07At].uniform1i(gl[gl.upper07At].puShowNegativeDiffuse,gl[gl.upper07At].negativeDiffuse);
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
			//AL("inside07 button[id="+this.id+"]");
			var elem = document.getElementById(this.id);
			//AL("looking at elem.value="+elem.value);
			if(-1<elem.value.indexOf("Enable")){
				elem.value=" Disable CullFace ";
				gl[gl.lower07At].enable(gl.CULL_FACE);
				gl[gl.upper07At].enable(gl.CULL_FACE);
				//AL("enabling CULL_FACE on both canvases");
			} else {
				elem.value="  Enable CullFace ";
				gl[gl.lower07At].disable(gl.CULL_FACE);
				gl[gl.upper07At].disable(gl.CULL_FACE);
				//AL("disabling CULL_FACE on both canvases");
			}
			reDraw();
		});
	}
	$('canvas[id^="tutorial07-canvas"]')
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
				gl.at=gl.lower07At;
			} else {
				gl.at=gl.upper07At;	
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
				//AL("keycode for the (currently undefined action) key just struck is="+event.keyCode);
			}
			if(true==gl.animationHalt07){
				var thisId=document.activeElement.id;
				//AL("halted movement input.  gl.at keying off "+thisId+" left allBut1="+thisId.substring(0,thisId.length-1));
				if(thisId.substring(0,thisId.length-1) == "tutorial07-canvas"){
				    //AL("got inside.  trying for number "+Number(thisId.substring(thisId.length-1)));
					gl.at=Number(thisId.substring(thisId.length-1));;
					drawScene07();
				} 
			}
		}	
		return false; 
	});
});