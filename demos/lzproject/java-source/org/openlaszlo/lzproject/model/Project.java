/* J_LZ_COPYRIGHT_BEGIN *******************************************************
 * Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
 * Use is subject to license terms.                                            *
 * J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.lzproject.model;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.MessageFormat;
import java.util.Calendar;
import java.util.Date;

import org.apache.log4j.Logger;
import org.openlaszlo.lzproject.rest.RestServiceResult;

/**
 * The class representing a project in our model.
 * 
 * <p>
 * This class handles the creation and deletion of projects.
 * 
 * @author raju
 * 
 */
public class Project extends PersistenceBaseClass {

    /**
     * The project id, the primary key in the DB table
     */
    private int id;

    /**
     * The name for this project
     */
    private String name;

    /**
     * A description of the project
     */
    private String description;

    /**
     * Log4j log
     */
    private Logger log = Logger.getLogger(Project.class);

    /**
     * The start date for this project.
     */
    private Date started;

    /**
     * Constructor for the Project class.
     * 
     * @param path
     *            The path to the WEB-INF folder
     */
    public Project(String path) {
        super(path);
    }

    /**
     * The number of days that this project has been running
     */
    int daysRunning = 0;

    /**
     * Create a new project in the database.
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
        Statement stmt;
        log.debug("Executing command Project.create()");
        if (description != null && name != null && description.length() > 0
                && name.length() > 0) {
            this.dbConnect();
            try {
                stmt = conn.createStatement(ResultSet.TYPE_FORWARD_ONLY,
                        ResultSet.CONCUR_READ_ONLY);
                stmt
                        .executeUpdate("INSERT INTO PROJECTS (NAME, DESCRIPTION, DATE_STARTED) "
                                + "VALUES ('"
                                + this.name
                                + "','"
                                + this.description + "', CURRENT_TIMESTAMP)");

                // Now load the created project to retrieve the ID
                ResultSet rs = stmt
                        .executeQuery("SELECT * FROM PROJECTS WHERE NAME='"
                                + this.getName() + "'");
                if (rs.next()) {
                    this.id = rs.getInt("ID");
                }
                stmt.close();
                Object[] args = { this.name, new Integer(this.id) };
                result.setMessage(MessageFormat.format(bundle
                        .getString("project.create.success"), args));
            } catch (SQLException e) {
                // 23505 is the state returned for duplicate keys
                if (result.getSqlState().equals("23505")) {
                    Object[] args = { this.name };
                    result.setMessage(MessageFormat.format(bundle
                            .getString("project.create.alreadyExists"), args));
                    log.warn(result.getMessage());
                } else {
                    // Add the SQLException information to the RestServiceResult
                    this.handleSQLError(e, result);
                }
            }
            if (this.conn != null) {
                this.dbDisconnect();
            }
        } else {
            // There are parameters missing, project cannot be created
            result.setError(true);
            result.setMessage(bundle
                    .getString("project.create.missingParameters"));
        }
        return result;
    }

    /**
     * Delete a project based on it's ID in the database.
     * 
     * <p>
     * In case of failure the error is passed back contained in the
     * {@link RestServiceResult} returned.
     * 
     * @param result
     * @return The RestServiceResult containing the result.
     */
    public RestServiceResult deleteById(RestServiceResult result) {
        Statement stmt;
        log.debug("Executing command Project.deleteById()");
        if (this.id > 0) {
            this.dbConnect();
            try {
                stmt = conn.createStatement(ResultSet.TYPE_FORWARD_ONLY,
                        ResultSet.CONCUR_READ_ONLY);
                int lines = stmt.executeUpdate("DELETE FROM PROJECTS WHERE ID="
                        + this.id);
                stmt.close();
                if (lines == 0) {
                    Object[] args = { new Integer(this.id) };
                    result.setMessage(MessageFormat.format(bundle
                            .getString("project.unknownProjectId"), args));
                } else {
                    Object[] args = { new Integer(this.id) };
                    result.setMessage(MessageFormat.format(bundle
                            .getString("project.delete.success"), args));
                }

            } catch (SQLException e) {
                this.handleSQLError(e, result);
            }
            if (this.conn != null)
                this.dbDisconnect();
        } else {
            result.setMessage(bundle.getString("user.delete.missingParameter"));
            log.warn(result.getMessage());
        }
        return result;
    }

    /**
     * Getter for id field.
     * 
     * @return The project id.
     */
    public int getId() {
        return id;
    }

    /**
     * Setter for id field.
     * 
     * @param id
     *            The new id value.
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * Getter for name fied.
     * 
     * @return The project's name.
     */
    public String getName() {
        return name;
    }

    /**
     * Setter for name field.
     * 
     * @param name
     *            The new name.
     */
    public void setName(String name) {
        if (name != null) {
            name = name.trim();
        }
        this.name = name;
    }

    /**
     * Getter for start date of this project.
     * 
     * @return The start date.
     */
    public Date getStarted() {
        return started;
    }

    /**
     * Setter for the start date.
     * 
     * @param started
     *            The new start date.
     */
    public void setStarted(Date started) {
        this.started = started;
    }

    /**
     * Getter for project description.
     * 
     * @return The description.
     */
    public String getDescription() {
        return description;
    }

    /**
     * Setter for the description.
     * 
     * @param description
     *            The new description.
     */
    public void setDescription(String description) {
        if (description != null) {
            description = description.trim();
        }
        this.description = description;
    }

    /**
     * Calculates the number of days that this project has been running.
     * 
     * @return The number of days the project has been running.
     */
    public int getDaysRunning() {
        Calendar cal = Calendar.getInstance();
        // Set the current time
        cal.setTime(new Date());
        // Get the time in millis
        long currentTime = cal.getTimeInMillis();
        cal.clear();
        cal.setTime(this.started);
        long started = cal.getTimeInMillis();
        // Return the difference between both values measured in days
        return (int) ((currentTime - started) / (1000.0 * 60.0 * 1440));
    }

}
