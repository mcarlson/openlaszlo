/* *****************************************************************************
 * HTTPConnection.java
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.connection;

import java.io.IOException;
import java.io.OutputStream;
import java.io.StringReader;
import java.util.Collections;
import java.util.Date;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;
import java.util.Random;
import java.util.Vector;
import javax.servlet.http.HttpSessionBindingListener;
import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletOutputStream;
import org.apache.log4j.Logger;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.input.SAXBuilder;
import org.jdom.JDOMException;


/** Persistent connection for SWF files. */
public class HTTPConnection 
{
    private static final String CONNECTED = "__LPSCONNECTED";
    private static final String RECONNECTED = "__LPSRECONNECTED";


    /** Queue to store events */
    private List mQueue;

    /** Username for connection -- this may not be unique */
    private String mUsername;

    /** Session id */
    private String mSID;

    /** Connection id -- changes with each reconnection */
    private String mCID;

    /** Servlet response object */
    private HttpServletResponse mRes;

    /** Output stream */
    private OutputStream mOut;

    /** Flag to immediately flush message queue */
    private boolean mDoFlushQueue;

    /** Flag to pad headers with bytes. Used for IE, which doesn't display
     * anything until byte 2000. */
    private boolean mDoPad;

    /** Heartbeat interval */
    private long mHeartbeatInterval;

    /** Heartbeat count */
    private int mHeartbeatCount;

    /** Request count */
    private int mRequestCount;

    /** Sent count */
    private int mSentCount;

    /** Flush count */
    private int mFlushCount;

    /** Total number of bytes sent out during application session */
    private int mTotalNumOfBytes;

    /** Number of bytes sent out */
    private int mNumOfBytes;

    /** String to send out depending on whether it's a connection or
     * reconnection */
    private String mConnectedString;

    private boolean mEmitConnectHeaders = false;

    /** Version of SWF bytes for connection messages. */
    private int mSWFVersion;


    //------------------------------------------------------------
    // Statics
    //------------------------------------------------------------
    private static Logger mLogger  = Logger.getLogger(HTTPConnection.class);

    /** Used to send IE a pad of 2000 spaces. IE doesn't display information
     * until it receives 2000 bytes or the connection is closed by the web
     * server. */
    private static String mPad;

    /** Static initializer synchronization lock. */
    private static Object mStaticInitLock = new Object();
 
    /** Check for static initialize block. */
    private static boolean mDoStaticInit = true;

    /** Check if the class was inited (see doInit()). */
    private static boolean mDoInit = true;

    /** Compiled heartbeat SWF bytes. */
    private static byte[] mSWFHeartbeat;

    /** Compiled reconnect command SWF bytes. */
    private static byte[] mSWFDoReconnect;

    /** Maximum length of a message. */
    private static int mMaxMessageLen = 2000;

    /** Content length of connection SWF. */
    private static int mConnectionLength = 65536;

    /** Check if disconnect was requested. */
    private boolean mDoDisconnect = false;

    /** Flag to check if this connection will be replaced by another
     * connection. */
    private boolean mIsReconnect = false;

    /** Interval to wait after client reconnection command is sent. */
    private static int mReconnectionWaitInterval = 60000;

    /** Count to generate UIDs. */
    private static long mUIDCount = 0;

    //------------------------------------------------------------
    // Not clear whether a static initializer needs to be
    // synchronized, but not taking any chances.
    //------------------------------------------------------------
    static {
        if (mDoStaticInit) {
            synchronized (mStaticInitLock) {
                if (mDoStaticInit) {
                    StringBuffer buf = new StringBuffer(2000);
                    for (int i=0; i < 2000; i++) 
                        buf.append(' ');
                    mPad = buf.toString();

                    mSWFHeartbeat = new SwfByte()
                        .actionSetElement
                        (getElement
                         (getConnectionInfoXML("__LPSHB", null)))
                        .setShowFrame()
                        .getBuf();

                    mSWFDoReconnect = new SwfByte()
                        .actionSetElement
                        (getElement
                         (getConnectionInfoXML("__LPSDORECONNECT", null)))
                        .setShowFrame()
                        .getBuf();

                    mDoStaticInit = false;
                }
            }
        }
    }


