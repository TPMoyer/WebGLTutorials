/*   © 2013 Thomas P Moyer  */ 

var gl = [];
gl.at=-1;
var rad2Deg=180/Math.PI;
var deg2Rad=1/rad2Deg;
var piOver2 = Math.PI/2;
gl.shiftKeyDown=false;

/* the modelview matrix was reverse engineered as meaning    positions are from 0,0,0 to present location
-leftX          +roofX         -ForwardX         NotFiguredOutButHasToDoWithScale
-leftY          +roofY         -ForwardY         NotFiguredOutButHasToDoWithScale
-leftZ          +roofZ         -ForwardZ         NotFiguredOutButHasToDoWithScale
-amplitudeLeft -amplitudeRoof  -amplitudeForward      one

-leftX         +roofX         -ForwardX         NotFiguredOutButHasToDoWithScale
  0              1              2                  3
-leftY         +roofY         -ForwardY         NotFiguredOutButHasToDoWithScale
  4              5              6                  7
-leftZ         +roofZ         -ForwardZ         NotFiguredOutButHasToDoWithScale
  8              9             10                 11
-amplitudeLeft -amplitudeRoof -amplitudeForward  one
  12             13            14                 15
*/
function rightMouseButton(e){
	//AL("rightMouseButton contextMenu overRidden");
}	

function initGL(canvas) {
	//AL("cme@ gl-aux2.js initGL gl.length="+gl.length);
	try {
		gl.push(canvas.getContext("experimental-webgl", {preserveDrawingBuffer: true}));
		if(1==gl.length){
			gl.at=0;
			setGLConstants();
			gl.singleShot4Draw=false;
			gl.striker = [];
			for(var ii=0;ii<12;ii++){
				gl.striker[ii]=vec3.create();
			}
			//AL("initGL pre setting post font set gl.at="+gl.at);
			gl.fontNames       = [];
			gl.fontTextureSizes= [];
			gl.fontCharSet     = [];
			gl.fontWidthType   = [];
			gl.fontWidthType   = [];
			gl.fontWeight      = [];
			gl.fontHeight      = [];
			gl.fontDescent     = [];
			gl.fontAs = [];
			gl.fontBs = [];
			gl.fontCs = [];
			gl.fontXs = [];
			gl.fontYs = [];
			gl.font2Use=0;
			gl.fontIndex=0;
			//AL("initGL pre2 setting post font set gl.at="+gl.at);
			for(var ii=0;ii<4;ii++){
				gl.fontAs[ii]= [];
				gl.fontBs[ii]= [];
				gl.fontCs[ii]= [];
				gl.fontXs[ii]= [];
				gl.fontYs[ii]= [];
			}
			//AL("initGL initial setting post font set gl.at="+gl.at);
		} //else {
			//AL("initGL gl.length="+gl.length);
		//}
		gl.at=gl.length-1;
		//AL("gl.at="+gl.at);
		gl[gl.at].viewportWidth  = canvas.width;
		gl[gl.at].viewportHeight = canvas.height;
		gl[gl.at].viewportAngle = 45.*deg2Rad;
		gl[gl.at].pixelsToPlane=.5*gl[gl.at].viewportHeight/Math.tan(gl[gl.at].viewportAngle/2.);
		gl[gl.at].frustumNear=0.1;
		gl[gl.at].frustumFar=100.;
		gl[gl.at].shaderProgram;
		gl[gl.at].X = 0.;
		gl[gl.at].Y = 0.;
		gl[gl.at].Z = 0.;
		gl[gl.at].pitch = Math.Pi;
		gl[gl.at].roll  = 0.;
		gl[gl.at].yaw   = 0.;
		gl[gl.at].deltaMove = 1.;
		gl[gl.at].deltaTurnPiOver=128;
		gl[gl.at].mvm = mat4.create(); /* ModelViewMatix              Works with glPushMatrix and glPopMatrix */
		gl[gl.at].mvmStack = [];       /* stack of modelViewMatrixes  Works with glPushMatrix and glPopMatrix */
		gl[gl.at].perspectiveMatrix = mat4.create(); 
		gl[gl.at].mvmp = mat4.create();  /* will be the multiplication of mvm and perspectiveMatrix,  */
		                                 /* to avoid needless repetitive in-fragment-shader multiplications */
		gl[gl.at].numCriticalJsonsDone=0;
		gl[gl.at].numCriticalJsons2BDone=0;
		gl[gl.at].numCriticalTexturesDone=0;
		gl[gl.at].numCriticalTextures2BDone=0;
		gl[gl.at].numSecondaryJsonsDone=0;
		gl[gl.at].numSecondaryJsons2BDone=0;
		gl[gl.at].numSecondaryTexturesDone=0;
		gl[gl.at].numSecondaryTextures2BDone=0;
		gl[gl.at].mouseDownTargetXYZ=vec3.create();
		gl[gl.at].mouseDownAmAtXYZ=vec3.create();
		gl[gl.at].mouseDownAmAtPRY=vec3.create();
		gl[gl.at].mouseDownXY = vec2.create();
		gl[gl.at].mouseButtonState=quat4.createFrom(1,1,1,false); /* three buttons 0==down 1==up, and a flag as to mousebusy */
		//AL("gl["+gl.at+"].mouseButtonState="+quat4.str(gl[gl.at].mouseButtonState));
		gl[gl.at].mouseRState=0; /* 0 is indeterminate, 1 is pitch, 2 is yaw */
		gl[gl.at].vertexShaderMode=0;
		gl[gl.at].fragmentShaderMode=0;
		gl[gl.at].iterations=0;
		gl[gl.at].tractionIteration=-1;
		setGLMaterial(gl.at,0);
	} catch (e) {
		//AL("in the catch of initGL "+e);
	}
	if (!gl[gl.at]) {
		alert("Could not initialise webGL, sorry :-(");
	}
	//AL("leaving initGL gl.at="+gl.at);
}

function getShader(id) {
	//AL("cme@ getShader(id=\""+id+"\")");
	var shaderScript = document.getElementById(id);
	if (!shaderScript) {
		AL("!shaderScript");
		return null;
	}
	var str = "";
	var k = shaderScript.firstChild;
	while (k) {
		if (k.nodeType == 3) {
			str += k.textContent;
		}
		k = k.nextSibling;
	}
	//AL("shader str=\n"+str);
	var shader;
	if (-1<id.indexOf("fragment")) {
		shader = gl[gl.at].createShader(gl.FRAGMENT_SHADER);
		//AL("in fragment shader");
	} else if (-1<id.indexOf("vertex")) {	
		shader = gl[gl.at].createShader(gl.VERTEX_SHADER);
		//AL("in vertex shader");
	} else {
		//AL("shader was neither fragment nor vertex");
		return null;
	}
	gl[gl.at].shaderSource(shader, str);
	gl[gl.at].compileShader(shader);
	if (!gl[gl.at].getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl[gl.at].getShaderInfoLog(shader));
		//AL("in getShader alert");
		return null;
	}
	//AL("atEndO getShader");
	return shader;
}
/* used to get indices for normals of a faceted sphere. 
 *  outputs [0,0,0,1,,1,1,2,2,2,3,3,3... n-1,n-1,n-1
 */
function ranger3(i){return i?ranger3(i-1).concat(i-1).concat(i-1).concat(i-1):[];}

function xyzpryPrint(){
	return sprintf("xyz=(%8.3f,%8.3f%8.3f) pry=(%7.3f,%7.3f,%7.3f)",gl[gl.at].X,gl[gl.at].Y,gl[gl.at].Z,rad2Deg*gl[gl.at].pitch,rad2Deg*gl[gl.at].roll,rad2Deg*gl[gl.at].yaw);
}

function xyzpryLogView() {
	/* this puts the current location (X,Y,Z) and orientation (pitch, roll, yaw) to the  log catcher */
	//AL("cme@ xyzpry2Logger");
	xyzpryFigure();
	AL(sprintf("gl%2d xyz(%9.3f %9.3f %9.3f) pry(%7.3f %7.3f %7.3f)",gl.at,gl[gl.at].X,gl[gl.at].Y,gl[gl.at].Z,gl[gl.at].pitch*rad2Deg,gl[gl.at].roll*rad2Deg,gl[gl.at].yaw*rad2Deg));
};

/**
 *  Output the model-view-matrix of the current context as a 4x4 array
 *  Inverts (multiplies by -1) columns 0 and 2 in order to have the bottom
 *  row be the multiplier for how far we are along the vec3 above.
 */
function mvmLogView(){
	//AL("cme@ mvmLogView");	
	AL(sprintf(
		"           Left     Roof    Forward   Scale\n        X %8.3f %8.3f %8.3f %8.3f\n        Y %8.3f %8.3f %8.3f %8.3f\n        Z %8.3f %8.3f %8.3f %8.3f\namplitude %8.3f %8.3f %8.3f %8.3f"
		,-gl[gl.at].mvm[ 0], gl[gl.at].mvm[ 1],-gl[gl.at].mvm[ 2],gl[gl.at].mvm[ 3]
		,-gl[gl.at].mvm[ 4], gl[gl.at].mvm[ 5],-gl[gl.at].mvm[ 6],gl[gl.at].mvm[ 7]
		,-gl[gl.at].mvm[ 8], gl[gl.at].mvm[ 9],-gl[gl.at].mvm[10],gl[gl.at].mvm[11]
		,-gl[gl.at].mvm[12],-gl[gl.at].mvm[13],-gl[gl.at].mvm[14],gl[gl.at].mvm[15]
		)
	);	
}
mat4.printMvmLogView = function (mat){
	//AL("cme@ mat4.printMvmLogView");	
	AL(sprintf(
		"           Left     Roof    Forward   Scale\n        X %8.3f %8.3f %8.3f %8.3f\n        Y %8.3f %8.3f %8.3f %8.3f\n        Z %8.3f %8.3f %8.3f %8.3f\namplitude %8.3f %8.3f %8.3f %8.3f"
		,-mat[ 0], mat[ 1],-mat[ 2],mat[ 3]
		,-mat[ 4], mat[ 5],-mat[ 6],mat[ 7]
		,-mat[ 8], mat[ 9],-mat[10],mat[11]
		,-mat[12],-mat[13],-mat[14],mat[15]
		)
	);	
};
/**
 *  output the model-view-matrix of the current context as a 4x4 array (without inversions)
 */
function mvmLogPure(){
	//AL("cme@ mvmLogPure");	
	AL(sprintf(
		"\"pure mvm\" Right    Roof    Backward  Scale\n        X %8.3f %8.3f %8.3f %8.3f\n        Y %8.3f %8.3f %8.3f %8.3f\n        Z %8.3f %8.3f %8.3f %8.3f\namplitude %8.3f %8.3f %8.3f %8.3f"
		,gl[gl.at].mvm[ 0],gl[gl.at].mvm[ 1],gl[gl.at].mvm[ 2],gl[gl.at].mvm[ 3]
		,gl[gl.at].mvm[ 4],gl[gl.at].mvm[ 5],gl[gl.at].mvm[ 6],gl[gl.at].mvm[ 7]
		,gl[gl.at].mvm[ 8],gl[gl.at].mvm[ 9],gl[gl.at].mvm[10],gl[gl.at].mvm[11]
		,gl[gl.at].mvm[12],gl[gl.at].mvm[13],gl[gl.at].mvm[14],gl[gl.at].mvm[15]
		)
	);	
}

function glPushMatrix() {
									// AL("A");
	var copy = mat4.create();		// AL("B");
	mat4.set(gl[gl.at].mvm, copy);	// AL("C");
	gl[gl.at].mvmStack.push(copy);	// AL("D");
}
function sign(x) {
    return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}
function glPopMatrix() {
   if (gl[gl.at].mvmStack.length == 0) {
       throw "Invalid popMatrix!";
   }
   gl[gl.at].mvm = gl[gl.at].mvmStack.pop();
}
/**
 * prints the vec with sprintf(%7.3f) format
 *
 * @param {vec} Vec to pritn
 *
 * @returns {String}
 */
