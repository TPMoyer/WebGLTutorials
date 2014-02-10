<!DOCTYPE html>
<!--  © 2013 Thomas P Moyer  -->
<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ page import="java.util.Date"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<html>
<head>
<title id="title">Learning webGL &mdash; tutorial03</title>
<meta http-equiv="content-type" content="text/html; charset=ISO-8859-1">
<link rel="stylesheet" type="text/css" href="<c:url value="css/webGLTutorials.css" />" />
<script type="text/javascript" src="js/jquery-1.9.0.js"></script>
<script type="text/javascript" src="js/gl-matrix.js"></script>     <%--needs to be above gl-aux2.js     --%>
<script type="text/javascript" src="js/gl-aux2.js"></script>
<script type="text/javascript" src="js/webgl-utils.js"></script>
<script type="text/javascript" src="js/sprintf-0.7-beta1.js"></script>
<script type='text/javascript' src="dwr/engine.js"></script>
<script type='text/javascript' src="dwr/interface/R.js"></script>
<script type="text/javascript" src="js/webGLTutorial02.js"></script>
<script type="text/javascript" src="js/webGLTutorial03.js"></script>

<script id="vertex-shader1" type="text/webgl">
	attribute vec3 aXYZ;
	attribute vec4 aRGBA;
	
	uniform mat4 uMvm;
	uniform mat4 uPerspectiveMatrix;
	
	varying vec4 vColor;
	
	void main(void) {
		gl_PointSize=3.;
		gl_Position = uPerspectiveMatrix * uMvm * vec4(aXYZ, 1.0);
		vColor = aRGBA;
    }
</script>
<script id="fragment-shader1" type="text/webgl">
	#ifdef GL_ES
	precision highp float;
	#endif
	
	varying vec4 vColor;

	void main(void) {
		gl_FragColor = vColor;
	}
</script>
</head>
<body onload="webGLStart03();" style="overflow: auto; overflow-x: hidden;">
<p id="breadcrumbs">
<a href="WebGLTutorials">WebGLTutorials</a> -&gt; WebGLTutorial03
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<a href="WebGLTutorial04"> forward to Tutorial04 </a>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<a href="WebGLTutorial02"> backward to Tutorial02 </a>
</p>
<p id="header">
Tutorial03 &nbsp; Animation
</p>
<div> 	
<canvas id="tutorial03-canvas0" width="500" height="500" style="border:none; position:relative; top:-20px;"></canvas>
<p id="xyzpry0" class="xyzpry" style="position:relative; left:30px; top:-20px;">xyz=( ###.###, ###.###, ###.###) pry=(###.###,###.###,###.###)</p>
<input type="button" id="cullFace0" style="position:relative; left:190px; top:-35px;" value="  Enable CullFace " ></input> 
</div>
<div style="position:relative; left:502px; top:-581px;"> 
<canvas id="tutorial03-canvas1" width="500" height="500" style="border:none;"></canvas>
<p id="xyzpry1" class="xyzpry" style="position:relative; left:30px;">xyz=( ###.###, ###.###, ###.###) pry=(###.###,###.###,###.###)</p>
<input type="button" id="cullFace1" style="position:relative; left:190px; top:-15px;" value="  Enable CullFace " ></input> 
</div>  
<c:out value='${  form_html}' escapeXml='false'/>
<c:out value='${result_html}' escapeXml='false'/>
<div style="position:relative; top:-561px;">
<%@ include file="webGLTutorial03_body.html" %>
</div>
</body>
</html>