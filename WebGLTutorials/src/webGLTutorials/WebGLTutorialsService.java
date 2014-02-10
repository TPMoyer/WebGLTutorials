package webGLTutorials;
/*   © 2013 Thomas P Moyer  */ 

//import org.apache.log4j.Level;
import org.apache.log4j.Logger;

/** @author TPMoyer */
public class WebGLTutorialsService {
	@SuppressWarnings("unused")
	private static Logger logger  = Logger.getLogger(WebGLTutorialsService.class);
	
	public StringBuilder GetWebGLTutorials() {
		//logger.setLevel(Level.DEBUG);
		//logger.info("cme@ service GetWebGLTutorials");
		StringBuilder sbout = new StringBuilder();
		sbout.append("<div id=tutorialEndings01 style=\"position:relative; top:-100px;\">");
		sbout.append("project is being developed by Thomas P. Moyer<br>TPMoyer000@GMail.com");
		sbout.append("</div>");
		//logger.info("final sbout=\n"+sbout);
		return (sbout);
	}
	
	public StringBuilder GetWebGLTutorial01(boolean cullFace) {
		//logger.setLevel(Level.DEBUG);
		//logger.info("cme@ service GetWebGLTutorial01  with cullFace="+(cullFace?"true":"false"));
		StringBuilder sbout = new StringBuilder();
		sbout.append("<p "+(true==cullFace?"id=setCullFace":"")+"> <p>");
		sbout.append("<div id=tutorialEndings01 style=\"position:relative; top:-580px;\">");
		sbout.append("project is being developed by Thomas P. Moyer<br>TPMoyer000@GMail.com");
		sbout.append(" &nbsp; &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp ");
		sbout.append("<a href=\"WebGLTutorial01?CullFace="+(cullFace?"false":"true")+"\">");
		sbout.append(" Tutorial01 with CullFace initially "+(cullFace?"false":"true")+"</a>");
		sbout.append("</div>");
		//logger.info("final sbout=\n"+sbout);
		return (sbout);
	}
	public StringBuilder GetWebGLTutorial02(boolean cullFace) {
		//logger.setLevel(Level.DEBUG);
		//logger.info("cme@ service GetWebGLTutorial02  with cullFace="+(cullFace?"true":"false"));
		StringBuilder sbout = new StringBuilder();
		sbout.append("<p "+(true==cullFace?"id=setCullFace":"")+"> <p>");
		sbout.append("<div id=tutorialEndings02 style=\"position:relative; top:-580px;\">");
		sbout.append("project is being developed by Thomas P. Moyer<br>TPMoyer000@GMail.com");
		sbout.append(" &nbsp; &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp ");
		sbout.append("<a href=\"WebGLTutorial02?CullFace="+(cullFace?"false":"true")+"\">");
		sbout.append(" Tutorial02 with CullFace initially "+(cullFace?"false":"true")+"</a>");
		sbout.append("</div>");
		//logger.info("final sbout=\n"+sbout);
		return (sbout);
	}
	public StringBuilder GetWebGLTutorial03(boolean cullFace) {
		//logger.setLevel(Level.DEBUG);
		//logger.info("cme@ service GetWebGLTutorial03  with cullFace="+(cullFace?"true":"false"));
		StringBuilder sbout = new StringBuilder();
		sbout.append("<p "+(true==cullFace?"id=setCullFace":"")+"> <p>");
		sbout.append("<div id=tutorialEndings03 style=\"position:relative; top:-580px;\">");
		sbout.append("project is being developed by Thomas P. Moyer<br>TPMoyer000@GMail.com");
		sbout.append(" &nbsp; &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp ");
		sbout.append("<a href=\"WebGLTutorial03?CullFace="+(cullFace?"false":"true")+"\">");
		sbout.append(" Tutorial03 with CullFace initially "+(cullFace?"false":"true")+"</a>");
		sbout.append("</div>");
		//logger.info("final sbout=\n"+sbout);
		return (sbout);
	}
	public StringBuilder GetWebGLTutorial04(boolean cullFace) {
		//logger.setLevel(Level.DEBUG);
		//logger.info("cme@ service GetWebGLTutorial04  with cullFace="+(cullFace?"true":"false"));
		StringBuilder sbout = new StringBuilder();
		sbout.append("<p "+(true==cullFace?"id=setCullFace":"")+"> <p>");
		sbout.append("<div id=tutorialEndings04 style=\"position:relative; top:-580px;\">");
		sbout.append("project is being developed by Thomas P. Moyer<br>TPMoyer000@GMail.com");
		sbout.append(" &nbsp; &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp ");
		sbout.append("<a href=\"WebGLTutorial04?CullFace="+(cullFace?"false":"true")+"\">");
		sbout.append(" Tutorial04 with CullFace initially "+(cullFace?"false":"true")+"</a>");
		sbout.append("</div>");
		//logger.info("final sbout=\n"+sbout);
		return (sbout);
	}
	public StringBuilder GetWebGLTutorial05(boolean cullFace) {
		//logger.setLevel(Level.DEBUG);
		//logger.info("cme@ service GetWebGLTutorial05  with cullFace="+(cullFace?"true":"false"));
		StringBuilder sbout = new StringBuilder();
		sbout.append("<p "+(true==cullFace?"id=setCullFace":"")+"> <p>");
		sbout.append("<div id=tutorialEndings05 style=\"position:relative; top:-5px;\">");
		sbout.append("project is being developed by Thomas P. Moyer<br>TPMoyer000@GMail.com");
		sbout.append(" &nbsp; &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp ");
		sbout.append("<a href=\"WebGLTutorial05?CullFace="+(cullFace?"false":"true")+"\">");
		sbout.append(" Tutorial05 with CullFace initially "+(cullFace?"false":"true")+"</a>");
		sbout.append("</div>");
		//logger.info("final sbout=\n"+sbout);
		return (sbout);
	}
	public StringBuilder GetWebGLTutorial06(boolean cullFace,boolean tet2Icosa) {
		//logger.setLevel(Level.DEBUG);
		//logger.info("cme@ service GetWebGLTutorial06  with cullFace="+(cullFace?"true":"false"));
		StringBuilder sbout = new StringBuilder();
		sbout.append("<p "+(true==cullFace?"id=setCullFace":"")+"> <p>");
		sbout.append("<p "+(true==tet2Icosa?"id=setTet2Icosa":"")+"> <p>");
		sbout.append("<div id=tutorialEndings06 style=\"position:relative; top:-5px;\">");
		sbout.append("project is being developed by Thomas P. Moyer<br>TPMoyer000@GMail.com");
		sbout.append(" &nbsp; &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp ");
		sbout.append("<a href=\"WebGLTutorial06?CullFace="+(cullFace?"false":"true")+"\">");
		sbout.append(" Tutorial06 with CullFace initially "+(cullFace?"false":"true")+"</a>");
		sbout.append("</div>");
		//logger.info("final sbout=\n"+sbout);
		return (sbout);
	}
	public StringBuilder GetWebGLTutorial07(boolean cullFace) {
		//logger.setLevel(Level.DEBUG);
		//logger.info("cme@ service GetWebGLTutorial07  with cullFace="+(cullFace?"true":"false"));
		StringBuilder sbout = new StringBuilder();
		sbout.append("<p "+(true==cullFace?"id=setCullFace":"")+"> <p>");
		sbout.append("<div id=tutorialEndings07 style=\"position:relative; top:-5px;\">");
		sbout.append("project is being developed by Thomas P. Moyer<br>TPMoyer000@GMail.com");
		sbout.append(" &nbsp; &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp ");
		sbout.append("<a href=\"WebGLTutorial07?CullFace="+(cullFace?"false":"true")+"\">");
		sbout.append(" Tutorial07 with CullFace initially "+(cullFace?"false":"true")+"</a>");
		sbout.append("</div>");
		//logger.info("final sbout=\n"+sbout);
		return (sbout);
	}
	public StringBuilder GetWebGLTutorial08(boolean cullFace) {
		//logger.setLevel(Level.DEBUG);
		//logger.info("cme@ service GetWebGLTutorial08  with cullFace="+(cullFace?"true":"false"));
		StringBuilder sbout = new StringBuilder();
		sbout.append("<p "+(true==cullFace?"id=setCullFace":"")+"> <p>");
		sbout.append("<div id=tutorialEndings08 style=\"position:relative; top:-5px;\">");
		sbout.append("project is being developed by Thomas P. Moyer<br>TPMoyer000@GMail.com");
		sbout.append(" &nbsp; &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp ");
		sbout.append("<a href=\"WebGLTutorial08?CullFace="+(cullFace?"false":"true")+"\">");
		sbout.append(" Tutorial08 with CullFace initially "+(cullFace?"false":"true")+"</a>");
		sbout.append("</div>");
		//logger.info("final sbout=\n"+sbout);
		return (sbout);
	}
}