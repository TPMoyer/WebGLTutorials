/*   © 2013 Thomas P Moyer  */ 

function webGLStart06() {
	//AL("cme@ webGLTutorial06.js webGLStart");
	window.resizeTo( 1100,700);
	var canvas = document.getElementById("tutorial06-canvas0");
	initGL(canvas);
	gl.lower06At=gl.at;
	canvas = document.getElementById("tutorial06-canvas1");
	initGL(canvas);
	gl.upper06At=gl.at;
	//AL("gl.lower06At="+gl.lower06At+" gl.upper06At="+gl.upper06At);
	
	gl.animationCount06=0;
	gl.animationHaltAt06=-1; /* negative never stops (till rollover). */
	//gl.animationHaltAt06=4;
	//gl.animationHaltAt06=250;  /* 250 stops at near 1X thru tween sequence.  Smaller will stop sooner */
	gl.tween=0.;
	gl.lastTime06 = 0;
	gl.animationHalt06=false;
	gl.tweenCycle06=0; /* which of the phases... tetrahedron to icosahedron, colortween or the two triangle quadrasections */	
	gl.morphIteration06=0;
	gl.tweenDirection06=1;	
	gl.numTweenedSpheres06=4;	
	gl.directionalLightXYZ06;
	gl.directionalLightDiffuseRGB06;	
	gl.directionalLightSpecularRGB06;
	gl.ambientLightRGB06;

	gl.shininess06=5.;
	gl.materislsOn06=true;
	gl.materialTween06=true;
	gl.sayOnce06=false;
	gl.benOneFullCycle06=false;
	gl.talkon06=false;
	
	gl[gl.lower06At].numCriticalJsons2BDone=1;
	gl[gl.upper06At].numCriticalJsons2BDone=1;
	loadFacetedTeeenedSphere();
	
	var slider;
	if(0==gl.at){
		slider=selection = $( "#directionalLightXYZSlider").slider( "value" );	
	} else {
		slider=50;
	}
	var angle= Math.PI*(100-slider)/100.;
	gl.directionalLightXYZ06 = vec3.createFrom(Math.cos(angle),-.3,Math.sin(angle));
	gl.ambientLightRGB06             = vec3.createFrom(1.,1.,1.);
	gl.directionalLightDiffuseRGB06  = vec3.createFrom(1.,1.,1.);
	gl.directionalLightSpecularRGB06 = vec3.createFrom(1.,1.,1.);
	
	gl.at=gl.lower06At;
	initShaders06();
	customizeGL06(); /* uniforms are set in this, so must come after initShaders */
	
	gl.at=gl.upper06At;
	initShaders06();
	customizeGL06();/* uniforms are set in this, so must come after initShaders */
	
	tick06();
}
function customizeGL06() {
	//AL("customizeGL02");
	if(0==gl.lower06At){
		gl[gl.at].clearColor(0.3, 0.3, 0.3, 1.0);
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
	if(null != document.getElementById('setTet2Icosa')){	
		var elem = document.getElementById("phase");
		elem.value=" First cycle only ";
		gl.numTweenedSpheres06=1;
		gl.tweenCycle06=0;
	}

	switch (gl.at%2){
	case 0:
		//xyzprySetInDegrees(   0, -13,   0,  0,  0, 90);   /* 13 units South, flat and level (roof is up),  facing North */
		/* the teapot can be viewed from 43 units away */
		//xyzprySetInDegrees(   0, -43,   0,  0,  0, 90);   /* 13 units South, flat and level (roof is up),  facing North */
		//xyzprySetInDegrees(   0,  0 ,  13,-90,  0, 90);   /* 13 units Up, pointing straight down,(roof is north) */
		xyzprySetInDegrees(   0,  2, 2.657,-90,  0, 90);
		xyzprySet2Home0();	
		if(0==gl.lower06At){
			//xyzprySetInDegrees(   0,  6, 18.125,-90,  0, 90);
			xyzprySetInDegrees(0.000, -11.378, 12.962,-37.969, 0.000, 90.000);
			xyzprySetInDegrees( 1.075, -2.436, 1.159,-23.048, 1.203,113.915);
		}	
		//AL("case0");
		//xyzpryLogView();
		xyzprySet2Home();
		gl[gl.at].deltaMove=1./8;
	break;
	case 1:
		//xyzprySetInDegrees(  0., -2.666,0.447,-9.141,  0, 90);
		xyzprySetInDegrees( 1.075, -2.436, 1.159,-23.048, 1.203,113.915);
		xyzprySet2Home0();
		if(1==gl.upper06At){
			//xyzprySetInDegrees(   0,  -15,  8.5, -21.445,  0,90);    /* 13 units North, flat and level (roof is up), facing South */
			xyzprySetInDegrees( 1.075, -2.436, 1.159,-23.048, 1.203,113.915);
		}
		xyzprySet2Home();
		//AL("case1");
		//xyzpryLogView();
		gl[gl.at].deltaMove=1./8;
	
	break;
	default:
		alert("customize06 attempted to use a non existant context "+gl.at);
	}
}
function loadFacetedTeeenedSphere() {
	//AL("cme@ loadFacetedSphere gl.animationCount06="+gl.animationCount06);
	var requestA = new XMLHttpRequest();
	requestA.open("GET", "json/Tweeners/TetrahedralFacetedMultiColoredTweenedSpheres.json");
    //requestA.open("GET", "json/TetrahedralFacetedMultiColoredTweenedSpheres.json");
	requestA.onreadystatechange = function () {
		if (requestA.readyState == 4) {
			//AL("A inside loadSphere requestgl.animationCount06="+gl.animationCount06+" "+gl.lower06At);
			//AL("requestA.responseText="+requestA.responseText);
			var parsedJson=JSON.parse(requestA.responseText);
			handleLoadedFacetedTweenedSphere(parsedJson,gl[gl.lower06At]);
			gl[gl.lower06At].numCriticalJsonsDone++;
			//AL("B inside loadSphere requestgl.animationCount06="+gl.animationCount06);
			handleLoadedFacetedTweenedSphere(parsedJson,gl[gl.upper06At]);
			gl[gl.upper06At].numCriticalJsonsDone++;
			elem=document.getElementById("loadingtext");
			if(null!=elem)elem.textContent = "";
			//AL("json done");
		}
	};
	//AL("about to request.send()");
	requestA.send();
	//AL("back from request.send()");
}
function handleLoadedFacetedTweenedSphere(parsedJson,glSubAt) {
	//AL("cme@ handleLoadedFacetedSphere( with gl.at="+at+")");
	
	glSubAt.sphereXYZ0XYZ1Norm0Norm1Set0  = []; /* an array of 6 materials for the tetrahedron tweening into an icosahedron */
	glSubAt.sphereFaceIndiceSet0          = []; /* an array of 6 materials for the tetrahedron tweening into an icosahedron */ 
	glSubAt.sphereXYZ0XYZ1Norm0Norm1Set1  = []; /* an array of 6 materials for the icosahedron color tween when quadrasecting to 80 sided polyhedron */
	glSubAt.sphereFaceIndiceSet1          = []; /* an array of 6 materials for the icosahedron color tween when quadrasecting to 80 sided polyhedron */
	glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR0 = []; /* an array of 6 materials for the tetrahedron tweening into an icosahedron with the other twist */
	glSubAt.sphereFaceIndiceSetR0         = []; /* an array of 6 materials for the tetrahedron tweening into an icosahedron with the other twist */
	glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR1 = []; /* an array of 6 materials for the icosahedron color tween when quadrasecting to 80 sided polyhedron from the other twist */
	glSubAt.sphereFaceIndiceSetR1         = []; /* an array of 6 materials for the icosahedron color tween when quadrasecting to 80 sided polyhedron from the other twist */
	glSubAt.sphereXYZ0XYZ1Norm0Norm1s     = []; /* an array of 2 VBO's for the two highest number of sided polyhedra */
	glSubAt.sphereFaceIndices             = []; /* an array of 2 VBO's for the two highest number of sided polyhedra */
	//AL("post array instantiation");
	
	/*************************************************************************************************************************************/
	/*************************************************************************************************************************************/	
	/*************************************************************************************************************************************/	
	
	glSubAt.sphereXYZ0XYZ1Norm0Norm1Set0[0] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ARRAY_BUFFER, glSubAt.sphereXYZ0XYZ1Norm0Norm1Set0[0]);
	glSubAt.bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s1_0), gl.STATIC_DRAW);
	glSubAt.sphereXYZ0XYZ1Norm0Norm1Set0[0].numItems = parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s1_0.length / 12;
	glSubAt.sphereFaceIndiceSet0[0] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glSubAt.sphereFaceIndiceSet0[0]);
	glSubAt.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parsedJson.faceIndices1_0), gl.STATIC_DRAW);
	glSubAt.sphereFaceIndiceSet0[0].numItems = parsedJson.faceIndices1_0.length;
	
	//AL("parsedJson.faceIndices1_0.length="+parsedJson.faceIndices1_0.length);
	
	glSubAt.sphereXYZ0XYZ1Norm0Norm1Set0[1] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ARRAY_BUFFER, glSubAt.sphereXYZ0XYZ1Norm0Norm1Set0[1]);
	glSubAt.bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s1_1), gl.STATIC_DRAW);
	glSubAt.sphereXYZ0XYZ1Norm0Norm1Set0[1].numItems = parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s1_1.length / 12;
	glSubAt.sphereFaceIndiceSet0[1] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glSubAt.sphereFaceIndiceSet0[1]);
	glSubAt.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parsedJson.faceIndices1_1), gl.STATIC_DRAW);
	glSubAt.sphereFaceIndiceSet0[1].numItems = parsedJson.faceIndices1_1.length;
	
	glSubAt.sphereXYZ0XYZ1Norm0Norm1Set0[2] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ARRAY_BUFFER, glSubAt.sphereXYZ0XYZ1Norm0Norm1Set0[2]);
	glSubAt.bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s1_2), gl.STATIC_DRAW);
	glSubAt.sphereXYZ0XYZ1Norm0Norm1Set0[1].numItems = parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s1_2.length / 12;
	glSubAt.sphereFaceIndiceSet0[2] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glSubAt.sphereFaceIndiceSet0[2]);
	glSubAt.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parsedJson.faceIndices1_2), gl.STATIC_DRAW);
	glSubAt.sphereFaceIndiceSet0[2].numItems = parsedJson.faceIndices1_2.length;
	
	glSubAt.sphereXYZ0XYZ1Norm0Norm1Set0[3] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ARRAY_BUFFER, glSubAt.sphereXYZ0XYZ1Norm0Norm1Set0[3]);
	glSubAt.bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s1_3), gl.STATIC_DRAW);
	glSubAt.sphereXYZ0XYZ1Norm0Norm1Set0[1].numItems = parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s1_3.length / 12;
	glSubAt.sphereFaceIndiceSet0[3] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glSubAt.sphereFaceIndiceSet0[3]);
	glSubAt.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parsedJson.faceIndices1_3), gl.STATIC_DRAW);
	glSubAt.sphereFaceIndiceSet0[3].numItems = parsedJson.faceIndices1_3.length;
	
	glSubAt.sphereXYZ0XYZ1Norm0Norm1Set0[4] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ARRAY_BUFFER, glSubAt.sphereXYZ0XYZ1Norm0Norm1Set0[4]);
	glSubAt.bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s1_4), gl.STATIC_DRAW);
	glSubAt.sphereXYZ0XYZ1Norm0Norm1Set0[1].numItems = parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s1_4.length / 12;
	glSubAt.sphereFaceIndiceSet0[4] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glSubAt.sphereFaceIndiceSet0[4]);
	glSubAt.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parsedJson.faceIndices1_4), gl.STATIC_DRAW);
	glSubAt.sphereFaceIndiceSet0[4].numItems = parsedJson.faceIndices1_4.length;
	
	glSubAt.sphereXYZ0XYZ1Norm0Norm1Set0[5] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ARRAY_BUFFER, glSubAt.sphereXYZ0XYZ1Norm0Norm1Set0[5]);
	glSubAt.bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s1_5), gl.STATIC_DRAW);
	glSubAt.sphereXYZ0XYZ1Norm0Norm1Set0[1].numItems = parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s1_5.length / 12;
	glSubAt.sphereFaceIndiceSet0[5] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glSubAt.sphereFaceIndiceSet0[5]);
	glSubAt.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parsedJson.faceIndices1_5), gl.STATIC_DRAW);
	glSubAt.sphereFaceIndiceSet0[5].numItems = parsedJson.faceIndices1_5.length;

	

	glSubAt.sphereXYZ0XYZ1Norm0Norm1Set1[0] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ARRAY_BUFFER, glSubAt.sphereXYZ0XYZ1Norm0Norm1Set1[0]);
	glSubAt.bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s2_0), gl.STATIC_DRAW);
	glSubAt.sphereXYZ0XYZ1Norm0Norm1Set1[0].numItems = parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s2_0.length / 12;
	glSubAt.sphereFaceIndiceSet1[0] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glSubAt.sphereFaceIndiceSet1[0]);
	glSubAt.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parsedJson.faceIndices2_0), gl.STATIC_DRAW);
	glSubAt.sphereFaceIndiceSet1[0].numItems = parsedJson.faceIndices2_0.length;
	
	//AL(sprintf("gl[%2d].sphereFaceIndices[0].numItems=%4d",at,glSubAt.sphereFaceIndices[0].numItems));
