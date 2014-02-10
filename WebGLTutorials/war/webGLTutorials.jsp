<!DOCTYPE html>
<!--  © 2013 Thomas P Moyer  -->
<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ page import="java.util.Date"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<html>
<head>
<title id="title">Learning webGL &mdash; the tutorials</title>
<meta http-equiv="content-type" content="text/html; charset=ISO-8859-1">
<link rel="stylesheet" type="text/css" href="<c:url value="css/webGLTutorials.css" />" />
<script type="text/javascript" src="js/jquery-1.9.0.js"></script>
<script type="text/javascript" src="js/gl-matrix.js"></script>     <%--needs to be above gl-aux2.js     --%>
<script type="text/javascript" src="js/gl-aux2.js"></script>
<script type="text/javascript" src="js/webgl-utils.js"></script>
<script type="text/javascript" src="js/sprintf-0.7-beta1.js"></script>
<script type='text/javascript' src="dwr/engine.js"></script>
<script type='text/javascript' src="dwr/interface/R.js"></script>
<script type="text/javascript" src="js/webGLTutorials.js"></script>
<script type="text/javascript" src="js/webGLTutorial01.js"></script>
<script type="text/javascript" src="js/webGLTutorial02.js"></script>
<script type="text/javascript" src="js/webGLTutorial03.js"></script>
<script type="text/javascript" src="js/webGLTutorial04.js"></script>
<script type="text/javascript" src="js/webGLTutorial05.js"></script>
<script type="text/javascript" src="js/webGLTutorial06.js"></script>
<script type="text/javascript" src="js/webGLTutorial07.js"></script>

<script id="vertex-shader0" type="text/webgl">
/* simplest vertex shader.  position is perspective, no color fed to fragment shader 
 *
 */	
	attribute vec3 aXYZ;
	
	uniform mat4 uMvm;
	uniform mat4 uPerspectiveMatrix;
	
	void main(void) {
		gl_Position = uPerspectiveMatrix * uMvm * vec4(aXYZ, 1.0);
	}
</script>
<script id="vertex-shader1" type="text/webgl">
/* simple vertex shader.  position is perspective, color is passed to fragement shader 
 *
 */
	attribute vec3 aXYZ;
	attribute vec4 aRGBA;
	
	uniform mat4 uMvm;
	uniform mat4 uPerspectiveMatrix;
	
    varying vec4 vColor;
	
	void main(void) {
		gl_Position = uPerspectiveMatrix * uMvm * vec4(aXYZ, 1.0);
		vColor = aRGBA;
    }
