<%@ page contentType="text/xml" %>
<%@ page import="java.util.*" %>
<%@ page import="java.util.regex.*" %>
<%@ page import="java.io.*" %>
<%@ page import="java.net.*" %>
<%@ page import="java.text.*" %>
<%@ page import="org.jdom.*" %>
<%@ page import="org.jdom.input.*" %>
<%@ page import="org.jdom.output.*" %>
<%@ page import="org.jdom.xpath.*" %>
<%!

/* X_LZ_COPYRIGHT_BEGIN ****************************************************
 * Copyright 2007-2009 Laszlo Systems, Inc.  All Rights Reserved.          *
 * Use is subject to license terms.                                        *
 * X_LZ_COPYRIGHT_END ******************************************************/


    public String devId =
        "cdVNj_FoE_w";


    public void reportError(
        String message,
        Document result)
    {
        Element el =
            new Element("error");

        el.setAttribute("message", message);

        result.setRootElement(el);
    }


    public Document loadDocumentFromUrl(
        String url,
        Document result)
    {
        BufferedReader inputFile = null;
        try {
            URL u = new URL(url);
            inputFile =
                new BufferedReader(
                    new InputStreamReader(
                        u.openStream()));
        } catch (Exception e) {
            reportError("Could not load url.", result);
            return null;
        } // try

        if (inputFile == null) {
            reportError("Problem loading url.",  result);
            return null;
        }

        SAXBuilder builder =
            new SAXBuilder();
        Document doc = null;

        try {
            doc = builder.build(inputFile);
            inputFile.close();
        } catch (JDOMException e) {
            reportError("Could not parse xml.", result);
            return null;
        } catch (IOException e) {
            reportError("Could not open file.", result);
            return null;
        } // try

        if (doc == null) {
            reportError("Problem parsing file.", result);
            return null;
        }

        return doc;
    }


    public boolean returnLibrary(
        Document doc,
        Document result)
    {
        Element libraryEl =
            new Element("library");

        Element rootEl =
            doc.getRootElement();

        if (rootEl == null) {
            reportError("Root element is null.", result);
            return false;
        }

        if (!rootEl.getName().equals("ut_response")) {
            reportError("Expected ut_response.", result);
            return false;
        }

        Element videoListEl =
            rootEl.getChild("video_list");
        if (videoListEl == null) {
            reportError("Expected videoList element.", result);
            return false;
        }

        List videoList =
            videoListEl.getChildren("video");
        if (videoList == null) {
            reportError("Expected video children.", result);
            return false;
        }

        Iterator videoListIt =
            videoList.iterator();
        while (videoListIt.hasNext()) {
            Element videoEl =
                (Element)videoListIt.next();

            Element resultEl =
                new Element("video");

            libraryEl.addContent(
                resultEl);

            Element el;

            el =
                videoEl.getChild("id");
            if (el == null) {
                reportError("Expected id element.", result);
                return false;
            }
            resultEl.setAttribute(
                "id",
                el.getText());

            el =
                videoEl.getChild("url");
            if (el == null) {
                reportError("Expected url element.", result);
                return false;
            }
            resultEl.setAttribute(
                "pageUrl",
                el.getText());

            el =
                videoEl.getChild("thumbnail_url");
            if (el == null) {
                reportError("Expected thumbnail_url element.", result);
                return false;
            }
            resultEl.setAttribute(
                "icon",
                el.getText());

            el =
                videoEl.getChild("title");
            if (el == null) {
                reportError("Expected title element.", result);
                return false;
            }
            resultEl.setAttribute(
                "title",
                el.getText());

            el =
                videoEl.getChild("description");
            if (el == null) {
                reportError("Expected description element.", result);
                return false;
            }
            resultEl.setAttribute(
                "description",
                el.getText());

            el =
                videoEl.getChild("length_seconds");
            if (el == null) {
                reportError("Expected length_seconds element.", result);
                return false;
            }
            resultEl.setAttribute(
                "duration",
                el.getText());

        }

        result.setRootElement(
            libraryEl);

        return true;
    }

    private String getVideoInfo (String id, Document result) {
         String pageUrl =
            "http://www.youtube.com/get_video_info?video_id=" + id;

        String content = null;
        try {
            URL u = new URL(pageUrl);
            BufferedReader inputFile = new BufferedReader(new InputStreamReader(u.openStream()));
            content = inputFile.readLine();
            inputFile.close();
        } catch (Exception e) {
            reportError("Could not load url " + pageUrl + ": " + e.toString(), result);
        }
        return content;
    }

    public void videoGetFlvUrl(
        String id,
        Document result)
    {
        final boolean HIRES = false;
        final boolean MP4 = false;

        String vidInfo = getVideoInfo(id, result);
        if (vidInfo == null) return;

        String tId = "";
        // Extract the token field
        Pattern tpat = Pattern.compile("token=([^&]*)&");
        Matcher tmatcher = tpat.matcher(vidInfo);
        if (tmatcher.find()) {
            try {
                tId = URLDecoder.decode(tmatcher.group(1), "UTF-8");
            } catch (UnsupportedEncodingException e) {
                reportError("cannot url-decode token argument: " + vidInfo, result);
                return;
            }
        } else {
            reportError("token argument not found in video-info: " + vidInfo, result);
            return;
        }

        String url = "http://www.youtube.com/get_video?video_id=" + id + "&t=" + tId + "&el=detailpage&ps=&fmt=34";
        if (HIRES) {
            url += "&fmt=6";
        } else if (MP4) {
            url += "&fmt=18";
        }

        Element resultEl = new Element("videoGetFlvUrlResult");
        resultEl.setAttribute("id", id);
        resultEl.setAttribute("t", tId);
        resultEl.setAttribute("url", url);
        result.setRootElement(resultEl);
    }


    public void videoGetDetails(
        String id,
        Document result)
    {
        String url =
            "http://www.youtube.com/api2_rest.php?method=youtube.videos.get_details&dev_id=";
        url += devId;
        url += "&video_id=";
        url += id;

        Document doc =
            loadDocumentFromUrl(url, result);

        if (doc == null) {
            return;
        }

        Element detailsEl =
            new Element("details");

        Element rootEl =
            doc.getRootElement();

        if (rootEl == null) {
            reportError("Root element is null.", result);
            return;
        }

        if (!rootEl.getName().equals("ut_response")) {
            reportError("Expected ut_response.", result);
            return;
        }

        Element videoDetailsEl =
            rootEl.getChild("video_details");
        if (videoDetailsEl == null) {
            reportError("Expected videoDetails element.", result);
            return;
        }

        Element el;

        detailsEl.setAttribute(
            "id",
            id);

        el =
            videoDetailsEl.getChild("author");
        if (el == null) {
            reportError("Expected author element.", result);
            return;
        }
        detailsEl.setAttribute(
            "author",
            el.getText());

        el =
            videoDetailsEl.getChild("title");
        if (el == null) {
            reportError("Expected title element.", result);
            return;
        }
        detailsEl.setAttribute(
            "title",
            el.getText());

        el =
            videoDetailsEl.getChild("rating_avg");
        if (el == null) {
            reportError("Expected rating_avg element.", result);
            return;
        }
        detailsEl.setAttribute(
            "rating_avg",
            el.getText());

        el =
            videoDetailsEl.getChild("rating_count");
        if (el == null) {
            reportError("Expected rating_count element.", result);
            return;
        }
        detailsEl.setAttribute(
            "rating_count",
            el.getText());

        el =
            videoDetailsEl.getChild("tags");
        if (el == null) {
            reportError("Expected tags element.", result);
            return;
        }
        detailsEl.setAttribute(
            "tags",
            el.getText());

        el =
            videoDetailsEl.getChild("description");
        if (el == null) {
            reportError("Expected description element.", result);
            return;
        }
        detailsEl.setAttribute(
            "description",
            el.getText());

        el =
            videoDetailsEl.getChild("view_count");
        if (el == null) {
            reportError("Expected view_count element.", result);
            return;
        }
        detailsEl.setAttribute(
            "view_count",
            el.getText());

        el =
            videoDetailsEl.getChild("upload_time");
        if (el == null) {
            reportError("Expected upload_time element.", result);
            return;
        }
        detailsEl.setAttribute(
            "upload_time",
            el.getText());

        el =
            videoDetailsEl.getChild("length_seconds");
        if (el == null) {
            reportError("Expected length_seconds element.", result);
            return;
        }
        detailsEl.setAttribute(
            "duration",
            el.getText());

        el =
            videoDetailsEl.getChild("comment_list");
        if (el == null) {
            reportError("Expected comment_list element.", result);
            return;
        }

        List commentList =
            el.getChildren("comment");
        if (commentList == null) {
            reportError("Expected comment children.", result);
            return;
        }

        Element commentsEl =
            new Element("comments");

        detailsEl.addContent(
            commentsEl);

        Iterator commentListIt =
            commentList.iterator();
        while (commentListIt.hasNext()) {
            Element commentEl =
                (Element)commentListIt.next();

            Element commentResultEl =
                new Element("comment");

            commentsEl.addContent(
                commentResultEl);

            el =
                commentEl.getChild("author");
            if (el == null) {
                reportError("Expected author element.", result);
                return;
            }
            commentResultEl.setAttribute(
                "author",
                el.getText());

            el =
                commentEl.getChild("time");
            if (el == null) {
                reportError("Expected time element.", result);
                return;
            }
            commentResultEl.setAttribute(
                "time",
                el.getText());

            el =
                commentEl.getChild("text");
            if (el == null) {
                reportError("Expected text element.", result);
                return;
            }
            commentResultEl.setAttribute(
                "text",
                el.getText());

        }

        result.setRootElement(
            detailsEl);
    }


    public void videosListFeatured(
        Document result)
    {
        String url =
            "http://www.youtube.com/api2_rest.php?method=youtube.videos.list_featured&dev_id=";
        url += devId;

        Document doc =
            loadDocumentFromUrl(url, result);

        if (doc == null) {
            return;
        }

        returnLibrary(doc, result);
    }


    public void videosListByTag(
        String tag,
        Document result)
    {
        String url =
            "http://www.youtube.com/api2_rest.php?method=youtube.videos.list_by_tag&dev_id=";
        url += devId;
        url += "&tag=";
        url += tag; // TODO: url encode tag

        Document doc =
            loadDocumentFromUrl(url, result);

        if (doc == null) {
            return;
        }

        returnLibrary(doc, result);
    }


    public void videosListByUser(
        String user,
        Document result)
    {
        String url =
            "http://www.youtube.com/api2_rest.php?method=youtube.videos.list_by_user&dev_id=";
        url += devId;
        url += "&user=";
        url += user; // TODO: url encode user

        Document doc =
            loadDocumentFromUrl(url, result);

        if (doc == null) {
            return;
        }

        returnLibrary(doc, result);
    }


%>


<%


    Document result =
        new Document();

    Enumeration params =
        request.getParameterNames();

    String method =
        request.getParameter("method");

    if (method == null) {

        reportError("Undefined method.", result);

    } else if (method.equals("videoGetDetails")) {

        String id =
            request.getParameter("id");

        if (id == null) {
            reportError("Undefined id parameter.", result);
        } else {
            videoGetDetails(
                id,
                result);
        }

    } else if (method.equals("videoGetFlvUrl")) {

        String id =
            request.getParameter("id");

        if (id == null) {
            reportError("Undefined id parameter.", result);
        } else {
            videoGetFlvUrl(
                id,
                result);
        }

    } else if (method.equals("videosListFeatured")) {

        videosListFeatured(
            result);

    } else if (method.equals("videosListByTag")) {

        String tag =
            request.getParameter("tag");

        if (tag == null) {
            reportError("Undefined tag parameter.", result);
        } else {
            videosListByTag(
                tag,
                result);
        }

    } else if (method.equals("videosListByUser")) {

        String user =
            request.getParameter("user");

        if (user == null) {
            reportError("Undefined user parameter.", result);
        } else {
            videosListByUser(
                user,
                result);
        }

    } else {

        reportError("Unknown method.", result);

    }

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
