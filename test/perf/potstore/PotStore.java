/******************************************************************************
 * PotStore.java
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
public class PotStore extends HttpServlet
{
    private static Logger mLogger  = Logger.getLogger(PotStore.class);

    private String mAlias = "PotStore";

    public void init (ServletConfig config) throws ServletException
    {
        super.init (config);

        System.out.println("in init()");

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
	    if (jdbc_db     == null) jdbc_db     = "potstore";
	    if (jdbc_host   == null) jdbc_host   = "localhost";
	    if (jdbc_usr    == null) jdbc_usr    = "potstore";
	    if (jdbc_pwd    == null) jdbc_pwd    = "potstore";
	    if (jdbc_url    == null) jdbc_url    = "jdbc:mysql://" + jdbc_host + "/" + jdbc_db;

	    log("JDBC_DRIVER: " + jdbc_driver);
	    log("JDBC_DB:     " + jdbc_db);
	    log("JDBC_HOST:   " + jdbc_host);
	    log("JDBC_USR:    " + jdbc_usr);
	    log("JDBC_PWD:    " + jdbc_pwd);
	    log("JDBC_URL:    " + jdbc_url);

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
            pool.addAlias(mAlias, jdbc_driver, jdbc_url, jdbc_usr, jdbc_pwd,
                          jdbc_max_connections, jdbc_idle_timeout, jdbc_checkout_timeout);

        } catch (SQLException e) {
            System.out.println("SQLException: " + e.getMessage());
            e.printStackTrace();
	    throw new ServletException(e.getMessage());
        } catch (Exception e) {
            System.out.println("Exception: " + e.getMessage());
            e.printStackTrace();
	    throw new ServletException(e.getMessage());
        }
    }



    public void doGet(HttpServletRequest req, HttpServletResponse res)
    {
        Connection conn = null;
        try {
            conn = DriverManager.getConnection
                (ConnectionPoolManager.URL_PREFIX + mAlias, null, null);

	    ServletOutputStream out = res.getOutputStream();
	    String path = req.getServletPath();

	    res.setContentType ("text/xml");

	    String type = req.getParameter("type");
	    if (type == null) type="x";

	    if (type.equals("1")) {
		getCategoryItems(req, res, conn, false);
	    } else if (type.equals("2")) {
		getItem(req, res, conn);
	    } else if (type.equals("3")) {
		getCategoryItems(req, res, conn, true);
	    } else if (type.equals("4")) {
		postInfo();
	    } else {
		out.println("<query></query>");
	    }

        } catch (IOException e) {
	    System.out.println("IOException: " + e.getMessage());
        } catch (SQLException e) {
	    System.out.println("SQLException: " + e.getMessage());
        } catch (Exception e) {
	    System.out.println("Exception: " + e.getMessage());
        } finally {
            try {
		if (conn != null)
		    conn.close();
            } catch (SQLException e) {
                System.out.println("Could not close connection");
            }
        }
    }


    void postInfo()
    {
    }

    void getItem(HttpServletRequest req, HttpServletResponse res, Connection conn)
	throws IOException
    {
	String sku = req.getParameter("sku");
	StringBuffer buf = new StringBuffer();

	buf.append("<query>\n");
	try { 
	    String query = 
		"SELECT price, title, image, description" +
		" FROM catalog where sku=" + sku;

	    Statement stmt = conn.createStatement();
	    ResultSet rs = stmt.executeQuery(query);

            if (rs.first()) {
		float     price  = rs.getFloat(1);
		String    title  = rs.getString(2);
		String    image  = rs.getString(3);
		String    descr  = rs.getString(4);

		buf.append("<record>\n");
		buf.append("<title>").append(title).append("</title>\n");
		buf.append("<description>").append(descr).append("</description>\n");
		buf.append("<image>").append(image).append("</image>\n");
		buf.append("<price>").append(price).append("</price>\n");
		buf.append("</record>\n");
	    }


	} catch (SQLException e) {
	    e.printStackTrace();
	    buf.append("<error string=\"exception\" />\n");
	}

	buf.append("</query>\n");

	ServletOutputStream out = res.getOutputStream();
	out.println(buf.toString());

    }

    void getCategoryItems(HttpServletRequest req, HttpServletResponse res, Connection conn,
			  boolean doFeature)
	throws IOException
    {
	String cat = req.getParameter("category");
	StringBuffer buf = new StringBuffer();

	buf.append("<query>\n");

	try { 
	    String query = 
		"SELECT sku, price, title, image, description" +
		" FROM catalog WHERE category=" + cat;

	    if (doFeature)
		query += " AND featured > 0";

	    Statement stmt = conn.createStatement();
	    ResultSet rs = stmt.executeQuery(query);

            for (rs.first(); ! rs.isAfterLast(); rs.next()) {
		int       sku    = rs.getInt(1);
		float     price  = rs.getFloat(2);
		String    title  = rs.getString(3);
		String    image  = rs.getString(4);
		String    descr  = rs.getString(5);

		buf.append("<record>\n");
		buf.append("<sku>").append(sku).append("</sku>\n");
		buf.append("<title>").append(title).append("</title>\n");
		buf.append("<price>").append(price).append("</price>\n");
		buf.append("<image>").append(image).append("</image>\n");
		buf.append("<description>").append(descr).append("</description>\n");
		buf.append("</record>\n");
	    }

	} catch (SQLException e) {
	    e.printStackTrace();
	    buf.append("<error string=\"exception\" />\n");
	}

	buf.append("</query>\n");

	ServletOutputStream out = res.getOutputStream();
	out.println(buf.toString());
    }
}