</script>
<script id="vertex-shader2" type="text/webgl">
/*  functional vertex shader.  position is perspective, materials and directional lights and point lights
 * are per vertex implemented. 
 */
	attribute vec3 aXYZ ;
	attribute vec3 aNormal ;
	
	uniform mat4 uMvm ;
	uniform mat4 uPerspectiveMatrix ;
	uniform mat3 uNormal ;
	
	uniform bool uUseLighting ;
	uniform bool uUseDirectionalLight;
	uniform bool uUsePointLight;
	uniform bool uShowSpecularHighlights ;
	uniform bool uShowNegativeDiffuse;
	
	uniform vec3 uAmbientLightRGB ;

	uniform vec3 uDirectionalLightXYZ;
	uniform vec3 uDirectionalLightSpecularRGB;	
	uniform vec3 uDirectionalLightDiffuseRGB;
	
	uniform vec3 uPointLightXYZ ;
	uniform vec3 uPointLightSpecularRGB ;
	uniform vec3 uPointLightDiffuseRGB;
	
	uniform vec3  uMaterialAmbientRGB;
	uniform vec3  uMaterialSpecularRGB;
	uniform vec3  uMaterialDiffuseRGB;
	uniform float uMaterialShininess;
	uniform vec3  uMaterialEmissiveRGB;
	
	varying vec3 vLightWeighting;
	
	void main(void) {
		gl_PointSize=9.;
		vec4 ecVertexXYZA = uMvm  * vec4(aXYZ , 1.0);
		gl_Position = uPerspectiveMatrix  * ecVertexXYZA;
		if (!uUseLighting ) {
			vLightWeighting = vec3(1.0, 1.0, 1.0);
		} else {
			vec3 transformedNormal = uNormal  * aNormal ;
			float pointLightDiffuseWeighting;
			float pointLightSpecularWeighting = 0.0;
			float directionalLightDiffuseWeighting;
			float directionalLightSpecularWeighting = 0.0;
			if(uUsePointLight){
				vec3 normal = normalize(transformedNormal);
				vec3 pointLightDirection  = normalize(uPointLightXYZ  - ecVertexXYZA.xyz); 
				pointLightDiffuseWeighting = dot(normal, pointLightDirection);              /* most shaders  max(this,0.) */
				if (   uShowSpecularHighlights
				    &&(0.<pointLightDiffuseWeighting)
				) { 
					vec3 eyeDirection = normalize(-ecVertexXYZA.xyz);
					vec3 reflectionDirection = reflect(-pointLightDirection, normal);
					pointLightSpecularWeighting = pow(max(dot(reflectionDirection, eyeDirection), 0.0), uMaterialShininess );
				}
				if(0.>pointLightDiffuseWeighting){
					pointLightDiffuseWeighting*=(true==uShowNegativeDiffuse?-.25:0.);
				}
			} else {
				pointLightDiffuseWeighting = 0.0;
			}
			if(uUseDirectionalLight){
				directionalLightDiffuseWeighting = dot(transformedNormal, uDirectionalLightXYZ); /* most shaders  max(this,0.) */ 
				if (  uShowSpecularHighlights
				    &&(0.<directionalLightDiffuseWeighting)
				) {
					vec3 eyeDirection = normalize(-ecVertexXYZA.xyz);
					vec3 reflectionDirection = reflect(-uDirectionalLightXYZ, transformedNormal);
					directionalLightSpecularWeighting = pow(max(dot(reflectionDirection, eyeDirection), 0.0), uMaterialShininess);
				}
				if(0.>directionalLightDiffuseWeighting){
					directionalLightDiffuseWeighting*=(true==uShowNegativeDiffuse?-.25:0.);
				}
			} else {
				directionalLightDiffuseWeighting = 0.0;
			}	
			vLightWeighting =									uMaterialAmbientRGB  * uAmbientLightRGB
				+ directionalLightSpecularWeighting *  uMaterialSpecularRGB * uDirectionalLightSpecularRGB
				+ directionalLightDiffuseWeighting  *  uMaterialDiffuseRGB  * uDirectionalLightDiffuseRGB
				+ pointLightSpecularWeighting       *  uMaterialSpecularRGB * uPointLightSpecularRGB 
				+ pointLightDiffuseWeighting        *  uMaterialDiffuseRGB  * uPointLightDiffuseRGB 
				+ uMaterialEmissiveRGB
			;
		}
	}
