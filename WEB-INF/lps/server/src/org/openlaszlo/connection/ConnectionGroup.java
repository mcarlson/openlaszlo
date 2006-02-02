/* *****************************************************************************
 * ConnectionGroup.java
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.connection;

import java.io.*;
import java.util.*;
import javax.servlet.http.*;
import javax.servlet.*;
import org.openlaszlo.utils.*;
import org.apache.log4j.*;

public class ConnectionGroup 
{
    private static Hashtable mGroups = new Hashtable();
    static private Logger mLogger  = Logger.getLogger(ConnectionGroup.class);

    /** Group name */
    private String mName;

    /** Applications in group */
    private Set mApplications = new HashSet();

    static public ConnectionGroup getGroup(String name) {
        return getGroup(name, true);
    }

    synchronized static public ConnectionGroup getGroup(String name, boolean create) {
        ConnectionGroup group = (ConnectionGroup) mGroups.get(name);
        if (group == null && create) {
            group = new ConnectionGroup(name);
            mGroups.put(name, group);
        }
        return group;
    }


    synchronized static private void removeGroup(ConnectionGroup group) {
        mGroups.remove(group.getName());
    }


    private ConnectionGroup(String name) {
        mName = name;
    }

    public String getName() {
        return mName;
    }

    public void registerApplication(Application application) {
        mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="register(" + p[0] + ")"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                ConnectionGroup.class.getName(),"051018-63", new Object[] {application})
);
        synchronized (mApplications) {
            mApplications.add(application);
        }
    }

    public void unregisterApplication(Application application) {
        mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="unregisterApplication(" + p[0] + ")"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                ConnectionGroup.class.getName(),"051018-77", new Object[] {application})
);
        synchronized (mApplications) {
            mApplications.remove(application);
        }
    }


    public Set list(String users) {
        mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="list(users)"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                ConnectionGroup.class.getName(),"051018-92")
);

        Set set = new HashSet();
        Iterator iter = mApplications.iterator();
        while (iter.hasNext()) {
            Application app = (Application)iter.next();
            set.addAll(app.list(users));
        }
        return set;
    }

    public int sendMessage(String users, String mesg, String range, 
                           StringBuffer xmlResult) {
        mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="sendMesage(users, mesg, range, xmlResult)"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                ConnectionGroup.class.getName(),"051018-112")
);

        int count = 0;
        Iterator iter = mApplications.iterator();
        while (iter.hasNext()) {
            Application app = (Application)iter.next();
            count += app.sendMessage(users, mesg, range, xmlResult);
        }
        if (xmlResult != null) {
            xmlResult.insert(0, "<send count=\"" + count + "\" >");
            xmlResult.append("</send>");
        }
        return count;
    }


    synchronized static public void dumpGroupsXML(StringBuffer buf, boolean details)
    {
        Application.dumpTableXML("group", mGroups, buf, details);
    }

    public String toString() {
        StringBuffer buf = new StringBuffer();
        buf.append("<group ")
            .append(" name=\"").append(mName).append("\"")
            .append(" >");
            Iterator iter = mApplications.iterator();
            while (iter.hasNext()) {
                Application app = (Application)iter.next();
                buf.append("<application name=\"" + app.getName() + "\" />");
            }
        buf.append("</group>");
        return buf.toString();
    }
}
