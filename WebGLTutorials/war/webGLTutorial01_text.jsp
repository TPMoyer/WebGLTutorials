<!DOCTYPE html>
<!--  © 2013 Thomas P Moyer  -->
<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ page import="java.util.Date"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<html>
<head>
<title>WebGL tutorial01 Text Only</title>
<meta http-equiv="content-type" content="text/html; charset=ISO-8859-1">
<link rel="stylesheet" type="text/css" href="<c:url value="css/webGLTutorials.css" />" />
<script type="text/javascript" src="js/jquery-1.9.0.js"></script>
<script type="text/javascript" src="js/webGLTutorial01.js"></script>

</head>
<body onload="webGLStart01();" style="overflow: auto; overflow-x: hidden;">
<h3> Welcome</h3>
	<p>or rather... Hello World<p>
<br>for tutorial01 the webGL bit is a trivial adder, so there is no need for this .jsp
</body>
</html>