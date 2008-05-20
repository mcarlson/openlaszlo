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
 * Users class is used to read out all
 * the users from Derby.
 *
 * @author raju
 *
 */
public class Users extends PersistenceBaseClass {

    /**
     * The user list.
     */
    private Vector list = new Vector();

    /**
     * Log4J logger.
     */
    private Logger log = Logger.getLogger(Users.class);

    /**
     * Constructor for Users class.
     *
     * @param path
     *            The real path to the WEB-INF folder
     */
    public Users(String path) {
        super(path);
    }

    /**
     * Load the users in the database.
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
        this.dbConnect();
        try {
            stmt = conn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
            ResultSet rs = stmt.executeQuery("SELECT * FROM USERS ORDER BY LOGIN ASC");
            while (rs.next()) {
                User user = new User(this.realPath);
                user.setLogin(rs.getString("LOGIN"));
                user.setRealName(rs.getString("REAL_NAME"));
                user.setEmail(rs.getString("EMAIL"));
                user.setLastLogin(rs.getTimestamp("LAST_LOGIN"));
                user.setId(rs.getInt("ID"));
                list.add(user);
            }
        } catch (SQLException e) {
            // Generate a debug error message and add the error to the
            // result set.
            log.error("Error loading user list");
            log.error(e.getLocalizedMessage());
            log.error(e.getStackTrace());

        }
        if (this.conn != null) {
            this.dbDisconnect();
        }
        return result;
    }

    /**
     * Getter for user list.
     * @return The list of users.
     */
    public Vector getList() {
        return list;
    }

    /**
     * Setter for user list.
     * @param list The new user list.
     */
    public void setList(Vector list) {
        this.list = list;
    }

}
