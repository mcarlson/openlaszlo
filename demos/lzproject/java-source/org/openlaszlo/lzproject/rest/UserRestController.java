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
import org.openlaszlo.lzproject.model.Projects;
import org.openlaszlo.lzproject.model.Task;
import org.openlaszlo.lzproject.model.User;
import org.openlaszlo.lzproject.model.Users;


/**
 * Rest controller for all REST web service calls around users in LZTRack, using
 * /lzproject/rest/user/* for the servlet mapping.
 *
 * @author raju
 *
 * @web.servlet name = "UserRest" display-name = "REST web service for user
 *              data" load-on-startup = "1"
 * @web.servlet-mapping url-pattern = "/lzproject/rest/user/*"
 */
public class UserRestController extends BaseRestController {

    /**
     * Log4J logger.
     */
    protected Logger log = Logger.getLogger(UserRestController.class);

    /**
     * JSP page used for all respones.
     */
    private final static String USER_RESPONSE_JSP = Common.LZPROJECTROOT + "/lzproject/webservice/UserDefaultResponse.jsp";

    /**
     * JSP page used for listing users.
     */
    private final static String USER_LIST_ALL = Common.LZPROJECTROOT + "/lzproject/webservice/UserList.jsp";

    /**
     * Handle a HTTP GET request to the task REST service.
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
     * Handle a HTTP POST request to the user REST service.
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
     */
    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        this.realPath = this.getServletContext().getRealPath(Common.DERBYROOT + "/");
        // Extract the command from the servlet path
        String command = this.getRestMethod(request.getRequestURI(), request.getContextPath(), "user");
        request.setAttribute("command", command);

        // Get the HTTP session object
        HttpSession session = request.getSession();

        // Result object used for passing values and messages to the JSP
        RestServiceResult result = new RestServiceResult();
        User user = new User(this.realPath);

        // The dispatcher to be used for directing to the right response page
        RequestDispatcher dispatcher = null;

        // Load the message bundle for this locale task object
        user.setBundle(this.loadResourceBundle(request));
        // Default error response, in case the REST method is not known

        // Default error response, in case the REST method is not known
        Object[] args = { command };
        result.setMessage(MessageFormat.format(user.getBundle().getString("rest.unkownMethod"), args));

        // Check for all known commands
        if (command.equals("login")) {
            // Remove user object from session
            session.removeAttribute("user");
            // Start the login process
            log.debug("User login: " + request.getParameter("login"));
            log.debug("User password: " + request.getParameter("password"));
            user.setLogin((String) request.getParameter("login"));
            if (request.getParameter("password") != null) {
                user.setPassword((String) request.getParameter("password"));
            } else {
                // To avoid null reference problems set a dummy password
                user.setPassword("");
            }
            result = user.login(session, result);
            dispatcher = getServletContext().getRequestDispatcher(USER_RESPONSE_JSP);
        } else if (command.equals("logout")) {
            // Start the logout process
            if (session.getAttribute("user") != null) {
                user = (User) session.getAttribute("user");
            }
            result = user.logout(session, result);
            if (!result.isError()) {
                dispatcher = getServletContext().getRequestDispatcher(USER_RESPONSE_JSP);
            }
        } else if (command.equals("create")) {
            // Create new user
            user.setLogin((String) request.getParameter("login"));
            log.debug("User login: " + user.getLogin());
            user.setRealName((String) request.getParameter("realname"));
            log.debug("User real name: " + user.getRealName());
            user.setPassword((String) request.getParameter("password"));
            log.debug("User password: " + user.getPassword());
            user.setEmail(request.getParameter("email"));
            result = user.create(result);
            dispatcher = getServletContext().getRequestDispatcher(USER_RESPONSE_JSP);
        } else if (command.equals("list")) {
            Users users = new Users(realPath);
            result = users.load(result);
            request.setAttribute("users", users);
            if (! result.isError()) {
                dispatcher = getServletContext().getRequestDispatcher(USER_LIST_ALL);
            }
        } else if (command.equals("update")) {
            // Update data for existing user
            try {
                user.setId(Integer.parseInt(request.getParameter("id")));
                user.setLogin((String) request.getParameter("login"));
                log.debug("User login: " + user.getLogin());
                user.setRealName((String) request.getParameter("realname"));
                log.debug("User real name: " + user.getRealName());
                user.setPassword((String) request.getParameter("password"));
                log.debug("User password: " + user.getPassword());
                user.setEmail(request.getParameter("email"));
                result = user.update(result);
                dispatcher = getServletContext().getRequestDispatcher(USER_RESPONSE_JSP);
            } catch (NumberFormatException e) {
                result.setError(true);
                log.warn("ID is not a number");
            }
        } else if (command.equals("delete")) {
            // Delete user
            user.setLogin((String) request.getParameter("login"));
            log.debug("User login: " + user.getLogin());
            user.deleteByLogin(result);
            dispatcher = getServletContext().getRequestDispatcher(USER_RESPONSE_JSP);
        }

        // If we don't have a dispatcher yet, we have an error
        if (dispatcher == null) {
            result.setError(true);
            dispatcher = getServletContext().getRequestDispatcher(USER_RESPONSE_JSP);
        }

        // Add the RestResult to the request
        request.setAttribute("result", result);
        // Forward to the response JSP generating the XML
        dispatcher.forward(request, response);
    }

}