    //------------------------------------------------------------
    // Initialize static properties. This should only get called 
    // once.
    //------------------------------------------------------------
    synchronized static public void init(Properties properties)
    {
        if (! mDoInit) 
            return;

        mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="init(properties)"
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                HTTPConnection.class.getName(),"051018-190")
);

        Enumeration propNames = properties.propertyNames();
        while (propNames.hasMoreElements()) {

            String key = (String)propNames.nextElement();
            String val = properties.getProperty(key);

            try {
                if (val != null) {
                    if (key.intern() == "maxMessageLen")
                        mMaxMessageLen = Integer.parseInt(val);
                    else if (key.intern() == "connectionLength")
                        mConnectionLength = Integer.parseInt(val);
                    else if (key.intern() == "reconnectionWaitInterval")
                        mReconnectionWaitInterval = Integer.parseInt(val);
                }
            } catch (NumberFormatException e) {
                mLogger.debug(e.getMessage());
            }
        }

        // These are the minimum values.
        if (mMaxMessageLen < 2000)
            mMaxMessageLen = 2000;
        if (mConnectionLength < (5 * mMaxMessageLen))
            mConnectionLength = 5 * mMaxMessageLen;
        if (mReconnectionWaitInterval < 10000) // wait a minimum of 10 seconds
            mReconnectionWaitInterval = 60000; // default 60 seconds

        mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="maxMessageLen:" + p[0]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                HTTPConnection.class.getName(),"051018-227", new Object[] {new Integer(mMaxMessageLen)})
);
        mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="connectionLength:" + p[0]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                HTTPConnection.class.getName(),"051018-235", new Object[] {new Integer(mConnectionLength)})
);
        mDoInit = false;
    }


    //------------------------------------------------------------
    // Constructor
    //------------------------------------------------------------

    /**
     * Generates a unique identifier.
     * @return hexadecimal unique string identifier.
     */
    private synchronized static String generateUID()
    {
        return Long.toHexString( System.currentTimeMillis() ) + 
            Long.toHexString( mUIDCount++ );
    }


    /** 
     * Constructor.
     *
     * @param res http servlet response to use as persistent connection 
     * @param username username associated with connection 
     */
    public HTTPConnection(HttpServletResponse res, String username, int swfversion)
        throws IOException
    {
        mRes = res;
        mOut = res.getOutputStream();
        mUsername = username;
        mSID = generateUID();
        mCID = generateUID();
        mHeartbeatCount = 0;
        mRequestCount = 0;
        mSentCount = 0;
        mFlushCount = 0;
        mTotalNumOfBytes = 0;
        mNumOfBytes = 0;
        mDoDisconnect = false;
        mSWFVersion = swfversion;

        // Don't have to make queue thread-safe since synchronization is handled
        // below.
        mQueue = new Vector();

        mConnectedString = CONNECTED;

        // This is false when attempting a reconnect with client so messages can
        // be saved.
        mDoFlushQueue = true;

        setDoPad(false);
        setHeartbeatInterval(0);
    }

    /** 
     * Will update the request count, heartbeat count, total number of bytes
     * sent.
     *
     * @param res http servlet response to user as persistent connect
     * @param hc HTTPConnection to copy parameters from
     */
    public HTTPConnection(HttpServletResponse res, HTTPConnection hc)
        throws IOException
    {
        mRes = res;
        mOut = res.getOutputStream();
        mUsername = hc.mUsername;
        mSID = hc.mSID;
        mCID = generateUID();
        mHeartbeatCount  += hc.mHeartbeatCount;
        mRequestCount    += hc.mRequestCount;
        mSentCount       += hc.mSentCount;
        mFlushCount      += hc.mFlushCount;
        mTotalNumOfBytes += hc.mTotalNumOfBytes;
        mEmitConnectHeaders = hc.mEmitConnectHeaders;
        mDoDisconnect = false;
        mSWFVersion = hc.mSWFVersion;

        mConnectedString = RECONNECTED;

        // Easy way to save the queue (or is it too easy? I think this is ok...)
        mQueue = hc.mQueue;

        mNumOfBytes = 0;

        // This is false when attempting a reconnect with client so messages can
        // be saved.
        mDoFlushQueue = true;

        setDoPad(hc.mDoPad);
        setHeartbeatInterval(hc.mHeartbeatInterval);
    }


    //------------------------------------------------------------
    // Methods
    //------------------------------------------------------------

    /**
     * Queue up event to send. 
     *
     * @param msg event message
     * @param doFlushQueue if true, flushes the message event queue
     * @throws IOException if connection does not exist
     */
    synchronized public void send(String msg)
        throws IOException
    {
        mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="send(msg=" + p[0] + ")"
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                HTTPConnection.class.getName(),"051018-353", new Object[] {msg})
);

        if (mDoDisconnect) {
            mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="connection is already disconnected, not sending"
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                HTTPConnection.class.getName(),"051018-363")
);
            return;
        }

        Element element = getElement(msg);
        if (element==null) {
            mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Bad XML for message: " + p[0]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                HTTPConnection.class.getName(),"051018-376", new Object[] {msg})
);
            return;
        }

        byte[] swfBuf = swfBuf = new SwfByte()
            .actionSetElement(element)
            .setShowFrame()
            .getBuf();

        if (swfBuf.length > mMaxMessageLen) {
            String info = 
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="compiled message bytes are too large -- greater than" + p[0] + ")"
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                HTTPConnection.class.getName(),"051018-393", new Object[] {new Integer(mMaxMessageLen)})
;
            mLogger.debug(info);
            throw new IOException(info);
        }

        synchronized (mQueue) {
            mRequestCount++;
            mQueue.add(swfBuf);
        }

        if (mDoFlushQueue) {
            notify();
        }

    }

    /** 
     * Close connection.
     */
    public void disconnect()
    {
        disconnect(false);
    }

    /** 
     * Close connection.
     *
     * @param isReconnect if this connection will be replaced by another
     * connection.
     */
    synchronized public void disconnect(boolean isReconnect)
    {
        mLogger.debug("disconnect()");
        mIsReconnect = isReconnect;
        mDoDisconnect = true;
        notify();
    }


    /**
     * Check if connection is to be replaced by another connection.
     */
    synchronized public boolean toBeReconnected()
    {
        return mIsReconnect;
    }

    /** 
     * This call will block and wait for events to handle. Keeps HTTP
     * connection alive for an asynchronous event.
     *
     * @param res servlet response object 
     * @return true if connection was lost to reconnection, else false
     */
    public void connect()
        throws IOException
    {
        mLogger.debug("connect()");

        try {
            mNumOfBytes += sendHeader();
            mNumOfBytes += flushMessageQueue();

            mTotalNumOfBytes += mNumOfBytes;

            int numOfBytesSent = 0;
            long waitInterval = mHeartbeatInterval;
            long reconnectRequestTime = 0; // time we made reconnect request

            while (true) {

                mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="[" + p[0] + "," + p[1] + "] " + "  request: " + p[2] + "  sent: " + p[3] + ", flush: " + p[4] + ", heartbeats: " + p[5] + ", bytes: " + p[6] + " (" + p[7] + "/" + p[8] + ")"
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                HTTPConnection.class.getName(),"051018-471", new Object[] {mUsername, mSID, new Integer(mRequestCount), new Integer(mSentCount), new Integer(mFlushCount), new Integer(mHeartbeatCount), new Integer(mTotalNumOfBytes), new Integer(mNumOfBytes), new Integer(mConnectionLength)})
                );
                synchronized (this) {
                    wait(waitInterval);
                }

                if (mDoDisconnect) {
                    mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="disconnecting..."
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                HTTPConnection.class.getName(),"051018-484")
);
                    if (reconnectRequestTime != 0) {
                        mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="reconnect time: " + p[0] + "ms"
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                HTTPConnection.class.getName(),"051018-493", new Object[] {new Long(new Date().getTime() - reconnectRequestTime)})
                        );
                    }
                    return;
                }

                // Check to see if we're nearing the limit of bytes sent out
                if ( doReconnect() ) {

                    mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="sending reconnect request " + p[0] + "..."
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                HTTPConnection.class.getName(),"051018-508", new Object[] {mUsername})
);

                    if (reconnectRequestTime == 0) {
                        // ...give client a few seconds to reconnect...
                        waitInterval = mReconnectionWaitInterval; 
                        
                        synchronized (this) {
                            mDoFlushQueue = false;
                        }

                        mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="...for " + p[0] + " seconds"
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                HTTPConnection.class.getName(),"051018-525", new Object[] {new Long(waitInterval / 1000)})
);

                        // ...send reconnect request to client
                        mOut.write(mSWFDoReconnect);
                        mOut.flush();

                        mNumOfBytes += mSWFDoReconnect.length;
                        mTotalNumOfBytes += mSWFDoReconnect.length;

                        reconnectRequestTime = new Date().getTime();
                        continue;

                    }

                    // If our wait is less than the wait interval, keep
                    // waiting...
                    long now = new Date().getTime();
                    long interval = now - reconnectRequestTime;
                    if (interval < waitInterval) {
                        mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="still waiting for reconnect..."
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                HTTPConnection.class.getName(),"051018-551")
);
                        continue;
                    }
                    
                    // ...else, really quit.
                    mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="interval was " + p[0] + "; done waiting...goodbye!"
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                HTTPConnection.class.getName(),"051018-563", new Object[] {new Long(interval)})
);
                    return;
                }

                numOfBytesSent = 0;

                // If queue is 0, just send heartbeat.
                if (mQueue.size()==0) {
                    mHeartbeatCount++;
                    mOut.write(mSWFHeartbeat);
                    mOut.flush();
                    numOfBytesSent = mSWFHeartbeat.length;
                } else {
                    numOfBytesSent = flushMessageQueue();
                }

                mNumOfBytes += numOfBytesSent;
                mTotalNumOfBytes += numOfBytesSent;
            }
        } catch (InterruptedException e) {
mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="InterruptedException: " + p[0]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                HTTPConnection.class.getName(),"051018-590", new Object[] {e.getMessage()})
);
        }
    }


    /**
     * @return true if reconnect needs to happen.
     */
    private boolean doReconnect()
    {
        return doReconnect(0);
    }

    /**
     * @param n number of potential bytes that will be going out.
     * @return true if reconnect needs to happen.
     */
    private boolean doReconnect(int n)
    {
        return (mConnectionLength - (mMaxMessageLen * 2)) <= (mNumOfBytes + n);
    }


    /** 
     * Send a connection header and flush any messages in the queue, if any.
     */
    private int sendHeader()
        throws InterruptedException, IOException
    {
        mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="sendHeader()"
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                HTTPConnection.class.getName(),"051018-626")
);

        // Content-length used to be commented out because w/Tomcat 3.3
        // connections seemed open to the servlet container even after browser
        // close.
        mRes.setContentLength(mConnectionLength);
        mRes.setContentType("application/x-shockwave-flash");

        // This is to keep browsers from doing connection keep-alives.
        mRes.setHeader("Connection", "close");
        mRes.setHeader("Keep-Alive", "close");

        if (mEmitConnectHeaders) {
            if (mConnectedString == CONNECTED)
                mRes.setHeader("X-LPS-C", mCID);
            else if (mConnectedString == RECONNECTED)
                mRes.setHeader("X-LPS-R", mCID);
        }

        mLogger.debug("Sent connected string: " + mConnectedString);

        String  info;
        if (mConnectedString == CONNECTED) {
            info = getConnectionInfoXML (mConnectedString, 
                                         "<cid>" + mCID + "</cid>" +
                                         "<sid>" + mSID + "</sid>" +
                                         "<usr>" + mUsername + "</usr>");
        } else {
            info = getConnectionInfoXML (mConnectedString, 
                                         "<cid>" + mCID + "</cid>");

        }
        SwfByte swf = new SwfByte();

        swf.setHeader(mSWFVersion);
        swf.setLength(mConnectionLength);
        swf.actionSetElement(getElement(info));
        if (mDoPad) swf.actionSetVariable("pad", mPad);
        swf.setShowFrame();

        byte[] buf = swf.getBuf();
        mOut.write(buf, 0, buf.length);
        mOut.flush();

        return buf.length;
    }


    /** 
     * Flush out messages in queue for the client.
     *
     * @return number of messages sent
     * @throws IOException if there's a problem with the output stream
     */
    private int flushMessageQueue()
        throws IOException, InterruptedException
    {
        mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="flushMessageQueue()"
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                HTTPConnection.class.getName(),"051018-690")
);

        byte[] swfBuf;
        int numOfBytes = 0;
        synchronized (mQueue) {

            Iterator iter = mQueue.iterator();
            if (! iter.hasNext())
                return 0;

            while (iter.hasNext()) {
                swfBuf = (byte[])iter.next();
                mOut.write(swfBuf);
                numOfBytes += swfBuf.length;
                ++mSentCount;
                iter.remove();

                // If data sent is above the byte limit, reconnect before
                // flushing the rest of the queue.
                if ( doReconnect(numOfBytes) )
                    break;
            }

            mOut.flush();
            ++mFlushCount;
        }

        return numOfBytes;
    }


    /** 
     * Check if padding is required.
     */
    public boolean doPad()
    {
        return mDoPad;
    }

    /** 
     * Set if you want padding of bytes to headers. Used for browser like IE
     * that don't display anything until the Nth byte.
     *
     * @param doPad flag for padding
     * @return this object
     */
    public HTTPConnection setDoPad(boolean doPad)
    {
        mDoPad = doPad;
        return this;
    }

    /** 
     * Get heartbeat interval in milliseconds.
     */
    public long getHeartbeatInterval()
    {
        return mHeartbeatInterval;
    }


    /**
     * @return version for SWF bytes.
     */
    public int getSWFVersion() {
        return mSWFVersion;
    }

    /** 
     * Set heartbeat in milliseconds.
     */
    public HTTPConnection setHeartbeatInterval(long heartbeatInterval)
    {
        mHeartbeatInterval = heartbeatInterval;
        return this;
    }


    /** 
     * Get username.
     */
    public String getUsername()
    {
        return mUsername;
    }

    /** 
     * Get unique id.
     */
    public String getCID()
    {
        return mCID;
    }

    /**
     */
    public HTTPConnection setEmitConnectHeaders(boolean emitConnectHeaders)
    {
        mEmitConnectHeaders = emitConnectHeaders;
        return this;
    }

    /** 
     * Turn xml into a JDOM element.
     *
     * @param xml xml string
     * @return JDOM element
     */
    private static Element getElement(String xml)
    {
        Element el = null;
        try {
            el = new SAXBuilder(false)
            .build(new StringReader(xml))
            .getRootElement();
        } catch (JDOMException e) {
            mLogger.debug(e.getMessage());
        } catch (IOException e) {
            mLogger.debug(e.getMessage());
        }
        return el;
    }

    /** 
     * XML message structure used to push server information to the
     * client. Used for heartbeats, sending connection startup and informing
     * users someone's been disconnected.
     *
     * @param type type of information. This will be received by the client as a
     * dataset.
     * @param msg message of type, if any
     * @return an xml string with connection information
     */
    public static String getConnectionInfoXML(String type, String msg)
    {
        if (msg==null) 
            return "<resultset s=\"0\"><root dset=\""+type+"\" /></resultset>";
        else 
            return "<resultset s=\"0\"><root dset=\""+type+"\">"
                + msg 
                + "</root></resultset>";
    }

    public static int getMaxMessageLen() {
        return mMaxMessageLen;
    }
    public static int getConnectionLength() {
        return mConnectionLength;
    }
    public static int getReconnectionWaitInterval() {
        return mReconnectionWaitInterval;
    }

    public String toString() {
        return
            new StringBuffer()
            .append("<connection")
            .append(" sid=\"").append(mSID).append("\"")
            .append(" cid=\"").append(mCID).append("\"")
            .append(" user=\"").append(mUsername).append("\"")
            .append(" heartbeats=\"").append(mHeartbeatCount).append("\"")
            .append(" flushes=\"").append(mFlushCount).append("\"")
            .append(" current-bytes=\"").append(mNumOfBytes).append("\"")
            .append(" total-bytes=\"").append(mTotalNumOfBytes).append("\"")
            .append(" />").toString();
    }

}
