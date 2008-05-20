/* J_LZ_COPYRIGHT_BEGIN *******************************************************
 * Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
 * Use is subject to license terms.                                            *
 * J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.lzproject.model;

import java.io.Serializable;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.MessageFormat;
import java.util.Date;

import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.openlaszlo.lzproject.rest.RestServiceResult;

/**
 * Class User is the representation of a user in
 * the model.
 *
 * @author raju
 *
 */
public class User extends PersistenceBaseClass implements Serializable {

    
    /**
     * serialVersionUID used for serialization.
     */
    private static final long serialVersionUID = 0L;

    /**
     * The user id, the primary key value in the DB table.
     */
    private int id;

    /**
     * User's real name.
     */
    private String realName;

    /**
     * The login or user name.
     */
    private String login;

    /**
     * The email.
     */
    private String email;

    /**
     * Log4J logger.
     */
    private transient Logger log = Logger.getLogger(User.class);

    /**
     * MD5 hash of the user's password.
     */
    private String password;

    /**
     * Last login date and time.
     */
    private Date lastLogin;

    /**
     * Defaul constructor for User class.
     */
    public User() {
        this.log = Logger.getLogger(User.class);
    }

    /**
     * Constructor for User class.
     * @param path The real path to the WEB-INF folder.
     */
    public User(String path) {
        super(path);
    }

