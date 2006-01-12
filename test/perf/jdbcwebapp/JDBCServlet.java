/******************************************************************************
 * JDBCServlet.java
 *****************************************************************************/
/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/
import java.io.*;
import java.net.*;
import java.util.*;
import javax.servlet.*;
import javax.servlet.http.*;
import org.apache.log4j.*;
import java.sql.*;
import com.bitmechanic.sql.*;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.output.XMLOutputter;

//------------------------------------------------------------------------------
// Example calls (from Jerry's examples.txt file):
//
// getCategories
//   Response XML:  getCategories.xml
//
// getUserSettings?cat=sports
//   Response XML:  getUserSettings-cat-sports.xml
//
// getHierarchy?cat=sports&hier=root&levels=5
//   Response XML:  getHierarchy-cat-sports-hier-root-levels-5.xml
//   Note: For this request, only a single branch of data is reflected in the
//   example response XML.  In actual implementation, all branches of data for all
//   5 levels would be returned.  (Of course, a request/response like this would
//   likely be impractical.)
//
// getHierarchy?cat=movie&search=01701
//   Response XML:  getHierarchy-cat-movie-search-01701.xml
//
// getHierarchy?cat=movie&search=999999
//   Response XML:  getHierarchy-cat-movie-search-error.xml
//
// getHierarchy?cat=weather&hier=root
//   Response XML:  getHierarchy-cat-weather-hier-root.xml
//   Note: In some cases, hierarchy ID values have been invented for information
//   that currently doesn't exist as a separate tier in Yahoo's existing
//   information hierarchy (e.g., lz_na for North America)
//
// getHierarchy?cat=weather&hier=lz_na,root
//   Response XML:  getHierarchy-cat-weather-hier-lz_na,root.xml
//
// getHierarchy?cat=weather&hier=h_51,lz_na,root
//   Response XML:  getHierarchy-cat-weather-hier-h_51,lz_na,root.xml
//
// getHierarchy?cat=weather&hier=h_53,h_51,lz_na,root
//   Response XML:  getHierarchy-cat-weather-hier-h_53,h_51,lz_na,root.xml
//------------------------------------------------------------------------------
public class JDBCServlet extends HttpServlet
{
    private static Logger mLogger  = Logger.getLogger(JDBCServlet.class);

    private String alias = "JDBCServlet";