vec3.printS3 = function(v){
	return(sprintf("%7.3f,%7.3f,%7.3f",v[0],v[1],v[2]));
};
vec3.print3 = function(v){
	return(sprintf("%9.3f,%9.3f,%9.3f",v[0],v[1],v[2]));
};
vec3.print6 = function(v){
	return(sprintf("%12.6f,%12.6f,%12.6f",v[0],v[1],v[2]));
};
quat4.setIffCloser = function(amAt,q0,v1){
	var d1=( (amAt[0]-v1[0])*(amAt[0]-v1[0])
			+(amAt[1]-v1[1])*(amAt[1]-v1[1])
			+(amAt[2]-v1[2])*(amAt[2]-v1[2])
	       );
	//AL(sprintf("quat4.setIffCloser\namAt=(%s) (%s) %8.3f %8.3f",vec3.printS3(amAt),vec3.printS3(q0),d1,q0[3]));
	if(  (q0[3]>d1)
	   ||(q0[3]<0.)		
	  ){
		q0[0]=v1[0];
		q0[1]=v1[1];
		q0[2]=v1[2];
		q0[3]=d1;
		//AL("applied new v1");
	}
};

vec2.printS3 = function(v){
	return(sprintf("%7.3f,%7.3f",v[0],v[1]));
};
/**
 * prints the 4x4 matrix with sprintf(%9.3f) format
 *
 * @param {mat4} mat mat4 to pritn
 *
 * @returns {String}
 */
mat4.print3 = function(mat){
	return(sprintf(
		"  %9.3f %9.3f %9.3f %9.3f\n  %9.3f %9.3f %9.3f %9.3f\n  %9.3f %9.3f %9.3f %9.3f\n  %9.3f %9.3f %9.3f %9.3f"
		,mat[ 0],mat[ 1],mat[ 2],mat[ 3]
		,mat[ 4],mat[ 5],mat[ 6],mat[ 7]
		,mat[ 8],mat[ 9],mat[10],mat[11]
		,mat[12],mat[13],mat[14],mat[15]
		)
	);	
};
/**
 *  extracts the 6 position variables (X Y Z pitch Roll and Yaw) from
 *  the current gl context mvm and sets them into the position variables
 *  for the current gl context.
 *  Pitch, Roll and Yaw are in radians
 */
function xyzpryFigure() {
	//AL("cme@ xyzpryFigure();");
	var mv = mat4.create();
	mat4.set(gl[gl.at].mvm,mv);
	//mvmLogView(mv);
	//AL("rad2Deg="+rad2Deg);
	gl[gl.at].X=(-mv[14]*mv[ 2])+(-mv[13]*mv[1])+(-mv[12]*mv[ 0]);
	//AL(sprintf("Xfrom %9.3f %9.3f %9.3f ",(-mv[14]*mv[ 2]),(-mv[13]*mv[ 1]),(-mv[12]*mv[ 0])));
	gl[gl.at].Y=(-mv[14]*mv[ 6])+(-mv[13]*mv[5])+(-mv[12]*mv[ 4]);
	//AL(sprintf("Yfrom %9.3f %9.3f %9.3f ",(-mv[14]*mv[ 6]),(-mv[13]*mv[ 5]),(-mv[12]*mv[ 4])));
	gl[gl.at].Z=(-mv[14]*mv[10])+(-mv[13]*mv[ 9])+(-mv[12]*mv[ 8]);
	//AL(sprintf("Zfrom %9.3f %9.3f %9.3f ",(-mv[14]*mv[10]),(-mv[13]*mv[ 9]),(-mv[12]*mv[ 8])));
	if (  (Math.abs(mv[2]) > .0000001)
	    ||(Math.abs(mv[6]) > .0000001)
	   ){
		gl[gl.at].yaw=Math.atan2(-mv[6],-mv[2]);
		while(gl[gl.at].yaw < 0.){
			//AL("trip thru whileyaw "+2.*Math.PI);
			gl[gl.at].yaw=gl[gl.at].yaw+(2.*Math.PI);
			//AL("post trip thru whileyaw");
		}
		//AL(sprintf("nonZaxis yaw=%7.3f",(gl[gl.at].yaw*rad2Deg)));
	} else {
		gl[gl.at].yaw=Math.atan2(mv[5],mv[1]);
		while(gl[gl.at].yaw < 0.) gl[gl.at].yaw=gl[gl.at].yaw+(2.*Math.PI);
		//AL(sprintf("yesZaxis gl[gl.at].yaw=%7.3f",(gl[gl.at].yaw*rad2Deg)));
	} /* endif */
	while(gl[gl.at].yaw < 0.) gl[gl.at].yaw=gl[gl.at].yaw+2*Math.PI;
	gl[gl.at].pitch=Math.atan2(Math.sqrt((mv[2]*mv[2])+(mv[6]*mv[6])),mv[10])-(.5*Math.PI);
	//AL("pitch="+gl[gl.at].pitch*rad2Deg);
	mat4.translate(mv,vec3.createFrom(-mv[14]*mv[ 2],-mv[14]*mv[6],-mv[14]*mv[10])); /* translate back to zero along the Forward vector */
	//AL("translated back to zeroing along the forward direction");
	mat4.translate(mv,vec3.createFrom(-mv[13]*mv[ 1],-mv[13]*mv[5],-mv[13]*mv[ 9])); /* translate back to zero along the roof      vector */
	//AL("translated back to zero along roof");
	mat4.translate(mv,vec3.createFrom(-mv[12]*mv[ 0],-mv[12]*mv[4],-mv[12]*mv[ 8])); /* translate back to zero along the Left    vector */
	//AL("translated back to zero along the left");
	//AL("translated back to zero along the 3 axies");
	//mvmLogView(mv);
	mat4.rotateZ(mv,gl[gl.at].yaw);/* rotate around the Z axis */
	//AL(sprintf("rotated yaw=%9.3f around the Z axies to have rooffowward plane == XZ plane \n", gl[gl.at].yaw*rad2Deg));
	//mvmLogView(mv);
	mat4.rotateY(mv,-1*gl[gl.at].pitch);/* rotate around the Forward vector */
	//AL("back from pitch");
	//AL(sprintf("rotated pitch=%9.3f around the Y axies",gl[gl.at].pitch*rad2Deg));
	//mvmLogView(mv);
	gl[gl.at].roll=Math.atan2(mv[9],mv[5])-(.5*Math.PI);
	//AL("back from roll "+roll*rad2Deg);
	while(gl[gl.at].roll < -1*Math.PI){ 
		gl[gl.at].roll+=(2*Math.PI);
		//AL("in reroll 0 to 360 "+roll*rad2Deg);
	}
	//AL(sprintf("gl[%d] xyz(%9.3f %9.3f %9.3f) pry(%7.3f %7.3f %7.3f)",gl[gl.at],gl[gl.at].X,gl[gl.at].Y,gl[gl.at].Z,gl[gl.at].pitch*rad2Deg,gl[gl.at].roll*rad2Deg,gl[gl.at].yaw*rad2Deg));
	//AL("at endof XYZPRYfigure()");
 };
 /* convert hex to RGB 
  *  based on http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
  */
 function hexToRgb(hex) {
 	//AL("hexToRgb(hex="+hex+")");
 	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
 	return vec3.createFrom( parseInt(result[1], 16)/255.
 						   ,parseInt(result[2], 16)/255.
 						   ,parseInt(result[3], 16)/255.
 						  );
 }
 /*
  *  Paririty check on which way is up.
  *  Documents conformality of the mvm manipulations to the mat4.rotate
  *  functions provided in gl-matrix.js
  *  */ 
function documentMvmXyzpry(){
	mat4.identity(gl[gl.at].mvm);
	AL("This is the identity modelViewMatrix\nleft is -X, roof is +Y, forward is -Z");
	//xyzpryLogView(gl[gl.at].mvm);
	//mvmLogView(gl[gl.at].mvm);
	//mvmLogPure(gl[gl.at].mvm);
	AL("\n");
	
	AL("left is +Y, roof is Up, Forward is +X");
	mat4.identity(gl[gl.at].mvm);
	mat4.rotateZ(gl[gl.at].mvm,90*deg2Rad);
	mat4.rotateY(gl[gl.at].mvm,90*deg2Rad);
	//mat4.translate(gl[gl.at].mvm,[7.,0.,0.]);
	//xyzpryLogView(gl[gl.at].mvm);
	//mvmLogView(gl[gl.at].mvm);
	//mvmLogPure(gl[gl.at].mvm);
	AL("");
	
	AL("left is -X, roof is Up, Forward is +Y");
	mat4.identity(gl[gl.at].mvm);
	mat4.rotateX(gl[gl.at].mvm,-90*deg2Rad);
	mat4.translate(gl[gl.at].mvm,[7.,0.,0.]);
	//xyzpryLogView(gl[gl.at].mvm);
	//mvmLogView(gl[gl.at].mvm);	
	//mvmLogPure(gl[gl.at].mvm);
	AL("");
	
	AL("left is -X, roof is -Y, Forward is +Z");
	mat4.identity(gl[gl.at].mvm);
	mat4.rotateX(gl[gl.at].mvm,-179.9995*deg2Rad);
	mat4.translate(gl[gl.at].mvm,[7.,0.,0.]);
	//xyzpryLogView(gl[gl.at].mvm);
	//mvmLogView(gl[gl.at].mvm);
	//mvmLogPure(gl[gl.at].mvm);
	AL("\n");
	
	AL("left is +Y, roof is Up, Forward is +X");
	mat4.identity(gl[gl.at].mvm);
	mat4.rotateZ(gl[gl.at].mvm,90*deg2Rad);
	mat4.rotateY(gl[gl.at].mvm,90*deg2Rad);
	mat4.translate(gl[gl.at].mvm,[0.,6.,0.]);
	//xyzpryLogView(gl[gl.at].mvm);
	//mvmLogView(gl[gl.at].mvm);
	//mvmLogPure(gl[gl.at].mvm);
	AL("");
	
	AL("left is -X, roof is Up, Forward is +Y");	
	mat4.identity(gl[gl.at].mvm);
	mat4.rotateX(gl[gl.at].mvm,-90*deg2Rad);
	mat4.translate(gl[gl.at].mvm,[0.,6.,0.]);
	//xyzpryLogView(gl[gl.at].mvm);
	//mvmLogView(gl[gl.at].mvm);	
	//mvmLogPure(gl[gl.at].mvm);
	AL("");
	
	AL("left is -X, roof is -Y, Forward is +Z");	
	mat4.identity(gl[gl.at].mvm);
	mat4.rotateX(gl[gl.at].mvm,-179.9995*deg2Rad);
	mat4.translate(gl[gl.at].mvm,[0.,6.,0.]);
	//xyzpryLogView(gl[gl.at].mvm);
	//mvmLogView(gl[gl.at].mvm);
	//mvmLogPure(gl[gl.at].mvm);
	AL("\n");
	
	AL("left is +Y, roof is Up, Forward is +X");
	mat4.identity(gl[gl.at].mvm);
	mat4.rotateZ(gl[gl.at].mvm,90*deg2Rad);
	mat4.rotateY(gl[gl.at].mvm,90*deg2Rad);
	//mat4.translate(gl[gl.at].mvm,[0.,0.,5.]);
	//xyzpryLogView(gl[gl.at].mvm);
	//mvmLogView(gl[gl.at].mvm);
	//mvmLogPure(gl[gl.at].mvm);
	AL("");
	
	AL("left is -X, roof is Up, Forward is +Y");
	mat4.identity(gl[gl.at].mvm);
	mat4.rotateX(gl[gl.at].mvm,-90*deg2Rad);
	mat4.translate(gl[gl.at].mvm,[0.,0.,5.]);
	//xyzpryLogView(gl[gl.at].mvm);
	//mvmLogView(gl[gl.at].mvm);	
	//mvmLogPure(gl[gl.at].mvm);
	AL("");
	
	AL("left is -X, roof is -Y, Forward is +Z");
	mat4.identity(gl[gl.at].mvm);
	mat4.rotateX(gl[gl.at].mvm,-179.9995*deg2Rad);
	mat4.translate(gl[gl.at].mvm,[0.,0.,5.]);
	//xyzpryLogView(gl[gl.at].mvm);
	//mvmLogView(gl[gl.at].mvm);
	//mvmLogPure(gl[gl.at].mvm);
	AL("\n");
} 


/*
 *  Sets the 6 input position variables (X Y Z Pitch Roll and Yaw) to the
 *  current gl context position variables, and to the current gl context  
 *  modelView-Matrix.
 *  Pitch Roll and Yaw are in radians.
 *  */
function xyzprySet(Xin,Yin,Zin,pitchin,rollin,yawin) {
	gl[gl.at].X      = Xin    ;
	gl[gl.at].Y      = Yin    ;
	gl[gl.at].Z      = Zin    ;
	gl[gl.at].pitch  = pitchin;         /* these are in radians */
	gl[gl.at].roll   = rollin ;         /* these are in radians */
	gl[gl.at].yaw    = yawin  ;         /* these are in radians */
	mvmSet();
}
/*
 *  Sets the 6 input position variables (X Y Z Pitch Roll and Yaw) to the
 *  current gl context position variables, and to the current gl context  
 *  modelView-Matrix.
 *  Pitch Roll and Yaw are in degrees.
 *  */
