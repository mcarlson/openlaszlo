/* J_LZ_COPYRIGHT_BEGIN *******************************************************
 * Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
 * Use is subject to license terms.                                            *
 * J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.lzproject.rest;

import java.io.IOException;
import java.text.MessageFormat;
import java.util.Locale;
import java.util.ResourceBundle;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

import org.openlaszlo.lzproject.Common;

/**
 * @author raju
 *
 * @web.servlet name = "ApplicationXMLRest"
 *              display-name = "REST web service for application i18n"
 *              load-on-startup = "1"
 * @web.servlet-mapping url-pattern = "/lzproject/rest/application/*"
 */
public class ApplicationI18NController extends BaseRestController {

    /**
     * Log4J logger.
     */
    protected Logger log = Logger.getLogger(ApplicationI18NController.class);

    /**
     * The JSP containing the localized strings for LZProject.
     */
    private final static String APPLICATION_XML_JSP = Common.LZPROJECTROOT + "/lzproject/webservice/ApplicationXML.jsp";

    /**
     * Pass the request to the localization file to the ApplicationXML.jsp
     *
     * <p>
     * As there's no data being passed to this REST controller
     * it's safe to use HTTP GET here.
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
        // Just make this call to get the debug output from the ProjectBaseController
        // logging the REST command
        if (log.isDebugEnabled()) {
            this.getRestMethod(request.getRequestURI(), request.getContextPath(), "project");
        }

        // Forward to the corresponding JSP
        RequestDispatcher dispatcher = getServletContext().getRequestDispatcher(APPLICATION_XML_JSP);
        log.debug("Forwarding to " + APPLICATION_XML_JSP);
        dispatcher.forward(request, response);
    }

}
