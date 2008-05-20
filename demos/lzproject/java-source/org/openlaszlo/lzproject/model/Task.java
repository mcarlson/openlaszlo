/* J_LZ_COPYRIGHT_BEGIN *******************************************************
 * Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
 * Use is subject to license terms.                                            *
 * J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.lzproject.model;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.MessageFormat;
import java.util.Date;

import org.apache.log4j.Logger;
import org.openlaszlo.lzproject.rest.RestServiceResult;

/**
 * Class Task is the representation of a task in
 * the model.
 *
 * @author raju
 *
 */
public class Task extends PersistenceBaseClass {

    /**
     * The task's id, primary key in the Derby DB table.
     */
    private int id;

    /**
     * The id of the project that this tasks belongs to.
     */
    private int projectId;

    /**
     * The title of this task.
     */
    private String title;

    /**
     * The descriptive text.
     */
    private String description;

    /**
     * The name of the project that this task belongs to.
     */
    private String projectName;

    /**
     * Log4J logger.
     */
    private Logger logger = Logger.getLogger(Task.class);

    /**
     * Creation date.
     */
    private Date created;

    /**
     * Deadline for this task.
     */
    private Date deadline;

    /**
     * Marker to show if this task is finished. Zero means
     * unfinished, 1 means finished.
     */
    private int finished;

    /**
     *  SQL query for inserting a new task.
     */
    private static final String INSERT_TASK_SQL = "INSERT INTO TASKS (PROJECT_ID, NAME, DESCRIPTION, DEADLINE) "
            + "VALUES (?,?,?,?)";

    /**
     * SQL query for deleting a task.
     */
    private static final String DELETE_BY_ID_SQL = "DELETE FROM TASKS WHERE ID=";

    /**
     * SQL query for marking a tasked as finished.
     */
    private static final String MARK_AS_FINISHED_SQL = "UPDATE TASKS SET FINISHED=1 WHERE ID=";

    /**
     * Constructor for the class Task.
     * @param path The real path to the WEB-INF folder.
     */
    public Task(String path) {
        super(path);
    }