//	if(0==at){
//		//AL(sprintf("gl[%2d].sphere          XYZs.numItems=%4d",at,glSubAt.sphereXYZ0XYZ1Norm0Norm1Set1[0].numItems));
//		AL("going for "+(parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s2_0.length / 12) +" points");
//		AL("          X0     Y0     Z0       X1     Y1     Z1       U0     V0     W0       U1     V1     W1     |");
//		for(var ii=0;ii<glSubAt.sphereFaceIndiceSet1[0].numItems;ii++){
//			//AL("going for ii="+ii);
//			AL(sprintf("%2d %d %2d (%6.3f,%6.3f,%6.3f) (%6.3f,%6.3f,%6.3f) (%6.3f,%6.3f,%6.3f) (%6.3f,%6.3f,%6.3f)%s"
//				,Math.floor(ii/3)
//				,ii%3
//				,ii	
//				,parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s2_0[(12*ii)+ 0]
//				,parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s2_0[(12*ii)+ 1]
//				,parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s2_0[(12*ii)+ 2]
//				,parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s2_0[(12*ii)+ 3]
//				,parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s2_0[(12*ii)+ 4]
//				,parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s2_0[(12*ii)+ 5]
//				,parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s2_0[(12*ii)+ 6]
//				,parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s2_0[(12*ii)+ 7]
//				,parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s2_0[(12*ii)+ 8]
//				,parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s2_0[(12*ii)+ 9]
//				,parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s2_0[(12*ii)+10]
//				,parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s2_0[(12*ii)+11]
//				,2==ii%3?"\n":""
//			));
//		}
//	}	
	
	glSubAt.sphereXYZ0XYZ1Norm0Norm1Set1[1] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ARRAY_BUFFER, glSubAt.sphereXYZ0XYZ1Norm0Norm1Set1[1]);
	glSubAt.bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s2_1), gl.STATIC_DRAW);
	glSubAt.sphereXYZ0XYZ1Norm0Norm1Set1[1].numItems = parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s2_1.length / 12;
	glSubAt.sphereFaceIndiceSet1[1] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glSubAt.sphereFaceIndiceSet1[1]);
	glSubAt.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parsedJson.faceIndices2_1), gl.STATIC_DRAW);
	glSubAt.sphereFaceIndiceSet1[1].numItems = parsedJson.faceIndices2_1.length;
	
	glSubAt.sphereXYZ0XYZ1Norm0Norm1Set1[2] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ARRAY_BUFFER, glSubAt.sphereXYZ0XYZ1Norm0Norm1Set1[2]);
	glSubAt.bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s2_2), gl.STATIC_DRAW);
	glSubAt.sphereXYZ0XYZ1Norm0Norm1Set1[2].numItems = parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s2_2.length / 12;
	glSubAt.sphereFaceIndiceSet1[2] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glSubAt.sphereFaceIndiceSet1[2]);
	glSubAt.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parsedJson.faceIndices2_2), gl.STATIC_DRAW);
	glSubAt.sphereFaceIndiceSet1[2].numItems = parsedJson.faceIndices2_2.length;
	
	glSubAt.sphereXYZ0XYZ1Norm0Norm1Set1[3] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ARRAY_BUFFER, glSubAt.sphereXYZ0XYZ1Norm0Norm1Set1[3]);
	glSubAt.bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s2_3), gl.STATIC_DRAW);
	glSubAt.sphereXYZ0XYZ1Norm0Norm1Set1[3].numItems = parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s2_3.length / 12;
	glSubAt.sphereFaceIndiceSet1[3] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glSubAt.sphereFaceIndiceSet1[3]);
	glSubAt.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parsedJson.faceIndices2_3), gl.STATIC_DRAW);
	glSubAt.sphereFaceIndiceSet1[3].numItems = parsedJson.faceIndices2_3.length;
	
	glSubAt.sphereXYZ0XYZ1Norm0Norm1Set1[4] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ARRAY_BUFFER, glSubAt.sphereXYZ0XYZ1Norm0Norm1Set1[4]);
	glSubAt.bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s2_4), gl.STATIC_DRAW);
	glSubAt.sphereXYZ0XYZ1Norm0Norm1Set1[4].numItems = parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s2_4.length / 12;
	glSubAt.sphereFaceIndiceSet1[4] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glSubAt.sphereFaceIndiceSet1[4]);
	glSubAt.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parsedJson.faceIndices2_4), gl.STATIC_DRAW);
	glSubAt.sphereFaceIndiceSet1[4].numItems = parsedJson.faceIndices2_4.length;
	
	glSubAt.sphereXYZ0XYZ1Norm0Norm1Set1[5] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ARRAY_BUFFER, glSubAt.sphereXYZ0XYZ1Norm0Norm1Set1[5]);
	glSubAt.bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s2_5), gl.STATIC_DRAW);
	glSubAt.sphereXYZ0XYZ1Norm0Norm1Set1[5].numItems = parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s2_5.length / 12;
	glSubAt.sphereFaceIndiceSet1[5] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glSubAt.sphereFaceIndiceSet1[5]);
	glSubAt.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parsedJson.faceIndices2_5), gl.STATIC_DRAW);
	glSubAt.sphereFaceIndiceSet1[5].numItems = parsedJson.faceIndices2_5.length;
	
	glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR0[0] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ARRAY_BUFFER, glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR0[0]);
	glSubAt.bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedJson.vertexReverseFaceXYZ0XYZ1Norm0Norm1s5_0), gl.STATIC_DRAW);
	glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR0[0].numItems = parsedJson.vertexReverseFaceXYZ0XYZ1Norm0Norm1s5_0.length / 12;
	glSubAt.sphereFaceIndiceSetR0[0] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glSubAt.sphereFaceIndiceSetR0[0]);
	glSubAt.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parsedJson.faceReverseIndices5_0), gl.STATIC_DRAW);
	glSubAt.sphereFaceIndiceSetR0[0].numItems = parsedJson.faceReverseIndices5_0.length;
	
	glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR0[1] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ARRAY_BUFFER, glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR0[1]);
	glSubAt.bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedJson.vertexReverseFaceXYZ0XYZ1Norm0Norm1s5_1), gl.STATIC_DRAW);
	glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR0[1].numItems = parsedJson.vertexReverseFaceXYZ0XYZ1Norm0Norm1s5_1.length / 12;
	glSubAt.sphereFaceIndiceSetR0[1] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glSubAt.sphereFaceIndiceSetR0[1]);
	glSubAt.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parsedJson.faceReverseIndices5_1), gl.STATIC_DRAW);
	glSubAt.sphereFaceIndiceSetR0[1].numItems = parsedJson.faceReverseIndices5_1.length;
	
	glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR0[2] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ARRAY_BUFFER, glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR0[2]);
	glSubAt.bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedJson.vertexReverseFaceXYZ0XYZ1Norm0Norm1s5_2), gl.STATIC_DRAW);
	glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR0[2].numItems = parsedJson.vertexReverseFaceXYZ0XYZ1Norm0Norm1s5_2.length / 12;
	glSubAt.sphereFaceIndiceSetR0[2] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glSubAt.sphereFaceIndiceSetR0[2]);
	glSubAt.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parsedJson.faceReverseIndices5_2), gl.STATIC_DRAW);
	glSubAt.sphereFaceIndiceSetR0[2].numItems = parsedJson.faceReverseIndices5_2.length;
	
	glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR0[3] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ARRAY_BUFFER, glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR0[3]);
	glSubAt.bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedJson.vertexReverseFaceXYZ0XYZ1Norm0Norm1s5_3), gl.STATIC_DRAW);
	glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR0[3].numItems = parsedJson.vertexReverseFaceXYZ0XYZ1Norm0Norm1s5_3.length / 12;
	glSubAt.sphereFaceIndiceSetR0[3] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glSubAt.sphereFaceIndiceSetR0[3]);
	glSubAt.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parsedJson.faceReverseIndices5_3), gl.STATIC_DRAW);
	glSubAt.sphereFaceIndiceSetR0[3].numItems = parsedJson.faceReverseIndices5_3.length;
	
	glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR0[4] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ARRAY_BUFFER, glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR0[4]);
	glSubAt.bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedJson.vertexReverseFaceXYZ0XYZ1Norm0Norm1s5_4), gl.STATIC_DRAW);
	glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR0[4].numItems = parsedJson.vertexReverseFaceXYZ0XYZ1Norm0Norm1s5_4.length / 12;
	glSubAt.sphereFaceIndiceSetR0[4] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glSubAt.sphereFaceIndiceSetR0[4]);
	glSubAt.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parsedJson.faceReverseIndices5_4), gl.STATIC_DRAW);
	glSubAt.sphereFaceIndiceSetR0[4].numItems = parsedJson.faceReverseIndices5_4.length;
	
	glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR0[5] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ARRAY_BUFFER, glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR0[5]);
	glSubAt.bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedJson.vertexReverseFaceXYZ0XYZ1Norm0Norm1s5_5), gl.STATIC_DRAW);
	glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR0[5].numItems = parsedJson.vertexReverseFaceXYZ0XYZ1Norm0Norm1s5_5.length / 12;
	glSubAt.sphereFaceIndiceSetR0[5] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glSubAt.sphereFaceIndiceSetR0[5]);
	glSubAt.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parsedJson.faceReverseIndices5_5), gl.STATIC_DRAW);
	glSubAt.sphereFaceIndiceSetR0[5].numItems = parsedJson.faceReverseIndices5_5.length;	

	/*********************************************************    2R **************************************************/
	glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR1[0] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ARRAY_BUFFER, glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR1[0]);
	glSubAt.bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedJson.vertexReverseFaceXYZ0XYZ1Norm0Norm1s6_0), gl.STATIC_DRAW);
	glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR1[0].numItems = parsedJson.vertexReverseFaceXYZ0XYZ1Norm0Norm1s6_0.length / 12;
	glSubAt.sphereFaceIndiceSetR1[0] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glSubAt.sphereFaceIndiceSetR1[0]);
	glSubAt.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parsedJson.faceReverseIndices6_0), gl.STATIC_DRAW);
	glSubAt.sphereFaceIndiceSetR1[0].numItems = parsedJson.faceReverseIndices6_0.length;
	
	glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR1[1] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ARRAY_BUFFER, glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR1[1]);
	glSubAt.bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedJson.vertexReverseFaceXYZ0XYZ1Norm0Norm1s6_1), gl.STATIC_DRAW);
	glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR1[1].numItems = parsedJson.vertexReverseFaceXYZ0XYZ1Norm0Norm1s6_1.length / 12;
	glSubAt.sphereFaceIndiceSetR1[1] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glSubAt.sphereFaceIndiceSetR1[1]);
	glSubAt.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parsedJson.faceReverseIndices6_1), gl.STATIC_DRAW);
	glSubAt.sphereFaceIndiceSetR1[1].numItems = parsedJson.faceReverseIndices6_1.length;
	
	glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR1[2] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ARRAY_BUFFER, glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR1[2]);
	glSubAt.bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedJson.vertexReverseFaceXYZ0XYZ1Norm0Norm1s6_2), gl.STATIC_DRAW);
	glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR1[2].numItems = parsedJson.vertexReverseFaceXYZ0XYZ1Norm0Norm1s6_2.length / 12;
	glSubAt.sphereFaceIndiceSetR1[2] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glSubAt.sphereFaceIndiceSetR1[2]);
	glSubAt.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parsedJson.faceReverseIndices6_2), gl.STATIC_DRAW);
	glSubAt.sphereFaceIndiceSetR1[2].numItems = parsedJson.faceReverseIndices6_2.length;
	
	glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR1[3] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ARRAY_BUFFER, glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR1[3]);
	glSubAt.bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedJson.vertexReverseFaceXYZ0XYZ1Norm0Norm1s6_3), gl.STATIC_DRAW);
	glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR1[3].numItems = parsedJson.vertexReverseFaceXYZ0XYZ1Norm0Norm1s6_3.length / 12;
	glSubAt.sphereFaceIndiceSetR1[3] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glSubAt.sphereFaceIndiceSetR1[3]);
	glSubAt.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parsedJson.faceReverseIndices6_3), gl.STATIC_DRAW);
	glSubAt.sphereFaceIndiceSetR1[3].numItems = parsedJson.faceReverseIndices6_3.length;
	
	glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR1[4] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ARRAY_BUFFER, glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR1[4]);
	glSubAt.bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedJson.vertexReverseFaceXYZ0XYZ1Norm0Norm1s6_4), gl.STATIC_DRAW);
	glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR1[4].numItems = parsedJson.vertexReverseFaceXYZ0XYZ1Norm0Norm1s6_4.length / 12;
	glSubAt.sphereFaceIndiceSetR1[4] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glSubAt.sphereFaceIndiceSetR1[4]);
	glSubAt.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parsedJson.faceReverseIndices6_4), gl.STATIC_DRAW);
	glSubAt.sphereFaceIndiceSetR1[4].numItems = parsedJson.faceReverseIndices6_4.length;
	
	glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR1[5] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ARRAY_BUFFER, glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR1[5]);
	glSubAt.bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedJson.vertexReverseFaceXYZ0XYZ1Norm0Norm1s6_5), gl.STATIC_DRAW);
	glSubAt.sphereXYZ0XYZ1Norm0Norm1SetR1[5].numItems = parsedJson.vertexReverseFaceXYZ0XYZ1Norm0Norm1s6_5.length / 12;
	glSubAt.sphereFaceIndiceSetR1[5] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glSubAt.sphereFaceIndiceSetR1[5]);
	glSubAt.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parsedJson.faceReverseIndices6_5), gl.STATIC_DRAW);
	glSubAt.sphereFaceIndiceSetR1[5].numItems = parsedJson.faceReverseIndices6_5.length;	
	
	
	/**************************   The final two sets of triange quadrasections are single materials, so can go in one pass each *********/	

	glSubAt.sphereXYZ0XYZ1Norm0Norm1s[0] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ARRAY_BUFFER, glSubAt.sphereXYZ0XYZ1Norm0Norm1s[0]);
	glSubAt.bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s3), gl.STATIC_DRAW);
	glSubAt.sphereXYZ0XYZ1Norm0Norm1s[0].numItems = parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s3.length / 12;
	//AL(sprintf("gl[%2d].sphere          XYZs.numItems=%4d",at,glSubAt.sphereXYZ0XYZ1Norm0Norm1s[0].numItems));
	glSubAt.sphereFaceIndices[0] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glSubAt.sphereFaceIndices[0]);
	glSubAt.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parsedJson.faceIndices3), gl.STATIC_DRAW);
	glSubAt.sphereFaceIndices[0].numItems = parsedJson.faceIndices3.length;
	//AL(sprintf("gl[%2d].sphereFaceIndices[0].numItems=%4d",at,glSubAt.sphereFaceIndices[0].numItems));
	
	glSubAt.sphereXYZ0XYZ1Norm0Norm1s[1] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ARRAY_BUFFER, glSubAt.sphereXYZ0XYZ1Norm0Norm1s[1]);
	glSubAt.bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s4), gl.STATIC_DRAW);
	glSubAt.sphereXYZ0XYZ1Norm0Norm1s[1].numItems = parsedJson.vertexFaceXYZ0XYZ1Norm0Norm1s4.length / 12;
	//AL(sprintf("gl[%2d].sphere          XYZs.numItems=%4d",at,glSubAt.sphereXYZ0XYZ1Norm0Norm1s[1].numItems));
	glSubAt.sphereFaceIndices[1] = glSubAt.createBuffer();
	glSubAt.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glSubAt.sphereFaceIndices[1]);
	glSubAt.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parsedJson.faceIndices4), gl.STATIC_DRAW);
	glSubAt.sphereFaceIndices[1].numItems = parsedJson.faceIndices4.length;
	//AL(sprintf("gl[%2d].sphereFaceIndices[0].numItems=%4d",at,glSubAt.sphereFaceIndices[1].numItems));
}

