/******************************************************************************
 * HistoryServlet.java
 *****************************************************************************/
/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/
package org.openlaszlo.servlets;

import java.io.*;
import java.net.*;
import java.util.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.ServletConfig.*;
import org.apache.log4j.*;
import org.jdom.*;
import org.jdom.input.*;
import org.jdom.output.*;
import org.apache.commons.httpclient.*;
import org.apache.commons.httpclient.methods.*;
import org.apache.commons.httpclient.util.*;


public class HistoryServlet extends HttpServlet 
{
    public class MyGetMethod extends GetMethod {
        protected void addCookieRequestHeader(HttpState s, HttpConnection c) {
        
        }
    }

    private static Logger mLogger  = Logger.getLogger(HistoryServlet.class);

    /** Connection Manager */
    private static MultiThreadedHttpConnectionManager 
        mConnectionMgr = new MultiThreadedHttpConnectionManager();

    private List mHistory = new LinkedList();

    private String mURL = "http://localhost:8080/lps-pc/examples/history/history.lzx";

    /** Request counter */
    private int mRequestCounter = 1;

    private static final int TYPE_UNKNOWN = 0;
    private static final int TYPE_MESSAGE = 1;
    private static final int TYPE_HISTORY = 2;
    private static final int TYPE_USERDISCONNECT = 3;

    private static final String DEFAULT_MAX_CONNECTIONS = "1000";
    private static final String DEFAULT_HISTORY_LENGTH = "10";
    private static final String DEFAULT_AGENT_NAME = "history";
    private static final String DEFAULT_AGENT_GROUP = "history";
    private static final String DEFAULT_CLIENT_DATASET = "history";

    private int mHistoryLength;
    private String mAgentURL;
    private String mAgentGroup;
    private String mClientDataset;

    private String getInitParameter(ServletConfig config, String name, String defaultValue) {
        String value = config.getInitParameter(name);
        mLogger.debug("web.xml value for " + name + " is " + value);
        return (value!=null?value:defaultValue);
    }

    /** Initialize servlet.
     * @param config configuration file object */
    public void init(ServletConfig config)
        throws ServletException 
    {
        super.init (config);

        try {
            String maxConns = 
                getInitParameter(config, "MAX_CONNECTIONS", DEFAULT_MAX_CONNECTIONS);
            mConnectionMgr.setMaxConnectionsPerHost(Integer.parseInt(maxConns));
        
            String len = 
                getInitParameter(config, "HISTORY_LENGTH", DEFAULT_HISTORY_LENGTH);
            mHistoryLength = Integer.parseInt(len);

            mAgentURL = getInitParameter(config, "AGENT_URL", DEFAULT_AGENT_NAME);
            mAgentGroup = getInitParameter(config, "AGENT_GROUP", DEFAULT_AGENT_GROUP);
            mClientDataset = getInitParameter(config, "CLIENT_DATASET", DEFAULT_CLIENT_DATASET);

        } catch (Exception e) {
            throw new ServletException(e.getMessage());
        }
    }


    /**
     * @param req @see HttpServletRequest
     * @param res @see HttpServletResponse
     */
    public void doGet(HttpServletRequest req, HttpServletResponse res) 
        throws IOException, ServletException
    {
        // Set up logger NDC

        int requestID;
        synchronized (this) {
            requestID = mRequestCounter++; 
        }

        NDC.push(req.getRemoteAddr() + " " + (requestID));

        try {
            _doGet(req, res);
        } finally {

            mLogger.debug("Request " + requestID + " finished");
            NDC.pop();
            NDC.remove();
        }

    }



    /**
     * @param req @see HttpServletRequest
     * @param res @see HttpServletResponse
     */
    private void _doGet(HttpServletRequest req, HttpServletResponse res) 
        throws IOException, ServletException
    {
        res.setContentType("text/xml");

        String xml = req.getParameter("xml");
        if (xml == null || xml.equals("")) {
            mLogger.warn("no xml");
            doHelp(req, res, "no xml");
            return;
        }
        mLogger.debug("xml is " + xml);

        try {
            SAXBuilder builder = new SAXBuilder();
            Document document = builder.build(new StringReader(xml));

            switch (peekAtType(document)) {
            case TYPE_MESSAGE:
                doSaveMessage(req, res, document);
                break;
            case TYPE_HISTORY:
                doSendHistory(req, res, document);
                break;
            case TYPE_USERDISCONNECT:
                mLogger.debug("got 'userdisconnect' from server");
                break;
            default:
                doHelp(req, res, "default");
                break;
            }

        } catch (JDOMException e) {
            mLogger.warn("JDOMException: " + e.getMessage());
        }
    }