</script>
<script id="vertex-shader3" type="text/webgl">
/* a specialty vertex shader. used by tutorial06 
 * position is perspective, materials and directional lights are implemented 
 * position is tweened.
 * materials are selectable as tweenable. 
 * per vertex implemented.
 */
	
	attribute vec3 aXYZ0;
	attribute vec3 aXYZ1;
	attribute vec3 aNormal0;
	attribute vec3 aNormal1;
	
	/* aaaahhh */
	/* a line immediatly above here with content  "aaahhhh"  (remove the / *  and the   * / from the line above  
	 * prompts a runtime error of     ERROR: 0:13: 'aaahhhh' : syntax error 
	 * because it is the 13'th linefeed into the program 
	 */
	
	uniform float uTween;
	uniform mat4  uMvm;
	uniform mat4  uPerspectiveMatrix;
	uniform mat3  uNormal;
	
	uniform vec3 uAmbientLightRGB;
	
	uniform vec3 uDirectionalLightDiffuseRGB;
	uniform vec3 uDirectionalLightSpecularRGB;
	uniform vec3 uDirectionalLightXYZ;
	
	uniform vec3  uMaterialAmbientRGB;
	uniform vec3  uMaterialDiffuseRGB;
	uniform vec3  uMaterialSpecularRGB;
	uniform float uMaterialShininess;
	uniform vec3  uMaterialEmissiveRGB;
	uniform vec3  uMaterialAmbientRGBTween;
	uniform vec3  uMaterialDiffuseRGBTween;
	uniform vec3  uMaterialSpecularRGBTween;
	uniform float uMaterialShininessTween;
	
	uniform bool uUseLighting;
	uniform bool uShowSpecularHighlights;
	uniform bool uShowNegativeDiffuse;
	uniform bool uUseMaterialTweening;
	
	varying vec3 vLightWeighting;
	
	void main(void) {
		vec3 ecVertexXYZ = vec3( uMvm * mix(
			 vec4(aXYZ0,1.0)
			,vec4(aXYZ1,1.0)
			,uTween
		));
		gl_Position = uPerspectiveMatrix * vec4(ecVertexXYZ,1.0);
		vec3 transformedNormal = normalize(
			uNormal * mix(
				 aNormal0
				,aNormal1
				,uTween
			)
		);
		vec3 materialAmbientRGB;
		vec3 materialDiffuseRGB;
		vec3 materialSpecularRGB;
		float materialShininess;
		if(uUseMaterialTweening){
			materialAmbientRGB  = mix(uMaterialAmbientRGB ,uMaterialAmbientRGBTween ,uTween);
			materialDiffuseRGB  = mix(uMaterialDiffuseRGB ,uMaterialDiffuseRGBTween ,uTween);
			materialSpecularRGB = mix(uMaterialSpecularRGB,uMaterialSpecularRGBTween,uTween);
			materialShininess   = mix(uMaterialShininess  ,uMaterialShininessTween  ,uTween);
		} else {
			materialAmbientRGB  = uMaterialAmbientRGB;
			materialDiffuseRGB  = uMaterialDiffuseRGB;
			materialSpecularRGB = uMaterialSpecularRGB;
			materialShininess   = uMaterialShininess;
		}
		if (!uUseLighting) {
			vLightWeighting = vec3(1.0, 1.0, 1.0);
		} else {
			float directionalLightWeighting = dot(transformedNormal, uDirectionalLightXYZ);
			
			float specularLightWeighting = 0.0;
			if (  uShowSpecularHighlights
				 &&(0.<directionalLightWeighting)
			) {
				vec3 eyeDirection = normalize(-ecVertexXYZ);
				vec3 reflectionDirection = reflect(-uDirectionalLightXYZ, transformedNormal);
				specularLightWeighting = pow(max(dot(reflectionDirection, eyeDirection), 0.0), uMaterialShininess);
			}
			if(0.>directionalLightWeighting){
				directionalLightWeighting*=(true==uShowNegativeDiffuse?-.25:0.);
			}
			vLightWeighting =						 materialAmbientRGB  * uAmbientLightRGB
				+ directionalLightWeighting *  materialDiffuseRGB  * uDirectionalLightDiffuseRGB 
				+ specularLightWeighting    *  materialSpecularRGB * uDirectionalLightSpecularRGB 
				+ uMaterialEmissiveRGB
			;
		}
	}