    /**
     */
    public void init (ServletConfig config) throws ServletException
    {
        super.init (config);

        mLogger.debug("in init()");

        ServletContext ctxt = config.getServletContext();

        // Sanity check the servlet context version
        if (ctxt.getMajorVersion() < 2 || ctxt.getMinorVersion() < 2) {
            throw new ServletException("Must be at least " +
                                       "Version 2.2 Servlet Container!");
        }

        try {
	    String jdbc_driver = getInitParameter("JDBC_DRIVER");
	    String jdbc_db     = getInitParameter("JDBC_DB");
	    String jdbc_host   = getInitParameter("JDBC_HOST");
	    String jdbc_usr    = getInitParameter("JDBC_USR");
	    String jdbc_pwd    = getInitParameter("JDBC_PWD");
            String jdbc_url    = getInitParameter("JDBC_URL");

	    if (jdbc_driver == null) jdbc_driver = "com.mysql.jdbc.Driver";
	    if (jdbc_db     == null) jdbc_db     = "horton";
	    if (jdbc_host   == null) jdbc_host   = "localhost";
	    if (jdbc_usr    == null) jdbc_usr    = "horton";
	    if (jdbc_pwd    == null) jdbc_pwd    = "horton";
	    if (jdbc_url    == null) jdbc_url    = "jdbc:mysql://" + jdbc_host + "/" + jdbc_db;

	    log("JDBC_DRIVER: " + jdbc_driver);
	    log("JDBC_DB:     " + jdbc_db);
	    log("JDBC_HOST:   " + jdbc_host);
	    log("JDBC_USR:    " + jdbc_usr);
	    log("JDBC_PWD:    " + jdbc_pwd);
	    log("JDBC_URL:    " + jdbc_url);

	    mLogger.debug("JDBC_DRIVER: " + jdbc_driver);
	    mLogger.debug("JDBC_DB:     " + jdbc_db);
	    mLogger.debug("JDBC_HOST:   " + jdbc_host);
	    mLogger.debug("JDBC_USR:    " + jdbc_usr);
	    mLogger.debug("JDBC_PWD:    " + jdbc_pwd);

	    System.out.println("JDBC_DRIVER: " + jdbc_driver);
	    System.out.println("JDBC_DB:     " + jdbc_db);
	    System.out.println("JDBC_HOST:   " + jdbc_host);
	    System.out.println("JDBC_USR:    " + jdbc_usr);
	    System.out.println("JDBC_PWD:    " + jdbc_pwd);

            int jdbc_max_connections  = 100;
            int jdbc_idle_timeout     = 120;
            int jdbc_checkout_timeout = 120;

            Class.forName(jdbc_driver).newInstance();

            // Use jdbc pool
            ConnectionPoolManager pool = new ConnectionPoolManager(120);
            pool.addAlias(alias, jdbc_driver, jdbc_url, jdbc_usr, jdbc_pwd,
                          jdbc_max_connections, jdbc_idle_timeout, jdbc_checkout_timeout);

//             dbConn =
//                 DriverManager.getConnection(jdbc_url, jdbc_usr, jdbc_pwd);

        } catch (SQLException e) {
            mLogger.debug("SQLException: " + e.getMessage());
            e.printStackTrace();
	    throw new ServletException(e.getMessage());
        } catch (Exception e) {
            mLogger.debug("Exception: " + e.getMessage());
            e.printStackTrace();
	    throw new ServletException(e.getMessage());
        }
    }

    private void handleHierarchyLevels(Connection conn, 
                                       HttpServletRequest req, 
                                       HttpServletResponse res, 
                                       String catid)
        throws IOException, SQLException
    {
        mLogger.debug("in handleHierarchyLevels");

        // do levels thingy
        String levelsStr = req.getParameter("levels");
        int levels = 1;
        try {
            if (levelsStr != null)
                levels = Integer.valueOf(levelsStr).intValue();
        } catch (NumberFormatException e) {
        }
        if (levels<=0)
            levels=1;

        String reqhier = req.getParameter("hier");
        String hierid = null;
        StringTokenizer st = new StringTokenizer(reqhier, ",");
        if (st.hasMoreTokens())
            hierid = st.nextToken();

        ServletOutputStream out = res.getOutputStream();
        if (hierid == null) {
            out.println("Query parameter hier has not been specified or is not a valid hierarchy");
            out.close();
            return;
        }

        StringBuffer buf = new StringBuffer();
        PreparedStatement pstmt = conn.prepareStatement
            ("SELECT id, hierid, catid, label, isitem FROM topic " +
             "WHERE  catid=? AND hierid=?");
        pstmt.setString(1, catid);
        pstmt.setString(2, hierid);
        handleNextLevel(conn, pstmt, req, res, buf, catid, hierid, levels);
        pstmt.close();

        String topicAttr = "requesthier=\"" + reqhier + "\""
            + " hierid=\"" + hierid + "\""
            + " label=\"" + "alabel" + "\""
            + " error=\"0\"";

        buf.insert(0, "<topic " + topicAttr + ">\n")
            .append("</topic>\n");

        out.println(buf.toString());
        out.close();
    }