    private void doHelp(HttpServletRequest req, HttpServletResponse res, String xxx) {
        ServletOutputStream out = null;
        try {
            out = res.getOutputStream();

            out.println("<!-- " + xxx + " -->");

            out.println("<help>");
            out.println("You must pass in an xml query parameter (?xml=...).  ");
            out.println("The following are valid xml values.");

            out.println("<xml description=\"Save message.\" >");
            out.println("<resultset>");
            out.println("<root dset=\"message\"><from name=\"aName\" />messageText</root>");
            out.println("</resultset>");
            out.println("</xml>");

            out.println("<xml description=\"Get message history.\" >");
            out.println("<resultset>");
            out.println("<root><history/></root>");
            out.println("</resultset>");
            out.println("</xml>");

            out.println("<xml description=\"LPS push of client disconnect.\" >");
            out.println("<resultset>");
            out.println("<root dset=\"__LPSUSERDISCONNECT\">username</root>");
            out.println("</resultset>");
            out.println("</xml>");

            out.println("</help>");
            out.flush();
        } catch (IOException e) { 
            mLogger.info("IOException: " + e.getMessage());
        } finally {
            close(out);
        }
    }

    private void doSaveMessage(HttpServletRequest req, HttpServletResponse res, Document doc) {
        mLogger.debug("doSaveMessage()");
        if (mHistory.size() == mHistoryLength) {
            mHistory.remove(0);
        }
        String message = doc.getRootElement().getChild("root").getText();
        mHistory.add(message);

        ServletOutputStream out = null;
        try {
            out = res.getOutputStream();
            out.println("<status message=\"message saved\" />");
            out.flush();
        } catch (IOException e) { 
            mLogger.info("IOException: " + e.getMessage());
        } finally {
            close(out);
        }
    }

    private String getXMLHistory() {
        StringBuffer buf = new StringBuffer();
        for (int i=0; i < mHistory.size(); i++) {
            buf.append("<message>")
                .append((String)mHistory.get(i))
                .append("</message>\n");
        }
        return buf.toString();
    }


    private void doSendHistory(HttpServletRequest req, HttpServletResponse res,
                               Document doc) {
        mLogger.info("doSendHistory");
        Element el = doc.getRootElement().getChild("root").getChild("history");

        ServletOutputStream out = null;
        GetMethod request = null;
        String status = null;
        String body = null;
        try {
            out = res.getOutputStream();

            request = new MyGetMethod();

            String url = mURL 
                + "?lzt=agentmessage"
                + "&url=" + URLEncoder.encode(mAgentURL)
                + "&group=" + mAgentGroup
                + "&to=*&range=user" 
                + "&dset=" + mClientDataset
                + "&msg=" + URLEncoder.encode(getXMLHistory());

            mLogger.debug("url: " + url);
            URI uri = new URI(url.toCharArray());
            HostConfiguration hcfg = new HostConfiguration();
            hcfg.setHost(uri);

            String path = uri.getEscapedPath();
            String query = uri.getEscapedQuery();

            mLogger.debug("path: " + path);
            mLogger.debug("query: " + query);

            request.setPath(path);
            request.setQueryString(query);

            HttpClient htc = new HttpClient(mConnectionMgr);
            htc.setHostConfiguration(hcfg);
            int rc = htc.executeMethod(hcfg, request);

            status = HttpStatus.getStatusText(rc);
            if (status == null) {
                status = "" + rc;
            }
            mLogger.debug("remote response status: " + status);

            body = request.getResponseBodyAsString();

            mLogger.debug("response body: " + body);
        } catch (HttpRecoverableException e) {
            mLogger.debug("HttpRecoverableException: " + e.getMessage());
            sendError(out, "<status message=\"HttpRecoverableException " + e.getMessage() + "\" />");
        } catch (HttpException e) {
            mLogger.debug("HttpException: " + e.getMessage());
            sendError(out, "<status message=\"HttpException " + e.getMessage() + "\" />");
        } catch (IOException e) {
            mLogger.debug("IOException: " + e.getMessage());
            sendError(out, "<status message=\"IOException " + e.getMessage() + "\" />");
        } finally {
            if (request != null) {
                request.releaseConnection();
            }
        }

        try {
            if (status != null && status.equals("OK")) {
                out.println("<status message=\"ok\">" + (body!=null?body:"") + "</status>");
            } else {
                out.println("<status message=\"" + mURL + "?lzt=agentmessage" + " " + status + "\" />");
            }
            out.flush();
        } catch  (IOException e) {
            mLogger.debug("Client IOException");
            // ignore client ioexception
        } finally {
            close(out);
        }
    }

    private void sendError(ServletOutputStream out, String error) {
        try {
            out.println(error);
        } catch (IOException e) {
        }
    }

    private int peekAtType(Document doc)
        throws JDOMException {

        Element el = doc.getRootElement().getChild("root");
        if (el == null)
            return TYPE_UNKNOWN;

        String dset = el.getAttributeValue("dset");
        if (dset != null && dset.equals("__LPSUSERDISCONNECT")) {
            return TYPE_USERDISCONNECT;
        } else if (dset != null && dset.equals("message") && el.getChild("from") != null) {
            return TYPE_MESSAGE;
        } else if (el.getChild("history") != null) {
            return TYPE_HISTORY;
        }

        return TYPE_UNKNOWN;
    }

    private void close(OutputStream out) {
        try {
            if (out != null)
                out.close();
        } catch (IOException e) {
        }
    }
}
