/* J_LZ_COPYRIGHT_BEGIN *******************************************************
 * Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
 * Use is subject to license terms.                                            *
 * J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.lzproject.model;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.ResourceBundle;

import org.apache.log4j.Logger;
import org.openlaszlo.lzproject.rest.RestServiceResult;

/**
 * Base class for managing the connection to the Apache Derby database. All the
 * classes in the model extends PersistenceBase Class.
 *
 * @author raju
 *
 */
public class PersistenceBaseClass {

    /**
     * Log4J logger
     */
    private Logger logger = Logger.getLogger(PersistenceBaseClass.class);

    /**
     * JDBC connection for SQL queries.
     */
    protected Connection conn = null;

    /**
     * The name of the Derby database.
     */
    protected String dbName = "lzprojectdb";

    /**
     * The real path is used in the process of loading the Derby database.
     */
    protected String realPath = null;

    /**
     * The resource bundle used for localized messages.
     */
    protected ResourceBundle bundle = null;

    /**
     * Default constructor for PersistenceBaseClass.
     */
    public PersistenceBaseClass() {
    }

    /**
     * Constructor for PersistenceBaseClass.
     *
     * @param path
     *            Path to the parent directory of the Derby database.
     */
    public PersistenceBaseClass(String path) {
        this.realPath = path;
    }

    /**
     * Connect to Derby database. The Derby DB files are located in
     * WEB-INF/lzprojectdb/ folder. This pass is used in the call to
     * {@link java.sql.DriverManager#getConnection}.
     *
     */
    protected boolean dbConnect() {
        String dbPath = this.realPath + "/" + this.dbName;
        boolean connected = true;
        try {
            logger.debug("Loading Derby embedded driver");
            Class.forName("org.apache.derby.jdbc.EmbeddedDriver");
            conn = DriverManager.getConnection("jdbc:derby:" + dbPath);
            conn.setAutoCommit(true);
            logger.info("Connection to Derby established");
        } catch (Exception e) {
            logger.error("Error loading Derby DB " + this.dbName
                    + " from path " + dbPath + "!");
            logger.error(e.getLocalizedMessage());
            connected = false;
        }
        return connected;
    }

    /**
     * Disconnect from the Derby DB.
     *
     */
    protected void dbDisconnect() {
        try {
            conn.close();
            logger.debug("Connection to Derby closed");

        } catch (Exception e) {
            logger.error("Error closing connection to Derby");
            logger.error(e.getLocalizedMessage());
        }
    }

    /**
     * Adds the localized error message and the SQL state to the
     * {@link RestServiceResult} object.
     *
     * @param e
     *            The SQL exception.
     * @param result
     *            REST service result object.
     * @return The REST service result object containing the SQL state and a
     *         localized message.
     */
    protected RestServiceResult handleSQLError(SQLException e,
            RestServiceResult result) {
        String sqlState = e.getSQLState();
        logger.error(e.getLocalizedMessage());
        logger.error("SQLState: " + sqlState);
        result.setSqlState(sqlState);
        result.setMessage(e.getLocalizedMessage());
        result.setError(true);
        return result;
    }

    /**
     * Getter for the resource bundle
     *
     * @return
     */
    public ResourceBundle getBundle() {
        return bundle;
    }

    /**
     * Setter for the resource bundle
     *
     * @param bundle
     *            The resource bundle.
     */
    public void setBundle(ResourceBundle bundle) {
        this.bundle = bundle;
    }

}