    private void handleNextLevel(Connection conn, PreparedStatement pstmt, 
                                 HttpServletRequest req, 
                                 HttpServletResponse res, StringBuffer buf,
                                 String catid, String hierid, int levels)
        throws IOException, SQLException
    {
        mLogger.debug("in handleNextLevel");

        if (levels==0)
            return;

        ServletOutputStream out = res.getOutputStream();
        ResultSet rs = pstmt.executeQuery();
        if (rs.first()) {
            String itemCheck = rs.getString(5);
            String tag = ( itemCheck == null ? "topic" : "item" );
            Vector idVect = new Vector();
            Vector labelVect = new Vector();
            for (; ! rs.isAfterLast(); rs.next()){
                idVect.add(rs.getString(1));
                labelVect.add(rs.getString(4));
            }
            rs.close();

            for (int i = 0; i < idVect.size(); i++) {
                String id = (String)idVect.get(i);
                String label = (String)labelVect.get(i);

                buf.append("<").append(tag)
                    .append(" hierid=\"").append(id).append("\"")
                    .append(" label=\"").append(label).append("\"")
                    .append(">\n");

                pstmt.setString(1, catid);
                pstmt.setString(2, id);
                handleNextLevel(conn, pstmt, req, res, buf, catid, id, levels-1);

                buf.append("</").append(tag).append(">");
            }
        }
    }


    /**
     */
    public void doGet(HttpServletRequest req, HttpServletResponse res)
    {
        mLogger.debug("in DOGET");

        Connection conn = null;
        try {
            conn = DriverManager.getConnection
                (ConnectionPoolManager.URL_PREFIX + alias, null, null);

	    ServletOutputStream out = res.getOutputStream();
	    String path = req.getServletPath();

	    res.setContentType ("text/xml");
	    //        res.setContentType ("text/plain");
	    if (path.equals("/getCategories"))
		respondWithCategoriesXML(conn, req, res);
	    else if (path.equals("/getHierarchy"))
		respondWithHierarchyXML(conn, req, res);
	    else if (path.equals("/getUserSettings"))
		respondWithUserSettingsXML(conn, req, res);
	    else
                out.println("what're you doing?");
        } catch (IOException e) {
	    mLogger.debug("IOException: " + e.getMessage());
        } catch (SQLException e) {
	    mLogger.debug("SQLException: " + e.getMessage());
        } catch (Exception e) {
	    mLogger.debug("Exception: " + e.getMessage());
        } finally {
            try {
                conn.close();
            } catch (SQLException e) {
                mLogger.debug("Could not close connection");
            }
        }
    }


    private void respondWithCategoriesXML(Connection conn, 
                                          HttpServletRequest req,
                                          HttpServletResponse res)
        throws IOException
    {
        mLogger.debug("in respondWithCategoriesXML");

        ServletOutputStream out = res.getOutputStream();

        try {
            StringBuffer buf = new StringBuffer("<categories error=\"0\">\n");
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT catid, label FROM category");
            for (rs.first(); ! rs.isAfterLast(); rs.next()) {
                String catid=rs.getString(1);
                String label=rs.getString(2);
                buf.append("<category catid=\"")
		    .append(catid)
		    .append("\" label=\"")
		    .append(label)
		    .append("\" />\n");
                mLogger.debug("1: " + catid);
                mLogger.debug("2: " + label);
		//              mLogger.debug("catid: " + rs.getString("catid"));
		//              mLogger.debug("label: " + rs.getString("label"));
            }
            rs.close();
            stmt.close();

            buf.append("</categories>");

            out.println(buf.toString());

        } catch (SQLException e) {
	    mLogger.debug("SQLException: " + e.getMessage());
        }

        out.close();
    }


    private void respondWithHierarchyXML(Connection conn, 
                                         HttpServletRequest req,
                                         HttpServletResponse res)
        throws IOException
    {
        mLogger.debug("in respondWithHierarchyXML");

        ServletOutputStream out = res.getOutputStream();
        String catid = req.getParameter("cat");
        if (catid == null) {
            out.println("Pass in \"cat\" (category id) parameter.");
            out.close();
            return;
        }

        try {
            if (req.getParameter("hier") != null) {

                String levelsStr = req.getParameter("levels");
                if (levelsStr != null)
                    handleHierarchyLevels(conn, req, res, catid);
                else
                    handleHierarchy(conn, req, res, catid);

            } else if (req.getParameter("search") != null) {

                handleSearch(conn, req, res, catid);

            } else {
                out.println("You need to pass in 'hier' or 'search'.");
                out.close();
            }

        } catch (SQLException e) {
            mLogger.debug("SQLException: " + e.getMessage());
        }
    }