function xyzprySetInDegrees(Xin,Yin,Zin,pitchin,rollin,yawin) {
	gl[gl.at].X      = Xin    ;
	gl[gl.at].Y      = Yin    ;
	gl[gl.at].Z      = Zin    ;
	gl[gl.at].pitch  = pitchin*deg2Rad;         /* these are in radians */
	gl[gl.at].roll   = rollin *deg2Rad;         /* these are in radians */
	gl[gl.at].yaw    = yawin  *deg2Rad;         /* these are in radians */
	mvmSet();
}
/*
 *  Sets the 6 currently in place position variables (X Y Z Pitch Roll and Yaw) 
 *  as the home location.
 *  */
function xyzprySet2Home() {
	gl[gl.at].homeX      = gl[gl.at].X    ;
	gl[gl.at].homeY      = gl[gl.at].Y    ;
	gl[gl.at].homeZ      = gl[gl.at].Z    ;
	gl[gl.at].homePitch  = gl[gl.at].pitch;
	gl[gl.at].homeRoll   = gl[gl.at].roll ;
	gl[gl.at].homeYaw    = gl[gl.at].yaw  ;
	//AL("setting home as");
	//xyzpryLogView();
}
/*
 *  Sets the 6 currently in place position variables (X Y Z Pitch Roll and Yaw) 
 *  as the home0 location.
 *  */
function xyzprySet2Home0() {
	gl[gl.at].homeX0      = gl[gl.at].X    ;
	gl[gl.at].homeY0      = gl[gl.at].Y    ;
	gl[gl.at].homeZ0      = gl[gl.at].Z    ;
	gl[gl.at].homePitch0  = gl[gl.at].pitch;
	gl[gl.at].homeRoll0   = gl[gl.at].roll ;
	gl[gl.at].homeYaw0    = gl[gl.at].yaw  ;
	//AL("setting home0 as");
	//xyzpryLogView();
}
/*
 *  Sets the gl.at context to the current home location.
 *  */
function goHome() {
	gl[gl.at].X     = gl[gl.at].homeX    ;
	gl[gl.at].Y     = gl[gl.at].homeY    ;
	gl[gl.at].Z     = gl[gl.at].homeZ    ;
	gl[gl.at].pitch = gl[gl.at].homePitch;
	gl[gl.at].roll  = gl[gl.at].homeRoll ;
	gl[gl.at].yaw   = gl[gl.at].homeYaw  ;
	mvmSet();
}
/*
 *  Sets the gl.at context to the home0 location.
 *  */
function goHome0() {
	gl[gl.at].X     = gl[gl.at].homeX0    ;
	gl[gl.at].Y     = gl[gl.at].homeY0    ;
	gl[gl.at].Z     = gl[gl.at].homeZ0    ;
	gl[gl.at].pitch = gl[gl.at].homePitch0;
	gl[gl.at].roll  = gl[gl.at].homeRoll0 ;
	gl[gl.at].yaw   = gl[gl.at].homeYaw0  ;
	mvmSet();
}
/*
 *  Puts the 6 gl position variables for the current gl context
 *  into the ModelViewMatrix.
 *  Pitch Roll and Yaw are in radians.
 *  */
function mvmSet() {
	//AL("cme@ mvmSet()");
	mat4.identity(gl[gl.at].mvm);
	//AL("identity");
	//mvmLogView(gl[gl.at].mvm);
	mat4.rotateZ(gl[gl.at].mvm,gl[gl.at].roll);
	//AL("rolled if you want to");
	//mvmLogView(gl[gl.at].mvm);
	mat4.rotateX(gl[gl.at].mvm,-1*((Math.PI/2)+gl[gl.at].pitch));
	//AL("pitched");
	//mvmLogView(gl[gl.at].mvm);
	mat4.rotateZ(gl[gl.at].mvm,-1*(gl[gl.at].yaw-(Math.PI/2)));
	//AL("yawed");
	//mvmLogView(gl[gl.at].mvm);
	mat4.translate(gl[gl.at].mvm,[-gl[gl.at].X,-gl[gl.at].Y,-gl[gl.at].Z]);
	//xyzpryLogView(gl[gl.at].mvm);
}

///*************************************************************************************/
///**
// * @class 3 Dimensional Plane
// * @name plane
// */
//var plane = {};
//
///**
// * Creates a new instance of a plane using the default array type
// * Any javascript array-like objects containing at least 3 numeric elements can serve as a vec3
// *
// * @param {vec3} [vec] vec3 containing values to initialize the normal with
// * @param {mag} single value to initialize the distance with
// *
// * @returns {vec3} New vec3
// */
//plane.create = function (vec, mag) {
//	
//    this.norm = new MatrixArray(3);
//    this.cnst = mag;
//
//    if (vec && mag) {
//        this.norm[0] = vec[0];
//        this.norm[1] = vec[1];
//        this.norm[2] = vec[2];
//        this.cnst[0]=mag;
//        AL("initialzing from inputs");
//    } else {
//        this.norm[0] = this.norm[1] = this.norm[2] = this.cnst =0;
//    }
//
//    return this;
//};
//
///**
// * Creates a new instance of a vec3, initializing it with the given arguments
// *
// * @param {number} x X value for normal
// * @param {number} y Y value for normal
// * @param {number} z Z value for normal
// * @param {number} m cnst value for magnitude of offset along normal
//
// * @returns {plane} New plane
// */
//plane.createFrom = function (x, y, z,m) {
//    this.norm = new MatrixArray(3);
//    this.cnst=m;
//
//    this.norm[0] = x;
//    this.norm[1] = y;
//    this.norm[2] = z;
//
//    return this;
//};
var FLOAT_EPSILON = 0.000001;



/*********************************************************************************************/