    /**
     * Create a new user in the database.
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
        log.debug("Executing command User.create()");
        if (login != null && realName != null && login.length()> 0 && realName.length() > 0
            && email != null && email.length() > 0) {
            if (!this.dbConnect()) {
                result.setError(true);
                result.setMessage(bundle.getString("database.connectError"));
                return result;
            }
            try {
                stmt = conn.createStatement(ResultSet.TYPE_FORWARD_ONLY, ResultSet.CONCUR_READ_ONLY);
                stmt.executeUpdate("INSERT INTO USERS (LOGIN, REAL_NAME, PASS, EMAIL, LAST_LOGIN) "
                                + "VALUES ('" + this.login + "','"
                                + this.realName + "','" + this.password + "', '" + this.email + "', CURRENT_TIMESTAMP)");
                stmt.close();
                Object[] args = { this.realName, this.login };
                result.setMessage(MessageFormat.format(bundle.getString("user.create.success"), args));
            } catch (SQLException e) {
                // 23505: unique key violation
                if (result.getSqlState().equals("23505")) {
                    Object[] args = { this.login };
                    result.setMessage(MessageFormat.format(bundle.getString("user.create.userAlreadyExists"), args));
                } else {
                    // Generate a debug error message and add the error to the
                    // result set.
                    log.error("Error while creating user");
                    log.error(e.getLocalizedMessage());
                    log.error(e.getStackTrace());
                }
            }
            if (this.conn != null) {
                this.dbDisconnect();
            }
        } else {
            log.warn("User could not be created! Missing parameters...");
            result.setError(true);
            result.setMessage(bundle.getString("user.create.missingParameters"));
        }
        return result;
    }

    /**
     * Update a users data.
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
    public RestServiceResult update(RestServiceResult result) {
        Statement stmt;
        log.debug("Executing command User.update()");
        if (login != null && realName != null && login.length()> 0 && realName.length() > 0
            && email != null && email.length() > 0) {
            this.dbConnect();
            try {
                stmt = conn.createStatement(ResultSet.TYPE_FORWARD_ONLY, ResultSet.CONCUR_READ_ONLY);
                stmt.executeUpdate("UPDATE USERS SET LOGIN='" + this.login + "', REAL_NAME='"+ this.realName + "', " +
                                   "PASS='" + this.password + "', EMAIL='" + this.email + "' " +
                                   "WHERE id=" + this.getId());
                stmt.close();
                Object[] args = { this.realName, this.login };
                result.setMessage(MessageFormat.format(bundle.getString("user.update.success"), args));
            } catch (SQLException e) {
                // Generate a debug error message and add the error to the
                // result set.
                log.error("Error updating user with ID " + this.id + " (login: " + this.login + ")");
                log.error(e.getLocalizedMessage());
                log.error(e.getStackTrace());

            }
            if (this.conn != null) {
                this.dbDisconnect();
            }
        } else {
            log.warn("User could not be updated! Missing parameters...");
            result.setError(true);
            result.setMessage(bundle.getString("user.create.missingParameters"));
        }
        return result;
    }

    /**
     * Delete a user by login name.
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
    public RestServiceResult deleteByLogin(RestServiceResult result) {
        Statement stmt;
        log.debug("Executing command User.deleteByLogin()");
        if (login != null && login.length()> 0) {
            this.dbConnect();
            try {
                stmt = conn.createStatement(ResultSet.TYPE_FORWARD_ONLY,
                        ResultSet.CONCUR_READ_ONLY);
                int lines = stmt.executeUpdate("DELETE FROM USERS WHERE LOGIN='" + this.getLogin() + "'");
                stmt.close();
                if (lines == 0) {
                    Object[] args = { this.login };
                    result.setMessage(MessageFormat.format(bundle.getString("user.delete.usernameDoesntExist"), args));
                } else {
                    Object[] args = { this.login };
                    result.setMessage(MessageFormat.format(bundle.getString("user.delete.success"), args));
                }

            } catch (SQLException e) {
                // Generate a debug error message and add the error to the
                // result set.
                log.error("Error deleting user with login " + this.login);
                log.error(e.getLocalizedMessage());
                log.error(e.getStackTrace());

            }
            if (this.conn != null) {
                this.dbDisconnect();
            }
        } else {
            result.setError(true);
            result.setMessage(bundle.getString("user.delete.missingParameter"));
            log.warn("Missing parameters! Called User.deleteByLogin without specifiying the login!");
        }
        return result;
    }


    /**
     * Handle a user login request.
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
    public RestServiceResult login(HttpSession session, RestServiceResult result) {
        Statement stmt;
        if (!this.dbConnect()) {
            result.setError(true);
            result.setMessage(bundle.getString("database.connectError"));
            return result;
        }

        if (this.getLogin() != null && this.getLogin().length() > 0) {
            try {
                stmt = conn.createStatement(ResultSet.TYPE_FORWARD_ONLY, ResultSet.CONCUR_READ_ONLY);
                ResultSet rs = stmt
                        .executeQuery("SELECT * FROM USERS WHERE LOGIN='"+ this.getLogin() +"'");
                if (rs.next()) {
                    this.id = rs.getInt("ID");
                    this.realName = rs.getString("REAL_NAME");
                    this.lastLogin = rs.getTimestamp("LAST_LOGIN");
                    log.debug("User with real name " + this.realName
                            + " loaded!");
                    if (this.authorize(rs.getString("PASS"))) {
                        // User authenticated, now save to session
                        session.setAttribute("user", this);
                        result.setError(false);
                        result.setMessage(bundle.getString("user.login.success"));
                        log.debug("User saved in session");
                        // Mark in the session that we have a logged in user
                        // Set the LAST_LOGIN to the current timestamp
                        stmt.executeUpdate("UPDATE USERS SET LAST_LOGIN=CURRENT_TIMESTAMP WHERE LOGIN='"+ this.getLogin() +"'");
                    } else {
                        log.warn("Wrong password for user " + this.getLogin());
                        session.setAttribute("user", null);
                        result.setError(true);
                        result.setMessage(bundle.getString("user.login.wrongPassword"));
                    }
                } else {
                    // Authentication failed. Remove the user from the session
                    session.removeAttribute("user");
                    result.setError(true);
                    Object[] args = { this.login };
                    result.setMessage(MessageFormat.format(bundle.getString("user.login.unknownUserName"), args));
                }
            } catch (SQLException e) {
                // Generate a debug error message and add the error to the
                // result set.
                log.error("Error while trying to authenticate user");
                log.error(e.getLocalizedMessage());
                log.error(e.getStackTrace());
            }
        } else {
            result.setMessage(bundle.getString("user.login.missingData"));
            result.setError(true);
            log.error("Missing parameters! Called User.login() without specifiying the login and/or pass!");
        }
        if (this.conn != null) {
            this.dbDisconnect();
        }
        return result;
    }

    /**
     * Handle a logout request.
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
    public RestServiceResult logout(HttpSession session,
            RestServiceResult result) {
        // remove the user object from the session
        log.debug("Starting logout sequence");
        session.removeAttribute("user");
        session.invalidate();
        if (this.getLogin() != null) {
            Object[] args = { this.login };
            result.setMessage(MessageFormat.format(bundle
                    .getString("user.logout.success"), args));
            log.debug("User " + this.getLogin() + " logged out!");
        } else {
            result.setError(true);
            result.setMessage(bundle.getString("user.logout.notLoggedIn"));
            log.debug("Attempted to logout when not logged in");
        }
        return result;
    }


    /**
     * Compare the MD5 hash passed to this method with the user's password hash.
     * Returns true if they match, false if they don't match.
     *
     * @param checksum
     *            The MD5 hash of the entered password.
     * @return true, if authorized; false, if not authorized
     */
    private boolean authorize(String checksum) {
        log.debug("Trying to authorize user " + this.realName);
        log.debug("Checksum in database: " + checksum);
        // Compare the checksum in the database with the checksum for the
        // password entered by the user
        log.debug("Checksum for entered password: " + this.getPassword());
        if (checksum.equals(this.getPassword())) {
            log.debug("Checksums match, user authorized");
            return true;
        } else {
            log.debug("Checksums do not match, wrong password");
            return false;
        }

    }