    /**
     * Create a new task in the database.
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
    public RestServiceResult create(RestServiceResult result) {
        PreparedStatement stmt;
        logger.debug("Executing command Task.create()");
        if (description != null && title != null && description.length() > 0
                && title.length() > 0) {
            this.dbConnect();
            try {
                stmt = this.conn.prepareStatement(INSERT_TASK_SQL);
                stmt.setLong(1, this.projectId);
                stmt.setString(2, this.title);
                stmt.setString(3, this.description);
                stmt.setDate(4, new java.sql.Date(this.deadline.getTime()));
                stmt.executeUpdate();
                Object[] args = { this.title };
                result.setMessage(MessageFormat.format(bundle
                        .getString("task.create.success"), args));
            } catch (SQLException e) {
                // Generate a debug error message and add the error to the
                // result set.
                logger.error("Error creating task with name " + this.title);
                logger.error(e.getLocalizedMessage());
                logger.error(e.getStackTrace());
                this.handleSQLError(e, result);
            }
            if (this.conn != null)
                this.dbDisconnect();
        } else {
            result.setError(true);
            result.setMessage(bundle.getString("task.create.missingParameters"));
        }
        return result;
    }

    /**
     * Delete a task based on the id in the database.
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
    public RestServiceResult deleteById(RestServiceResult result) {
        Statement stmt = null;
        logger.debug("Executing command Task.deleteById()");
        if (this.id > 0) {
            this.dbConnect();
            try {
                stmt = conn.createStatement(ResultSet.TYPE_FORWARD_ONLY,
                        ResultSet.CONCUR_READ_ONLY);
                int lines = stmt.executeUpdate(DELETE_BY_ID_SQL + this.id);
                stmt.close();
                logger.debug(lines + " rows have been deleted");
            if (lines == 0) {
                Object[] args = { new Integer(this.id) };
                result.setMessage(MessageFormat.format(bundle
                        .getString("task.unknownTaskId"), args));
            } else {
                Object[] args = { new Integer(this.id) };
                result.setMessage(MessageFormat.format(bundle
                        .getString("task.delete.success"), args));
            }

            } catch (SQLException e) {
                // Generate a debug error message and add the error to the
                // result set.
                logger.error("Error deleting task with ID " + this.id);
                logger.error(e.getLocalizedMessage());
                logger.error(e.getStackTrace());
                this.handleSQLError(e, result);
            }
            if (this.conn != null)
                this.dbDisconnect();
        } else {
            result.setError(true);
            result.setMessage(bundle.getString("task.delete.missingParameter"));
            logger.warn("Missing parameters! Called Task.delete() without specifiying the id!");
        }
        return result;
    }

    /**
     * Mark a task as finished.
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
    public RestServiceResult markAsFinished(RestServiceResult result) {
        Statement stmt = null;
        logger.debug("Executing command Task.markAsFinished()");
        if (this.id > 0) {
            this.dbConnect();
            try {
                stmt = this.conn.createStatement();
                logger.debug("ID to update: " + this.getId());
                int stmtResult = stmt.executeUpdate(MARK_AS_FINISHED_SQL
                        + this.id);
                logger.debug("PST result : " + stmtResult);
                stmt.close();
                if (stmtResult == 0) {
                    Object[] args = { new Integer(this.id) };
                    result.setMessage(MessageFormat.format(bundle
                            .getString("task.unknownTaskId"), args));
                } else {
                    Object[] args = { new Integer(this.id) };
                    result.setMessage(MessageFormat.format(bundle
                            .getString("task.markAsFinished.success"), args));
                }

            } catch (SQLException e) {
                // Generate a debug error message and add the error to the
                // result set.
                logger.error("Error marking task with ID " + this.id + " as finished");
                logger.error(e.getLocalizedMessage());
                logger.error(e.getStackTrace());
                this.handleSQLError(e, result);
            }
            if (this.conn != null) {
                this.dbDisconnect();
            }
        } else {
            result.setMessage(bundle.getString("task.delete.missingParameter"));
            logger.warn("Missing parameters! Called Task.markAsFinished() without specifiying the id!");
        }
        return result;
    }

    /**
     * Getter for task id.
     * @return
     */
    public int getId() {
        return id;
    }

    /**
     * Setter for task id.
     * @param id The new id.
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * Getter for task title.
     * @return The title.
     */
    public String getTitle() {
        return title;
    }

    /**
     * Setter for task title.
     * @param name The new title.
     */
    public void setTitle(String title) {
        if (title != null) {
            title = title.trim();
        }
        this.title = title;
    }

    /**
     * Getter for creation date.
     * @return The creation date.
     */
    public Date getCreated() {
        return created;
    }

    /**
     * Setter for creation date.
     * @param created The new creation date.
     */
    public void setCreated(Date created) {
        this.created = created;
    }

    /**
     * Getter for task description.
     * @return
     */
    public String getDescription() {
        return description;
    }

    /**
     * Setter for task description.
     * @param description The new description.
     */
    public void setDescription(String description) {
        if (description != null) {
            description = description.trim();
        }
        this.description = description;
    }

    /**
     * Getter for deadline.
     * @return The deadline.
     */
    public Date getDeadline() {
        return deadline;
    }

    /**
     * Setter for the deadline.
     * @param deadline The new deadline.
     */
    public void setDeadline(Date deadline) {
        this.deadline = deadline;
    }

    /**
     * Getter for project id.
     * @return The project id.
     */
    public int getProjectId() {
        return projectId;
    }

    /**
     * Setter for project id.
     * @param projectId The new project id.
     */
    public void setProjectId(int projectId) {
        this.projectId = projectId;
    }

    /**
     * Getter for project name.
     * @return The project name.
     */
    public String getProjectName() {
        return projectName;
    }

    /**
     * Setter for project name.
     * @param projectName The new project name.
     */
    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    /**
     * Getter for finished marker.
     * @return The finished marker.
     */
    public int getFinished() {
        return finished;
    }

    /**
     * Setter for finshed marker.
     * @param finished The new value.
     */
    public void setFinished(int finished) {
        this.finished = finished;
    }

}
