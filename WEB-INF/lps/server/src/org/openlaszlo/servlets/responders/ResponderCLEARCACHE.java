/******************************************************************************
 * ResponderCLEARCACHE.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2004, 2008 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.servlets.responders;

import java.io.*;
import java.util.Properties;
import java.util.StringTokenizer;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletOutputStream;
import org.openlaszlo.utils.FileUtils;
import org.openlaszlo.cache.RequestCache;
import org.openlaszlo.sc.ScriptCompiler;
import org.openlaszlo.cm.CompilationManager;
import org.apache.log4j.Logger;

public final class ResponderCLEARCACHE extends ResponderAdmin
{
    private static Logger mLogger = Logger.getLogger(ResponderCLEARCACHE.class);

    final static int CLEAR_COMPILATION = 0x01;
    final static int CLEAR_DATA        = 0x02;
    final static int CLEAR_SCRIPT      = 0x08;

    protected void respondAdmin(HttpServletRequest req, HttpServletResponse res)
        throws IOException
    {
        boolean cleared;
        boolean isOk = true;
        StringBuffer buf = new StringBuffer();

        int clearOptions = getClearOptions(req);

        if ( doClear(clearOptions, CLEAR_COMPILATION) ) {
            cleared = clearCompilationCache();
            buf.append("<compilation-cache cleared=\"" + cleared + "\" />\n");
            if (! cleared) isOk = false;
        }
            
        if ( doClear(clearOptions, CLEAR_DATA) ) {
            cleared = clearDataCache();
            buf.append("<data-cache cleared=\"" + cleared + "\" />\n");
            if (! cleared) isOk = false;
        }

        if ( doClear(clearOptions, CLEAR_SCRIPT) ) {
            cleared = clearScriptCache();
            buf.append("<script-cache cleared=\"" + cleared + "\" />\n");
            if (! cleared) isOk = false;
        }

        StringBuffer xml = new StringBuffer()
            .append("<clearcache cleared=\"").append(isOk).append("\" >\n")
            .append(buf)
            .append("</clearcache>\n");

        if (isOk) {
            mLogger.info(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Cache cleared"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                ResponderCLEARCACHE.class.getName(),"051018-79")
);
        } else {
            mLogger.info(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Problems clearing cache:\n" + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                ResponderCLEARCACHE.class.getName(),"051018-88", new Object[] {buf.toString()})
);
        }

        respondWithXML(res, xml.toString());
    }


    boolean doClear(int options, int clearType) {
        return (options & clearType) != 0;
    }

    int getClearOptions(HttpServletRequest req) {
        String tokens = req.getParameter("cache");
        if (tokens == null || tokens.equals("")) {
            return CLEAR_COMPILATION | CLEAR_DATA | CLEAR_SCRIPT;
        }

        int options = 0x00;
        StringTokenizer st = new StringTokenizer(tokens, ", ");
        while (st.hasMoreTokens()) {
            String o = st.nextToken();
            if ( o.equals("compilation") ) {
                options |= CLEAR_COMPILATION;
            } else if ( o.equals("data") ) {
                options |= CLEAR_DATA;
            } else if ( o.equals("script") ) {
                options |= CLEAR_SCRIPT;
            }
        }

        return options;
    }

    boolean clearScriptCache() {
        return ScriptCompiler.clearCacheStatic();
    }

    boolean clearDataCache() {
        RequestCache dataCache = ResponderDATA.getCache();
        if (dataCache == null) return false;
        return dataCache.clearCache();
    }


    boolean clearCompilationCache() {
        CompilationManager compMgr = ResponderCompile.getCompilationManager();
        if (compMgr == null) return false;
        return compMgr.clearCacheDirectory();
    }



    public int getMimeType()
    {
        return MIME_TYPE_XML;
    }
}