function initShaders06() {
	var   vertexShader = getShader(  "vertex-shader3");
	var fragmentShader = getShader("fragment-shader2");
	
	gl[gl.at].shaderProgram = gl[gl.at].createProgram();
	gl[gl.at].attachShader(gl[gl.at].shaderProgram,  vertexShader);
	gl[gl.at].attachShader(gl[gl.at].shaderProgram, fragmentShader);
	gl[gl.at].linkProgram (gl[gl.at].shaderProgram);
	if (!gl[gl.at].getProgramParameter(gl[gl.at].shaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise shaders 06");
	}
	gl[gl.at].useProgram(gl[gl.at].shaderProgram);
	
	gl[gl.at].paXYZ0         = gl[gl.at].getAttribLocation(gl[gl.at].shaderProgram, "aXYZ0"   );
	gl[gl.at].paXYZ1         = gl[gl.at].getAttribLocation(gl[gl.at].shaderProgram, "aXYZ1"   );
	gl[gl.at].paNormal0      = gl[gl.at].getAttribLocation(gl[gl.at].shaderProgram, "aNormal0");
	gl[gl.at].paNormal1      = gl[gl.at].getAttribLocation(gl[gl.at].shaderProgram, "aNormal1");
	gl[gl.at].enableVertexAttribArray(gl[gl.at].paXYZ0);
	gl[gl.at].enableVertexAttribArray(gl[gl.at].paXYZ1);
	gl[gl.at].enableVertexAttribArray(gl[gl.at].paNormal0);
	gl[gl.at].enableVertexAttribArray(gl[gl.at].paNormal1);
	
	gl[gl.at].puTween                       = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uTween"                      );
	gl[gl.at].puPerspectiveMatrix           = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uPerspectiveMatrix"          );
	gl[gl.at].puMvm                         = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uMvm"                        );
	gl[gl.at].puNormal                      = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uNormal"                     );
	
	gl[gl.at].puShowSpecularHighlights      = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uShowSpecularHighlights"     );
	gl[gl.at].puShowNegativeDiffuse         = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uShowNegativeDiffuse"        );
	gl[gl.at].puUseLighting                 = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uUseLighting"                );
	gl[gl.at].puUseMaterialTweening         = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uUseMaterialTweening"        );
	
	gl[gl.at].puMaterialAmbientRGB          = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uMaterialAmbientRGB"         );
	gl[gl.at].puMaterialDiffuseRGB          = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uMaterialDiffuseRGB"         );
	gl[gl.at].puMaterialSpecularRGB         = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uMaterialSpecularRGB"        );
	gl[gl.at].puMaterialShininess           = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uMaterialShininess"          );
	gl[gl.at].puMaterialEmissiveRGB         = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uMaterialEmissiveRGB"        );
	gl[gl.at].puMaterialAmbientRGBTween     = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uMaterialAmbientRGBTween"    );
	gl[gl.at].puMaterialDiffuseRGBTween     = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uMaterialDiffuseRGBTween"    );
	gl[gl.at].puMaterialSpecularRGBTween    = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uMaterialSpecularRGBTween"   );
	gl[gl.at].puMaterialShininessTween      = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uMaterialShininessTween"     );
	
	gl[gl.at].puAmbientLightRGB             = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uAmbientLightRGB"            );
	
	gl[gl.at].puDirectionalLightDiffuseRGB  = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uDirectionalLightDiffuseRGB" );
	gl[gl.at].puDirectionalLightSpecularRGB = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uDirectionalLightSpecularRGB");
	gl[gl.at].puDirectionalLightXYZ         = gl[gl.at].getUniformLocation(gl[gl.at].shaderProgram, "uDirectionalLightXYZ"        );
}
function setMatrixUniforms06() {
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
	gl[gl.at].uniform1f(gl[gl.at].puTween,gl.tween);
}
function drawScene06() {
	//if(5==gl.animationCount06)AL(sprintf("drawScene06 with gl.at=%2d gl.animationCount06=%3d gl.tweenCycle06=%d gl.tween=%7.3f",gl.at,gl.animationCount06,gl.tweenCycle06,gl.tween));
	gl[gl.at].viewport(0, 0, gl[gl.at].viewportWidth, gl[gl.at].viewportHeight);
	gl[gl.at].clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//AL("gotTo 0="+gl.animationCount06);
	if (gl[gl.at].numCriticalJsons2BDone  > gl[gl.at].numCriticalJsonsDone){
		//AL("early return gl.at="+gl.at);
		return;
	}
	//AL(sprintf("drawScene06 past the nulls with gl.at=%2d gl.animationCount06=%3d",gl.at,gl.animationCount06));
	
	mat4.perspective(45, gl[gl.at].viewportWidth / gl[gl.at].viewportHeight, 0.1, 100.0, gl[gl.at].perspectiveMatrix);
	
	//AL("450 gotTo="+gl.animationCount06);	
	var specularHighlights;
	var negativeDiffuse;
	var lighting;
	if(null != document.getElementById('specular')){
		
		specularHighlights = document.getElementById("specular"  ).checked;
		negativeDiffuse    = document.getElementById("negDiffuse").checked;
		lighting           = document.getElementById("lighting"  ).checked;
		//if(5==gl.animationCount06)AL("specular exists  specularChecked="+(specularHighlights?"True":"False")+" negativeDiffuse="+(negativeDiffuse?"True":"False")+" lighting="+(lighting?"True":"False"));
		if (lighting) {
			gl[gl.at].uniform3f(
				 	gl[gl.at].puAmbientLightRGB
					,gl.ambientLightRGB06[0]
					,gl.ambientLightRGB06[1]
					,gl.ambientLightRGB06[2]
			);
			gl[gl.at].uniform3f(gl[gl.at].puDirectionalLightSpecularRGB,1.0,1.0,1.0);
		}
	} else {
		//if(5==gl.animationCount06)AL("in section for lessons page");
		specularHighlights = true;
		negativeDiffuse    = true;	
		lighting           = true;
		gl[gl.at].uniform3f(gl[gl.at].puAmbientLightRGB            ,1.0,1.0,1.0);

		gl.directionalLightXYZ06         = vec3.createFrom(0.0,0.0,1.0);
		gl.directionalLightDiffuseRGB06  = vec3.createFrom(1.0,1.0,1.0);
		gl.directionalLightSpecularRGB06 = vec3.createFrom(1.0,1.0,1.0);
	}	
	gl[gl.at].uniform1i(gl[gl.at].puShowSpecularHighlights,specularHighlights);
	gl[gl.at].uniform1i(gl[gl.at].puShowNegativeDiffuse   ,negativeDiffuse   );
	gl[gl.at].uniform1i(gl[gl.at].puUseLighting           ,lighting          );
	
	var dXYZ=vec3.createFrom( gl.directionalLightXYZ06[0]
							 ,gl.directionalLightXYZ06[1]
							 ,gl.directionalLightXYZ06[2]
							);
	vec3.scale(dXYZ,1000000000.);
	mat4.multiplyVec3(gl[gl.at].mvm,dXYZ);
	vec3.normalize(dXYZ);
	//if(5==gl.animationCount06)AL(sprintf("gl[%d] gl.directionalLightXYZ06 norm =%s",gl.at,vec3.printS3(gl.directionalLightXYZ06)));
	gl[gl.at].uniform3f( gl[gl.at].puDirectionalLightXYZ
						,dXYZ[0]
						,dXYZ[1]
						,dXYZ[2]
						);
	gl[gl.at].uniform3f( gl[gl.at].puDirectionalLightDiffuseRGB
						,gl.directionalLightDiffuseRGB06[0]
						,gl.directionalLightDiffuseRGB06[1]
	 					,gl.directionalLightDiffuseRGB06[2]
						);
	gl[gl.at].uniform3f( gl[gl.at].puDirectionalLightSpecularRGB
						,gl.directionalLightSpecularRGB06[0]
						,gl.directionalLightSpecularRGB06[1]
						,gl.directionalLightSpecularRGB06[2]
						);
	//AL(sprintf("gl[%d] gl.directionalLightDiffuseRGB06=%s",gl.at,vec3.printS3(gl.directionalLightDiffuseRGB06)));

	gl[gl.at].uniform1f(gl[gl.at].puMaterialShininess,gl[gl.at].materialShininess);
	
	//if(true==gl.sayOnce06)AL("gl.tweenCycle06="+gl.tweenCycle06);
	
	//gl.talkon06=false;
	//if(  (false==gl.benOneFullCycle06) 
	//   &&(gl.at==gl.lower06At)
	//   &&(0==gl.animationCount06%10)
	//   &&(1==gl.tweenCycle06)
	//){
	//	gl.talkon06=true;
	//}
	//if(true==gl.talkon06)AL(sprintf("cycle=%d tween=%5.3f",gl.tweenCycle06,gl.tween));
	
	if(0==gl.tweenCycle06){
		gl[gl.at].uniform1i(gl[gl.at].puUseMaterialTweening,false);
			for(var kk=0;kk<6;kk++){
			gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].sphereXYZ0XYZ1Norm0Norm1Set0[kk]);
			gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ0   , 3, gl.FLOAT, false,48, 0);
			gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ1   , 3, gl.FLOAT, false,48,12);
			gl[gl.at].vertexAttribPointer(gl[gl.at].paNormal0, 3, gl.FLOAT, false,48,24);
			gl[gl.at].vertexAttribPointer(gl[gl.at].paNormal1, 3, gl.FLOAT, false,48,36);
			glPushMatrix();
				mat4.translate(gl[gl.at].mvm, [-6, 0, 0]);
				var counter=0;
				for(var jj=0;jj<7;jj++){
					for(var ii=0;ii<7;ii++){
						if(0==(gl.morphIteration06+counter)%2){
							DrawMaterialSphere(kk,jj,ii, gl[gl.at].sphereFaceIndiceSet0[kk].numItems,false,counter);
						}
						counter++;
					};	
				}	
			glPopMatrix();
		}
		for(var kk=0;kk<6;kk++){
			gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].sphereXYZ0XYZ1Norm0Norm1SetR0[kk]);
			gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ0   , 3, gl.FLOAT, false,48, 0);
			gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ1   , 3, gl.FLOAT, false,48,12);
			gl[gl.at].vertexAttribPointer(gl[gl.at].paNormal0, 3, gl.FLOAT, false,48,24);
			gl[gl.at].vertexAttribPointer(gl[gl.at].paNormal1, 3, gl.FLOAT, false,48,36);
			glPushMatrix();
				mat4.translate(gl[gl.at].mvm, [-6, 0, 0]);
				var counter=0;
				for(var jj=0;jj<7;jj++){
					for(var ii=0;ii<7;ii++){
						if(1==(gl.morphIteration06+counter)%2){
							//AL("numItems="+kk);
							//AL("numItems="+ gl[gl.at].sphereFaceIndiceSetR0[kk].numItems);
							DrawMaterialSphere(kk,jj,ii, gl[gl.at].sphereFaceIndiceSetR0[kk].numItems,true,counter);
						}
						counter++;
					};
				}
			glPopMatrix();
		}
	} else
	if(1==gl.tweenCycle06){
		gl[gl.at].uniform1i(gl[gl.at].puUseMaterialTweening,true);
		for(var kk=0;kk<6;kk++){
			gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].sphereXYZ0XYZ1Norm0Norm1Set1[kk]);
			gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ0   , 3, gl.FLOAT, false,48, 0);
			gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ1   , 3, gl.FLOAT, false,48,12);
			gl[gl.at].vertexAttribPointer(gl[gl.at].paNormal0, 3, gl.FLOAT, false,48,24);
			gl[gl.at].vertexAttribPointer(gl[gl.at].paNormal1, 3, gl.FLOAT, false,48,36);
			glPushMatrix();
				mat4.translate(gl[gl.at].mvm, [-6, 0, 0]);
				var counter=0;
				for(var jj=0;jj<7;jj++){
					for(var ii=0;ii<7;ii++){
						if(0==(gl.morphIteration06+counter)%2){
							DrawMaterialSphere(kk,jj,ii, gl[gl.at].sphereFaceIndiceSet1[kk].numItems,true,counter);
						}	
						counter++;
					};
				}
			glPopMatrix();
		};
		for(var kk=0;kk<6;kk++){
			gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].sphereXYZ0XYZ1Norm0Norm1SetR1[kk]);
			gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ0   , 3, gl.FLOAT, false,48, 0);
			gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ1   , 3, gl.FLOAT, false,48,12);
			gl[gl.at].vertexAttribPointer(gl[gl.at].paNormal0, 3, gl.FLOAT, false,48,24);
			gl[gl.at].vertexAttribPointer(gl[gl.at].paNormal1, 3, gl.FLOAT, false,48,36);
			glPushMatrix();
				mat4.translate(gl[gl.at].mvm, [-6, 0, 0]);
				var counter=0;
				for(var jj=0;jj<7;jj++){
					for(var ii=0;ii<7;ii++){
						if(1==(gl.morphIteration06+counter)%2){
							DrawMaterialSphere(kk,jj,ii, gl[gl.at].sphereFaceIndiceSetR1[kk].numItems,true,counter);
						}
						counter++;
					};
				}
			glPopMatrix();
		}
	} else {
		gl[gl.at].uniform1i(gl[gl.at].puUseMaterialTweening,false);
		var kk=999;
		gl[gl.at].bindBuffer(gl.ARRAY_BUFFER, gl[gl.at].sphereXYZ0XYZ1Norm0Norm1s[gl.tweenCycle06-2]);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ0   , 3, gl.FLOAT, false,48, 0);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paXYZ1   , 3, gl.FLOAT, false,48,12);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paNormal0, 3, gl.FLOAT, false,48,24);
		gl[gl.at].vertexAttribPointer(gl[gl.at].paNormal1, 3, gl.FLOAT, false,48,36);
		glPushMatrix();
			mat4.translate(gl[gl.at].mvm, [-6, 0, 0]);
			var counter=0;
			for(var jj=0;jj<7;jj++){
				for(var ii=0;ii<7;ii++){
					DrawMaterialSphere(kk,jj,ii, gl[gl.at].sphereFaceIndices[gl.tweenCycle06-2].numItems,false,counter);
					counter++;
				};
			}
		glPopMatrix();
	}
	
	if(gl.at==gl.lower06At){
		var canvas = document.getElementById("tutorial06-canvas0");
		var img    = canvas.toDataURL("image/png");
		var ajax = new XMLHttpRequest();
		var postData = "canvasData="+img;
		ajax.open("POST","WebGLTutorials",true);
		//	$.ajax({type:"POST",url:"WebGLTutorials",data:"2log="+message});
		ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		ajax.send(postData);
		gl.animationHalt06=true;
	}
	
	var elem = document.getElementById(sprintf("xyzpry%d",gl.at));
	//AL("elem="+elem+" "+sprintf("xyzpry%d",gl.at));
	if(null!=elem)elem.innerHTML=xyzpryPrint();
	elem = document.getElementById(sprintf("stepTurn%d",gl.at));
	if(null!=elem)elem.innerHTML=sprintf(" step=%8.3f &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; turn=pi/%d",gl[gl.at].deltaMove,gl[gl.at].deltaTurnPiOver);
	gl.sayOnce06=false;
}

