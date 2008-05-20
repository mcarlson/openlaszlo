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
 * Projects class is used to read out all
 * the projects from Derby.
 * 
 * @author raju
 *
 */
public class Projects extends PersistenceBaseClass {
    
    /**
     * List of projects.
     */
    private Vector list = new Vector();

    /**
     * Log4J logger
     */
    private Logger log = Logger.getLogger(Projects.class);
    
    /**
     * Constructor for class Projects.
     * 
     * @param path The path to the DERBY database files
     */
    public Projects(String path) {
        super(path);
    }

    /**
     * Load the complete lists of projects from the database.
     * 
     * @param result
     *        The empty RestServiceResult object.
     * @return A RestServiceResult object containing the i18n messages and status.
     * 
     * Loads the list of existing projects.
     */
    public RestServiceResult load(RestServiceResult result) {
        Statement stmt; 
        this.dbConnect();
        try {
            log.debug("Trying to load project list");
            stmt = conn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
            ResultSet rs = stmt.executeQuery("SELECT * FROM PROJECTS");
            // Itereate through the result set and add the projects to
            // the projects list
            while (rs.next()) {
                Project project = new Project(this.realPath);
                project.setName(rs.getString("NAME"));
                project.setDescription(rs.getString("DESCRIPTION"));
                project.setStarted(rs.getTimestamp("DATE_STARTED"));
                project.setId(rs.getInt("ID"));
                list.add(project);
                log.debug("Project '" + project.getName() + "' added to project list");
            }
            stmt.close();
        } catch (SQLException e) {
            // Generate a debug error message and add the error to the
            // result set.
            log.error("Error loading list of projects");
            log.error(e.getLocalizedMessage());
            log.error(e.getStackTrace());
            this.handleSQLError(e, result);
        }
        // If we are connected to Derby disconnect now
        if (this.conn != null) {
            this.dbDisconnect();
        }
        return result;
    }

    /**
     * Getter for vector containing projects.
     * @return
     */
    public Vector getList() {
        return list;
    }

    /**
     * Setter for project list.
     * @param list
     *        A vector containing the projects.
     */
    public void setList(Vector list) {
        this.list = list;
    }

}
