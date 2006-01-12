/* ****************************************************************************
 * SessionBindingMap.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.data;

import java.util.*;
import javax.servlet.http.*;
import org.openlaszlo.servlets.responders.ResponderCache;
import org.apache.log4j.Logger;

/**
 * 
 */
public class SessionBindingMap extends HashMap 
    implements HttpSessionBindingListener {

    private static Logger mLogger = Logger.getLogger(SessionBindingMap.class);

    public void valueBound(HttpSessionBindingEvent event) {
        if (mLogger.isDebugEnabled()) {
            mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes=p[0] + " bound for session " + p[1]
 */
			org.openlaszlo.i18n.LaszloMessages.getMessage(
				SessionBindingMap.class.getName(),"051018-32", new Object[] {event.getName(), event.getSession()})
				);
        }
        JavaDataSource.mSessionCounter.increment();
    }
    public void valueUnbound(HttpSessionBindingEvent event) {
        if (mLogger.isDebugEnabled()) {
            mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes=p[0] + " unbound for session " + p[1]
 */
			org.openlaszlo.i18n.LaszloMessages.getMessage(
				SessionBindingMap.class.getName(),"051018-44", new Object[] {event.getName(), event.getSession()})
				);
        }
        JavaDataSource.mSessionCounter.decrement();

        // decrement number of objects stored by this session.
        Map m = (Map)event.getValue();
        JavaDataSource.mSessionObjectsCounter.decrement(m.size());
    }
}

