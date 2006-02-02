/* *****************************************************************************
 * FileDataSource.java
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.data;

import java.io.*;
import java.net.URL;
import java.net.MalformedURLException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.log4j.Logger;
import org.openlaszlo.utils.ChainedException;
import org.openlaszlo.utils.LZHttpUtils;
import org.openlaszlo.utils.FileUtils;
import org.openlaszlo.media.MimeType;

/**
 * File Transport
 */
public class FileDataSource extends DataSource
{
    private static Logger mLogger  = Logger.getLogger(FileDataSource.class);

    /**
     * @return name
     */
    public String name() {
        return "file";
    }

    /**
     * @return the data from this request
     * @param app absolute pathnane to app file
     * @param req request in progress
     * @param lastModifiedTime this is the timestamp on the
     * currently cached item; this time can be used as the datasource
     * sees fit (or ignored) in constructing the results.  If 
     * the value is -1, assume there is no currently cached item.
     */
    public Data getData(String app, HttpServletRequest req, 
                        HttpServletResponse res, long lastModifiedTime) 
        throws IOException, DataSourceException {
        return getFileData(app, req, res, null, lastModifiedTime);
    }

    static public Data getFileData(String app, HttpServletRequest req, 
                                   HttpServletResponse res, String urlStr, 
                                   long lastModifiedTime) 
        throws IOException, DataSourceException {

        if (urlStr == null) {
            urlStr = DataSource.getURL(req);
        }

        URL url = new URL(urlStr);

        String protocol = url.getProtocol();

        if ( protocol == null || ! protocol.equals("file")){
            mLogger.error( 
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="bad protocol for " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                FileDataSource.class.getName(),"051018-71", new Object[] {url})
 );
            throw new DataSourceException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="protocol " + p[0] + "is not 'file:' "
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                FileDataSource.class.getName(),"051018-79", new Object[] {protocol})
);
        }

        // We are not supporting 'file' type requests anymore. 
        if (true) {
            throw new IOException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="'file' data request type is not supported."
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                FileDataSource.class.getName(),"051018-91")
);
        }

        String filename = url.getFile();
        mLogger.debug("filename " + filename);

        if ( filename == null || filename.equals("") ) {
            throw new DataSourceException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="empty filename"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                FileDataSource.class.getName(),"051018-105")
);
        }

        // For relative urls, add app path before 
        if (filename.charAt(0) != '/') {
            mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="app " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                FileDataSource.class.getName(),"051018-117", new Object[] {app})
);
            String appdir = app.substring(0, 
                            app.lastIndexOf(File.separatorChar) + 1);
            mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="appdir " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                FileDataSource.class.getName(),"051018-127", new Object[] {appdir})
);
            filename = appdir + filename;
            mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="filename " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                FileDataSource.class.getName(),"051018-136", new Object[] {filename})
);
        }

        // Cope with Windows wackiness.
        if (File.separatorChar == '\\') {
            while (filename.startsWith("/")) {
                filename = filename.substring(1);
            }
            filename = filename.replace('/', '\\');
        }

        FileData data = new FileData(filename, lastModifiedTime);

        // proxy date header
        res.setDateHeader(LZHttpUtils.LAST_MODIFIED, data.lastModified());

        return data;
    }

    /**
     * A class for holding on to results of a File fetch.
     *
     * @author <a href="mailto:bloch@laszlosystems.com">Eric Bloch</a>
     */

    public static class FileData extends Data {

        /** response code */
        public FileInputStream str = null;

        /** file */
        public final File file;

        /** lastModifiedTime from request (or -1)*/
        public final long lastModifiedTime;

        /** 
         * @param f file
         */
        public FileData(String filename, long lm) throws IOException {
            mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="filename " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                FileDataSource.class.getName(),"051018-136", new Object[] {filename})
);
            File f = new File(filename);
            if (f == null) {
                throw new IOException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="can't construct file"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                FileDataSource.class.getName(),"051018-193")
);
            } else if (!f.exists()) {
                throw new IOException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes=p[0] + " doesn't exist."
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                FileDataSource.class.getName(),"051018-202", new Object[] {filename})
);
            } else if (!f.canRead()) {
                throw new IOException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="can't read " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                FileDataSource.class.getName(),"051018-211", new Object[] {filename})
);
            } 
            lastModifiedTime = lm;
            file = f;
        }
    
        /**
         * @return size of file
         */
        public long size() {
            try {
                return FileUtils.fileSize(file);
            } catch (Exception e) {
                throw new ChainedException(e);
            }
        }
    
        /**
         * @return true if the data was "not modified"
         * compared to the cached lastModified time.
         */
        public boolean notModified() {

            long l = lastModified();
            if (l == -1) {
                return false;
            }

            return (l <= lastModifiedTime);
        }
    
        /**
         * @return the lastModified time of the data
         */
        public long lastModified() {

            long l = file.lastModified();
            if (l == 0) {
                l = -1;
            }
            // Truncate to nearest second
            l = ((l)/1000L) * 1000L;
            mLogger.debug("lm is " + l);
            return l;
        }
    
        /**
         * append response headers
         */
        public void appendResponseHeadersAsXML(StringBuffer xmlResponse) {
            // TODO: [2003-04-17 bloch] should this be a string or a long?
            xmlResponse.append("<header name=\"Last-Modified\" " 
                             + "value=\""  + lastModified() + "\" />");
        }
    
        /**
         * release any resources associated with this data
         */
        public synchronized void release() {
            try {
                if (str != null) {
                    str.close();
                    str = null;
                }
            } catch (Exception e) {
                mLogger.warn(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="ignoring exception while closing stream: "
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                FileDataSource.class.getName(),"051018-283")
                        , e);
            }
        }

        /**
         * @return mime type 
         */
        public String getMimeType() {
            return MimeType.fromExtension(file.getPath());
        }

        /**
         * @return input stream
         */
        public synchronized InputStream getInputStream() throws IOException {
            if (str == null) {
                str = new FileInputStream(file);
            }
            return str;
        }

        /**
         * @return string
         */
        public String getAsString() throws IOException  {
            return FileUtils.readFileString(file);
        }
    }
}
