<!DOCTYPE html>
<!--  © 2013 Thomas P Moyer  -->
<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ page import="java.util.Date"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<html>
<head>
<title id="title">Learning webGL &mdash; tutorial06</title>
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
<script type="text/javascript" src="js/webGLTutorial06Wiki.js"></script>

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
		vec4 ecVertexXYZA =  uMvm * vec4(mix(aXYZ0,aXYZ1,uTween),1.0);
		gl_Position = uPerspectiveMatrix * ecVertexXYZA;
		vec3 transformedNormal = normalize(uNormal * mix(aNormal0,aNormal1,uTween));
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
			float directionalLightDiffuseWeighting = dot(transformedNormal, uDirectionalLightXYZ);
			
			float directionalLightSpecularWeighting = 0.0;
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
			vLightWeighting =								  materialAmbientRGB  * uAmbientLightRGB
				+ directionalLightDiffuseWeighting	* materialDiffuseRGB  * uDirectionalLightDiffuseRGB 
				+ directionalLightSpecularWeighting	* materialSpecularRGB * uDirectionalLightSpecularRGB 
				+ uMaterialEmissiveRGB
			;
		}
	}
</script>
<script id="fragment-shader2" type="text/webgl">
	precision mediump float;
	
	varying vec3 vLightWeighting;
	
	void main(void) {
		gl_FragColor = vec4(vLightWeighting, 1.0);
	}
</script>
</head>
<body onload="webGLStart06();">
<p id="breadcrumbs">
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<a href="WebGLTutorials">WebGLTutorials</a> -&gt; WebGLTutorial06 
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<a href="WebGLTutorial07"> forward to Tutorial07  </a>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<a href="WebGLTutorial05"> backward to Tutorial05 </a>
</p>
<h2>Tutorial06 &nbsp; Tweening Shapes and Materials</h2>
<canvas id="tutorial06-canvas0" tabindex="0" width="160" height="160" style="border:none; position:absolute; left: 40px; top:80px;"></canvas>
<canvas id="tutorial06-canvas1" tabindex="1" width="500" height="500" style="border:none; position:absolute; left:552px; top:80px;"></canvas>

<div id="tutorial06Tabs"> 
	<ul> 
		<li><a href="#idTab060">Movement</a></li> 
		<li><a href="#idTab061">Directional Light</a></li> 
		<li><a href="#idTab062">Tweening Animation</a></li> 
	</ul> 
	<div id="idTab060" style ="height:350px;">
		<div style="position:relative; top:-10px; left:-10px;">
			<div id="xyzpry0" class="xyzpry" style="position:relative; left: 40px;">xyz=( ###.###, ###.###, ###.###) pry=(###.###,###.###,###.###)</div>
			<input type="button" id="home06-00"  style="position:relative; left: 0px; top:3px;" value="home" ></input>
			<input type="button" id="home06-01"  style="position:relative; left: 0px; top:3px;" value="home big" ></input>
			<input type="button" id="step06_up0" style="position:relative; left:60px; top:3px;" value="step up" ></input>
			<input type="button" id="step06_dn0" style="position:relative; left:60px; top:3px;" value="step dn" ></input>
			<input type="button" id="turn06_up0" style="position:relative; left:60px; top:3px;" value="turn up" ></input>
			<input type="button" id="turn06_dn0" style="position:relative; left:60px; top:3px;" value="turn dn" ></input>
			<div id="stepTurn0" class="xyzpry"   style="position:relative; left:230px; top:3px;">step=###.###      turn= Pi/###</div>
		</div>	
		<div style="position:relative; left:530px; top:-66px">
			<div id="xyzpry1" class="xyzpry" style="position:relative; left:40px;">xyz=( ###.###, ###.###, ###.###) pry=(###.###,###.###,###.###)</div>
			<input type="button" id="home06_10"  style="position:relative; left: 0px; top:3px;" value="home" ></input>
	 		<input type="button" id="home06_11"  style="position:relative; left: 0px; top:3px;" value="home big" ></input>
			<input type="button" id="step06_up1" style="position:relative; left:60px; top:3px;" value="step up" ></input>
			<input type="button" id="step06_dn1" style="position:relative; left:60px; top:3px;" value="step dn" ></input>
			<input type="button" id="turn06_up1" style="position:relative; left:60px; top:3px;" value="turn up" ></input>
			<input type="button" id="turn06_dn1" style="position:relative; left:60px; top:3px;" value="turn dn" ></input>
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
			</div>	 
		</div>
	</div> 
	<div id="idTab061" style ="height:100px;" >
		<div style="position:relative; top:-10px">
			<input type="checkbox" id="lighting"  checked > Use lighting &nbsp; &nbsp;
			<input type="checkbox" id="materials" onchange='handleMaterialChange(this);' checked >Materials &nbsp; &nbsp;
			<input type="checkbox" id="specular" checked > Show specular highlight &nbsp; &nbsp;
			<input type="checkbox" id="negDiffuse" checked > Negative Diffuse
			<div style="position:relative; left:650px; top:-22px;">
				Directional Diffuse
				<input id="directionalDiffuse" type="color" onchange='handleDirectionalDiffuseChange(this);' value="#FFFFFF">
			</div>
			<div style="position:relative; left:850px; top:-55px;">
				Directional Specular
				<input id="directionalSpecular"  type='color' onchange='handleDirectionalSpecularChange(this);' value="#FFFFFF">
			</div>		
			<div style="position:relative; left:860px; top:-30px;">
				Ambient
				<input id="ambient"  type='color' onchange='handleAmbientChange(this);' value="#FFFFFF">
			</div>		
		</div>
		<div style="position:relative; left:-10px; top:-90px; width:650px;">
		   Directional light,like the sun, is so far away that all elements are lit from the same direction.
			<div style="position:relative; left:-10px; top: 10px; width:150px;">sunset</div>
			<div style="position:relative; left:277px; top:-15px; width:150px;">noon</div>
			<div style="position:relative; left:550px; top:-20px; width:150px;">sunrise</div>
			<div id="directionalLightXYZSlider" style="position:relative; top:-30px;"></div>
		</div> 
		<div id="shiner" style="position:relative; left:690px; top:-160px; width:150px; display: none;">
			Shininess	
			<div id="shininessSlider"></div>
		</div> 				
	</div> 
	<div id="idTab062">
		<input type="button" id="tweening"  style="width:70px;" value="Halt" ></input>
		<input type="button" id="tween_min" style="position:relative; left:60px;" value="Min Number of Faces"></input>
		<input type="button" id="tween_max" style="position:relative; left:60px;" value="Max Number of Faces"></input>
		<input type="button" id="color_tween_min" style="position:relative; left:60px;" value="Min Color Tween"></input>
		<input type="button" id="cullFaces" style="position:relative; left:290px;" value=" Disable CullFace " ></input>
		<input type="button" id="phase" style="position:relative; left:0px;" value=" All Cycles " ></input>  
	</div> 
</div>
<div id="loadingtext">Loading world...</div>
<div style="position:relative; top:500px;">
	<c:out value='${  form_html}' escapeXml='false'/> <!-- no form was made so this just adds a zero length string  -->
	<c:out value='${result_html}' escapeXml='false'/>
</div>	
</body>
</html>