function setGLConstants(){
	//AL("cme@ setGLConstants();");
	gl.mvm0 = mat4.create(); /* for temporary storage of mvm when doing moves */
	gl.mvm1 = mat4.create(); /* for temporary storage of mvm when doing moves */	
	gl.counter =0; /* general purpose utility counter, initially added so jsonReviverVarList would have a counter */
	gl.sayVarList=false;
	
    gl.DEPTH_BUFFER_BIT               =gl[0].DEPTH_BUFFER_BIT              ;
    gl.STENCIL_BUFFER_BIT             =gl[0].STENCIL_BUFFER_BIT            ;
    gl.COLOR_BUFFER_BIT               =gl[0].COLOR_BUFFER_BIT              ;

    gl.POINTS                         =gl[0].POINTS                        ;
    gl.LINES                          =gl[0].LINES                         ;
    gl.LINE_LOOP                      =gl[0].LINE_LOOP                     ;
    gl.LINE_STRIP                     =gl[0].LINE_STRIP                    ;
    gl.TRIANGLES                      =gl[0].TRIANGLES                     ;
    gl.TRIANGLE_STRIP                 =gl[0].TRIANGLE_STRIP                ;
    gl.TRIANGLE_FAN                   =gl[0].TRIANGLE_FAN                  ;
    gl.ZERO                           =gl[0].ZERO                          ;
    gl.ONE                            =gl[0].ONE                           ;
    gl.SRC_COLOR                      =gl[0].SRC_COLOR                     ;
    gl.ONE_MINUS_SRC_COLOR            =gl[0].ONE_MINUS_SRC_COLOR           ;
    gl.SRC_ALPHA                      =gl[0].SRC_ALPHA                     ;
    gl.ONE_MINUS_SRC_ALPHA            =gl[0].ONE_MINUS_SRC_ALPHA           ;
    gl.DST_ALPHA                      =gl[0].DST_ALPHA                     ;
    gl.ONE_MINUS_DST_ALPHA            =gl[0].ONE_MINUS_DST_ALPHA           ;

    gl.DST_COLOR                      =gl[0].DST_COLOR                     ;
    gl.ONE_MINUS_DST_COLOR            =gl[0].ONE_MINUS_DST_COLOR           ;
    gl.SRC_ALPHA_SATURATE             =gl[0].SRC_ALPHA_SATURATE            ;

    gl.FUNC_ADD                       =gl[0].FUNC_ADD                      ;
    gl.BLEND_EQUATION                 =gl[0].BLEND_EQUATION                ;
    gl.BLEND_EQUATION_RGB             =gl[0].BLEND_EQUATION_RGB            ;
    gl.BLEND_EQUATION_ALPHA           =gl[0].BLEND_EQUATION_ALPHA          ;

    gl.FUNC_SUBTRACT                  =gl[0].FUNC_SUBTRACT                 ;
    gl.FUNC_REVERSE_SUBTRACT          =gl[0].FUNC_REVERSE_SUBTRACT         ;

    gl.BLEND_DST_RGB                  =gl[0].BLEND_DST_RGB                 ;
    gl.BLEND_SRC_RGB                  =gl[0].BLEND_SRC_RGB                 ;
    gl.BLEND_DST_ALPHA                =gl[0].BLEND_DST_ALPHA               ;
    gl.BLEND_SRC_ALPHA                =gl[0].BLEND_SRC_ALPHA               ;
    gl.CONSTANT_COLOR                 =gl[0].CONSTANT_COLOR                ;
    gl.ONE_MINUS_CONSTANT_COLOR       =gl[0].ONE_MINUS_CONSTANT_COLOR      ;
    gl.CONSTANT_ALPHA                 =gl[0].CONSTANT_ALPHA                ;
    gl.ONE_MINUS_CONSTANT_ALPHA       =gl[0].ONE_MINUS_CONSTANT_ALPHA      ;
    gl.BLEND_COLOR                    =gl[0].BLEND_COLOR                   ;

    gl.ARRAY_BUFFER                   =gl[0].ARRAY_BUFFER                  ;
    gl.ELEMENT_ARRAY_BUFFER           =gl[0].ELEMENT_ARRAY_BUFFER          ;
    gl.ARRAY_BUFFER_BINDING           =gl[0].ARRAY_BUFFER_BINDING          ;
    gl.ELEMENT_ARRAY_BUFFER_BINDING   =gl[0].ELEMENT_ARRAY_BUFFER_BINDING  ;

    gl.STREAM_DRAW                    =gl[0].STREAM_DRAW                   ;
    gl.STATIC_DRAW                    =gl[0].STATIC_DRAW                   ;
    gl.DYNAMIC_DRAW                   =gl[0].DYNAMIC_DRAW                  ;

    gl.BUFFER_SIZE                    =gl[0].BUFFER_SIZE                   ;
    gl.BUFFER_USAGE                   =gl[0].BUFFER_USAGE                  ;

    gl.CURRENT_VERTEX_ATTRIB          =gl[0].CURRENT_VERTEX_ATTRIB         ;

    gl.FRONT                          =gl[0].FRONT                         ;
    gl.BACK                           =gl[0].BACK                          ;
    gl.FRONT_AND_BACK                 =gl[0].FRONT_AND_BACK                ;

    gl.CULL_FACE                      =gl[0].CULL_FACE                     ;
    gl.BLEND                          =gl[0].BLEND                         ;
    gl.DITHER                         =gl[0].DITHER                        ;
    gl.STENCIL_TEST                   =gl[0].STENCIL_TEST                  ;
    gl.DEPTH_TEST                     =gl[0].DEPTH_TEST                    ;
    gl.SCISSOR_TEST                   =gl[0].SCISSOR_TEST                  ;
    gl.POLYGON_OFFSET_FILL            =gl[0].POLYGON_OFFSET_FILL           ;
    gl.SAMPLE_ALPHA_TO_COVERAGE       =gl[0].SAMPLE_ALPHA_TO_COVERAGE      ;
    gl.SAMPLE_COVERAGE                =gl[0].SAMPLE_COVERAGE               ;

    gl.NO_ERROR                       =gl[0].NO_ERROR                      ;
    gl.INVALID_ENUM                   =gl[0].INVALID_ENUM                  ;
    gl.INVALID_VALUE                  =gl[0].INVALID_VALUE                 ;
    gl.INVALID_OPERATION              =gl[0].INVALID_OPERATION             ;
    gl.OUT_OF_MEMORY                  =gl[0].OUT_OF_MEMORY                 ;

    gl.CW                             =gl[0].CW                            ;
    gl.CCW                            =gl[0].CCW                           ;
    //AL("gl[0].CCW="+gl[0].CCW);

    gl.LINE_WIDTH                     =gl[0].LINE_WIDTH                    ;
    gl.ALIASED_POINT_SIZE_RANGE       =gl[0].ALIASED_POINT_SIZE_RANGE      ;
    gl.ALIASED_LINE_WIDTH_RANGE       =gl[0].ALIASED_LINE_WIDTH_RANGE      ;
    gl.CULL_FACE_MODE                 =gl[0].CULL_FACE_MODE                ;
    gl.FRONT_FACE                     =gl[0].FRONT_FACE                    ;
    gl.DEPTH_RANGE                    =gl[0].DEPTH_RANGE                   ;
    gl.DEPTH_WRITEMASK                =gl[0].DEPTH_WRITEMASK               ;
    gl.DEPTH_CLEAR_VALUE              =gl[0].DEPTH_CLEAR_VALUE             ;
    gl.DEPTH_FUNC                     =gl[0].DEPTH_FUNC                    ;
    gl.STENCIL_CLEAR_VALUE            =gl[0].STENCIL_CLEAR_VALUE           ;
    gl.STENCIL_FUNC                   =gl[0].STENCIL_FUNC                  ;
    gl.STENCIL_FAIL                   =gl[0].STENCIL_FAIL                  ;
    gl.STENCIL_PASS_DEPTH_FAIL        =gl[0].STENCIL_PASS_DEPTH_FAIL       ;
    gl.STENCIL_PASS_DEPTH_PASS        =gl[0].STENCIL_PASS_DEPTH_PASS       ;
    gl.STENCIL_REF                    =gl[0].STENCIL_REF                   ;
    gl.STENCIL_VALUE_MASK             =gl[0].STENCIL_VALUE_MASK            ;
    gl.STENCIL_WRITEMASK              =gl[0].STENCIL_WRITEMASK             ;
    gl.STENCIL_BACK_FUNC              =gl[0].STENCIL_BACK_FUNC             ;
    gl.STENCIL_BACK_FAIL              =gl[0].STENCIL_BACK_FAIL             ;
    gl.STENCIL_BACK_PASS_DEPTH_FAIL   =gl[0].STENCIL_BACK_PASS_DEPTH_FAIL  ;
    gl.STENCIL_BACK_PASS_DEPTH_PASS   =gl[0].STENCIL_BACK_PASS_DEPTH_PASS  ;
    gl.STENCIL_BACK_REF               =gl[0].STENCIL_BACK_REF              ;
    gl.STENCIL_BACK_VALUE_MASK        =gl[0].STENCIL_BACK_VALUE_MASK       ;
    gl.STENCIL_BACK_WRITEMASK         =gl[0].STENCIL_BACK_WRITEMASK        ;
    gl.VIEWPORT                       =gl[0].VIEWPORT                      ;
    gl.SCISSOR_BOX                    =gl[0].SCISSOR_BOX                   ;

    gl.COLOR_CLEAR_VALUE              =gl[0].COLOR_CLEAR_VALUE             ;
    gl.COLOR_WRITEMASK                =gl[0].COLOR_WRITEMASK               ;
    gl.UNPACK_ALIGNMENT               =gl[0].UNPACK_ALIGNMENT              ;
    gl.PACK_ALIGNMENT                 =gl[0].PACK_ALIGNMENT                ;
    gl.MAX_TEXTURE_SIZE               =gl[0].MAX_TEXTURE_SIZE              ;
    gl.MAX_VIEWPORT_DIMS              =gl[0].MAX_VIEWPORT_DIMS             ;
    gl.SUBPIXEL_BITS                  =gl[0].SUBPIXEL_BITS                 ;
    gl.RED_BITS                       =gl[0].RED_BITS                      ;
    gl.GREEN_BITS                     =gl[0].GREEN_BITS                    ;
    gl.BLUE_BITS                      =gl[0].BLUE_BITS                     ;
    gl.ALPHA_BITS                     =gl[0].ALPHA_BITS                    ;
    gl.DEPTH_BITS                     =gl[0].DEPTH_BITS                    ;
    gl.STENCIL_BITS                   =gl[0].STENCIL_BITS                  ;
    gl.POLYGON_OFFSET_UNITS           =gl[0].POLYGON_OFFSET_UNITS          ;

    gl.POLYGON_OFFSET_FACTOR          =gl[0].POLYGON_OFFSET_FACTOR         ;
    gl.TEXTURE_BINDING_2D             =gl[0].TEXTURE_BINDING_2D            ;
    gl.SAMPLE_BUFFERS                 =gl[0].SAMPLE_BUFFERS                ;
    gl.SAMPLES                        =gl[0].SAMPLES                       ;
    gl.SAMPLE_COVERAGE_VALUE          =gl[0].SAMPLE_COVERAGE_VALUE         ;
    gl.SAMPLE_COVERAGE_INVERT         =gl[0].SAMPLE_COVERAGE_INVERT        ;

    gl.NUM_COMPRESSED_TEXTURE_FORMATS =gl[0].NUM_COMPRESSED_TEXTURE_FORMATS;
    gl.COMPRESSED_TEXTURE_FORMATS     =gl[0].COMPRESSED_TEXTURE_FORMATS    ;

    gl.DONT_CARE                      =gl[0].DONT_CARE                     ;
    gl.FASTEST                        =gl[0].FASTEST                       ;
    gl.NICEST                         =gl[0].NICEST                        ;

    gl.GENERATE_MIPMAP_HINT           =gl[0].GENERATE_MIPMAP_HINT          ;

    gl.BYTE                           =gl[0].BYTE                          ;
    gl.UNSIGNED_BYTE                  =gl[0].UNSIGNED_BYTE                 ;
    gl.SHORT                          =gl[0].SHORT                         ;
    gl.UNSIGNED_SHORT                 =gl[0].UNSIGNED_SHORT                ;
    gl.INT                            =gl[0].INT                           ;
    gl.UNSIGNED_INT                   =gl[0].UNSIGNED_INT                  ;
    gl.FLOAT                          =gl[0].FLOAT                         ;

    gl.DEPTH_COMPONENT                =gl[0].DEPTH_COMPONENT               ;
    gl.ALPHA                          =gl[0].ALPHA                         ;
    gl.RGB                            =gl[0].RGB                           ;
    gl.RGBA                           =gl[0].RGBA                          ;
    gl.LUMINANCE                      =gl[0].LUMINANCE                     ;
    gl.LUMINANCE_ALPHA                =gl[0].LUMINANCE_ALPHA               ;

    gl.UNSIGNED_SHORT_4_4_4_4         =gl[0].UNSIGNED_SHORT_4_4_4_4        ;
    gl.UNSIGNED_SHORT_5_5_5_1         =gl[0].UNSIGNED_SHORT_5_5_5_1        ;
    gl.UNSIGNED_SHORT_5_6_5           =gl[0].UNSIGNED_SHORT_5_6_5          ;
    //AL("gl[0].UNSIGNED_SHORT_5_6_5="+gl[0].UNSIGNED_SHORT_5_6_5);
    
    gl.FRAGMENT_SHADER                  =gl[0].FRAGMENT_SHADER                 ;
    gl.VERTEX_SHADER                    =gl[0].VERTEX_SHADER                   ;
    gl.MAX_VERTEX_ATTRIBS               =gl[0].MAX_VERTEX_ATTRIBS              ;
    gl.MAX_VERTEX_UNIFORM_VECTORS       =gl[0].MAX_VERTEX_UNIFORM_VECTORS      ;
    gl.MAX_VARYING_VECTORS              =gl[0].MAX_VARYING_VECTORS             ;
    gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS =gl[0].MAX_COMBINED_TEXTURE_IMAGE_UNITS;
    gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS   =gl[0].MAX_VERTEX_TEXTURE_IMAGE_UNITS  ;
    gl.MAX_TEXTURE_IMAGE_UNITS          =gl[0].MAX_TEXTURE_IMAGE_UNITS         ;
    gl.MAX_FRAGMENT_UNIFORM_VECTORS     =gl[0].MAX_FRAGMENT_UNIFORM_VECTORS    ;
    gl.SHADER_TYPE                      =gl[0].SHADER_TYPE                     ;
    gl.DELETE_STATUS                    =gl[0].DELETE_STATUS                   ;
    gl.LINK_STATUS                      =gl[0].LINK_STATUS                     ;
    gl.VALIDATE_STATUS                  =gl[0].VALIDATE_STATUS                 ;
    gl.ATTACHED_SHADERS                 =gl[0].ATTACHED_SHADERS                ;
    gl.ACTIVE_UNIFORMS                  =gl[0].ACTIVE_UNIFORMS                 ;
    gl.ACTIVE_ATTRIBUTES                =gl[0].ACTIVE_ATTRIBUTES               ;
    gl.SHADING_LANGUAGE_VERSION         =gl[0].SHADING_LANGUAGE_VERSION        ;
    gl.CURRENT_PROGRAM                  =gl[0].CURRENT_PROGRAM                 ;

    gl.NEVER                          =gl[0].NEVER                          ;
    gl.LESS                           =gl[0].LESS                           ;
    gl.EQUAL                          =gl[0].EQUAL                          ;
    gl.LEQUAL                         =gl[0].LEQUAL                         ;
    gl.GREATER                        =gl[0].GREATER                        ;
    gl.NOTEQUAL                       =gl[0].NOTEQUAL                       ;
    gl.GEQUAL                         =gl[0].GEQUAL                         ;
    gl.ALWAYS                         =gl[0].ALWAYS                         ;

    gl.KEEP                           =gl[0].KEEP                           ;
    gl.REPLACE                        =gl[0].REPLACE                        ;
    gl.INCR                           =gl[0].INCR                           ;
    gl.DECR                           =gl[0].DECR                           ;
    gl.INVERT                         =gl[0].INVERT                         ;
    gl.INCR_WRAP                      =gl[0].INCR_WRAP                      ;
    gl.DECR_WRAP                      =gl[0].DECR_WRAP                      ;

    gl.VENDOR                         =gl[0].VENDOR                         ;
    gl.RENDERER                       =gl[0].RENDERER                       ;
    gl.VERSION                        =gl[0].VERSION                        ;

    gl.NEAREST                        =gl[0].NEAREST                        ;
    gl.LINEAR                         =gl[0].LINEAR                         ;

    gl.NEAREST_MIPMAP_NEAREST         =gl[0].NEAREST_MIPMAP_NEAREST         ;
    gl.LINEAR_MIPMAP_NEAREST          =gl[0].LINEAR_MIPMAP_NEAREST          ;
    gl.NEAREST_MIPMAP_LINEAR          =gl[0].NEAREST_MIPMAP_LINEAR          ;
    gl.LINEAR_MIPMAP_LINEAR           =gl[0].LINEAR_MIPMAP_LINEAR           ;

    gl.TEXTURE_MAG_FILTER             =gl[0].TEXTURE_MAG_FILTER             ;
    gl.TEXTURE_MIN_FILTER             =gl[0].TEXTURE_MIN_FILTER             ;
    gl.TEXTURE_WRAP_S                 =gl[0].TEXTURE_WRAP_S                 ;
    gl.TEXTURE_WRAP_T                 =gl[0].TEXTURE_WRAP_T                 ;

    gl.TEXTURE_2D                     =gl[0].TEXTURE_2D                     ;
    gl.TEXTURE                        =gl[0].TEXTURE                        ;

    gl.TEXTURE_CUBE_MAP               =gl[0].TEXTURE_CUBE_MAP               ;
    gl.TEXTURE_BINDING_CUBE_MAP       =gl[0].TEXTURE_BINDING_CUBE_MAP       ;
    gl.TEXTURE_CUBE_MAP_POSITIVE_X    =gl[0].TEXTURE_CUBE_MAP_POSITIVE_X    ;
    gl.TEXTURE_CUBE_MAP_NEGATIVE_X    =gl[0].TEXTURE_CUBE_MAP_NEGATIVE_X    ;
    gl.TEXTURE_CUBE_MAP_POSITIVE_Y    =gl[0].TEXTURE_CUBE_MAP_POSITIVE_Y    ;
    gl.TEXTURE_CUBE_MAP_NEGATIVE_Y    =gl[0].TEXTURE_CUBE_MAP_NEGATIVE_Y    ;
    gl.TEXTURE_CUBE_MAP_POSITIVE_Z    =gl[0].TEXTURE_CUBE_MAP_POSITIVE_Z    ;
    gl.TEXTURE_CUBE_MAP_NEGATIVE_Z    =gl[0].TEXTURE_CUBE_MAP_NEGATIVE_Z    ;
    gl.MAX_CUBE_MAP_TEXTURE_SIZE      =gl[0].MAX_CUBE_MAP_TEXTURE_SIZE      ;

    gl.TEXTURE0                       =gl[0].TEXTURE0                       ;
    gl.TEXTURE1                       =gl[0].TEXTURE1                       ;
    gl.TEXTURE2                       =gl[0].TEXTURE2                       ;
    gl.TEXTURE3                       =gl[0].TEXTURE3                       ;
    gl.TEXTURE4                       =gl[0].TEXTURE4                       ;
    gl.TEXTURE5                       =gl[0].TEXTURE5                       ;
    gl.TEXTURE6                       =gl[0].TEXTURE6                       ;
    gl.TEXTURE7                       =gl[0].TEXTURE7                       ;
    gl.TEXTURE8                       =gl[0].TEXTURE8                       ;
    gl.TEXTURE9                       =gl[0].TEXTURE9                       ;
    gl.TEXTURE10                      =gl[0].TEXTURE10                      ;
    gl.TEXTURE11                      =gl[0].TEXTURE11                      ;
    gl.TEXTURE12                      =gl[0].TEXTURE12                      ;
    gl.TEXTURE13                      =gl[0].TEXTURE13                      ;
    gl.TEXTURE14                      =gl[0].TEXTURE14                      ;
    gl.TEXTURE15                      =gl[0].TEXTURE15                      ;
    gl.TEXTURE16                      =gl[0].TEXTURE16                      ;
    gl.TEXTURE17                      =gl[0].TEXTURE17                      ;
    gl.TEXTURE18                      =gl[0].TEXTURE18                      ;
    gl.TEXTURE19                      =gl[0].TEXTURE19                      ;
    gl.TEXTURE20                      =gl[0].TEXTURE20                      ;
    gl.TEXTURE21                      =gl[0].TEXTURE21                      ;
    gl.TEXTURE22                      =gl[0].TEXTURE22                      ;
    gl.TEXTURE23                      =gl[0].TEXTURE23                      ;
    gl.TEXTURE24                      =gl[0].TEXTURE24                      ;
    gl.TEXTURE25                      =gl[0].TEXTURE25                      ;
    gl.TEXTURE26                      =gl[0].TEXTURE26                      ;
    gl.TEXTURE27                      =gl[0].TEXTURE27                      ;
    gl.TEXTURE28                      =gl[0].TEXTURE28                      ;
    gl.TEXTURE29                      =gl[0].TEXTURE29                      ;
    gl.TEXTURE30                      =gl[0].TEXTURE30                      ;
    gl.TEXTURE31                      =gl[0].TEXTURE31                      ;
    gl.ACTIVE_TEXTURE                 =gl[0].ACTIVE_TEXTURE                 ;

    gl.REPEAT                         =gl[0].REPEAT                         ;
    gl.CLAMP_TO_EDGE                  =gl[0].CLAMP_TO_EDGE                  ;
    gl.MIRRORED_REPEAT                =gl[0].MIRRORED_REPEAT                ;

    gl.FLOAT_VEC2                     =gl[0].FLOAT_VEC2                     ;
    gl.FLOAT_VEC3                     =gl[0].FLOAT_VEC3                     ;
    gl.FLOAT_VEC4                     =gl[0].FLOAT_VEC4                     ;
    gl.INT_VEC2                       =gl[0].INT_VEC2                       ;
    gl.INT_VEC3                       =gl[0].INT_VEC3                       ;
    gl.INT_VEC4                       =gl[0].INT_VEC4                       ;
    gl.BOOL                           =gl[0].BOOL                           ;
    gl.BOOL_VEC2                      =gl[0].BOOL_VEC2                      ;
    gl.BOOL_VEC3                      =gl[0].BOOL_VEC3                      ;
    gl.BOOL_VEC4                      =gl[0].BOOL_VEC4                      ;
    gl.FLOAT_MAT2                     =gl[0].FLOAT_MAT2                     ;
    gl.FLOAT_MAT3                     =gl[0].FLOAT_MAT3                     ;
    gl.FLOAT_MAT4                     =gl[0].FLOAT_MAT4                     ;
    gl.SAMPLER_2D                     =gl[0].SAMPLER_2D                     ;
    gl.SAMPLER_CUBE                   =gl[0].SAMPLER_CUBE                   ;

    gl.VERTEX_ATTRIB_ARRAY_ENABLED        =gl[0].VERTEX_ATTRIB_ARRAY_ENABLED       ;
    gl.VERTEX_ATTRIB_ARRAY_SIZE           =gl[0].VERTEX_ATTRIB_ARRAY_SIZE          ;
    gl.VERTEX_ATTRIB_ARRAY_STRIDE         =gl[0].VERTEX_ATTRIB_ARRAY_STRIDE        ;
    gl.VERTEX_ATTRIB_ARRAY_TYPE           =gl[0].VERTEX_ATTRIB_ARRAY_TYPE          ;
    gl.VERTEX_ATTRIB_ARRAY_NORMALIZED     =gl[0].VERTEX_ATTRIB_ARRAY_NORMALIZED    ;
    gl.VERTEX_ATTRIB_ARRAY_POINTER        =gl[0].VERTEX_ATTRIB_ARRAY_POINTER       ;
    gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING =gl[0].VERTEX_ATTRIB_ARRAY_BUFFER_BINDING;

    gl.COMPILE_STATUS                 =gl[0].COMPILE_STATUS               ;
    //AL("gl[0].COMPILE_STATUS="+gl[0].COMPILE_STATUS);

    gl.LOW_FLOAT                      =gl[0].LOW_FLOAT                    ;
    gl.MEDIUM_FLOAT                   =gl[0].MEDIUM_FLOAT                 ;
    gl.HIGH_FLOAT                     =gl[0].HIGH_FLOAT                   ;
    gl.LOW_INT                        =gl[0].LOW_INT                      ;
    gl.MEDIUM_INT                     =gl[0].MEDIUM_INT                   ;
    gl.HIGH_INT                       =gl[0].HIGH_INT                     ;

    gl.FRAMEBUFFER                    =gl[0].FRAMEBUFFER                  ;
    gl.RENDERBUFFER                   =gl[0].RENDERBUFFER                 ;

    gl.RGBA4                          =gl[0].RGBA4                        ;
    gl.RGB5_A1                        =gl[0].RGB5_A1                      ;
    gl.RGB565                         =gl[0].RGB565                       ;
    gl.DEPTH_COMPONENT16              =gl[0].DEPTH_COMPONENT16            ;
    gl.STENCIL_INDEX                  =gl[0].STENCIL_INDEX                ;
    gl.STENCIL_INDEX8                 =gl[0].STENCIL_INDEX8               ;
    gl.DEPTH_STENCIL                  =gl[0].DEPTH_STENCIL                ;

    gl.RENDERBUFFER_WIDTH             =gl[0].RENDERBUFFER_WIDTH           ;
    gl.RENDERBUFFER_HEIGHT            =gl[0].RENDERBUFFER_HEIGHT          ;
    gl.RENDERBUFFER_INTERNAL_FORMAT   =gl[0].RENDERBUFFER_INTERNAL_FORMAT ;
    gl.RENDERBUFFER_RED_SIZE          =gl[0].RENDERBUFFER_RED_SIZE        ;
    gl.RENDERBUFFER_GREEN_SIZE        =gl[0].RENDERBUFFER_GREEN_SIZE      ;
    gl.RENDERBUFFER_BLUE_SIZE         =gl[0].RENDERBUFFER_BLUE_SIZE       ;
    gl.RENDERBUFFER_ALPHA_SIZE        =gl[0].RENDERBUFFER_ALPHA_SIZE      ;
    gl.RENDERBUFFER_DEPTH_SIZE        =gl[0].RENDERBUFFER_DEPTH_SIZE      ;
    gl.RENDERBUFFER_STENCIL_SIZE      =gl[0].RENDERBUFFER_STENCIL_SIZE    ;

    gl.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE           =gl[0].FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE          ;
    gl.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME           =gl[0].FRAMEBUFFER_ATTACHMENT_OBJECT_NAME          ;
    gl.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL         =gl[0].FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL        ;
    gl.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE =gl[0].FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE;

    gl.COLOR_ATTACHMENT0              =gl[0].COLOR_ATTACHMENT0       ;
    gl.DEPTH_ATTACHMENT               =gl[0].DEPTH_ATTACHMENT        ;
    gl.STENCIL_ATTACHMENT             =gl[0].STENCIL_ATTACHMENT      ;
    gl.DEPTH_STENCIL_ATTACHMENT       =gl[0].DEPTH_STENCIL_ATTACHMENT;

    gl.NONE                           =gl[0].NONE                    ;

    gl.FRAMEBUFFER_COMPLETE                      =gl[0].FRAMEBUFFER_COMPLETE                     ;
    gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT         =gl[0].FRAMEBUFFER_INCOMPLETE_ATTACHMENT        ;
    gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT =gl[0].FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT;
    gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS         =gl[0].FRAMEBUFFER_INCOMPLETE_DIMENSIONS        ;
    gl.FRAMEBUFFER_UNSUPPORTED                   =gl[0].FRAMEBUFFER_UNSUPPORTED                  ;

    gl.FRAMEBUFFER_BINDING            =gl[0].FRAMEBUFFER_BINDING          ;
    gl.RENDERBUFFER_BINDING           =gl[0].RENDERBUFFER_BINDING         ;
    gl.MAX_RENDERBUFFER_SIZE          =gl[0].MAX_RENDERBUFFER_SIZE        ;

    gl.INVALID_FRAMEBUFFER_OPERATION  =gl[0].INVALID_FRAMEBUFFER_OPERATION;

    gl.UNPACK_FLIP_Y_WEBGL               =gl[0].UNPACK_FLIP_Y_WEBGL              ;
    gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL    =gl[0].UNPACK_PREMULTIPLY_ALPHA_WEBGL   ;
    gl.CONTEXT_LOST_WEBGL                =gl[0].CONTEXT_LOST_WEBGL               ;
    gl.UNPACK_COLORSPACE_CONVERSION_WEBGL=gl[0].UNPACK_COLORSPACE_CONVERSION_WEBG;
    gl.BROWSER_DEFAULT_WEBGL             =gl[0].BROWSER_DEFAULT_WEBGL            ;
}