</script>
<script id="vertex-shader4" type="text/webgl">

	attribute vec3 aXYZ ;
	attribute vec3 aNormal ;
	attribute vec2 aTextureCoord ;
	
	uniform mat4 uMvm ;
	uniform mat4 uPerspectiveMatrix ;
	uniform mat3 uNormal ;
	
	varying vec2 vTextureCoord;
	varying vec3 vTransformedNormal;
	varying vec4 ecVertexXYZA;

	void main(void) {
		gl_PointSize=9.;
		ecVertexXYZA = uMvm * vec4( aXYZ,1.0);
		gl_Position = uPerspectiveMatrix  * ecVertexXYZA;
		vTextureCoord = aTextureCoord ;
		vTransformedNormal = uNormal  * aNormal ;
	}
</script>


<script id="fragment-shader0" type="text/webgl">
/*  all is white */
	#ifdef GL_ES
		precision highp float;
	#endif
	
	void main(void) {
		gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	}
</script>
<script id="fragment-shader1" type="text/webgl">
/*  color is carried thru per vertex  */ 
    #ifdef GL_ES
    precision highp float;
    #endif

    varying vec4 vColor;

    void main(void) {
        gl_FragColor = vColor;
    }
</script>
<script id="fragment-shader2" type="text/webgl">
/*  gl_FragColor is from lighting, per vertex */
	precision mediump float;
	
	varying vec3 vLightWeighting;
	
	void main(void) {
		gl_FragColor = vec4(vLightWeighting, 1.0);
	}
</script>
<script id="fragment-shader3" type="text/webgl">
	precision mediump float;
	
	varying vec2 vTextureCoord;
	varying vec3 vTransformedNormal;
	varying vec4 ecVertexXYZA;

	uniform bool uUseLighting ;
	uniform bool uUseTextures ;
	uniform bool uUseFullEmissivity;

	uniform bool uShowSpecularHighlights ;
	uniform bool uShowNegativeDiffuse;
	
	uniform vec3 uAmbientLightRGB ;

	uniform bool uUseDirectionalLight;	
	uniform vec3 uDirectionalLightXYZ;
	uniform vec3 uDirectionalLightSpecularRGB;	
	uniform vec3 uDirectionalLightDiffuseRGB;

	uniform bool uUsePointLight;
	uniform vec3 uPointLightXYZ ;
	uniform vec3 uPointLightSpecularRGB ;
	uniform vec3 uPointLightDiffuseRGB ;

	uniform bool  uUseMaterials;
	uniform vec3  uMaterialAmbientRGB;
	uniform vec3  uMaterialDiffuseRGB;
	uniform vec3  uMaterialSpecularRGB;
	uniform float uMaterialShininess;
	uniform vec3  uMaterialEmissiveRGB;
	
	uniform sampler2D uSampler ;
	
	void main(void) {
		vec3 vLightWeighting;
		 if(uUseFullEmissivity){
			gl_FragColor = vec4(1.);
		} else {
			if (!uUseLighting) {
				vLightWeighting = vec3(1.0, 1.0, 1.0);
			} else {
				float pointLightDiffuseWeighting;
				float pointLightSpecularWeighting = 0.0;
				float directionalLightDiffuseWeighting;
				float directionalLightSpecularWeighting = 0.0;
				if(uUsePointLight){
					vec3 pointLightDirection  = normalize(uPointLightXYZ  - ecVertexXYZA.xyz); 
					pointLightDiffuseWeighting = dot(vTransformedNormal, pointLightDirection);              /* most shaders  max(this,0.) */
					if (   uShowSpecularHighlights
					    &&(0.<pointLightDiffuseWeighting)
					) { 
						vec3 eyeDirection = normalize(-ecVertexXYZA.xyz);
						vec3 reflectionDirection = reflect(-pointLightDirection, vTransformedNormal);
						pointLightSpecularWeighting = pow(max(dot(reflectionDirection, eyeDirection), 0.0), uMaterialShininess );
					}
					if(0.>pointLightDiffuseWeighting){
						pointLightDiffuseWeighting*=(true==uShowNegativeDiffuse?-.25:0.);
					}
				} else {
					pointLightDiffuseWeighting = 0.0;
				}
				if(uUseDirectionalLight){
					directionalLightDiffuseWeighting = dot(vTransformedNormal, uDirectionalLightXYZ); /* most shaders  max(this,0.) */ 
					if (  uShowSpecularHighlights
					    &&(0.<directionalLightDiffuseWeighting)
					) {
						vec3 eyeDirection = normalize(-ecVertexXYZA.xyz);
						vec3 reflectionDirection = reflect(-uDirectionalLightXYZ, vTransformedNormal);
						directionalLightSpecularWeighting = pow(max(dot(reflectionDirection, eyeDirection), 0.0), uMaterialShininess);
					}
					if(0.>directionalLightDiffuseWeighting){
						directionalLightDiffuseWeighting*=(true==uShowNegativeDiffuse?-.25:0.);
					}
				} else {
					directionalLightDiffuseWeighting = 0.0;
				}	
				if(uUseMaterials){
					vLightWeighting =									uMaterialAmbientRGB  * uAmbientLightRGB
						+ directionalLightSpecularWeighting *  uMaterialSpecularRGB * uDirectionalLightSpecularRGB
						+ directionalLightDiffuseWeighting  *  uMaterialDiffuseRGB  * uDirectionalLightDiffuseRGB
						+ pointLightSpecularWeighting       *  uMaterialSpecularRGB * uPointLightSpecularRGB 
						+ pointLightDiffuseWeighting        *  uMaterialDiffuseRGB  * uPointLightDiffuseRGB 
						+ uMaterialEmissiveRGB
					;
					} else {
					vLightWeighting =								 uAmbientLightRGB
						+ directionalLightSpecularWeighting * uDirectionalLightSpecularRGB
						+ directionalLightDiffuseWeighting  * uDirectionalLightDiffuseRGB
						+ pointLightSpecularWeighting       * uPointLightSpecularRGB   
						+ pointLightDiffuseWeighting        * uPointLightDiffuseRGB 
					;
					}
			}
			vec4 fragmentColor;
			if (uUseTextures ) {
				fragmentColor = texture2D(uSampler , vec2(vTextureCoord.s, vTextureCoord.t));
			} else {
				fragmentColor = vec4(1.0, 1.0, 1.0, 1.0);
			}
			gl_FragColor = vec4(fragmentColor.rgb * vLightWeighting, fragmentColor.a);
		}
	}