    private void handleSearch(Connection conn, 
                              HttpServletRequest req, 
                              HttpServletResponse res, 
                              String catid)
        throws IOException, SQLException
    {
        mLogger.debug("in handleSearch");

        ServletOutputStream out = res.getOutputStream();

        String search = req.getParameter("search");
        if (search==null) {
            out.println("No search parameter");
            return;
        }

        // For now, this is just matching hierid with search query because
        // data populated will return the results listed under the horton
        // directory.
        PreparedStatement pstmt = conn.prepareStatement
            ("SELECT id, hierid, catid, label, isitem FROM topic " +
             "WHERE  catid=? AND hierid=?");
        pstmt.setString(1, catid);
        pstmt.setString(2, search);
        ResultSet rs = pstmt.executeQuery();
        StringBuffer buf = new StringBuffer();
        buf.append("<topic requesthier=\"").append(search).append("\"")
            .append(" hierid=\"").append(search).append("\"")
            .append(" label=\"Search results for ").append(search).append("\"")
            .append(" error=\"0\"")
            .append(">\n");
        if (rs.first()) {
            String itemCheck = rs.getString(5);
            String tag = ( itemCheck == null ? "topic" : "item" );
            for (; ! rs.isAfterLast(); rs.next()){
                buf.append("<").append(tag)
                    .append(" hierid=\"").append(rs.getString(1)).append("\"")
                    .append(" label=\"").append(rs.getString(4)).append("\"")
                    .append("/>\n");
            }
        }
        rs.close();
        pstmt.close();

        buf.append("</topic>\n");

        out.println(buf.toString());
        out.close();
    }


    private void handleHierarchy(Connection conn, 
                                 HttpServletRequest req, 
                                 HttpServletResponse res, 
                                 String catid)
        throws IOException, SQLException
    {
        mLogger.debug("in handleHierarchy");

        String reqhier = req.getParameter("hier");
        String hierid = null;

        StringTokenizer st = new StringTokenizer(reqhier, ",");

        if (st.hasMoreTokens())
            hierid = st.nextToken();

        if (hierid != null) {
            StringBuffer buf = new StringBuffer();
            PreparedStatement pstmt;
	    if (hierid.equals("root")) {
                pstmt = conn.prepareStatement
                    ("SELECT id, hierid, catid, label, isitem " +
                     "FROM   topic " + 
                     "WHERE  catid=? and hierid=?");
		pstmt.setString(1, catid);
		pstmt.setString(2, hierid);
	    } else {
                pstmt = conn.prepareStatement
                    ("SELECT t1.id, t1.hierid, t1.catid, t1.label, t1.isitem, t2.label " +
                     "FROM   topic t1, topic t2 " +
                     "WHERE  t1.catid=? and t1.hierid=? and t1.hierid=t2.id");
		pstmt.setString(1, catid);
		pstmt.setString(2, hierid);
	    }
	    ResultSet rs = pstmt.executeQuery();
            if (rs.first()) {
		String hierlabel = (hierid.equals("root") ? catid : rs.getString(6));
		buf.append("<topic requesthier=\"").append(reqhier).append("\"")
		    .append(" hierid=\"").append(hierid).append("\"")
		    .append(" label=\"").append(hierlabel).append("\"")
		    .append(" error=\"0\"")
		    .append(">\n");
		String itemCheck = rs.getString(5);
		String tag = ( itemCheck == null ? "topic" : "item" );
		for (; ! rs.isAfterLast(); rs.next()){
		    buf.append("<").append(tag)
			.append(" hierid=\"").append(rs.getString(1)).append("\"")
			.append(" label=\"").append(rs.getString(4)).append("\"")
			.append("/>\n");
		}
		buf.append("</topic>\n");

		ServletOutputStream out = res.getOutputStream();
		out.println(buf.toString());
		out.close();
	    } else {
		ServletOutputStream out = res.getOutputStream();
		out.println("<xxx>empty!</xxx>");
		out.close();
	    }
            rs.close();
            pstmt.close();
        }
    }