function setGLMaterial(at,whichMaterial) {
	//AL("cme@ setMaterial(at="+at+","+whichMaterial+");");
	switch(whichMaterial){
		case  0:
			setGLMaterialParms(at,0.1745, 0.01175, 0.01175, 0.61424, 0.04136, 0.04136, 0.727811, 0.626959, 0.626959, 12.); 
			/*  0 ruby           */
		break;
		case  1:
			setGLMaterialParms(at,0.0215, 0.1745, 0.0215, 0.07568, 0.61424, 0.07568, 0.633, 0.727811, 0.633, 12.); 
			/*  1 emerald        */
		break;
		case  2:
			setGLMaterialParms(at,0.01175, 0.01175, 0.1745, 0.04136, 0.04136, 0.61424, 0.626959, 0.626959, 0.727811, 12.);
			/*  2 saphire        */
		break;
		case  3:
			setGLMaterialParms(at,0.1745, 0.1745, 0.01175, 0.61424, 0.61424, 0.04136, 0.727811, 0.727811, 0.626959, 12.);
			/*  3 yellow gem     */
		break;
		case  4:
			setGLMaterialParms(at,0.1745, 0.01175, 0.1745, 0.61424, 0.04136, 0.61424, 0.727811, 0.626959, 0.727811, 12.); 
			/*  4 amathist       */
		break;
		case  5:
			setGLMaterialParms(at,0.1745, 0.093125, 0.01175, 0.61424, 0.3278, 0.04136, 0.727811, 0.677385, 0.626959, 12.); 
			/* 5  orange  gem  */
		break;
		case  6:
			setGLMaterialParms(at,0.135, 0.2225, 0.1575, 0.54, 0.89, 0.63, 0.316228, 0.316228, 0.316228, 6.2); 
			/*  6 jade           */
		break;
		case  7:
			setGLMaterialParms(at,0.05375, 0.05, 0.06625, 0.18275, 0.17, 0.22525, 0.332741, 0.328634, 0.346435, 8.5); 
			/*  7 obsidian       */
		break;
		case  8:
			setGLMaterialParms(at,0.35,0.35,0.35, 0.75424, 0.75424, 0.75424, 0.727811, 0.727811, 0.727811, 12.); 
			/*  8 white gem         */
		break;
		case  9:
			setGLMaterialParms(at,0.1, 0.18725, 0.1745, 0.396, 0.74151, 0.69102, 0.297254, 0.30829, 0.306678, 6.2); 
			/*  9 turquoise      */
		break;
		case 10:
			setGLMaterialParms(at,0.329412, 0.223529, 0.027451, 0.780392, 0.568627, 0.113725, 0.992157, 0.941176, 0.807843, 7.6);
			/* 10 brass  metal   */
		break;
		case 11:
			setGLMaterialParms(at,0.2125, 0.1275, 0.054, 0.714, 0.4284, 0.18144, 0.393548, 0.271906, 0.166721, 7.4); 
			/* 11 bronze metal   */
		break;
		case 12:
			setGLMaterialParms(at,0.25, 0.25, 0.25, 0.4, 0.4, 0.4, 0.774597, 0.774597, 0.774597, 12.); 
			/* 12 chrome metal   */
		break;
		case 13:
			setGLMaterialParms(at,0.19125, 0.0735, 0.0225, 0.7038, 0.27048, 0.0828, 0.256777, 0.137622, 0.086014, 6.2); 
			/* 13 copper metal   */
		break;
		case 14:
			setGLMaterialParms(at,0.24725, 0.1995, 0.0745, 0.75164, 0.60648, 0.22648, 0.628281, 0.555802, 0.366065, 9.6); 
			/* 14 gold   metal   */
		break;
		case 15:
			setGLMaterialParms(at,0.19225, 0.19225, 0.19225, 0.50754, 0.50754, 0.50754, 0.508273, 0.508273, 0.508273, 9.6);
			/* 15 silver metal   */
		break;
		case 16:
			setGLMaterialParms(at,0., 0., 0., 0.01, 0.01, 0.01, 0.5, 0.5, 0.5, 7.9); 
			/* 16 black  plastic */
		break;
		case 17:
			setGLMaterialParms(at,0., 0.1, 0.06, 0., 0.50980392, 0.50980392, 0.50196078, 0.50196078, 0.50196078, 7.9); 
			/* 17 cyan   plastic */
		break;
		case 18:
			setGLMaterialParms(at,0., 0., 0., 0.1, 0.35, 0.1, 0.45, 0.55, 0.45, 7.9); 
			/* 18 green  plastic */
		break;
		case 19:
			setGLMaterialParms(at,0., 0., 0., 0.5, 0., 0., 0.7, 0.6, 0.6, 7.9);
			/* 19 red    plastic */
		break;
		case 20:
			setGLMaterialParms(at,0., 0., 0., 0.55, 0.55, 0.55, 0.7, 0.7, 0.7, 7.9);
			/* 20 white  plastic */
		break;
		case 21:
			setGLMaterialParms(at,0., 0., 0., 0.5, 0.5, 0., 0.6, 0.6, 0.5, 7.9); 
			/* 21 yellow plastic */
		break;
		case 22:
			setGLMaterialParms(at,0.02, 0.02, 0.02, 0.01, 0.01, 0.01, 0.4, 0.4, 0.4, 6.); 
			/* 22 black  rubber  */
		break;
		case 23:
			setGLMaterialParms(at,0., 0.05, 0.05, 0.4, 0.5, 0.5, 0.04, 0.7, 0.7, 6.); 
			/* 23 cyan   rubber  */
		break;
		case 24:
			setGLMaterialParms(at,0., 0.05, 0., 0.4, 0.5, 0.4, 0.04, 0.7, 0.04, 6.); 
			/* 24 green  rubber  */
		break;
		case 25:
			setGLMaterialParms(at,0.05, 0., 0., 0.5, 0.4, 0.4, 0.7, 0.04, 0.04, 6.);
			/* 25 red    rubber  */
		break;
		case 26:
			setGLMaterialParms(at,0.05, 0.05, 0.05, 0.5, 0.5, 0.5, 0.7, 0.7, 0.7, 6.); 
			/* 26 white  rubber  */
		break;
		case 27:
			setGLMaterialParms(at,0.05, 0.05, 0., 0.5, 0.5, 0.4, 0.7, 0.7, 0.04, 6.); 
			/* 27 yellow rubber  */
		break;
		case 28:
			setGLMaterialParms(at,0.3, 0., 0., 0.5, 0., 0., 0.4, 0.4, 0.4, 9.6); 
			/*red metal */
		break;
		case 29:
			setGLMaterialParms(at,0., 0.3, 0., 0., 0.5, 0., 0.4, 0.4, 0.4, 9.6); 
			/*green metal */
		break;
		case 30:
			setGLMaterialParms(at,0., 0.15, 0.5, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 9.6);
			/*nice light blue metal */
		break;
		case 31:
			setGLMaterialParms(at,0.35, 0.3, 0., 0.75, 0.61, 0., 0.4, 0.4, 0.4, 9.6); 
			/* yellow (gold)  metal   */
		break;
		case 32:
			setGLMaterialParms(at,0., 0.3, 0.3, 0., 0.5, 0.5, 0.4, 0.4, 0.4, 9.6); 
			/* cyan metal */
		break;
		case 33:
			setGLMaterialParms(at,0.3, 0., 0.3, 0.5, 0., 0.5, 0.4, 0.4, 0.4, 9.6); 
			/* magenta metal */
		break;
		case 34:
			setGLMaterialParms(at,0.19, 0.19, 0.19, 0.51, 0.51, 0.51, 0.51, 0.51, 0.51, 9.6); 
			/* silver metal  */
		break;
		case 35:
			setGLMaterialParms(at,0.19, 0.07, 0.02, 0.7, 0.27, 0.08, 0.26, 0.14, 0.09, 6.2); 
			/* copper metal   */
		break;
		case 36:
			setGLMaterialParms(at,0.05375, 0.05, 0.06625, 0.18275, 0.17, 0.22525, 0.332741, 0.328634, 0.346435, 8.5);
			/*  obsidian       */
		break;
		case 37:
			setGLMaterialParms(at,0.3, 0.15, 0.15, 0.5, 0.5, 0.5, 0.4, 0.4, 0.4, 9.6); 
			/* metal */
		break;
		case 38:
			setGLMaterialParms(at,0.15, 0.3, 0., 0.5, 0.5, 0., 0.4, 0.4, 0.4, 9.6); 
			/* metal */
		break;
		case 39:
			setGLMaterialParms(at,0., 0.3, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 7.6); 
			/* metal */
		break;
		case 40:
			setGLMaterialParms(at,0.15, 0.3, 0.15, 0.5, 0.5, 0.5, 0.4, 0.4, 0.4, 9.6);
			/* metal */
		break;
		case 41:
			setGLMaterialParms(at,0.15, 0., 0.3, 0.5, 0., 0.5, 0.4, 0.4, 0.4, 9.6); 
			/* metal */
		break;
		case 42:
			setGLMaterialParms(at,0., 0.15, 0.3, 0.5, 0.5, 0.5, 0.4, 0.4, 0.4, 9.6); 
			/*nice light blue metal */
		break;
		case 43:
			setGLMaterialParms(at,0.01, 0.07, 0.26, 0.44, 0.44, 0.51, 0.53, 0.53, 0.63, 12.);
		break;
		case 44:
			setGLMaterialParms(at,0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.4, 0.4, 0.4, 9.6); 
			/* metal */
		break;
		case 45:
			setGLMaterialParms(at,0.098, 0.1745, 0.016625, 0.34496, 0.61424, 0.05852, 0.6804055, 0.727811, 0.6299795, 12.); 
			/* chartruce gem */
		break;
		case 46:
			setGLMaterialParms(at,0.12, 0.01, 0.3, 0.4, 0.4136, 0.41424, 0.626959, 0.626959, 0.627811, 9.6);
		break;
		case 47:
			setGLMaterialParms(at,0.1745,0.1745,0.1745, 0.61424, 0.61424, 0.61424, 0.727811, 0.727811, 0.727811, 12.); 
			/*  Alumina    */
		break;
		case 48:
			setGLMaterialParms(at,0.22, 0.32, 0.05, 0.74, 0.5, 0.63, 0.31, 0.31, 0.31, 9.6);
			/*  jade ish           */
		break;
		case 49:
			setGLMaterialParms(at,0.25, 0.20725, 0.20725, 1., 0.829, 0.829, 0.296648, 0.296648, 0.296648, 6.1); 
			/* 49 pearl          */
		break;
		case 999:
			setGLMaterialParms(at,1.,1.,1., 1.,1.,1., 1.,1.,1., 10.); 
			/*  full on, debug material     */
		break;
		default:
			setGLMaterialParms(at,0.19225, 0.19225, 0.19225, 0.50754, 0.50754, 0.50754, 0.508273, 0.508273, 0.508273, 9.6); 
		/*  silver metal   */
		break;
	} /* endswitch */
}
function setGLMaterialParms(at,
		  ambR,  ambG,  ambB
		, difR,  difG,  difB
		,specR, specG, specB
		,shine
	){
	//AL(sprintf("cme@ setGLMaterialParms(%3d,(%6.3f,%6.3f,%6.3f),(%6.3f,%6.3f,%6.3f),(%6.3f,%6.3f,%6.3f), %6.3f)",at,ambR,ambG,ambB,difR,difG,difB,specR,specG,specB,shine));
	gl[at].materialAmbientRGB =vec3.createFrom( ambR, ambG, ambB);
	gl[at].materialDiffuseRGB =vec3.createFrom( difR, difG, difB);
	gl[at].materialSpecularRGB=vec3.createFrom(specR,specG,specB);
	gl[at].materialShininess = shine;
	gl[at].materialEmissiveRGB=vec3.createFrom(0.,0.,0.);
}
function jsonReviverVarList(key, value) {
	//AL("check");
	if(  (typeof(value) === 'object')
	   &&(0<key.length)
	  ){
		AL(sprintf("%5d jsonVarList %s",gl.counter,key));
		gl.counter=-1;
	}
//	if(8000<gl.counter)	AL("jprlv "+typeof(key)+" "+typeof(value)+" "+gl.counter+" key="+key+" value="+value);
//	if(typeof(value) === 'object')AL("OBJECT "+key.length+" typeof(key)="+typeof(key)+" typeof(value)="+typeof(value)+" "+gl.counter+" key="+key+" value="+value);
	gl.counter++;
	return value;
}
function setAmbientUniforms(at) {
	if (typeof gl[at].ambientLightRGB === "undefined"){
		AL("setambientUniforms("+at+") accessed but gl[at].ambientLightRGB is undefined");
		return;
	}
	if (!(typeof gl[at].ambientLightRGB    === "undefined"))gl[at].uniform3fv(gl[at].puAmbientLightRGB       ,gl[at].ambientLightRGB   );
	if (!(typeof gl[at].lighting           === "undefined"))gl[at].uniform1i (gl[at].puUseLighting           ,gl[at].lighting          );
	if (!(typeof gl[at].directionalLight   === "undefined"))gl[at].uniform1i (gl[at].puUseDirectionalLight   ,gl[at].directionalLight  );
	if (!(typeof gl[at].pointLight         === "undefined"))gl[at].uniform1i (gl[at].puUsePointLight         ,gl[at].pointLight        );
	if (!(typeof gl[at].specularHighlights === "undefined"))gl[at].uniform1i (gl[at].puShowSpecularHighlights,gl[at].specularHighlights);
	if (!(typeof gl[at].negativeDiffuse    === "undefined"))gl[at].uniform1i (gl[at].puShowNegativeDiffuse   ,gl[at].negativeDiffuse   );
	if (!(typeof gl[at].materials          === "undefined"))gl[at].uniform1i (gl[at].puUseMaterials          ,gl[at].materials         );
}
//function setLighting(at) {
//	if (typeof gl[at].lighting === "undefined"){
//		AL("setLighting("+at+") accessed but gl[at].lighting is undefined");
//		return;
//	}
//	gl[at].uniform1i(gl[at].puUseLighting,gl[at].lighting);
//}
//function setMaterials(at) {
//	if (typeof gl[at].materials === "undefined"){
//		AL("setMaterials("+at+") accessed but gl[at].materials is undefined");
//		return;
//	}
//	gl[at].uniform1i(gl[at].puUseMaterials,gl[at].materials);
//}
function setDirectionalLight(at) {
	if (typeof gl[at].directionalLight === "undefined"){
		AL("setDirectionalLight("+at+") accessed but gl[at].directionalLight is undefined");
		return;
	}
	if (!(typeof gl[at].directionalLightXYZ  === "undefined")){
		var lightXYZ = vec3.create();
		vec3.set(gl[at].directionalLightXYZ, lightXYZ);
		vec3.scale(lightXYZ,1000000000.);
		mat4.multiplyVec3(gl[at].mvm,lightXYZ);
		vec3.normalize(lightXYZ);
		//if(5==gl.animationCount05)AL(sprintf("gl[%d] gl[gl.at].directionalLightXYZ norm =%s",gl.at,vec3.printS3(lightXYZ)));
		gl[at].uniform3fv(gl[at].puDirectionalLightXYZ        ,lightXYZ);
		gl[at].uniform1i (gl[at].puUseDirectionalLight        ,gl[at].directionalLight);
	}
	if (!(typeof gl[at].directionalLightSpecularRGB === "undefined"))gl[at].uniform3fv(gl[at].puDirectionalLightSpecularRGB,gl[at].directionalLightSpecularRGB);
	if (!(typeof gl[at].directionalLightDiffuseRGB  === "undefined"))gl[at].uniform3fv(gl[at].puDirectionalLightDiffuseRGB ,gl[at].directionalLightDiffuseRGB);
	//AL(sprintf("gl[%d] gl.directionalLightDiffuseRGB=%s",at,vec3.printS3(gl.directionalLightDiffuseRGB)));
}
function setPointLight(at) {
	if (typeof gl[at].pointLight === "undefined"){
		AL("setpointLight("+at+") accessed but gl[at].pointLight is undefined");
		return;
	}
	gl[at].uniform1i(gl[at].puUsePointLight,gl[at].pointLight);
	if (!(typeof gl[at].pointLightXYZ  === "undefined")){
		var lightXYZ=vec3.create();
		vec3.set(gl[at].pointLightXYZ,lightXYZ);
		mat4.multiplyVec3(gl[at].mvm,lightXYZ);
		//if(5==gl.animationCount05)AL(sprintf("gl[%d] gl[at].pointLightXYZ norm =%s",at,vec3.printS3(lightXYZ)));
		gl[at].uniform3fv(gl[at].puPointLightXYZ        ,lightXYZ);
	}
	if (!(typeof gl[at].pointLightSpecularRGB  === "undefined")){
		gl[at].uniform3fv(gl[at].puPointLightSpecularRGB,gl[at].pointLightSpecularRGB);
		//AL("gl["+at+"].pointLightSpecularRGB set as "+vec3.printS3(gl[at].pointLightSpecularRGB));
	}	
	if (!(typeof gl[at].pointLightDiffuseRGB  === "undefined")){
		gl[at].uniform3fv(gl[at].puPointLightDiffuseRGB ,gl[at].pointLightDiffuseRGB);
		//AL("gl["+at+"].pointLightDiffuseRGB set as "+vec3.printS3(gl[at].pointLightDiffuseRGB));
	}
}
/* from 
 * http://stackoverflow.com/questions/3730510/javascript-sort-array-and-return-an-array-of-indicies-that-indicates-the-positi
 * Dave Aaron Smith
 */
