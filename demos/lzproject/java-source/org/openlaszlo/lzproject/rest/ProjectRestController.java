/* J_LZ_COPYRIGHT_BEGIN *******************************************************
 * Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
 * Use is subject to license terms.                                            *
 * J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.lzproject.rest;

import java.io.IOException;
import java.text.MessageFormat;


import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.openlaszlo.lzproject.Common;
import org.openlaszlo.lzproject.model.Project;
import org.openlaszlo.lzproject.model.Projects;


/**
 * Rest controller for all REST web service calls around
 * projects in LZTRack, using /lzproject/rest/project/* for the
 * servlet mapping.
 * 
 * @author raju
 * 
 * @web.servlet name = "ProjectRestController"
 *              display-name = "REST web service for user data"
 *              load-on-startup = "1"
 * @web.servlet-mapping url-pattern = "/lzproject/rest/project/*"
 */
public class ProjectRestController extends BaseRestController {
    
    /**
     * Log4J logger.
     */
    protected Logger log = Logger.getLogger(ProjectRestController.class);
    
    /**
     * JSP page used for all successful REST service calls.
     */
    private final static String PROJECT_RESPONSE_JSP = Common.LZPROJECTROOT + "/lzproject/webservice/ProjectDefaultResponse.jsp";
    
    /**
     * JSP page for the generation of the project list.
     */
    private final static String PROJECT_LIST_ALL = Common.LZPROJECTROOT + "/lzproject/webservice/ProjectList.jsp";
    
    /**
     * Handle a HTTP GET request to the project REST service.
     * 
     * <p>
     * LZProject sends all the data through HTTP posts as it is the only safe way
     * to send unicode to the server; the forwarding of the request
     * {@link #doPost} to is only done to make testing of the web service
     * easier. Loot at {@link #doPost} for the processing of the REST request.
     * 
     * 
     * @param request
     *            an {@link HttpServletRequest} object that contains the request
     *            the client has made of the servlet
     * 
     * @param response
     *            an {@link HttpServletResponse} object that contains the
     *            response the servlet sends to the client
     * 
     * @exception IOException
     *                if an input or output error is detected when the servlet
     *                handles the GET request
     * 
     * @exception ServletException
     *                if the request for the GET could not be handled
     * 
     */
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        this.doPost(request, response);
    }
    
    /**
     * Handle a HTTP POST request to the project REST service.
     * 
     * <p>
     * LZProject sends all the data through HTTP posts as it is the only safe way
     * to send unicode to the server.
     * 
     * @param request
     *            an {@link HttpServletRequest} object that contains the request
     *            the client has made of the servlet
     * 
     * @param response
     *            an {@link HttpServletResponse} object that contains the
     *            response the servlet sends to the client
     * 
     * @exception IOException
     *                if an input or output error is detected when the servlet
     *                handles the GET request
     * 
     * @exception ServletException
     *                if the request for the GET could not be handled
     * 
     */ public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        this.realPath = this.getServletContext().getRealPath(Common.DERBYROOT + "/");
        // Extract the command from the servlet path
        String command = this.getRestMethod(request.getRequestURI(), request.getContextPath(), "project");
        request.setAttribute("command", command);
        
        // Result object used for passing values and messages to the JSP
        RestServiceResult result = new RestServiceResult();
        Project project = new Project(this.realPath);
        
        // The dispatcher to be used for directing to the right response page
        RequestDispatcher dispatcher = null;
        
        // Load the message bundle for this locale and pass it to the project
        project.setBundle(this.loadResourceBundle(request));
        
        // Default error response, in case the REST method is not known
        Object[] args = { command };
        result.setMessage(MessageFormat.format(project.getBundle().getString("rest.unkownMethod"), args));

        if (request.getParameter("id") != null) {
            try { 
                project.setId(Integer.parseInt(request.getParameter("id")));
                log.debug("Project id passed to REST service: " + project.getId());
            } catch (NumberFormatException e) {
                project.setId(-1);
                log.warn("Project ID past to REST service is not a number");
            }           
        }
        // Check for all known commands
        if  (command.equals("create")) {
            // Now execute the method for the corresponding REST call
            project.setName((String) request.getParameter("name"));
            log.debug("Project name: " + project.getName());
            project.setDescription((String) request.getParameter("description"));
            log.debug("Project description: " + project.getDescription());
            result = project.create(result);        
            if (!result.isError()) {
                dispatcher = getServletContext().getRequestDispatcher(PROJECT_RESPONSE_JSP);
            }
        } else if (command.equals("list")) {
            Projects projects = new Projects(realPath);
            request.setAttribute("projects", projects);
            result = projects.load(result);
            if (!result.isError()) {
                dispatcher = getServletContext().getRequestDispatcher(PROJECT_LIST_ALL);
            }
        } else if (command.equals("delete") && project.getId() != -1) {
            // Now execute the method for the corresponding REST call
            project.deleteById(result); 
            dispatcher = getServletContext().getRequestDispatcher(PROJECT_RESPONSE_JSP);
        }
        
        // If we don't have a dispatcher yet, we have an error
        if (dispatcher == null) {
            result.setError(true);
            dispatcher = getServletContext().getRequestDispatcher(PROJECT_RESPONSE_JSP);
        }
        
        // Add the RestResult to the request
        request.setAttribute("result", result);
        // Forward to the response JSP generating the XML
        dispatcher.forward(request, response);
    }

}
