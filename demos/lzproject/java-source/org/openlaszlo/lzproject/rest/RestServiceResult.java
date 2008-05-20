/* J_LZ_COPYRIGHT_BEGIN *******************************************************
 * Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
 * Use is subject to license terms.                                            *
 * J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.lzproject.rest;

/**
 * The classs RestServiceResult represents the result of
 * a REST service call.
 *
 * <p>
 * The RestServiceResult contains a localized message
 * passed to the response JSP page and JDBC SQL states
 * in case of SQL errors.
 *
 * @author raju
 *
 */
public class RestServiceResult {

    /**
     * Error marker, set to true if the request resulted
     * in an error.
     */
    private boolean isError = false;

    /**
     * The JDBC SQL state, used in case of SQL errors.
     */
    private String sqlState = "";

    /**
     * Default reponse message, should be overwritten.
     */
    private String message = "Default RestServiceResult message";

    /**
     * Getter for SQL state.
     * @return The SQL state.
     */
    public String getSqlState() {
        return sqlState;
    }

    /**
     * Setter for SQL ste
     * @param state The new state.
     */
    public void setSqlState(String state) {
        this.sqlState = state;
    }

    /**
     * Getter for isError
     * @return The isError value.
     */
    public boolean isError() {
        return isError;
    }

    /**
     * Setter for isError.
     * @param isError The new value.
     */
    public void setError(boolean isError) {
        this.isError = isError;
    }

    /**
     * Getter for message.
     * @return The message.
     */
    public String getMessage() {
        return message;
    }

    /**
     * Setter for reponse message.
     * @param message The new message.
     */
    public void setMessage(String message) {
        this.message = message;
    }

}
