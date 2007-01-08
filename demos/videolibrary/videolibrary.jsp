<%@ page contentType="text/xml" %>
<%@ page import="java.util.*" %>
<%@ page import="java.io.*" %>
<%@ page import="java.net.*" %>
<%@ page import="java.text.*" %>
<%@ page import="org.jdom.*" %>
<%@ page import="org.jdom.input.*" %>
<%@ page import="org.jdom.output.*" %>
<%@ page import="org.jdom.xpath.*" %>
<%!

    /* X_LZ_COPYRIGHT_BEGIN ****************************************************
     * Copyright 2007 Laszlo Systems, Inc.  All Rights Reserved.               *
     * Use is subject to license terms.                                        *
     * X_LZ_COPYRIGHT_END ******************************************************/


    // This is the RTMP server's directory containing the 
    // FLV video files. 
    public String libraryDirectory =
        //"/usr/local/src/red5/webapps/test/instance1/streams/";
        "/home/fms/applications/test/streams/instance1/";

    // This is the URL to the RTMP server publishing the library.
    // You should also configure the src attribute of the rtmpconnection 
    // in videolibrary.lzx to be the same url.
    public String libraryUrl =
        "rtmp://localhost/test/instance1/";


    // Report an error by creating an <error> element in the 
    // result document. 
    public void reportError(
        String message, 
        Document result)
    {
        Element el = 
            new Element("error");

        el.setAttribute("message", message);

        result.setRootElement(el);
    }


    // Return a <library> element containing <video> elements
    // for each video in the library. 
    public boolean getLibrary(
        Document result)
    {
        // We will create a bunch of <video> elements in 
        // this <library> element.
        Element libraryEl =
            new Element("library");

        // Get a list of the files in the library directory. 
        File dir = 
            new File(
                libraryDirectory);
        File[] children = 
            dir.listFiles();
        if (children == null) {
            reportError("Expected ut_response.", result);
            return false;
        }

        // Loop over all the files, making a <video> element 
        // for each flv file in the library directory. 
        int i;
        for (i = 0; i < children.length; i++) {

            File file = 
                children[i];

            // Skip directories and non-FLV files.
            if (file.isDirectory() ||
                !file.getName().toLowerCase().endsWith(".flv")) {
                continue;
            }

            // Get the absolute path without the .flv extension.
            String pathBase = 
                file.getPath();
            pathBase = 
                pathBase.substring(0, pathBase.length() - 4);

            // Get the relative url without the .flv extension.
            String url = file.getName();
            url = url.substring(0, url.length() - 4);

            // Create a <video> element and set its attributes.
            Element resultEl = 
                new Element("video");
            resultEl.setAttribute("url", url);
            resultEl.setAttribute("type", "rtmp");
            resultEl.setAttribute("title", file.getName());
            resultEl.setAttribute("description", "A video file.");

            // Look for meta data file, to override and 
            // define new attributes. The .meta file should
            // contain a list of lines in the form "key:value".
            File metaFile =
                new File(pathBase + ".meta");
            if (metaFile.exists()) {
                FileInputStream inputFile = null;
                try {
                    inputFile =
                        new FileInputStream(
                            metaFile);
                } catch (Exception e) {
                }
                
                // If we found a .meta file, then set the
                // <video> attributes from it.
                if (inputFile != null) {
                    BufferedInputStream bis = 
                        new BufferedInputStream(
                            inputFile);
                    DataInputStream dis = 
                        new DataInputStream(bis);
                    String line;
                    while (true) {
                        try {
                            line = dis.readLine();
                        } catch (Exception e) {
                            break;
                        }
                
                        if (line == null) {
                            break;
                        }

                        // Strip trailing returns and newlines.
                        while (line.length() > 0) {
                            char lastChar = 
                                line.charAt(line.length() - 1);
                            if ((lastChar != '\n') &&
                                (lastChar != '\r')) {
                                break;
                            }
                            line = 
                                line.substring(
                                    0, line.length() - 1);
                        }

                        // Strip leading and trailing white space.
                        line = line.trim();

                        // Ignore blank lines and comments.
                        if ((line.length() == 0) ||
                            (line.charAt(0) == '#')) {
                            continue;
                        }

                        // Find the colon separating key and value.
                        int colon =
                            line.indexOf(':');

                        // Ignore weird lines with a colon.
                        if (colon < 0) {
                            continue;
                        }

                        // Extract and strip white space from 
                        // the key and the value. 
                        String key =
                            line.substring(
                                0, colon).trim();
                        String val =
                            line.substring(
                                colon + 1, line.length()).trim();

                        // Set the attribute.
                        resultEl.setAttribute(key, val);
                    }
                }
            }

            // Add the <video> element to the <library> element.
            libraryEl.addContent(
                resultEl);

        }

        // Return the <library> element. 
        result.setRootElement(
            libraryEl);

        // Success!
        return true;
    }


%>


<%

    // Make the XML document to return.
    Document result =
        new Document();

    // Handle the request according to the method.
    Enumeration params = 
        request.getParameterNames();
    String method = 
        request.getParameter("method");

    // Dispatch on the method.
    if (method == null) {

        reportError("Undefined method.", result);

    } else if (method.equals("getLibrary")) {

        getLibrary(
            result);

    } else {

        reportError("Unknown method.", result);

    }

    // Return the result.
    org.jdom.output.Format format = 
        org.jdom.output.Format.getCompactFormat();
    format.setOmitDeclaration(
        true);
    XMLOutputter serializer =
        new XMLOutputter(
            format);
    serializer.output(
        result,
        out);

%>
