<!DOCTYPE html>
<!--  © 2013 Thomas P Moyer  -->
<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ page import="java.util.Date"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<html>
<head>
<title id="title">Learning webGL &mdash; tutorial05</title>
<meta http-equiv="content-type" content="text/html; charset=ISO-8859-1">
<link rel="stylesheet" type="text/css" href="<c:url value="css/jquery-ui-1.10.0.custom.css" />" /> 
<link rel="stylesheet" type="text/css" href="<c:url value="css/webGLTutorials.css" />" />
<link rel="stylesheet" type="text/css" href="<c:url value="css/spectrum.css" />" />

<!--  <script type="text/javascript" src="js/jquery-1.7.min.js"></script>-->
<script type="text/javascript" src="js/jquery-1.9.0.js"></script>
<script type="text/javascript" src="js/jquery-ui-1.10.0.custom.js"></script>
<script type="text/javascript" src="js/gl-matrix.js"></script>     <%--needs to be above gl-aux2.js     --%>
<script type="text/javascript" src="js/gl-aux2.js"></script>
<script type="text/javascript" src="js/webgl-utils.js"></script>
<script type="text/javascript" src="js/sprintf-0.7-beta1.js"></script>
<script type='text/javascript' src="dwr/engine.js"></script>
<script type="text/javascript" src="js/spectrum.js"></script>
<script type='text/javascript' src="dwr/interface/R.js"></script>
<script type="text/javascript" src="js/webGLTutorial05.js"></script>

<script id="vertex-shader2" type="text/webgl">
/* functional vertex shader.  position is perspective, materials and directional lights and point lights
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
<script id="fragment-shader2" type="text/webgl">
/*  gl_FragColor is from lighting, per vertex */
	precision mediump float;
	
	varying vec3 vLightWeighting;
	
	void main(void) {
		gl_FragColor = vec4(vLightWeighting, 1.0);
	}
</script>
	</head>
<body onload="webGLStart05();">
<p id="breadcrumbs">
<a href="WebGLTutorials">WebGLTutorials</a> -&gt; WebGLTutorial05 
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<a href="WebGLTutorial06"> forward to Tutorial06  </a>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<a href="WebGLTutorial04"> backward to Tutorial04 </a>
</p>
<p id="header">
Tutorial05 &nbsp; Rendering 3D Objects:  Materials with Lighting
</p>
<canvas id="tutorial05-canvas0" tabindex="0" width="500" height="500" style="border:none; position:absolute; left: 40px; top:50px;"></canvas>
<canvas id="tutorial05-canvas1" tabindex="1" width="500" height="500" style="border:none; position:absolute; left:552px; top:50px;"></canvas>