    /**
     * Generate an MD5 hash for the string passed to the method.
     *
     * @param pass
     *            The string for which we need to generate the hash.
     * @return The MD5 hash.
     */
    private String md5(String pass) {
        StringBuffer enteredChecksum = new StringBuffer();
        byte[] digest;
        MessageDigest md5;
        try {
            md5 = MessageDigest.getInstance("MD5");
            md5.update(pass.getBytes(), 0, pass.length());
            digest = md5.digest();
            for (int i = 0; i < digest.length; i++) {
                enteredChecksum.append(toHexString(digest[i]));
            }
        } catch (NoSuchAlgorithmException e) {
            log.error("Could not create MD5 hash!");
            log.error(e.getLocalizedMessage());
            log.error(e.getStackTrace());
        }
        return enteredChecksum.toString();
    }

    /**
     * Convert a byte into a hexadezimal string representation.
     * @param b The byte to be converted.
     * @return The hex String.
     */
    private String toHexString(byte b) {
        int value = (b & 0x7F) + (b < 0 ? 128 : 0);
        String ret = (value < 16 ? "0" : "");
        ret += Integer.toHexString(value).toUpperCase();
        return ret;
    }

    /**
     * Getter for user id.
     * @return The user id.
     */
    public int getId() {
        return id;
    }

    /**
     * Setter for user id.
     * @param id The new id.
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * Getter for login.
     * @return The login.
     */
    public String getLogin() {
        return login;
    }

    /**
     * Setter for login.
     * @param login The new login.
     */
    public void setLogin(String login) {
        if (login != null) {
            login = login.trim();
        }
        this.login = login;
    }

    /**
     * Getter for real name.
     * @return The real name.
     */
    public String getRealName() {
        return realName;
    }

    /**
     * Setter for real name.
     * @param realName The new real name.
     */
    public void setRealName(String realName) {
        if (realName != null) {
            realName = realName.trim();
        }
        this.realName = realName;
    }

    /**
     * Getter for password (MD5 hashed)
     * @return The password's hash.
     */
    public String getPassword() {
        return password;
    }

    /**
     * Setter for password.
     * @param password The new password.
     */
    public void setPassword(String password) {
        if (password != null) {
            this.password = md5(password.trim());
        } else {
            this.password = null;
        }
    }

    /**
     * Getter for last login.
     * @return Last login's date and time.
     */
    public Date getLastLogin() {
        return lastLogin;
    }

    /**
     * Setter for last login.
     * @param lastLogin The new last login date and time.
     */
    public void setLastLogin(Date lastLogin) {
        this.lastLogin = lastLogin;
    }

    /**
     * Getter for email.
     * @return The email.
     */
    public String getEmail() {
        return email;
    }

    /**
     * Setter for email.
     * @param email The new email.
     */
    public void setEmail(String email) {
        if (email != null) {
            email = email.trim();
        }
        this.email = email;
    }

}
