/*   © 2014 Thomas P Moyer  */

function webGLStart08() {
	//AL("cme@ webGLTutorial08.js webGLStart");
	gl.animationCount08=0;
	var canvas;
	canvas = document.getElementById("tutorial08-canvas0");
	initGL(canvas);
	gl.lower08At=gl.at;
	
	canvas = document.getElementById("tutorial08-canvas1");
	initGL(canvas);
	gl.upper08At=gl.at;
	//AL("gl.lower08At="+gl.lower08At+" gl.upper08At="+gl.upper08At);
	
	gl[gl.lower08At].numCriticalJsons2BDone=2;
	gl[gl.upper08At].numCriticalJsons2BDone=2;
	gl[gl.lower08At].numCriticalTextures2BDone=1;
	gl[gl.upper08At].numCriticalTextures2BDone=1;
	gl[gl.lower08At].numSecondaryJsons2BDone=2;
	gl[gl.upper08At].numSecondaryJsons2BDone=2;
	gl[gl.lower08At].numSecondaryTextures2BDone=4;
	gl[gl.upper08At].numSecondaryTextures2BDone=4;
	initTextures(true);
	loadSphere();
	loadTeapot();
	loadFont();

	//genSquares();
	
	gl.at=gl.lower08At;	initShaders();
	gl.at=gl.upper08At;	initShaders();
	customizeGL08();	
	tick08();
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

function customizeGL08() {
	//AL("customizeGL08");
	//gl[gl.lower08At].texture="galvanized";
	//gl[gl.upper08At].texture="galvanized";
	//gl[gl.lower08At].shape="teapot";
	//gl[gl.upper08At].shape="teapot";
	gl[gl.lower08At].texture="earth";
	gl[gl.upper08At].texture="earth";
	gl[gl.lower08At].shape="sphere";
	gl[gl.upper08At].shape=(0==gl.lower08At?"sphere":"teapot");
	
	gl[gl.lower08At].shape="cube";
	gl[gl.upper08At].shape="cube";
	gl[gl.lower08At].texture="tahoma";
	gl[gl.upper08At].texture="tahoma";
	
	gl.rotationDegrees08=0.;
	
	gl.animationHalt08=false;
	gl.animationHaltAt08=-1; /* negative never stops (till rollover post 4 billion). */
//	gl.constructHalt08=true;
//	gl.constructAt08=0;
//	gl.constructHaltAt08=-1;
//	gl.constructHalt082=true;
//	gl.constructAt082=0;
//	gl.constructHaltAt082=-1;
	gl.rotationSpeedFactor=1.;
	gl.rotationSpeedFactor=0.;
	//gl.animationHaltAt08=20;
	gl.lastTime08 = 0;
	gl.sayOnce08=false;
	gl.talkon08=false;
	gl.talkon08=true;
	gl.RPM = 10.;
	gl.shininess08=5.;
	
	gl[gl.lower08At].lighting           = true;
	gl[gl.lower08At].directionalLight   = true;
	gl[gl.lower08At].pointLight         = true;
	gl[gl.lower08At].materials          = false;
	gl[gl.lower08At].specularHighlights = true;
	gl[gl.lower08At].negativeDiffuse    = true;
	gl[gl.lower08At].ambientLightRGB             = vec3.createFrom(0.2,0.2,0.2);
	gl[gl.lower08At].directionalLightSpecularRGB = vec3.createFrom(1.0,1.0,1.0);
	gl[gl.lower08At].directionalLightDiffuseRGB  = vec3.createFrom(1.0,1.0,1.0);
	gl[gl.lower08At].pointLightXYZ = vec3.createFrom(  0.0,  6.0,  1.0);                  //AL(vec3.printS3(gl[gl.lower08At].pointLightXYZ)      +" initial gl[gl.lower08At].pointLightXYZ");
	gl[gl.lower08At].pointLightSpriteXYZ = gl[gl.lower08At].createBuffer(); /* the buffer for the white emissive dot that flies around */
	gl[gl.lower08At].pointLightSpecularRGB       = vec3.createFrom(0.8,0.8,0.8);
	gl[gl.lower08At].pointLightDiffuseRGB        = vec3.createFrom(0.8,0.8,0.8);
	gl[gl.lower08At].showLines=false;
	
	//AL("pre directional");
	if(0==gl.lower08At){
		var slider = selection = $("#directionalLightXYZSlider").slider( "value" );
		var angle= Math.PI*(100-slider)/100.;
		//gl[gl.lower08At].directionalLightXYZ = vec3.createFrom(Math.cos(angle),-.3,Math.sin(angle));//AL(vec3.printS3(gl[gl.lower08At].directionalLightXYZ)+" initial directionalLightXYZ");
		//gl[gl.upper08At].directionalLightXYZ = vec3.createFrom(Math.cos(angle),-.3,Math.sin(angle));//AL(vec3.printS3(gl[gl.upper08At].directionalLightXYZ)+" initial directionalLightXYZ");
		gl[gl.lower08At].directionalLightXYZ = vec3.createFrom(Math.cos(angle),-Math.sin(angle),0.);//AL(vec3.printS3(gl[gl.lower08At].directionalLightXYZ)+" initial directionalLightXYZ");
		gl[gl.upper08At].directionalLightXYZ = vec3.createFrom(Math.cos(angle),-Math.sin(angle),0.);//AL(vec3.printS3(gl[gl.upper08At].directionalLightXYZ)+" initial directionalLightXYZ");
				
	} else {
		gl[gl.lower08At].directionalLightXYZ         = vec3.createFrom(0.0,0.0,1.0);
		gl[gl.upper08At].directionalLightXYZ         = vec3.createFrom(0.0,0.0,1.0);
	}
	//AL("post directional");
	
	gl[gl.upper08At].lighting           = true;
	gl[gl.upper08At].directionalLight   = true;
	gl[gl.upper08At].pointLight         = true;
	gl[gl.upper08At].materials          = false;
	gl[gl.upper08At].specularHighlights = true;
	gl[gl.upper08At].negativeDiffuse    = true;
	gl[gl.upper08At].ambientLightRGB             = vec3.createFrom(0.2,0.2,0.2);
	gl[gl.upper08At].directionalLightSpecularRGB = vec3.createFrom(1.0,1.0,1.0);
	gl[gl.upper08At].directionalLightDiffuseRGB  = vec3.createFrom(1.0,1.0,1.0);
	gl[gl.upper08At].pointLightXYZ = vec3.createFrom(  0.0,  6.0,  1.0);                  //AL(vec3.printS3(gl[gl.lower08At].pointLightXYZ)      +" initial gl[gl.lower08At].pointLightXYZ");
	gl[gl.upper08At].pointLightSpriteXYZ = gl[gl.upper08At].createBuffer(); /* the buffer for the white emissive dot that flies around */
	gl[gl.upper08At].pointLightSpecularRGB       = vec3.createFrom(0.8,0.8,0.8);
	gl[gl.upper08At].pointLightDiffuseRGB        = vec3.createFrom(0.8,0.8,0.8);
	gl[gl.upper08At].showLines=false;
	
	for(gl.at=gl.lower08At;gl.at<=gl.upper08At;gl.at++){
		if(0==gl.lower08At){
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
	gl.at=gl.lower08At;
	//xyzprySetInDegrees(   0, -13,   0,  0,  0, 90);   /* 13 units South, flat and level (roof is up),  facing North */
	/* the teapot can be viewed from 43 units away */
	//xyzprySetInDegrees(   0, -43,   0,  0,  0, 90);   /* 13 units South, flat and level (roof is up),  facing North */
	//xyzprySetInDegrees(   0,  0 ,  13,-90,  0, 90);   /* 13 units Up, pointing straight down,(roof is north) */
	//xyzprySetInDegrees(   0,-30.4,13.6,-23,  0, 90);
	xyzprySetInDegrees(   0,-32.,  0,  0,  0, 90);
	xyzprySet2Home0();	
	if(0==gl.lower08At){
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
	gl.at=gl.upper08At;
	//xyzprySetInDegrees(  0.,30.4,13.6,-23.,  0,270);
	xyzprySetInDegrees(   0,32.,  0,  0,  0,270);
	xyzprySet2Home0();
	if(1==gl.upper08At){
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

	setAmbientUniforms (gl.lower08At);
	setDirectionalLight(gl.lower08At);
	setPointLight      (gl.lower08At);
	
	setAmbientUniforms (gl.upper08At);
	setDirectionalLight(gl.upper08At);
	setPointLight      (gl.upper08At);
	
	setGLMaterial(gl.lower08At,999);
	setGLMaterial(gl.upper08At,999);
	
	setCheckMarks();
/*	gl[gl.at].uniform1i(gl[gl.at].puUseANormal            ,gl[gl.at].aNormal); */
	gl[gl.at].uniform1i(gl[gl.at].puUseLighting           ,gl[gl.at].lighting);
	gl[gl.at].uniform1i(gl[gl.at].puUseDirectionalLight   ,gl[gl.at].directionalLight);
	gl[gl.at].uniform1i(gl[gl.at].puUsePointLight         ,gl[gl.at].pointLight);
	gl[gl.at].uniform1i(gl[gl.at].puShowSpecularHighlights,gl[gl.at].specularHighlights);
	gl[gl.at].uniform1i(gl[gl.at].puShowNegativeDiffuse   ,gl[gl.at].negativeDiffuse);
	
	var elem = document.getElementById("xyzpry0");
	if(null!=elem)elem.innerHTML=xyzpryPrint();	
	elem = document.getElementById("xyzpry1");
	if(null!=elem)elem.innerHTML=xyzpryPrint();
	//AL("did make it to bottom of customize08");
}

function initTextures(critical) {
	//AL("cme& initTextures()");
	if(critical){
		gl[gl.lower08At].earthTexture = gl[gl.lower08At].createTexture();
		gl[gl.upper08At].earthTexture = gl[gl.upper08At].createTexture();
		var earthImage = new Image();
		earthImage.src = "images/textures/world.topo.bathy.200407.3x"+(0==gl.lower08At?"4096x2048_B35":"256x128_B50")+".jpg";
		earthImage.onload = function () {
			handleLoadedTexture(gl[gl.lower08At].earthTexture,gl.lower08At,earthImage);
			gl[gl.lower08At].numCriticalTexturesDone++;
			handleLoadedTexture(gl[gl.upper08At].earthTexture,gl.upper08At,earthImage);
			gl[gl.upper08At].numCriticalTexturesDone++;
			//AL("got earth texture");
		};
	} else
	if(0==gl.lower08At){ /* when we are doing the small show for the webGLTorials, no need for secondary textures */
		gl[gl.lower08At].neheTexture = gl[gl.lower08At].createTexture();
		gl[gl.upper08At].neheTexture = gl[gl.upper08At].createTexture();
		var neheImage = new Image();
		neheImage.src = "images/textures/nehe.gif";
		neheImage.onload = function () {
			handleLoadedTexture(gl[gl.lower08At].neheTexture,gl.lower08At,neheImage);
			gl[gl.lower08At].numSecondaryTexturesDone++;
			handleLoadedTexture(gl[gl.upper08At].neheTexture,gl.upper08At,neheImage);
			gl[gl.upper08At].numSecondaryTexturesDone++;
		};
		
		gl[gl.lower08At].glassTexture = gl[gl.lower08At].createTexture();
		gl[gl.upper08At].glassTexture = gl[gl.upper08At].createTexture();
		var glassImage = new Image();
		glassImage.src = "images/textures/glass.gif";
		glassImage.onload = function () {
			handleLoadedTexture(gl[gl.lower08At].glassTexture,gl.lower08At,glassImage);
			gl[gl.lower08At].numSecondaryTexturesDone++;
			handleLoadedTexture(gl[gl.upper08At].glassTexture,gl.upper08At,glassImage);
			gl[gl.upper08At].numSecondaryTexturesDone++;
		};
		
		gl[gl.lower08At].tahomaTexture = gl[gl.lower08At].createTexture();
		gl[gl.upper08At].tahomaTexture = gl[gl.upper08At].createTexture();
		var tahomaImage = new Image();
		//tahomaImage.src = "images/textures/Font_1024_Var_Part_TAHOMA_400_121.png";
		tahomaImage.src = "images/textures/Font_1024_Var_Part_TAHOMA_400_121_Construct.png";
		tahomaImage.onload = function () {
			handleLoadedTexture(gl[gl.lower08At].tahomaTexture,gl.lower08At,tahomaImage);
			gl[gl.lower08At].numSecondaryTexturesDone++;
			handleLoadedTexture(gl[gl.upper08At].tahomaTexture,gl.upper08At,tahomaImage);
			gl[gl.upper08At].numSecondaryTexturesDone++;
		};
		
		gl[gl.lower08At].galvanizedTexture = gl[gl.lower08At].createTexture();
		gl[gl.upper08At].galvanizedTexture = gl[gl.upper08At].createTexture();
		var galvanizedImage = new Image();
		galvanizedImage.src = "images/textures/arroway.de_metal+structure+06_d100_flat.jpg";
		galvanizedImage.onload = function () {
			handleLoadedTexture(gl[gl.lower08At].galvanizedTexture,gl.lower08At,galvanizedImage);
			gl[gl.lower08At].numSecondaryTexturesDone++;
			handleLoadedTexture(gl[gl.upper08At].galvanizedTexture,gl.upper08At,galvanizedImage);
			gl[gl.upper08At].numSecondaryTexturesDone++;
		};
	}	
}

function handleLoadedTexture(texture,at,image) {
	//AL("handleLoadedTexture gl.animationCount08="+gl.animationCount08+" at="+at);
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
	//AL("cme@ loadTeapot gl.animationCount08="+gl.animationCount08);
	var request = new XMLHttpRequest();
	//request.open("GET", "json/Teapot/GitHubTeapot.json"); /* lid too small */
	//request.open("GET", "json/Teapot/SmallLidTeapot.json");
	//request.open("GET", "json/Teapot/TeapotNEF.json");
	//request.open("GET", "json/Teapot/TeapotNEFT.json"); /* lid too small */
	//request.open("GET", "json/Teapot/WebGLMMOTeapot.json");
	
	request.open("GET", "json/Teapot/Teapot.json");
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			//AL(sprintf("%3d loadTeapot() request readyState==4",gl.animationCount08));
			//gl.sayVarList=true; gl.counter=0; /* the gl.couner is used internally by the jsoanReviverVarList function */
			var parsedJson=JSON.parse(request.responseText,(gl.sayVarList?jsonReviverVarList:null));
			handleLoadedTeapot(parsedJson,gl.lower08At);gl[gl.lower08At].numCriticalJsonsDone++;
			handleLoadedTeapot(parsedJson,gl.upper08At);gl[gl.upper08At].numCriticalJsonsDone++;
			//AL("got teapot json "+gl[gl.lower08At].numCriticalJsonsDone+" "+gl[gl.upper08At].numCriticalJsonsDone );
		}
	};
	//AL(sprintf("%3d loadTeapot() pre  requedt.send()",gl.animationCount08));
	request.send();
	//AL(sprintf("%3d loadTeapot() post requedt.send()",gl.animationCount08));
}
function loadFont() {
	//AL("cme@ loadTeapot gl.animationCount08="+gl.animationCount08);
	var request = new XMLHttpRequest();
	//request.open("GET", "json/Teapot/GitHubTeapot.json"); /* lid too small */
	//request.open("GET", "json/Teapot/SmallLidTeapot.json");
	//request.open("GET", "json/Teapot/TeapotNEF.json");
	//request.open("GET", "json/Teapot/TeapotNEFT.json"); /* lid too small */
	//request.open("GET", "json/Teapot/WebGLMMOTeapot.json");
	request.open("GET", "json/Fonts/Font_1024_Var_Part_TAHOMA_400_121.json");
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			//AL(sprintf("%3d loadTeapot() request readyState==4",gl.animationCount08));
			JSON.parse(request.responseText,jsonTextReviver); /* this is not assigned to any var, because the whole job is done within jsonTextReviver() */
			//AL("got teapot json "+gl[gl.lower08At].numCriticalJsonsDone+" "+gl[gl.upper08At].numCriticalJsonsDone );
			genCube(gl.lower08At);
			genCube(gl.upper08At);
		}
	};
	//AL(sprintf("%3d loadTeapot() pre  requedt.send()",gl.animationCount08));
	request.send();
	//AL(sprintf("%3d loadTeapot() post requedt.send()",gl.animationCount08));
}
//,{"index": 84,"A": -1,"B": 74,"C": -2,"X": 557,"Y": 464} T
//,{"index": 98,"A":  8,"B": 56,"C":  3,"X": 565,"Y": 318} b
//,{"index":106,"A": -5,"B": 31,"C":  8,"X":   0,"Y": 172} j
function jsonTextReviver(key, value) {
	//TODO put a blue mark here	
	//AL("8^385 gl.font2Use="+gl.font2Use+" key="+key+"  value="+value);
	switch(key){
		case "index":
			gl.fontIndex=value;
			//AL("8^389 see gl.fontIndex="+gl.fontIndex);
			break;
		case "A":
			gl.fontAs[gl.font2Use][gl.fontIndex]=value;
			//AL("8^393 see As["+gl.font2Use+"]["+gl.fontIndex+"]="+gl.fontAs[gl.font2Use][gl.fontIndex]);
			break;
		case "B":
			gl.fontBs[gl.font2Use][gl.fontIndex]=value;
			//AL("8^397 see Bs["+gl.font2Use+"]["+gl.fontIndex+"]="+gl.fontBs[gl.font2Use][gl.fontIndex]);
			break;
		case "C":
			gl.fontCs[gl.font2Use][gl.fontIndex]=value;
			//AL("8^401 see Cs["+gl.font2Use+"]["+gl.fontIndex+"]="+gl.fontCs[gl.font2Use][gl.fontIndex]);
			break;
		case "X":
			gl.fontXs[gl.font2Use][gl.fontIndex]=value;
			//AL("8^405 see Xs["+gl.font2Use+"]["+gl.fontIndex+"]="+gl.fontXs[gl.font2Use][gl.fontIndex]);
			break;
		case "Y":
			gl.fontYs[gl.font2Use][gl.fontIndex]=value;
			//AL("8^409 see Ys["+gl.font2Use+"]["+gl.fontIndex+"]="+gl.fontYs[gl.font2Use][gl.fontIndex]);
			gl.fontXls[gl.font2Use][gl.fontIndex]=gl.fontXs[gl.font2Use][gl.fontIndex]/(gl.fontTextureSizes[gl.font2Use]-1);
			gl.fontXrs[gl.font2Use][gl.fontIndex]=
				(    gl.fontXs[gl.font2Use][gl.fontIndex]
				 +(0>gl.fontAs[gl.font2Use][gl.fontIndex]?0:gl.fontAs[gl.font2Use][gl.fontIndex])
				 +   gl.fontBs[gl.font2Use][gl.fontIndex]
				 +(0>gl.fontCs[gl.font2Use][gl.fontIndex]?0:gl.fontCs[gl.font2Use][gl.fontIndex])
				 -0.5
				)
				/(gl.fontTextureSizes[gl.font2Use]-1)
			;
			gl.fontYls[gl.font2Use][gl.fontIndex]=(gl.fontYs[gl.font2Use][gl.fontIndex]                            -gl.fontDescent[gl.font2Use])/(gl.fontTextureSizes[gl.font2Use]-1);
			gl.fontYus[gl.font2Use][gl.fontIndex]=(gl.fontYs[gl.font2Use][gl.fontIndex]+gl.fontHeight [gl.font2Use]-gl.fontDescent[gl.font2Use])/(gl.fontTextureSizes[gl.font2Use]-1);
			/**/AL(sprintf(
			/**/	"8^428 %s %d %d %5.3f %5.3f %5.3f %5.3f" 
			/**/	,String.fromCharCode(gl.fontIndex)
			/**/	,gl.font2Use
			/**/	,gl.fontIndex
			/**/	,gl.fontXls[gl.font2Use][gl.fontIndex]
			/**/	,gl.fontXrs[gl.font2Use][gl.fontIndex]
			/**/	,gl.fontYls[gl.font2Use][gl.fontIndex]
			/**/	,gl.fontYus[gl.font2Use][gl.fontIndex]
			/**/	)
			/**/);
			break;
		case "FontName":
			gl.fontNames[gl.font2Use]=value;
			//AL("8^413 see gl.fonttName      ["+gl.font2Use+"]="+gl.fontNames[gl.font2Use]);
			break;
		case "textureSize":
			gl.fontTextureSizes[gl.font2Use]=value;
			//AL("8^417 see gl.fontTextureSize["+gl.font2Use+"]="+gl.fontTextureSizes[gl.font2Use]);
			break;
		case "charSet":
			gl.fontCharSet[gl.font2Use]=value;
			//AL("8^421 see gl.fontCharSet    ["+gl.font2Use+"]="+gl.fontCharSet[gl.font2Use]);
			break;
		case "widthType":
			gl.fontWidthType[gl.font2Use]=value; /* fixed or variable */
			//AL("8^425 see gl.fontWidthType  ["+gl.font2Use+"]="+gl.fontWidthType[gl.font2Use]);
			break;
		case "weight":
			gl.fontWeight[gl.font2Use]=value;
			//AL("8^429 see gl.fontWeight     ["+gl.font2Use+"]="+gl.fontWeight[gl.font2Use]);
			break;
		case "height":
			gl.fontHeight[gl.font2Use]=value;
			//AL("8^433 see gl.fontHeight     ["+gl.font2Use+"]="+gl.fontHeight[gl.font2Use]);
			break;
		case "descent":
			gl.fontDescent[gl.font2Use]=value;
			//AL("8^437 see gl.fontDescent    ["+gl.font2Use+"]="+gl.fontDescent[gl.font2Use]);
			break;
		default:
			//AL("default key="+key+" value="+value);
			break;
	}
	gl.counter++;
	return null;
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
	//AL("cme@ loadSphere gl.animationCount08="+gl.animationCount08);
	var request = new XMLHttpRequest();
	//request.open("GET", "json/Spheres/IcosahedralSphere5120.json");
	request.open("GET", "json/Spheres/IcosahedralSphere20480.json");
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			//AL(sprintf("%3d loadSphere() request readyState==4",gl.animationCount08));
			//gl.sayVarList=true; gl.counter=0; /* the gl.couner is used internally by the jsoanReviverVarList function */
			var parsedJson=JSON.parse(request.responseText,(gl.sayVarList?jsonReviverVarList:null));
			handleLoadedSphereNormals(parsedJson,gl.lower08At);
			handleLoadedSphereNormals(parsedJson,gl.upper08At);
			handleLoadedSphere(parsedJson,gl.lower08At);gl[gl.lower08At].numCriticalJsonsDone++;
			handleLoadedSphere(parsedJson,gl.upper08At);gl[gl.upper08At].numCriticalJsonsDone++;
			//AL("got sphere json "+gl[gl.lower08At].numCriticalJsonsDone+" "+gl[gl.upper08At].numCriticalJsonsDone );
		}
	};
	//AL(sprintf("%3d loadSphere() pre  requedt.send()",gl.animationCount08));
	request.send();
	//AL(sprintf("%3d loadSphere() post requedt.send()",gl.animationCount08));
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
	if(at==gl.lower08At){
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
function genCube(at) {
	xyzs=[
		-1,-1, 1,
		-1,-1,-1,
		 1,-1, 1,
		 1,-1,-1,
		 
		 1,-1, 1,
		 1,-1,-1,
		 1, 1, 1,
		 1, 1,-1,
		 
		 1, 1, 1,
		 1, 1,-1,
		-1, 1, 1,
		-1, 1,-1,
		 
		-1, 1, 1,
		-1, 1,-1,
		-1,-1, 1,
		-1,-1,-1
	]; 
	normals=[
		 0,-1, 0,
		 0,-1, 0,
		 0,-1, 0,
		 0,-1, 0,
		 
		 1, 0, 0,
		 1, 0, 0,
		 1, 0, 0,
		 1, 0, 0,
		 
		 0, 1, 0,
		 0, 1, 0,
		 0, 1, 0,
		 0, 1, 0,
		
		-1, 0, 0,
		-1, 0, 0,
		-1, 0, 0,
		-1, 0, 0,
	]; 
	letters="YjbM";
	
	uvs=[
	gl.fontXls[gl.font2Use][letters.charCodeAt(0)],gl.fontYus[gl.font2Use][letters.charCodeAt(0)],
	gl.fontXls[gl.font2Use][letters.charCodeAt(0)],gl.fontYls[gl.font2Use][letters.charCodeAt(0)],
	gl.fontXrs[gl.font2Use][letters.charCodeAt(0)],gl.fontYus[gl.font2Use][letters.charCodeAt(0)],
	gl.fontXrs[gl.font2Use][letters.charCodeAt(0)],gl.fontYls[gl.font2Use][letters.charCodeAt(0)],
	
	gl.fontXls[gl.font2Use][letters.charCodeAt(1)],gl.fontYus[gl.font2Use][letters.charCodeAt(1)],
	gl.fontXls[gl.font2Use][letters.charCodeAt(1)],gl.fontYls[gl.font2Use][letters.charCodeAt(1)],
	gl.fontXrs[gl.font2Use][letters.charCodeAt(1)],gl.fontYus[gl.font2Use][letters.charCodeAt(1)],
	gl.fontXrs[gl.font2Use][letters.charCodeAt(1)],gl.fontYls[gl.font2Use][letters.charCodeAt(1)],
	
	gl.fontXls[gl.font2Use][letters.charCodeAt(2)],gl.fontYus[gl.font2Use][letters.charCodeAt(2)],
	gl.fontXls[gl.font2Use][letters.charCodeAt(2)],gl.fontYls[gl.font2Use][letters.charCodeAt(2)],
	gl.fontXrs[gl.font2Use][letters.charCodeAt(2)],gl.fontYus[gl.font2Use][letters.charCodeAt(2)],
	gl.fontXrs[gl.font2Use][letters.charCodeAt(2)],gl.fontYls[gl.font2Use][letters.charCodeAt(2)],
	
	gl.fontXls[gl.font2Use][letters.charCodeAt(3)],gl.fontYus[gl.font2Use][letters.charCodeAt(3)],
	gl.fontXls[gl.font2Use][letters.charCodeAt(3)],gl.fontYls[gl.font2Use][letters.charCodeAt(3)],
	gl.fontXrs[gl.font2Use][letters.charCodeAt(3)],gl.fontYus[gl.font2Use][letters.charCodeAt(3)],
	gl.fontXrs[gl.font2Use][letters.charCodeAt(3)],gl.fontYls[gl.font2Use][letters.charCodeAt(3)]

	];
	
//	uvs=[
//		0,1,
//		0,0,
//		1,1,
//		1,0,
//		
//		0,1,
//		0,0,
//		1,1,
//		1,0,
//		
//		0,1,
//		0,0,
//		1,1,
//		1,0,
//		
//		0,1,
//		0,0,
//		1,1,
//		1,0,
//	];
//	for(var ii=0;ii<uvs.length;ii++){
//		uvs[ii]=.5+ (uvs[ii]*.2);
//	}
	
	
	indices = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
	//indices = [0,1,2,3];
	for(var ii=0;ii<xyzs.length;ii++){
		xyzs[ii]*=10.;
	}
	
	//TODO put a blue mark here	
	                                   gl[at].cubeXYZs = gl[at].createBuffer();
	gl[at].bindBuffer(gl.ARRAY_BUFFER, gl[at].cubeXYZs); /* not an array of indices, so not an ELEMENT_ARRAY_BUFFER */
	gl[at].bufferData(gl.ARRAY_BUFFER, new Float32Array(xyzs), gl.STATIC_DRAW);
	gl[at].cubeXYZs.itemSize = 3;
	gl[at].cubeXYZs.numItems = xyzs.length / gl[at].cubeXYZs.itemSize;
	//if(0==at)AL("gl["+at+"].cubeXYZs.numItems="+gl[at].cubeXYZs.numItems);
	
	                                   gl[at].cubeNormals = gl[at].createBuffer();
	gl[at].bindBuffer(gl.ARRAY_BUFFER, gl[at].cubeNormals);/* not an array of indices, so not an ELEMENT_ARRAY_BUFFER */
	gl[at].bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	gl[at].cubeNormals.itemSize = 3;
	gl[at].cubeNormals.numItems = normals.length / gl[at].cubeNormals.itemSize;
	//if(0==at)AL("gl["+at+"].cubeNormals.numItems="+gl[at].cubeNormals.numItems);
	
	                                   gl[at].cubeTextureCoords = gl[at].createBuffer();
	gl[at].bindBuffer(gl.ARRAY_BUFFER, gl[at].cubeTextureCoords); /* not an array of indices, so not an ELEMENT_ARRAY_BUFFER */
	gl[at].bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
	gl[at].cubeTextureCoords.itemSize = 2;
	gl[at].cubeTextureCoords.numItems = uvs.length / gl[at].cubeTextureCoords.itemSize;
	//if(0==at)AL("gl["+at+"].cubeTexutreCoords.numItems="+gl[at].cubeTextureCoords.numItems);
	
	                                           gl[at].cubeIndices = gl[at].createBuffer();
	gl[at].bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl[at].cubeIndices);
	gl[at].bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	gl[at].cubeIndices.itemSize = 1;
	gl[at].cubeIndices.numItems = indices.length / gl[at].cubeIndices.itemSize;
	//if(0==at)AL("gl["+at+"].cubeIndices.numItems="+gl[at].cubeIndices.numItems);
}
function genSquares() {
	/* Generate the squares which will act as the first placement locaitons for the letters */
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

function drawScene08() {
	//AL(sprintf("drawScene08 with gl.at=%2d gl.animationCount08=%3d",gl.at,gl.animationCount08));
	gl[gl.at].viewport(0, 0, gl[gl.at].viewportWidth, gl[gl.at].viewportHeight);
	gl[gl.at].clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	if (  (gl[gl.at].numCriticalJsons2BDone    > gl[gl.at].numCriticalJsonsDone)
	    ||(gl[gl.at].numCriticalTextures2BDone > gl[gl.at].numCriticalTexturesDone)
	   ) {
		if((gl.at==gl.lower08At)&&(20==gl.animationCount08))AL("even at 20=gl.animationCount08 we are at early return.  gl["+gl.at+"].tractionIteration="+gl[gl.at].tractionIteration);
		return;
	} else {
		//if((gl.at==gl.lower08At)&&(20==gl.animationCount08))AL(sprintf("drawScene08 past the nulls with gl.at=%2d gl.animationCount08=%3d",gl.at,gl.animationCount08));
		if(gl[gl.at].tractionIteration===-1){ /* this will execute only once */
			elem=document.getElementById("loadingtext");
			if(null!=elem)elem.textContent = "";
			gl[gl.at].tractionIteration=gl.animationCount08;
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
		//if((20==gl.animationCount08)&&(0==gl.at))AL(sprintf("gl[%d] gl[gl.at].directionalLightXYZ norm =%s",gl.at,vec3.printS3(lightXYZ)));
		gl[gl.at].uniform3fv(gl[gl.at].puDirectionalLightXYZ,lightXYZ);
	} else {
		/**/if((20==gl.animationCount08)&&(0==gl.at))AL("false == directionalLight08");
	}
	if(  gl[gl.at].pointLight
	   &&(0==gl.lower08At)
	  ){
		//if((20==gl.animationCount08)&&(0==gl.at))AL("we have pointlight");
		lightXYZ = vec3.createFrom(
			     13*Math.cos(deg2Rad*gl.rotationDegrees08*.12)
			,0+ (13*Math.sin(deg2Rad*gl.rotationDegrees08*.12))
			,0+ ( 1*Math.sin(deg2Rad*gl.rotationDegrees08*3.))
		);
		gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].pointLightSpriteXYZ);
		gl[gl.at].bufferData(gl.ARRAY_BUFFER, new Float32Array(lightXYZ), gl.STATIC_DRAW);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ , 3, gl.FLOAT, false, 0,  0);
		
		gl[gl.at].uniform1i(gl[gl.at].puUseFullEmissivity,1);
		gl[gl.at].drawArrays(gl.POINTS, 0, 1);
		gl[gl.at].uniform1i(gl[gl.at].puUseFullEmissivity,0);
		
		mat4.multiplyVec3(gl[gl.at].mvm,lightXYZ);
		//if(20==gl.animationCount08)AL(sprintf("gl[%d] gl[gl.lower08At].pointLightXYZ norm =%s",gl.at,vec3.printS3(lightXYZ)));
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
	//if((20==gl.animationCount08)&&(0==gl.at))AL("texture="+texture);
	gl.textureSay=false;
	
	glPushMatrix();
	   // if(gl.at == gl.lower08At)AL("shape ="+gl[gl.at].shape);
		gl[gl.at].uniform1i(gl[gl.at].puSampler, 0);
		gl[gl.at].uniform1f (gl[gl.at].puMaterialShininess  ,gl[gl.at].materials?gl[gl.at].materialShininess:gl.shininess08);
		if(gl[gl.at].shape == "teapot"){
			mat4.rotate(gl[gl.at].mvm, deg2Rad*90., [1, 0, 0]);	
			mat4.rotate(gl[gl.at].mvm, deg2Rad*23.4, [1, 0, -1]);
			mat4.rotate(gl[gl.at].mvm, deg2Rad*gl.rotationDegrees08, [0, 1, 0]);
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
			mat4.rotate(gl[gl.at].mvm, deg2Rad*gl.rotationDegrees08, [0, 0, 1]);
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
		}else
		if(gl[gl.at].shape == "cube"){
			mat4.rotate(gl[gl.at].mvm, deg2Rad*gl.rotationDegrees08, [0, 0, 1]);
			gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].cubeXYZs);
			gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ, gl[gl.at].cubeXYZs.itemSize, gl.FLOAT, false, 0, 0);
			
			gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].cubeNormals);
			gl[gl.at].vertexAttribPointer(gl[gl.at].paNormal, gl[gl.at].cubeNormals.itemSize, gl.FLOAT, false, 0, 0);
			
			gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].cubeTextureCoords);
			gl[gl.at].vertexAttribPointer(gl[gl.at].paTextureCoord, gl[gl.at].cubeTextureCoords.itemSize, gl.FLOAT, false, 0, 0);
			
			//setMatrixUniforms();
			//gl[gl.at].drawElements(gl.TRIANGLES     ,gl[gl.at].sphereTrianglesXYZs.numItems, gl.UNSIGNED_SHORT, 0);
			//gl[gl.at].drawArrays(gl.TRIANGLES     ,0,gl[gl.at].cubeXYZs.numItems);
			
			gl[gl.at].bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl[gl.at].cubeIndices);
			setMatrixUniforms();
			gl[gl.at].drawElements(gl.TRIANGLE_STRIP, gl[gl.at].cubeIndices.numItems, gl.UNSIGNED_SHORT, 0);
			//AL("gl[gl.at].cubeXYZs.numItems="+gl[gl.at].cubeXYZs.numItems);
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
//TO DO put a blue mark here
function animate() {
	var timeNow = new Date().getTime();
	if (gl.lastTime08 != 0) {
		var elapsed = timeNow - gl.lastTime08;
		gl.rotationDegrees08 += 0.05 * elapsed*gl.rotationSpeedFactor;
		/* this was used to see which angles were the crossover points for the seems-to-be-a cube */
		if(gl.animationHaltAt08==gl.animationCount08){
			gl.animationHalt08=true;
		}	
		gl.animationCount08++;
	}
	gl.lastTime08 = timeNow;
}