</script>

</head>
<body onload="webGLStart();" style="overflow: auto; overflow-x: hidden;">
<div>
<p id="breadcrumbs"> WebGLTutorials </p>
<h2>Hello. Welcome to the webGLTutorials</h2> 
<b>To check on your browser's support for webGL click on: <a href="http://webglreport.sourceforge.net/" target="_blank">webGL Report</a></b>
&nbsp; &nbsp; &nbsp; &nbsp; Google Chrome supports webGL..  <a href="https://www.google.com/intl/en/chrome/browser/" target="_blank">Chrome Download Page</a>
<br><br>
<p>My previous 3D graphics experience was with OpenGL standalone apps.   In porting this display capability to the web
I wanted to set up a package which would become my standard platform for web apps.   There are a number of 3D graphics
<a href="webGLAspects.html">things I had worked thru</a> which seemed would be valuable if shared.
</p><p>
We stand on the shoulders of giants.<br>This set of web pages is based most directly on the well known
<a href="http://learningwebgl.com/blog/?page_id=1217">Learning webGL</a> tutorials.   
<p>
&nbsp; <a href="webGLTutorial00.html">Tutorial00</a> &nbsp; The Package.   These tutorials have been implemented as an Eclipse project which runs under both
 Google App Engine, and Apache TomCat. Have used jquery ajax to enable diagnostic server console print statements to better enable javascript debugging.