function DrawMaterialSphere(kk,jj,ii,numItems,payAttentionToCounter,counter){
	//if(gl.talkon06)AL(sprintf("DrawMaterialSphere ii=%d jj=%d kk=%d numItems=%3d useCounter=%s counter=%4d",ii,jj,kk,numItems,(payAttentionToCounter?"true ":"false"),counter));
	if(  (0==gl.lower06At)	
	   ||(  (0!=gl.lower06At)         /* show only the brass on left window on WegGLTutorials */
	      &&(gl.at == gl.lower06At)
	      &&(3==ii)
	      &&(1==jj)
	     )
	   ||(  (0!=gl.lower06At)      /* show only the emerald on right small window on WegGLTutorials */
	      &&(gl.at == gl.upper06At)
	      &&(3==ii)
	      &&(0==jj)
	     )
	  ){
		if(false==gl.materislsOn06){
			setGLMaterial(gl.at,999);
			gl[gl.at].materialShininess=gl.shininess06;	
		} else {
			if(  (false==payAttentionToCounter)
			   ||(0==counter%2)		
			){
				//if(true==gl.sayOnce06 && gl.at==gl.lower06At){AL(sprintf("switch even kk=%d",kk));}
				switch(kk){
					case 0:
						setGLMaterial(gl.at,2); /* blue for the tetrahedral faces */
						break;
					case 1:
						setGLMaterial(gl.at,0); /* red for the corners of the tetrahedra */
						break;
					case 2:
						setGLMaterial(gl.at,8);
						break;
					case 3:
						setGLMaterial(gl.at,1);
						break;
					case 4:
						setGLMaterial(gl.at,10);
						break;
					case 5:
						setGLMaterial(gl.at,4);
						break;
					case 999:
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
						//if(5==gl.animationCount06 && gl.at==gl.lower06At)AL(sprintf("ii=%d jj=%d material=%2d",ii,jj,(ii+(7*jj))));
						break;	
					default:
						setGLMaterial(gl.at,8);
				}
			} else {
				switch(kk){
					case 0:
						setGLMaterial(gl.at,2);
						break;
					case 1:
						setGLMaterial(gl.at,0);
						break;
					case 2:
						setGLMaterial(gl.at,8);
						break;
					case 3:
						setGLMaterial(gl.at,10);
						break;
					case 4:
						setGLMaterial(gl.at,1);
						break;
					case 5:
						setGLMaterial(gl.at,4);
						break;
					case 999:
//						setGLMaterial(gl.at,ii+(7*jj));
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
						//AL("believe this should never get here");
						break;	
					default:
						setGLMaterial(gl.at,8);
				}
			}
		}
		gl[gl.at].uniform3f(
			 gl[gl.at].puMaterialAmbientRGB
			,gl[gl.at].materialAmbientRGB[0]
			,gl[gl.at].materialAmbientRGB[1]
			,gl[gl.at].materialAmbientRGB[2]
		);
		//AL(sprintf("gl[%d].materialAmbientRGB=%s",gl.at,vec3.printS3(gl[gl.at].materialAmbientRGB)));
		gl[gl.at].uniform3f(
			 gl[gl.at].puMaterialDiffuseRGB
			,gl[gl.at].materialDiffuseRGB[0]
			,gl[gl.at].materialDiffuseRGB[1]
			,gl[gl.at].materialDiffuseRGB[2]
		);
		gl[gl.at].uniform3f(
			 gl[gl.at].puMaterialSpecularRGB
			,gl[gl.at].materialSpecularRGB[0]
			,gl[gl.at].materialSpecularRGB[1]
			,gl[gl.at].materialSpecularRGB[2]
		);
		gl[gl.at].uniform1f(
			 gl[gl.at].puMaterialShininess
			,gl[gl.at].materialShininess
		);
		if(  (1==gl.tweenCycle06)
		   &&(true==gl.materialTween06)
		){
			//if(  (true==gl.talkon06)
			//   &&(gl.at == gl.lower06At)
			//   &&(3==ii)
			//   &&(1==jj)		
			//  ){
			//  AL("inside green tween setup");
			//}
			//setGLMaterial(gl.at,ii+(7*jj));
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
			gl[gl.at].uniform3f(
				 gl[gl.at].puMaterialAmbientRGBTween
				,gl[gl.at].materialAmbientRGB[0]
				,gl[gl.at].materialAmbientRGB[1]
				,gl[gl.at].materialAmbientRGB[2]
			);
			//AL(sprintf("gl[%d]=materialAmbientRGB=%s",gl.at,vec3.printS3(gl[gl.at].materialAmbientRGB)));
			gl[gl.at].uniform3f(
				 gl[gl.at].puMaterialDiffuseRGBTween
				,gl[gl.at].materialDiffuseRGB[0]
				,gl[gl.at].materialDiffuseRGB[1]
				,gl[gl.at].materialDiffuseRGB[2]
			);
			gl[gl.at].uniform3f(
				 gl[gl.at].puMaterialSpecularRGBTween
				,gl[gl.at].materialSpecularRGB[0]
				,gl[gl.at].materialSpecularRGB[1]
				,gl[gl.at].materialSpecularRGB[2]
			);
			gl[gl.at].uniform1f(
				 gl[gl.at].puMaterialShininessTween
				,gl[gl.at].materialShininess
			);
		}
		//AL("gl.at="+gl.at+" ");
		glPushMatrix();
			mat4.translate(gl[gl.at].mvm, [2*ii,2*jj, 0]);
			setMatrixUniforms06();
			gl[gl.at].drawElements(gl.TRIANGLES,numItems, gl.UNSIGNED_SHORT, 0);
		glPopMatrix();
	}
}
function animate06() {
	var timeNow = new Date().getTime();
	//AL("animateCount="+gl.animationCount06+" vs gl.animationHaltAt06="+gl.animationHaltAt06);
	if (gl.lastTime06 != 0) {
		var elapsed = timeNow - gl.lastTime06;
		if(gl.animationHaltAt06==gl.animationCount06){
			gl.animationHalt06=true;
		}	
		gl.animationCount06++;
		gl.tween+=(0==gl.lower06At?.0002:.001)*elapsed*gl.tweenDirection06;
		if(gl.tween>1.0){
			if(gl.tweenCycle06 < (gl.numTweenedSpheres06-1)){
				gl.tween=0;
				gl.tweenCycle06++;
			} else {
				//AL("at turning point.  gl.animationCount06="+gl.animationCount06);
				gl.tweenDirection06*=-1;
				gl.tween=1.;
				gl.benOneFullCycle06=true;
			}
			//AL(sprintf("gl.tweenCycle06 ="+gl.tweenCycle06+" top   gl.tweenDirection06="+gl.tweenDirection06));
		} else
		if(gl.tween<0.0){
			if(gl.tweenCycle06>0){
				gl.tween=1;
				gl.tweenCycle06--;
			} else {
				gl.tweenDirection06*=-1;
				gl.tween=0.;
				gl.morphIteration06++;
			}
			//AL(sprintf("gl.tweenCycle06 ="+gl.tweenCycle06+" bot   gl.tweenDirection06="+gl.tweenDirection06));
		}
		//AL(sprintf("gl.tween=%5.3f",gl.tween));
	}
	
	/* toggle the commenting on this next section to cause the tweening to halt at a desired place in the cycles+tweens */
	//if(  (1==gl.tweenCycle06)
	//   &&(.9<gl.tween)
	//  ){
	//	gl.animationHalt06=true;
	//} 
	
	gl.lastTime06 = timeNow;
	//AL(sprintf("gl.tweenCycle06 = "+gl.tweenCycle06));
}
function tick06() {
	if(false==gl.animationHalt06){
		requestAnimFrame(tick06);
	}
	gl.at=gl.lower06At;
	drawScene06();
	gl.at=gl.upper06At;
	drawScene06();
	
	animate06();
}
function AL(message){
	$.ajax({type:"POST",url:"WebGLTutorials",data:"2log="+message});
}
/**************************************  Directional Light ***************************************/
function handleDXYZSliderSlide(e, ui){
	var angle = Math.PI*(100-ui.value)/100.;
	gl.directionalLightXYZ06 = vec3.createFrom(Math.cos(angle),-0.5,Math.sin(angle));
	/**/AL("DSliderSlide on the move "+ui.value +" angle="+angle*rad2Deg+" DLXYZ="+vec3.printS3(gl.directionalLightXYZ06));
	reDraw();
}
function handleDirectionalDiffuseChange(cp) {
	//AL("Directional Diffuse ColorPicker Changed, new value = " + cp.value +" "+vec3.printS3(hexToRgb(cp.value)));
	gl.directionalLightDiffuseRGB06  = hexToRgb(cp.value);
	reDraw();
}
function handleDirectionalSpecularChange(cp) {
	//AL("Directional Specular ColorPicker Changed, new value = " + cp.value +" "+vec3.printS3(hexToRgb(cp.value)));
	gl.directionalLightSpecularRGB06  = hexToRgb(cp.value);
	reDraw();
}
/**************************************   Ambient Light  ***************************************/
function handleAmbientChange(cp) {
	//AL("Ambient ColorPicker Changed, new value = " + cp.value +" "+vec3.printS3(hexToRgb(cp.value)));
	gl.ambientLightRGB06  = hexToRgb(cp.value);
	reDraw();
}
/**************************************   shininess  ***************************************/
function handleShininessSliderSlide(e, ui){
	gl.shininess06=ui.value/10;
	//AL("ShininessSliderSlide on the move "+ui.value +" becomming "+gl.shininess06);
	reDraw();
}
/************************************** Material ***************************************/
function handleMaterialChange(cb) {
	//AL("material Changed, new value = " + cb.checked);
	if(false==cb.checked){
		gl.materislsOn06=false;
		ambientRGB                  = vec3.createFrom(0.25,0.25,0.25);
		gl.directionalLightDiffuseRGB06  = vec3.createFrom(0.25,0.25,0.25);
		gl.directionalLightSpecularRGB06 = vec3.createFrom(0.25,0.25,0.25);
		$("#ambient"            ).spectrum("set", "#404040");
		$("#directionalDiffuse" ).spectrum("set", "#808080");
		$("#directionalSpecular").spectrum("set", "#00A000");
	} else {
		gl.materislsOn06=true;
		ambientRGB                  = vec3.createFrom(1.,1.,1.);
		gl.directionalLightDiffuseRGB06  = vec3.createFrom(1.,1.,1.);
		gl.directionalLightSpecularRGB06 = vec3.createFrom(1.,1.,1.);
		//AL("into true0");
		$("#ambient"            ).spectrum("set", "#FFFFFF");
		//AL("into true1");
		$("#directionalDiffuse" ).spectrum("set", "#FFFFFF");
		$("#directionalSpecular").spectrum("set", "#FFFFFF");
	}
	reDraw();
}
/****** to see the effects post input click, even when the animation has been turned off  *******/
function reDraw(){
	gl.at=gl.lower06At;
	drawScene06();
	gl.at=gl.upper06At;
	drawScene06();
}
/************************************** the onReady functions ************************************/
$(document).ready(function(){
	//AL("in ready 06");
	if(-1<document.getElementById("title").innerHTML.indexOf("tutorial06")){
		//AL("inside ready 06");
		$("input[id^=step06]").click(function (event) {
			//AL("inside06 button[id="+this.id+"]");
			//AL("looking at this.id="+this.id);
			gl.at=parseInt(this.id.charAt(this.id.length-1));
			//AL("whichCanvas="+gl.at);
			//AL("step this.id="+this.id+" this.id.substring(7,9)="+this.id.substring(7,9));
			if(   (this.id.substring(7,9) == "dn")
			   &&(.0006<gl[gl.at].deltaMove)		
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
			document.getElementById(0==gl.at?"tutorial06-canvas0":"tutorial06-canvas1").focus();
			drawScene06();
		});	
		$("input[id^=turn06]").click(function (event) {
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
			document.getElementById(0==gl.at?"tutorial06-canvas0":"tutorial06-canvas1").focus();
			drawScene06();
		});
		$("input[id^=home06]").click(function (event) {
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
			document.getElementById(0==gl.at?"tutorial06-canvas0":"tutorial06-canvas1").focus();
			drawScene06();
		});
		 $("#directionalLightXYZSlider").slider({
			animate: true,
			value: 50,
			slide: handleDXYZSliderSlide
		});
		 $("#shininessSlider").slider({
			animate: true,
			value:50,
			slide: handleShininessSliderSlide
		});
		$('#tutorial06Tabs').tabs({
			active: ((null != document.getElementById('setTet2Icosa'))?0:1),
			collapsible: false
		});
		$("input[id=materials]").click(function (event) {
			//AL("button "+this.id);
			if(true==gl.materislsOn06){
				this.value="Materials";
				gl.materislsOn06=false;
				document.getElementById("shiner").style.display = 'block';
			} else{
				this.value="No Materials";
				gl.materislsOn06=true;
				document.getElementById("shiner").style.display = 'none';
			}
		});
		$("input[id=tweening]").click(function (event) {
			//AL("button "+this.id);
			var elem = document.getElementById(this.id);
			//AL("looking at elem.value="+elem.value);
			if(-1<elem.value.indexOf("Halt")){
				elem.value="ReStart";
				gl.animationHalt06=true;
				//AL("halting the tweening animation");
			} else {
				elem.value="  Halt ";
				gl.lastTime06=new Date().getTime();
				//AL("restarting the tweening animation");
				gl.animationHalt06=false;
				requestAnimFrame(tick06);
			}
		});
		$("input[id=tween_min]").click(function (event) {
			//AL("button tween_max");
			gl.animationHalt06=true;
			var elem = document.getElementById("tweening");
			elem.value="ReStart";
			gl.tweenCycle06 =0;
			gl.tween=0;
			reDraw();
		});
		$("input[id=color_tween_min]").click(function (event) {
			//AL("button tween_max");
			gl.animationHalt06=true;
			var elem = document.getElementById("tweening");
			elem.value="ReStart";
			gl.tweenCycle06 =1;
			gl.tween=0;
			//gl.sayOnce06=true;
			reDraw();
		});
		$("input[id=tween_max]").click(function (event) {
			//AL("button tween_max");
			gl.animationHalt06=true;
			var elem = document.getElementById("tweening");
			elem.value="ReStart";
			gl.tweenCycle06 = gl.numTweenedSpheres06-1;
			gl.tween=1;
			//gl.sayOnce06=true;
			reDraw();
		});
		$("input[id=negDiffuse]").click(function (event) {
			//AL("checkbox "+this.id);
			reDraw();
		});
		$("input[id=specular]").click(function (event) {
			//AL("checkbox "+this.id);
			reDraw();
		});
		$("input[id=lighting]").click(function (event) {
			//AL("checkbox "+this.id);
			reDraw();
		});
		$("#ambient").spectrum({
			preferredFormat: "hex6",
			showInput: true
		});
		$("#directionalDiffuse").spectrum({
			preferredFormat: "hex6",
			showInput: true
		});
		$("#directionalSpecular").spectrum({
			preferredFormat: "hex6",
			showInput: true
		});
		$("input[id^=cullFaces]").click(function (event) {
			//AL("inside06 button[id="+this.id+"]");
			var elem = document.getElementById(this.id);
			//AL("looking at elem.value="+elem.value);
			if(-1<elem.value.indexOf("Enable")){
				elem.value=" Disable CullFace ";
				gl[gl.lower06At].enable(gl.CULL_FACE);
				gl[gl.upper06At].enable(gl.CULL_FACE);
				//AL("enabling CULL_FACE on both canvases");
			} else {
				elem.value="  Enable CullFace ";
				gl[gl.lower06At].disable(gl.CULL_FACE);
				gl[gl.upper06At].disable(gl.CULL_FACE);
				//AL("disabling CULL_FACE on both canvases");
			}
			reDraw();
		});
		$("input[id^=phase]").click(function (event) {
			//AL("inside06 button[id="+this.id+"]");
			var elem = document.getElementById(this.id);
			//AL("looking at elem.value="+elem.value);
			if(-1<elem.value.indexOf("All Cycles")){
				elem.value=" First cycle only ";
				gl.numTweenedSpheres06=1;
				gl.tweenCycle06=0;
				//AL("limiting to tetrahedron <==> Icosahedron ");
			} else {
				elem.value=" All Cycles ";
				gl.numTweenedSpheres06=4;
				//AL("showing full tetrahedron thru most sphere-like");
			}
			reDraw();
		});
	}
	$('canvas[id^="tutorial06-canvas"]')
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
				gl.at=gl.lower06At;
			} else {
				gl.at=gl.upper06At;	
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
			if(true==gl.animationHalt06){
				var thisId=document.activeElement.id;
				//AL("halted movement input.  gl.at keying off "+thisId+" left allBut1="+thisId.substring(0,thisId.length-1));
				if(thisId.substring(0,thisId.length-1) == "tutorial06-canvas"){
				    //AL("got inside.  trying for number "+Number(thisId.substring(thisId.length-1)));
					gl.at=Number(thisId.substring(thisId.length-1));;
					drawScene06();
				} 
				
			}
		}	
		return false; 
	});
});