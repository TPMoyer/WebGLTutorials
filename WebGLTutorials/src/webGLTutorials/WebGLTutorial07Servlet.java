package webGLTutorials;
/*   © 2013 Thomas P Moyer  */ 

import java.io.IOException;
import java.util.Enumeration;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


//import org.apache.log4j.Level;
import org.apache.log4j.Logger;

public class WebGLTutorial07Servlet  extends HttpServlet {
    private static final String primaryOutputJSP = "/webGLTutorial07.jsp";
    private static transient Logger logger = Logger.getLogger(WebGLTutorial07Servlet.class);
    private static final long serialVersionUID = 1L;

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse rsp)
    throws ServletException, java.io.IOException {
        //Treat gets and posts as the same
         doPost(req, rsp);
    }
    @Override
    public void doPost(HttpServletRequest req, HttpServletResponse resp)
    throws ServletException, IOException {
        //logger.setLevel(Level.DEBUG);
        //logger.info("\ncme@ webGLTutorial07Servlet.java doPost");
        StringBuilder result_html      = new StringBuilder();

        @SuppressWarnings("rawtypes")
        Map paramMap = req.getParameterMap();
        //logger.info("paramMap has "+paramMap.size()+" values");
        //if(0<paramMap.size())logger.info("URL params are:\n"+req.getQueryString());

        int numHandeled=0;
        boolean cullFace=true;
        String key= "CullFace";
        if(paramMap.containsKey(key)){
            numHandeled++;
            String[] paramValues = req.getParameterValues(key);
            if(0<paramValues.length){
        		cullFace=(0==paramValues[0].compareToIgnoreCase("true"))?true:false;
            }
        }
        boolean ajaxLogging=false;
        key= "2log";
        if(paramMap.containsKey(key)){
            numHandeled++;
            String[] paramValues = req.getParameterValues(key);
            //int counter=0;
            for(String s:paramValues){
        		//logger.info(String.format("%2d %s",counter++,s));
        		logger.info(s);
            }
            ajaxLogging=true;
        }
        if(0==paramMap.size()){
            //logger.info("no params");
        }
        else if(paramMap.size()==numHandeled){
            //logger.info("all params taken in well");
        }
        else{
            @SuppressWarnings("unchecked")Enumeration<String> paramNames = req.getParameterNames();
            logger.info("paramMap.size()="+paramMap.size()+" vs numHandeled="+numHandeled);
            logger.info("query included unhandeled params.  Full listing of params is:\n");
            logger.info("param value                           name ");
            logger.info("index index paramame                 length   Value");
            int counter=0;
            while (paramNames.hasMoreElements()){
            String paramName = paramNames.nextElement();
            String[] paramValues = req.getParameterValues(paramName);

            for(int ii=0;ii<paramValues.length;ii++){
                logger.info(String.format(" %2d    %2d   %-24s   %2d     %-16s",counter,ii,paramName,paramName.length(),paramValues[ii]));
                }
                counter++;
            }
        }
		if(false==ajaxLogging){
	        WebGLTutorialsService wgls = new WebGLTutorialsService();
	        /* 	Normal usage would call a function in the service paired with this servelet. Minimum confusion
	         * suggests it would have been named WebGLTutorial04Service.java
	         *  This tutorial uses WebGLTurorialService.java as a shared location for the minimal processing
	         * used by the several tutorials.
	         * 	The faster java code is the appropriate means for extensive calculations,
	         * for accessing large relational databases, or for creating tricky large lists of id encrypted
	         * <div> elements.
	         *   Putting the cullface processing java was done in order to demo how html can be sourced within java.
	         */
	        result_html.append(wgls.GetWebGLTutorial07(cullFace)); /* would call a function in the serrice, but am not adding anything myself */
	        //logger.debug("as recieved: result_html=\n"+result_html);
	//      req.setAttribute("form_html",form_html);
	        req.setAttribute("result_html",result_html);
	        getServletContext().getRequestDispatcher(primaryOutputJSP).forward(req, resp);
		}
    }
}
