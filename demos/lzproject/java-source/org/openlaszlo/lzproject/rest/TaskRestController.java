/* J_LZ_COPYRIGHT_BEGIN *******************************************************
 * Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
 * Use is subject to license terms.                                            *
 * J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.lzproject.rest;

import java.io.IOException;
import java.text.MessageFormat;
import java.util.Date;


import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.openlaszlo.lzproject.Common;
import org.openlaszlo.lzproject.model.Task;
import org.openlaszlo.lzproject.model.Tasks;

/**
 * Rest controller for all REST web service calls around
 * tasks in LZTRack, using /lzproject/rest/task/* for the
 * servlet mapping.
 *
 * @author raju
 *
 * @web.servlet name = "TaskRestController" display-name = "REST web service for
 *              user data" load-on-startup = "1"
 * @web.servlet-mapping url-pattern = "/lzproject/rest/task/*"
 */
public class TaskRestController extends BaseRestController {
    /**
     * Log4J logger
     */
    protected Logger log = Logger.getLogger(TaskRestController.class);

    /**
     * JSP page used for all respones.
     */
    private final static String TASK_RESPONSE_JSP = Common.LZPROJECTROOT + "/lzproject/webservice/TaskDefaultResponse.jsp";

    /**
     * JSP page used for the task list.
     */
    private final static String TASK_LIST_ALL = Common.LZPROJECTROOT + "/lzproject/webservice/TaskList.jsp";

    /**
     * Handle a HTTP GET request to the task REST service.
     *
     * <p>
     * LZProject sends all the data through HTTP posts as it is the only safe way
     * to send unicode to the server; the forwarding of the request to
     * {@link #doPost} is only done to make testing of the web service
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
     * Handle a HTTP POST request to the task REST service.
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
        String command = this.getRestMethod(request.getRequestURI(), request
                .getContextPath(), "task");
        request.setAttribute("command", command);

        // Result object used for passing values and messages to the JSP
        RestServiceResult result = new RestServiceResult();
        Task task = new Task(this.realPath);

        // The dispatcher to be used for directing to the right response page
        RequestDispatcher dispatcher = null;

        // Load the message bundle for this locale task object
        task.setBundle(this.loadResourceBundle(request));

        // Default error response, in case the REST method is not known
        Object[] args = { command };
        result.setMessage(MessageFormat.format(task.getBundle().getString(
                "rest.unkownMethod"), args));

        if (request.getParameter("id") != null) {
            try {
                task.setId(Integer.parseInt(request.getParameter("id")));
                log.debug("Task id passed to REST service: " + task.getId());
            } catch (NumberFormatException e) {
                task.setId(-1);
                log.warn("Task ID past to REST service is not a number");
                result.setError(true);
                result
                        .setMessage("Task ID past to REST service is not a number");
            }
        }
        // Check for all known commands
        if (command.equals("create")) {
            // Now execute the method for the corresponding REST call
            task.setTitle((String) request.getParameter("title"));
            log.debug("Task name: " + task.getTitle());
            task.setDescription((String) request.getParameter("description"));
            log.debug("Task description: " + task.getDescription());
            try {
                task.setProjectId(Integer.parseInt(request
                        .getParameter("projectId")));
                log.debug("Task projectId: " + task.getProjectId());

                long millis = Long.parseLong((String) request
                        .getParameter("deadline"));
                task.setDeadline(new Date(millis));
                log.debug("Task deadline: " + task.getDeadline());
                result = task.create(result);
            } catch (NumberFormatException e) {
                log.debug("Number format exception for projectId or deadline");
                result.setError(true);
                result.setMessage(task.getBundle().getString(
                        "task.create.invalidProjectIdOrDeadline"));
            }
            if (!result.isError()) {
                dispatcher = getServletContext().getRequestDispatcher(TASK_RESPONSE_JSP);
            }
        } else if (command.equals("list")) {
            Tasks tasks = new Tasks(realPath);
            request.setAttribute("tasks", tasks);
            result = tasks.load(result);
            if (!result.isError()) {
                dispatcher = getServletContext().getRequestDispatcher(
                        TaskRestController.TASK_LIST_ALL);
            }
        } else if (command.equals("markAsFinished") && task.getId() != -1) {
            result = task.markAsFinished(result);
            if (!result.isError()) {
                dispatcher = getServletContext().getRequestDispatcher(TASK_RESPONSE_JSP);
            }
        } else if (command.equals("delete") && task.getId() != -1) {
            // Now execute the method for the corresponding REST call
            result = task.deleteById(result);
            if (!result.isError()) {
                dispatcher = getServletContext().getRequestDispatcher(TASK_RESPONSE_JSP);
            }
        }

        // If we don't have a dispatcher yet, we have an error
        if (dispatcher == null) {
            result.setError(true);
            dispatcher = getServletContext().getRequestDispatcher(TASK_RESPONSE_JSP);
        }

        // Add the RestResult to the request
        request.setAttribute("result", result);
        // Forward to the response JSP generating the XML
        dispatcher.forward(request, response);
    }

}