function sortWithIndeces(toSort) {
	for (var i = 0; i < toSort.length; i++) {
		toSort[i] = [toSort[i], i];
	}
	toSort.sort(function(left, right) {
		return left[0] < right[0] ? -1 : 1;
	});
	toSort.sortIndices = [];
	for (var j = 0; j < toSort.length; j++) {
		toSort.sortIndices.push(toSort[j][1]);
		toSort[j] = toSort[j][0];
	}
	return toSort;
}
/**
 * Performs a linear combination of a point and a portion of a vector
 *
 * @param {vec3} vec First vector
 * @param {vec3} vec2 Second vector
 * @param {number} lerp Interpolation amount between the two inputs
 * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
 *
 * @returns {vec3} dest if specified, vec otherwise
 */
vec3.linComb = function (A, AB, lambda, dest) {
    if (!dest) { dest = A; }

    dest[0] = A[0] + lambda * AB[0];
    dest[1] = A[1] + lambda * AB[1];
    dest[2] = A[2] + lambda * AB[2];

    return dest;
};

/**
 * finds intersection of two 3D line segments.
 *  Three-dimimensional only 
 *  The intersection point = basepoint0 + lambda.V0 = basepoint1 + mu.V1 
 * WARNING WARNING WARNING  This funciton will return false hits for non coplainar inputs 
 * User programmer must provide only co-planer inputs
 *  *
 * @param {float []} lambda  where along first line segment is the intersection
 * @param {int } lpm[1]  are the lines lpm[1]
 * @param {float []} mu  where along second line segment is the intersection
 * @param {vec3} basepoint0  starting point for first line segment
 * @param {vec3} v0  vector extending from basepoint0 to define first line segment
 * @param {vec3} basepoint1  starting point for second line segment
 * @param {vec3} v1  vector extending from basepoint1 to define second line segment
 * *
 * @returns {boolean} is there an intersection
 */