function tick08() {
	if(false==gl.animationHalt08){
		requestAnimFrame(tick08);
	}
	gl.at=gl.lower08At;
	drawScene08();
	gl.at=gl.upper08At;
	drawScene08();
	
	animate();
}
function reDraw(){
	/* general utility, needed when animation is turned off, or else your will not see any changes */
	gl.at=gl.lower08At;
	drawScene08();
	gl.at=gl.upper08At;
	drawScene08();
}
function AL(message){
	$.ajax({type:"POST",url:"WebGLTutorials",data:"2log="+message});
}
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
	//gl[gl.lower08At].directionalLightXYZ = vec3.createFrom(Math.cos(angle),-0.3,Math.sin(angle));
	gl[gl.lower08At].directionalLightXYZ = vec3.createFrom(Math.cos(angle),-Math.sin(angle),0.);
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
	gl.shininess08=ui.value/10; /* this gets used/set in the onDraw function */
	//AL("ShininessSliderSlide on the move "+ui.value +" becomming "+gl.shininess08);
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
	//AL("in ready 08");
	if(-1<document.getElementById("title").innerHTML.indexOf("tutorial08")){
		//AL("inside ready for tutorial08");
		$('#tutorial08Tabs').tabs({
			active: 0,
			collapsible: false
		});
		$("input[id^=lighting]").click(function (event) {
			gl[gl.lower08At].lighting  = document.getElementById(this.id).checked;
			gl[gl.upper08At].lighting = gl[gl.lower08At].lighting;
			//AL("checkBox "+this.id+" incomming is "+gl[gl.lower08At].lighting);
			gl[gl.lower08At].uniform1i(gl[gl.lower08At].puUseLighting,gl[gl.lower08At].lighting);
			gl[gl.upper08At].uniform1i(gl[gl.upper08At].puUseLighting,gl[gl.upper08At].lighting);
			//setCheckMarks();
			reDraw();
		});
//		$("input[id^=textures]").click(function (event) {
//			gl[gl.lower08At].useTextures  = document.getElementById(this.id).checked;
//			gl[gl.upper08At].useTextures = gl[gl.lower08At].useTextures;
//			//AL("checkBox "+this.id+" incomming is "+gl[gl.lower08At].useTextures);
//			gl[gl.lower08At].uniform1i(gl[gl.lower08At].puUseTextures,gl[gl.lower08At].useTextures);
//			gl[gl.upper08At].uniform1i(gl[gl.upper08At].puUseTextures,gl[gl.upper08At].useTextures);
//			//setCheckMarks();
//			reDraw();
//		});
		$("input[id^=tex]").click(function (event) {
			var switchVar=parseFloat(this.id.substring(this.id.length-2,this.id.length));
			//AL("inside tex (texture) radio button[id="+this.id+"] num="+switchVar+" from "+(this.id.length-2)+" "+this.id.length);
			switch(switchVar){
				case 0://texture="none";
					gl[gl.lower08At].texture="none";
					gl[gl.upper08At].texture="none";
					break;
				case 1://texture="Galvanized";
					gl[gl.lower08At].texture="galvanized";
					gl[gl.upper08At].texture="galvanized";
					break;
				case 2://texture="Earth";
					gl[gl.lower08At].texture="earth";
					gl[gl.upper08At].texture="earth";
					break;
				case 3://texture="NeHe";
					gl[gl.lower08At].texture="nehe";
					gl[gl.upper08At].texture="nehe";
					break;
				case 4://texture="StainedGlass";
					gl[gl.lower08At].texture="glass";
					gl[gl.upper08At].texture="glass";
					break;
				case 5:
					gl[gl.lower08At].texture="tahoma";
					gl[gl.upper08At].texture="tahoma";
					break;
				default://texture="Galvanized";
					gl[gl.lower08At].texture="galvanized";
					gl[gl.upper08At].texture="galvanized";
			}
			gl.textureSay=true;
			reDraw();
		});	
		$("input[id^=shape]").click(function (event) {
			var switchVar=parseFloat(this.id.substring(this.id.length-2,this.id.length));
			/**/AL("inside shape radio button[id="+this.id+"] num="+switchVar);
			switch(switchVar){
				case 0://shape="none";
					gl[gl.lower08At].shape="teapot";
					gl[gl.upper08At].shape="teapot";
					break;
				case 1://shape="Galvanized";
					gl[gl.lower08At].shape="sphere";
					gl[gl.upper08At].shape="sphere";
					gl.at=gl.lower08At;
					xyzprySetInDegrees(   0,-40,  0,  0,  0, 90);
					gl.at=gl.upper08At;
					xyzprySetInDegrees(   0, 40,  0,  0,  0,270);
					break;
				case 2://shape="Earth";
					gl[gl.lower08At].shape="cube";
					gl[gl.upper08At].shape="cube";
					break;
				case 3://shape="NeHe";
					gl[gl.lower08At].shape="icosahedron";
					gl[gl.upper08At].shape="icosahedron";
					break;
				default://shape="Galvanized";
					gl[gl.lower08At].shape="teapot";
					gl[gl.upper08At].shape="teapot";
			}
			reDraw();
		});	
		$("input[id=sphereLines]").click(function (event) {
			var checked=this.checked;
			//AL("inside sphereLines button checked="+checked);
			gl[gl.lower08At].showLines=checked;
			gl[gl.upper08At].showLines=checked;
			if(checked){
				gl.rotationSpeedFactor*=.1;
			} else {
				gl.rotationSpeedFactor*=10.;
			}
			reDraw();
		});	
		$("input[id^=step08]").click(function (event) {
			//AL("inside08 button[id="+this.id+"]");
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
		$("#rotationSpeedSlider").slider({
			animate: true,
			value: 50,
			slide: handleRotationSpeedSliderSlide
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
//			if(true==gl[gl.upper08At].pointLight){
//				gl.at=gl.lower08At;
//				xyzprySetInDegrees(   0,  6 ,  18.5,-90,  0, 90);
//				gl.at=gl.upper08At;
//				xyzprySetInDegrees(   0,  -13.125, 2.75, 0,  0, 90);
//			}
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
			case 83 :  /* S for Roll, dont remembery why */
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