    private void respondWithUserSettingsXML(Connection conn, 
                                            HttpServletRequest req, 
                                            HttpServletResponse res)
        throws IOException
    {
        mLogger.debug("in respondWithUserSettingsXML");

        ServletOutputStream out = res.getOutputStream();
        String catid = req.getParameter("cat");
        if (catid == null) {
            out.println("Pass in \"cat\" (category id) parameter.");
            out.close();
            return;
        }

        try {
            PreparedStatement pstmt = conn.prepareStatement
                ("SELECT userid, catid, settingid, setting1, setting2, setting3 FROM user_settings " +
                 "WHERE  userid='johndoe' AND catid=?");
            pstmt.setString(1, catid);
            ResultSet rs = pstmt.executeQuery();

            StringBuffer buf = new StringBuffer();
            buf.append("<summary cat=\"").append(catid).append("\" error=\"0\">\n");

            if (rs.first()) {
                buf.append("<settings>\n");
                if (catid.equals("finance")) {
                    for (rs.first(); ! rs.isAfterLast(); rs.next())
                        buf.append("<portfolio")
                            .append(" portfolioid=\"").append(rs.getString(3)).append("\"")
                            .append(" label=\"").append(rs.getString(4)).append("\"")
                            .append("/>\n");
                } else if (catid.equals("movie")) {
                    buf.append("<zip>").append(rs.getString(4)).append("</zip>\n");
                } else if (catid.equals("news")) {
                    buf.append("<headlines>").append(rs.getString(4)).append("</headlines>\n");
                } else if (catid.equals("tv")) {
                    buf.append("<dispchannels>").append(rs.getString(4)).append("</dispchannels>\n");
                    buf.append("<starttime>").append(rs.getString(5)).append("</starttime>\n");
                    if (rs.getString(6) != null)
                        buf.append("<zip>").append(rs.getString(6)).append("</zip>\n");
                } else if (catid.equals("weather")) {
                    buf.append("<display>").append(rs.getString(4)).append("</display>\n");
                    if (rs.getString(5) != null)
                        buf.append("<zip>").append(rs.getString(5)).append("</zip>\n");
                }
                buf.append("</settings>\n");
            }
            rs.close();
            pstmt.close();

            rs = null;
            pstmt = null;

            pstmt = conn.prepareStatement
                ("SELECT userid, itemid, catid, label, category, " +
                 "       order_val, scoreboard, teamnews, calendars " +
                 "FROM   user_items " +
                 "WHERE  userid='johndoe' AND catid=?");
            pstmt.setString(1, catid);
            rs = pstmt.executeQuery();
            for (rs.first(); ! rs.isAfterLast(); rs.next()) {
                String itemid = rs.getString(2);
                String label = rs.getString(4);
                String category = rs.getString(5);
                String order = rs.getString(6);
                String scoreboard = rs.getString(7);
                String teamnews = rs.getString(8);
                String calendars = rs.getString(9);

                buf.append("<item")
                    .append(" itemid=\"").append(itemid).append("\"")
                    .append(" label=\"").append(label).append("\"")
                    .append(" category=\"").append(category).append("\"")
                    .append(" order=\"").append(order).append("\"");

                if (scoreboard == null) {
                    buf.append("/>\n");
                } else {
                    buf.append(">\n<prefs>\n")
                        .append("<scoreboard>").append(scoreboard).append("</scoreboard>\n")
                        .append("<teamnews>").append(teamnews).append("</teamnews>\n")
			.append("<calendars>").append(calendars).append("</calendars>\n")
                        .append("</prefs>\n")
                        .append("</item>\n");
                }
            }
            rs.close();
            pstmt.close();

            buf.append("</summary>");

            out.println(buf.toString());

        } catch (SQLException e) {
            mLogger.debug("SQLException: " + e.getMessage());
        }
        out.close();
    }
}