function intersectLines1Test(lpm,basepoint0,V0,basepoint1,V1){
	AL(sprintf("cme@ intersectLines1Test basepoint0=(%s) V0=(%s) basepoint1=(%s) V1=(%s)",vec3.printS3(basepoint0),vec3.printS3(V0),vec3.printS3(basepoint1),vec3.printS3(V1)));
	AL(sprintf("a2^49 lpm   =%s",vec3.printS3(lpm)));
	lpm[0]=444.222;
	lpm[2]=333.333;
	AL(sprintf("a2^52 lpm   =%s",vec3.printS3(lpm)));
}
function intersectLines1(lpm,basepoint0,V0,basepoint1,V1){
	//AL(sprintf("cme@ intersectLines1 basepoint0=(%s) V0=(%s) basepoint1=(%s) V1=(%s)",vec3.printS3(basepoint0),vec3.printS3(V0),vec3.printS3(basepoint1),vec3.printS3(V1)));

	//var talkon5=false;
	//talkon5=true;
	
	lpm[0] = lpm[2]= 555.555;
	//AL("lambda="+lambda+" mu="+mu);
	
	var lambda0=666.666;
	var lambda1=666.777;
	var mu0    =666.888;
	var mu1    =666.999;
	
	var origin=vec3.createFrom(0.,0.,0.);
	var cross=vec3.create();
	var basedelta=vec3.create();
	vec3.cross(V0,V1,cross);
	//if(talkon5==true)AL("cross    ="+vec3.printS3(cross));
	
	//var megacross=vec3.create();
	//var megacross=vec3.create();;
	//if(talkon5==true)vec3.set(cross,megacross);
	//if(talkon5==true)vec3.scale(megacross,1000000.);
	//if(talkon5==true)AL( "megacross="+vec3.printS3(megacross));
	//if(talkon5==true)AL("mega FLOAT_EPSILON+"+1000000.*FLOAT_EPSILON);
	vec3.scale(cross,.02);
	//AL("2Percenified cross="+vec3.printS3(cross)+" origin="+vec3.printS3(origin));
	if (vec3.equal(cross,origin)){
		/* for the parallel case (lpm[1] != 0.)*/
		/* lambda0 is the solution when mu==0. */
		/* lambda1 is the solution when mu==1. */
		lpm[1]=1.;
		//if(talkon5==true)AL( "lpm[1]==1");
		vec3.subtract(basepoint0,basepoint1,basedelta);
		//AL(sprintf("precompare 0 %25.20f %25.20f",(10000000.*basedelta[0]),(10000000.*FLOAT_EPSILON)));
		if (Math.abs(basedelta[0])<= FLOAT_EPSILON){
			//AL(sprintf("   compare 0 %25.20f %25.20f",(10000000.*basedelta[0]),(10000000.*FLOAT_EPSILON)));
			basedelta[0]=0.;
		}
		if (Math.abs(basedelta[1])<= FLOAT_EPSILON) {
			//AL(sprintf("   compare Y %25.20f %25.20f",(10000000.*basedelta[1]),(10000000.*FLOAT_EPSILON)));
			basedelta[1]=0.;
		}
		if (Math.abs(basedelta[2])<= FLOAT_EPSILON) {
			//AL(sprintf("   compare Z %25.20f %25.20f",(10000000.*basedelta[2]),(10000000.*FLOAT_EPSILON)));
			basedelta[2]=0.;
		}
		if (Math.abs(V0[0]) <= FLOAT_EPSILON) V0[0]=0.;
		if (Math.abs(V0[1]) <= FLOAT_EPSILON) V0[1]=0.;
		if (Math.abs(V0[2]) <= FLOAT_EPSILON) V0[2]=0.;
		if (Math.abs(V1[0]) <= FLOAT_EPSILON) V1[0]=0.;
		if (Math.abs(V1[1]) <= FLOAT_EPSILON) V1[1]=0.;
		if (Math.abs(V1[2]) <= FLOAT_EPSILON) V1[2]=0.;
		//if(talkon5==true)AL(sprintf("basedelta=%s %s8f",vec3.print6(basedelta),vec3.print6(V0)));
		//if(talkon5==true)AL("compares %s %s %s %s %s %s",(basedelta[0]==0.?"true":"false"),(basedelta[1]==0.?"true":"false"),(basedelta[2]==0.?"true":"false"),(V0[0]==0.?"true":"false"),(V0[1]==0.?"true":"false"),(V0[2]==0.?"true":"false"));
		/*AL(setprecision(10)+"compares "+basedelta[0]+" "+basedelta[1]+" "+basedelta[2]+" "+V0[0]+" "+V0[1]+" "+V0[2]+setprecision(3)+endl;*/
		
		if (  (basedelta[0]==0.)
		    &&(       V0[0]==0.)
		){
			if (  (basedelta[1]==0.)
			    &&(       V0[1]==0.)
			){
				lpm[1]=2;
				lambda0 =  basedelta[2]       /V0[2];
				lambda1 = (basedelta[2]+V1[2])/V0[2];
				mu0     = (     -basedelta[2])/V1[2];
				mu1     = (V0[2]-basedelta[2])/V1[2];
				//if(talkon5==true)AL("coincident 2");
			} else
			if(  (basedelta[2]==0.)
			   &&(       V0[2]==0.)
			){
				lpm[1]=3;
				lambda0 =  basedelta[1]       /V0[1];
				lambda1 = (basedelta[1]+V1[1])/V0[1];
				mu0     = (     -basedelta[1])/V1[1];
				mu1     = (V0[1]-basedelta[1])/V1[1];
				//if(talkon5==true)AL( "coincident 3");
			} else
			if ( (basedelta[1]/V0[1])==(basedelta[2]/V0[2])){
				lpm[1]=4;
				lambda0 =  basedelta[1]        /V0[1];
				lambda1 = (basedelta[1]+V1[1])/V0[1];
				mu0     = (      -basedelta[1])/V1[1];
				mu1     = (V0[1]-basedelta[1])/V1[1];
				//if(talkon5==true)AL( "coincident 4");
			}
		} else
		if (  (basedelta[1]==0.)
		    &&(       V0[1]==0.)
		){
			if (  (basedelta[2]==0.)
			    &&(       V0[2]==0.)
			){
				lpm[1]=5;
				lambda0 =  basedelta[0]        /V0[0];
				lambda1 = (basedelta[0]+V1[0])/V0[0];
				mu0     = (      -basedelta[0])/V1[0];
				mu1     = (V0[0]-basedelta[0])/V1[0];
				//if(talkon5==true)AL( "coincident 5");
			} else if ( (basedelta[0]/V0[0])==(basedelta[2]/V0[2])){
				lpm[1]=6;
				lambda0 =  basedelta[0]        /V0[0];
				lambda1 = (basedelta[0]+V1[0])/V0[0];
				mu0     = (      -basedelta[0])/V1[0];
				mu1     = (V0[0]-basedelta[0])/V1[0];
				//if(talkon5==true)AL( "coincident 6");
			}
		} else
		if (  (basedelta[2]==0.)
		    &&(       V0[2]==0.)
		){
			if ( (basedelta[0]/V0[0])==(basedelta[1]/V0[1])){
				lpm[1]=7;
				lambda0 =  basedelta[0]        /V0[0];
				lambda1 = (basedelta[0]+V1[0])/V0[0];
				mu0     = (      -basedelta[0])/V1[0];
				mu1     = (V0[0]-basedelta[0])/V1[0];
				//if(talkon5==true)AL( "coincident 7");
			}
		} else {
			var ratio0=basedelta[0]/V0[0];
			if (  (ratio0==basedelta[1]/V0[1])
			    &&(ratio0==basedelta[2]/V0[2])
			){
				lpm[1]=8;
				lambda0 = ratio0;
				lambda1 = (basedelta[0]+V1[0])/V0[0];
				if (  (V1[0]==0.)
				    &&(V1[0]==0.)
				    &&(V1[0]==0.)
				){
					mu0=0.;
					mu1=0.;
					//if(talkon5==true)AL( "special 0 case ");
				} else {
					mu0 = (      -basedelta[0])/V1[0];
					mu1 = (V0[0]-basedelta[0])/V1[0];
				}
				//if(talkon5==true)AL( "coincident 8");
			}
		}
		if (  (  (lambda0 <= 0.)
		       &&(lambda1 >  0.)
		      )
		   ||(  (lambda1 <= 0.)
		      &&(lambda0 >  0.)
		     )
		){
			lpm[0]=0.;
		} else
		if (  (lambda0 <= 1.)
		    &&(lambda1 >  1.)
		){
			lpm[0]=lambda0;
		} else
		if (  (lambda1 <= 1.)
		    &&(lambda0 >  1.)
		){
			lpm[0]=lambda1;
		} else {
			lpm[0]= Math.abs(lambda0) < Math.abs(lambda1) ? lambda0 : lambda1;
		} /* endif */
		if (  (  (mu0 <= 0.)
		       &&(mu1 >  0.)
		      )
		   ||(  (mu1 <= 0.)
		      &&(mu0 >  0.)
		     )
		){
			lpm[2]=0.;
		} else
		if (  (mu0 <= 1.)
		    &&(mu1 >  1.)
		){
			lpm[2]=mu0;
		} else
		if (  (mu1 <= 1.)
		    &&(mu0 >  1.)
		){
			lpm[2]=mu1;
		} else {
			lpm[2]= Math.abs(mu0) < Math.abs(mu1) ? mu0 : mu1;
		}
		//if(talkon5==true)AL("lpm[1]="+lpm[1] +" lambda's = "+lambda0 +" "+lambda1+" "+lambda+"\n               mu's = "+mu0+" "+mu1+" "+lpm[2]);
	} else {
		lpm[1]=0; /* not parallel */
		//if(talkon5==true)AL( "lpm[1]="+lpm[1]);
		var denominator = [];
		denominator[0] = (V0[1]*V1[0]) - (V0[0]*V1[1]);
		denominator[1] = (V0[2]*V1[0]) - (V0[0]*V1[2]);
		denominator[2] = (V0[0]*V1[1]) - (V0[1]*V1[0]);
		denominator[3] = (V0[2]*V1[1]) - (V0[1]*V1[2]);
		denominator[4] = (V0[0]*V1[2]) - (V0[2]*V1[0]);
		denominator[5] = (V0[1]*V1[2]) - (V0[2]*V1[1]);
		var best=-1;
		var compare=0.;
		for(var ii=0;ii<6;ii++){
			//if(talkon5==true)AL(sprintf("denominator[%d]=%13.6f",ii,denominator[ii]));
			if ( compare < Math.abs(denominator[ii])){
				compare = Math.abs(denominator[ii]);
				best=ii;
			}
		}
		//if(talkon5==true)AL( "best="+best);
		switch (best) {
			case  0:
				lpm[0] = ( (basepoint1[1]*V1[0]) + (basepoint0[0]*V1[1]) -(  (basepoint1[0]*V1[1]) + (basepoint0[1]*V1[0]) ) )/denominator[0];
				//if(talkon5==true)AL(sprintf("a2^257 V1[0]=%8.3f V1[1]=%8.3f lpm[0]=%8.3f",V1[0],V1[1],lpm[0]));
				if(Math.abs(V1[0]) < Math.abs(V1[1])){
					lpm[2] = (basepoint0[1]+(lpm[0]*V0[1])-basepoint1[1])/V1[1];
					//if(talkon5==true)AL(sprintf("a2^260 lpm[2]=%8.3f basepoint0[1]=%8.3f lpm[0]*V0[1]=%8.3f basepoint1[1]=%8.3f numerator=%8.3f",lpm[2],basepoint0[1],(lpm[0]*V0[1]),basepoint1[1],(basepoint0[1]+(lpm[0]*V0[1])-basepoint1[1])));
				} else {
					lpm[2] = (basepoint0[0]+(lpm[0]*V0[0])-basepoint1[0])/V1[0];
					//if(talkon5==true)AL("a2^263 lpm[2]="+lpm[2]+" basepoint0[0]="+basepoint0[0]+" lpm[0]*V0[0]="+lpm[0]*V0[0]+" basepoint1[0]="+basepoint1[0]+" "+(basepoint0[0]+(lpm[0]*V0[0])-basepoint1[0]));
				}
			break;
			case  1:
				lpm[0]= ( (basepoint1[2]*V1[0]) + (basepoint0[0]*V1[2]) -(  (basepoint1[0]*V1[2]) + (basepoint0[2]*V1[0]) ) )/denominator[1];
				if(Math.abs(V1[0]) < Math.abs(V1[2])){
					lpm[2] = (basepoint0[2]+(lpm[0]*V0[2])-basepoint1[2])/V1[2];
				} else {
					lpm[2] = (basepoint0[0]+(lpm[0]*V0[0])-basepoint1[0])/V1[0];
				}
			break;
			case  2:
				lpm[0]= ( (basepoint1[2]*V1[1]) + (basepoint0[1]*V1[0]) -(  (basepoint1[1]*V1[2]) + (basepoint0[0]*V1[1]) ) )/denominator[2];
				if(Math.abs(V1[0]) < Math.abs(V1[1])){
					lpm[2]= (basepoint0[1]+(lpm[0]*V0[1])-basepoint1[1])/V1[1];
				} else {
					lpm[2]= (basepoint0[0]+(lpm[0]*V0[0])-basepoint1[0])/V1[0];
				}
			break;
			case  3:
				lpm[0]= ( (basepoint1[2]*V1[1]) + (basepoint0[1]*V1[2]) -(  (basepoint1[1]*V1[2]) + (basepoint0[2]*V1[1]) ) )/denominator[3];
				if(Math.abs(V1[1]) < Math.abs(V1[2])){
					lpm[2]= (basepoint0[2]+(lpm[0]*V0[2])-basepoint1[2])/V1[2];
				} else {
					lpm[2]= (basepoint0[1]+(lpm[0]*V0[1])-basepoint1[1])/V1[1];
				}
			break;
			case  4:
				lpm[0]= ( (basepoint1[0]*V1[2]) + (basepoint0[2]*V1[0]) -(  (basepoint1[2]*V1[0]) + (basepoint0[0]*V1[2]) ) )/denominator[4];
				if(Math.abs(V1[2]) < Math.abs(V1[0])){
					lpm[2]= (basepoint0[0]+(lpm[0]*V0[0])-basepoint1[0])/V1[0];
				} else {
					lpm[2]= (basepoint0[2]+(lpm[0]*V0[2])-basepoint1[2])/V1[2];
				}
			break;
			case  5:
				lpm[0]= ( (basepoint1[1]*V1[2]) + (basepoint0[2]*V1[1]) -(  (basepoint1[2]*V1[1]) + (basepoint0[1]*V1[2]) ) )/denominator[5];
				if(Math.abs(V1[2]) < Math.abs(V1[1])){
					lpm[2]= (basepoint0[1]+(lpm[0]*V0[1])-basepoint1[1])/V1[1];
				} else {
					lpm[2]= (basepoint0[2]+(lpm[0]*V0[2])-basepoint1[2])/V1[2];
				}
			break;
			default:
				alert( "denominator==0 for all 6 cases on nonlpm[1] line intersect solution.\nPossible non co-planar lines is best clue I can give you ");
				AL("denominator==0 for all 6 cases on nonlpm[1] line intersect solution.\nPossible non co-plabody lines is best clue I can give you ");
				break;
		} /* endswitch */
	}
	//if(talkon5==true)AL(sprintf("intersectLine1   lpm[0]=%8.3f lpm[1]=%d lpm[2]=%8.3f",lpm[0],lpm[1],lpm[2]));
	if (  (lpm[0] >= 0.)
	    &&(lpm[0] <= 1.)
	    &&(lpm[2] >= 0.)
	    &&(lpm[2] <= 1.)
	){
		//if(talkon5==true)AL( "  HIT HIT HIT\n");
		return(true);
	} else {
		//if(talkon5==true)AL( "  no hit\n");
		return(false);
	}
}
//TODO put a blue mark here
/*****************************************************************************************/
/**
 * @class 3 Dimensional Plane
 * @name plane
 * @ defined by a normalized norman, and a constant (distance of closest point on plane from 0,0,0 along that normal)
 */