<div id="tutorial05Tabs" style="position:relative; top:481px;"> 
	<ul> 
		<li><a href="#idTab050">Movement</a></li> 
		<li><a href="#idTab051">Directional Light</a></li>
		<li><a href="#idTab052">Point Light</a></li>  
		<li><a href="#idTab053">CullFace</a></li> 
	</ul> 
	<div id="idTab050" style ="height:350px;">
		<div style="position:relative; top:-10px; left:-10px;">
			<div id="xyzpry0" class="xyzpry" style="position:relative; left: 40px;">xyz=( ###.###, ###.###, ###.###) pry=(###.###,###.###,###.###)</div>
			<input type="button" id="home05-00"  style="position:relative; left: 0px; top:3px;" value="home" ></input>
			<input type="button" id="home05-01"  style="position:relative; left: 0px; top:3px;" value="home big" ></input>
			<input type="button" id="step05_up0" style="position:relative; left:60px; top:3px;" value="step up" ></input>
			<input type="button" id="step05_dn0" style="position:relative; left:60px; top:3px;" value="step dn" ></input>
			<input type="button" id="turn05_up0" style="position:relative; left:60px; top:3px;" value="turn up" ></input>
			<input type="button" id="turn05_dn0" style="position:relative; left:60px; top:3px;" value="turn dn" ></input>
			<div id="stepTurn0" class="xyzpry"   style="position:relative; left:230px; top:3px;">step=###.###      turn= Pi/###</div>
		</div>	
		<div style="position:relative; left:530px; top:-66px">
			<div id="xyzpry1" class="xyzpry" style="position:relative; left:40px;">xyz=( ###.###, ###.###, ###.###) pry=(###.###,###.###,###.###)</div>
			<input type="button" id="home05_10"  style="position:relative; left: 0px; top:3px;" value="home" ></input>
	 		<input type="button" id="home05_11"  style="position:relative; left: 0px; top:3px;" value="home big" ></input>
			<input type="button" id="step05_up1" style="position:relative; left:60px; top:3px;" value="step up" ></input>
			<input type="button" id="step05_dn1" style="position:relative; left:60px; top:3px;" value="step dn" ></input>
			<input type="button" id="turn05_up1" style="position:relative; left:60px; top:3px;" value="turn up" ></input>
			<input type="button" id="turn05_dn1" style="position:relative; left:60px; top:3px;" value="turn dn" ></input>
			<div id="stepTurn1" class="xyzpry"   style="position:relative; left:230px; top:3px;">step=###.###      turn= Pi/###</div>
		</div>
		<div style="position:relative; left:0px; top:-50px;">
			<p>To Move you need to first click on a canvas. &nbsp; When you have done this, the canvas will indicate it has focus by having a yellow border.
			<br> F moves you forward one step.
			<br> B moves you backward one step.  V will also move you backwards.
			<br> R rotates you around the forward vector in a ClockWize direction.
			<br> C rotates you around the forward vector in a Counter-ClockWize direction.
			<br> Arrow keys move you &nbsp;
			left
			<span class="ui-state-default ui-corner-all"
				title="NO THIS IS NOT A BUTTON, I mean use the arrow key on the right side of the keyboard"
				style="display:inline-block; width:16px;">
				<span class="ui-icon ui-icon-triangle-1-w"></span>
			</span>
			, &nbsp; right
			<span class="ui-state-default ui-corner-all"	
				title="NO THIS IS NOT A BUTTON, I mean use the arrow key on the right side of the keyboard"
				style="display:inline-block; width:16px;">
				<span class="ui-icon ui-icon-triangle-1-e"></span>
			</span>
			, &nbsp; up
			<span class="ui-state-default ui-corner-all"	
				title="NO THIS IS NOT A BUTTON, I mean use the arrow key on the right side of the keyboard"
				style="display:inline-block; width:16px;">
				<span class="ui-icon ui-icon-triangle-1-n"></span>
			</span>
			, &nbsp; or down
			<span class="ui-state-default ui-corner-all"	
				title="NO THIS IS NOT A BUTTON, I mean use the arrow key on the right side of the  keyboard"
				style="display:inline-block; width:16px;">
				<span class="ui-icon ui-icon-triangle-1-s"></span>
			</span>
			<br> Shift Arrow keys cause you to rotate.  Their action is modeled on a fighter jet's joystick.
			<br>&nbsp; &nbsp; &nbsp; shift
			<span class="ui-state-default ui-corner-all"
				title="NO THIS IS NOT A BUTTON, I mean hold down the shift key and hit the left arrow key on the keyboard"
				style="display:inline-block; width:16px;">
				<span class="ui-icon ui-icon-triangle-1-w"></span>
			</span>
			turns you toward the left	
			<br>&nbsp; &nbsp; &nbsp; shift
			<span class="ui-state-default ui-corner-all"
				title="NO THIS IS NOT A BUTTON, I mean hold down the shift key and hit the right arrow key on the keyboard"
				style="display:inline-block; width:16px;">
				<span class="ui-icon ui-icon-triangle-1-e"></span>
			</span>
			turns you toward the right
			<br>&nbsp; &nbsp; &nbsp; shift
			<span class="ui-state-default ui-corner-all"
				title="NO THIS IS NOT A BUTTON, I mean hold down the shift key and hit the up arrow key on the keyboard"
				style="display:inline-block; width:16px;">
				<span class="ui-icon ui-icon-triangle-1-n"></span>
			</span>
			pushes the nose of your airplane down, like pushing forward on the joystick	
			<br>&nbsp; &nbsp; &nbsp; shift
			<span class="ui-state-default ui-corner-all"
				title="NO THIS IS NOT A BUTTON, I mean hold down the shift key and hit the down arrow key on the keyboard"
				style="display:inline-block; width:16px;">
				<span class="ui-icon ui-icon-triangle-1-s"></span>
			</span>  
			pulls the nose of your airplane up, like pulling back on the joystick
			
			<div style="position:relative; left:0px; top:0px">
				<br> Use the buttons below each canvas to change the size of the steps, and the amount turned per keystroke.
				<br><br> You can go to one of the preset positions by clicking on the Home or Home-Big buttons.  Home gets the full 49 balls, Home-Big gets the closeup. 
				<br> And yes, when you click the left Home-Big, you get a close-up of a big brass shiny one.
			</div>	
		</div>
	</div> 
	<div id="idTab051" style ="height:100px;" >
		<div style="position:relative; top:-10px">
			<label><input type="checkbox" id="lighting1"  checked > lighting</label> &nbsp; &nbsp;
			<label><input type="checkbox" id="directionalLight1" checked >Directional Light</label> &nbsp; &nbsp;
			<label><input type="checkbox" id="pointLight1" checked >Point Light</label> &nbsp; &nbsp;
			<label><input type="checkbox" id="materials1" checked >Materials</label> &nbsp; &nbsp;
			<label><input type="checkbox" id="specularHighlights1" checked > Specular Highlights</label> &nbsp; &nbsp;
			<label><input type="checkbox" id="negativeDiffuse1" checked > Negative Diffuse</label>

			<div style="position:relative; left:850px; top:-15px;">
				Directional Specular
				<input id="directionalSpecular"  type='color' onchange='handleDirectionalSpecularChange(this);' value="#FFFFFF">
			</div>
			<div style="position:relative; left:862px; top:-10px;">
				Directional Diffuse
				<input id="directionalDiffuse" type='color' onchange='handleDirectionalDiffuseChange(this);' value="#FFFFFF">
			</div>		
			<div style="position:relative; left:928px; top:-5px;">
				Ambient
				<input id="ambient1"  type='color' onchange='handleAmbientChange(this);' value="#333333">
			</div>		
		</div>
		<div style="position:relative; left:-10px; top:-90px; width:650px;">
		   Directional light,like the sun, is so far away that all elements are lit from the same direction.
			<div style="position:relative; left:-10px; top: 10px; width:150px;">sunset</div>
			<div style="position:relative; left:277px; top:-15px; width:150px;">noon</div>
			<div style="position:relative; left:550px; top:-20px; width:150px;">sunrise</div>
			<div id="directionalLightXYZSlider" style="position:relative; top:-30px;"></div>
		</div> 
		<div id="shiner1" style="position:relative; left:690px; top:-160px; width:150px; display: none;">
			Shininess	
			<div id="shininessSlider1"></div>
		</div> 				
	</div> 
	<div id="idTab052" style ="height:100px;" >
		<div style="position:relative; top:-10px">
			<label><input type="checkbox" id="lighting2"  checked > lighting</label> &nbsp; &nbsp;
			<label><input type="checkbox" id="directionalLight2" checked >Directional Light</label> &nbsp; &nbsp;
			<label><input type="checkbox" id="pointLight2" checked >Point Light</label> &nbsp; &nbsp;
			<label><input type="checkbox" id="materials2" checked >Materials</label> &nbsp; &nbsp;
			<label><input type="checkbox" id="specularHighlights2" checked > Specular Highlights</label> &nbsp; &nbsp;
			<label><input type="checkbox" id="negativeDiffuse2" checked > Negative Diffuse</label>

			<div style="position:relative; left:886px; top:-15px;">
				point Specular
				<input id="pointSpecular"  type='color' onchange='handlePointSpecularChange(this);' value="#CCCCCC">
			</div>
			<div style="position:relative; left:898px; top:-10px;">
				point Diffuse
				<input id="pointDiffuse" type="color" onchange='handlePointDiffuseChange(this);' value="#CCCCCC">
			</div>		
			<div style="position:relative; left:928px; top:-5px;">
				Ambient
				<input id="ambient2"  type='color' onchange='handleAmbientChange(this);' value="#333333">
			</div>		
		</div>
		<!-- 
		<div style="position:relative; left:-10px; top:-90px; width:650px;">
		   Directional light,like the sun, is so far away that all elements are lit from the same direction.
			<div style="position:relative; left:-10px; top: 10px; width:150px;">sunset</div>
			<div style="position:relative; left:277px; top:-15px; width:150px;">noon</div>
			<div style="position:relative; left:550px; top:-20px; width:150px;">sunrise</div>
			<div id="pointLightXYZSlider" style="position:relative; top:-30px;"></div>
		</div>
		-->
		<div id="shiner2" style="position:relative; left:690px; top:-80px; width:150px; display: none;">
			Shininess	
			<div id="shininessSlider2"></div>
		</div> 
	
	</div> 
	<div id="idTab053">
	   <!-- 
	   <input type="button" id="tweening"  style="width:70px;" value="Halt" ></input>
		<input type="button" id="tween_min" style="position:relative; left:60px;" value="Min Number of Faces"></input>
		<input type="button" id="tween_max" style="position:relative; left:60px;" value="Max Number of Faces"></input>
		<input type="button" id="color_tween_min" style="position:relative; left:60px;" value="Min Color Tween"></input>
		<input type="button" id="phase" style="position:relative; left:0px;" value=" All Cycles " ></input>
		-->
		<input type="button" id="cullFaces" style="position:relative; left:290px;" value=" Disable CullFace " ></input>  
	</div> 
</div>
<div id="loadingtext">Loading world...</div>
<div style="position:relative; top:500px;">
	<c:out value='${  form_html}' escapeXml='false'/> <!-- no form was made so this just adds a zero length string  -->
	<c:out value='${result_html}' escapeXml='false'/>
</div>	
</body>
</html>