<br>
</p>
<div>
<canvas id="tutorial01-canvas0" width="75" height="75" class="sandbad-Left"></canvas> 
<canvas id="tutorial01-canvas1" width="75" height="75" style="border:none; position:relative; left:5px;"></canvas>
	<div style="position:relative; left:170px; top:-70px; margin-right:160px;"> 
	&nbsp; <a href="WebGLTutorial01"> Tutorial01 </a> &nbsp; A point, two lines, three lines, a triangle, and two triangles.
	<br>A full working set of the code needed
	to draw the simplest of objects.   Includes which way is up, two points of view,  and how to not draw the
	half of the drawing you (usually) can't see anyway
	</div>
</div>
<br>
<div style="position:relative; top:-50px;">
	<canvas id="tutorial02-canvas0" width="75" height="75" style="border:none;"></canvas> 
	<canvas id="tutorial02-canvas1" width="75" height="75" style="border:none; position:relative; left:5px; top -78px;"></canvas> 
	<div style="position:relative; left:170px; top:-70px;">
		<a href="WebGLTutorial02"> Tutorial02 </a> &nbsp; Color
	</div>
</div>
<br>
<div style="position:relative; top:-80px;">
	<canvas id="tutorial03-canvas0" width="75" height="75" style="border:none;"></canvas> 
	<canvas id="tutorial03-canvas1" width="75" height="75" style="border:none; position:relative; left:5px; top -78px;"></canvas> 
	<div style="position:relative; left:170px; top:-70px;">
		<a href="WebGLTutorial03"> Tutorial03 </a> &nbsp; Animation
	</div>
</div>
<br>
<div style="position:relative; top:-110px;">
	<canvas id="tutorial04-canvas0" width="75" height="75" style="border:none;"></canvas> 
	<canvas id="tutorial04-canvas1" width="75" height="75" style="border:none; position:relative; left:5px; top -78px;"></canvas> 
	<div style="position:relative; left:170px; top:-70px;">
		<a href="WebGLTutorial04"> Tutorial04 </a> &nbsp; Drawing 3D Colored Objects
	</div>
</div>
<br>
<div style="position:relative; top:-140px;">
	<canvas id="tutorial05-canvas0" width="75" height="75" style="border:none;"></canvas> 
	<canvas id="tutorial05-canvas1" width="75" height="75" style="border:none; position:relative; left:5px; top -78px;"></canvas>
	<div style="position:relative; left:170px; top:-70px;">
		<a href="WebGLTutorial05"> Tutorial05 </a> &nbsp; Rendering 3D Objects:  Materials and Lighting
		<br>Keyboard motion control: &nbsp; forward&amp;backward  &nbsp; left&amp;right  &nbsp; up&amp;down  &nbsp;  pitch &nbsp; roll &nbsp; yaw
	</div>
</div>
<br>
<div style="position:relative; top:-190px;">
	<canvas id="tutorial06-canvas0" width="75" height="75" style="border:none;"></canvas> 
	<canvas id="tutorial06-canvas1" width="75" height="75" style="border:none; position:relative; left:5px; top -78px;"></canvas>
	<div style="position:relative; left:170px; top:-70px;">
		<a href="WebGLTutorial06"> Tutorial06 </a> &nbsp; Tweening:Shapes and Tweening Materials
	</div>
</div>
<br>
<div style="position:relative; top:-220px;">
	<canvas id="tutorial07-canvas0" width="75" height="75" style="border:none;"></canvas> 
	<canvas id="tutorial07-canvas1" width="75" height="75" style="border:none; position:relative; left:5px; top -78px;"></canvas>
	<div style="position:relative; left:170px; top:-70px;">
		<a href="WebGLTutorial07"> Tutorial07 </a> &nbsp; Textures
	</div>
</div>
<!--  The service calls the servelet and jstl allow it out. (I used no form but kept the next line as a placeholder)   -->
<c:out value='${  form_html}' escapeXml='false'/>
<c:out value='${result_html}' escapeXml='false'/>
</div>
</body>
</html>