var plane = {};
/**
 * Creates a new instance of a plane using the default array type
 * Any javascript array-like objects containing at least 3 numeric elements can serve as a vec3
 *
 * @param {plane} [plane] plane containing values to initialize with
 *
 * @returns {plane} New plane
 */
plane.create = function (vec) {
	var dest = new MatrixArray(4);
	if (vec) {
		//AL("create from inputs "+vec[0]+" "+vec[1]+" "+vec[2]+" "+vec[3]);	
		dest[0] = vec[0];
		dest[1] = vec[1];
		dest[2] = vec[2];
		dest[3] = vec[3];
	} else {
		dest[0] = dest[1] = dest[2] = dest[3] = 0;
	}
	return dest;
};
plane.createFromVecMag = function (vec, mag) {
	var p = new MatrixArray(4);
	if (vec && mag) {
		p[0] = vec[0];
		p[1] = vec[1];
		p[2] = vec[2];
		p[3] = mag;
		//AL("initialzing from inputs");
	} else {
		p[0] = p[1] = p[2] = p[3] = 0;
	}
	return p;
};

plane.createFrom3Points = function (vec0,vec1,vec2) {
	//AL(sprintf("createFrom3Vec3s (%s)(%s)(%s)",vec3.printS3(vec0),vec3.printS3(vec1),vec3.printS3(vec2)));
	p = new MatrixArray(4);
	var pq = new MatrixArray(3);
	var pr = new MatrixArray(3);
	vec3.subtract(vec0,vec1,pq);
	vec3.subtract(vec0,vec2,pr);
	//AL("pq="+vec3.printS3(pq));
	//AL("pr="+vec3.printS3(pr));
	vec3.cross(pq,pr,p);
	//AL("pre  normalize norm="+vec3.printS3(p));
	vec3.normalize(p);
	//AL("post normalize norm="+vec3.printS3(p));
	p[3] = vec3.dot(p,vec0);
	//AL(sprintf("norm=(%s) %9.6f",vec3.printS3(p),p[3]));
	return p;
};
plane.whichSide= function(aPoint, aPlane){
	//AL(sprintf(
	//	"whichSide=%2d aPoint=(%s) aPlane=%s"
	//	,(sign(vec3.dot(aPlane,aPoint) - aPlane[3]))
	//	,vec3.printS3(aPoint)
	//	,plane.print(aPlane)
	//	)
	//);
	return(sign(vec3.dot(aPlane,aPoint) - aPlane[3]));
};
//plane.print = function () {
//	return(sprintf("(%s) %9.6f",vec3.printS3(p),p[3]));
//};
plane.print = function (p) {
	return(sprintf("(%s) %9.6f",vec3.printS3(p),p[3]));
};

plane.constants= function(abc,a,b,c){
	/* a, b, c are three points inside the plane */
	var ab = vec3.create(); /* Difference vector */
	var bc = vec3.create(); /* Difference vector */
	vec3.subtract(a,b,ab);
	vec3.subtract(b,c,bc);
	vec3.cross(ab,bc,this.p);//	   Cross_product(pqr->normal, pq, pr);
	vec3.normalize(this.p);//	   normalize_vec(pqr->normal);
	this.p[3]=vec3.dot(this.p,a);//	  	pqr->cnst = Dot_product(pqr->normal, p);
};

plane.intersectLine = function(A,AB,aPlane,dest){
	/* lambda  parameter to intersection point */
	/*  a= line point,  AB=line direction */
	/* dest  vec3 for the intersection point */
	
	//AL("cme@ plane.intersectLine(A=("+vec3.printS3(A)+") AB=("+vec3.printS3(AB)+") plane="+plane.print(aPlane));
	var lambda = (aPlane[3] - vec3.dot(aPlane, A)) / (vec3.dot(aPlane, AB) + (10.*FLOAT_EPSILON));
	vec3.linComb(A,AB,lambda,dest);
	//AL(sprintf("lambda=%8.3f intersect at %s",lambda,vec3.printS3(dest)));
	return lambda;
};
/*****************************************************************************************/
//TO DO  to put a blue mark in the right collum... join the TO and the DO at the beginning of this line
