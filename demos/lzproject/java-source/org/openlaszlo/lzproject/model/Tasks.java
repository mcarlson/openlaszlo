/* J_LZ_COPYRIGHT_BEGIN *******************************************************
 * Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
 * Use is subject to license terms.                                            *
 * J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.lzproject.model;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Vector;

import org.apache.log4j.Logger;
import org.openlaszlo.lzproject.rest.RestServiceResult;

/**
 * Tasks class is used to read out all
 * the tasks from Derby.
 *
 * @author raju
 *
 */
public class Tasks extends PersistenceBaseClass {

    /**
     * The task list.
     */
    private Vector list = new Vector();

    /**
     * Log4J logger.
     */
    private Logger log = Logger.getLogger(Tasks.class);

    /**
     * Constructor for class Tasks.
     * @param path The real path to the WEB-INF folder.
     */
    public Tasks(String path) {
        super(path);
    }

    /**
     * Load the list of tasks.
     *
     * <p>
     * In case of failure the error is passed back contained in the
     * {@link RestServiceResult} returned.
     *
     * @param result
     *            The {@link RestServiceResult} which will contain the localized
     *            messages and SQL state.
     * @return The {@link RestServiceResult} containing the outcome of this
     *         operation.
     */
    public RestServiceResult load(RestServiceResult result) {
        Statement stmt;
        // Connect to Derby
        this.dbConnect();
        // Execute the SELECT query
        try {
            stmt = conn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
            ResultSet rs = null;
            rs = stmt.executeQuery("SELECT TASKS.ID, PROJECTS.NAME AS PROJECT_NAME, PROJECT_ID, TASKS.NAME, " +
                                   "TASKS.DESCRIPTION, DATE_CREATED, DEADLINE, FINISHED " +
                                   "FROM TASKS LEFT JOIN PROJECTS ON TASKS.PROJECT_ID=PROJECTS.ID " +
                                   "ORDER BY FINISHED, DEADLINE ASC");
            // Iterate through the resultset and create a task for each result
            while (rs.next()) {
                Task task = new Task(this.realPath);
                task.setTitle(rs.getString("NAME"));
                task.setDescription(rs.getString("DESCRIPTION"));
                task.setCreated(rs.getTimestamp("DATE_CREATED"));
                task.setDeadline(rs.getTimestamp("DEADLINE"));
                task.setId(rs.getInt("ID"));
                task.setProjectName(rs.getString("PROJECT_NAME"));
                task.setProjectId(rs.getInt("PROJECT_ID"));
                task.setFinished(rs.getInt("FINISHED"));
                list.add(task);
            }
        } catch (SQLException e) {
            // Generate a debug error message and add the error to the
            // result set.
            log.error("Error loading task list");
            log.error(e.getLocalizedMessage());
            log.error(e.getStackTrace());
        }

        if (this.conn != null) this.dbDisconnect();
        return result;
    }

    /**
     * Getter for task list.
     * @return The list of tasks as a {@link java.util.Vector}
     */
    public Vector getList() {
        return list;
    }

    /**
     * Setter for task list.
     * @param list The new list of tasks.
     */
    public void setList(Vector list) {
        this.list = list;
    }

}
