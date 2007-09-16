/* *****************************************************************************
 * WSDLException.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.remote.swf.soap;

public class WSDLException extends Exception {

    public WSDLException()
    {
        super();
    }

    public WSDLException(String message)
    {
        super(message);
    }

    public WSDLException(String message, Throwable cause)
    {
        super(message, cause);
    }

    public WSDLException(Throwable cause)
    {
        super(cause);
    }
}
