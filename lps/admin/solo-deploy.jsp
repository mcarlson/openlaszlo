<%@ page contentType="text/html" %>
<%@ page import="java.net.*" %>
<%@ page import="java.util.*" %>
<%@ page import="java.util.regex.*" %>
<%@ page import="java.util.zip.*" %>
<%@ page import="java.io.*" %>
<%@ page import="org.openlaszlo.utils.FileUtils.*" %>
    

<html>
    <head>
    <title>SOLO Application Deployment Wizard</title>
    </head>
    <body>

<%

    /*
      We want an option to deploy an app and it's entire directory.

      So, for an app with is at /foo/bar/baz.lzx

      That should make a zip file which is relative to the web root and has
      /lps/includes/**
      /foo/bar/**   -- will include the SOLO .lzx.swf file(s)
      /foo/bar/baz.lzx.html  -- the wrapper file
    */


String whatpage = request.getParameter("whatpage");
if (whatpage == null) {
    whatpage = "configure";
}

String appUrl = request.getParameter("appurl");
if (appUrl == null) {
    appUrl = "";
}

appUrl = appUrl.trim();


String title = request.getParameter("apptitle");
if (title == null) {  title = ""; }

URL wrapperUrl = null;
URL lzhistUrl = null;

String appwidth = request.getParameter("appwidth");
String appheight = request.getParameter("appheight");

// Get app width/height from its canvas wrapper

// download text content of URL
StringBuffer wrapperbuf = new StringBuffer();
StringBuffer lzhistbuf = new StringBuffer();
String lzhistwrapper = "";


/*
request.getContextPath(): /lps-dev
request.getRequestURI(): /lps-dev/hqm/test/solo-deploy.jsp
request.getRequestURL(): http://localhost:8080/lps-dev/hqm/test/solo-deploy.jsp
request.getServletPath(): /hqm/test/solo-deploy.jsp
*/

String sUrl = request.getRequestURL().toString();
String servletPath = request.getServletPath();
String baseUrl = sUrl.substring(0, (sUrl.length() - servletPath.length())+1);

if (appUrl != null && appUrl.length() > 0) {
    // remove dangerous pathname components, "..", and "//"

    if (appUrl.indexOf("..") != -1 || appUrl.indexOf("//") != -1) {
        %>
        <h3><font color="red">Error, do not use '..' or '//' in your app pathname:  <%= appUrl %></font></h3>
             <%
    }
   try 
    {
        // okee dokee. Now we have to adjust the app path to be relative to
        // the server document root. 

        // say that appUrl == demos/vacation-survey/vacation-survey.lzx

        // trim leading slash
        if (appUrl.charAt(0) == '/') {
            appUrl = appUrl.substring(1);
        }


        // If there are no "/" separators in the non-zero position in the
        // url string , then the app url is at the LPS_HOME root, and that
        // is bad thing to try to zip up recursively, so issue a warning
        // and refuse to do it.
        if (appUrl.indexOf("/") == -1) {
        %>
        <h3><font color="red">Error</font> bad location for app file</h3>
You entered <tt><i><%= appUrl %></i></tt>, which names a file in the server document root directory. Please
place the file in a subdirectory of the server root directory and try
again with the new path.<p>
              Explanation: The SOLO deployment tool creates an
archive of all files, recursively, starting in the directory that
contains the application source file.  If the application source file
is in the servlet root container, this tool will create a zip that
contains all the files inside the root directory.  This directory
contains the entire OpenLaszlo binary distribution, so this is almost
certainly not what you want.
       <%        
          return;
        }

        wrapperUrl = new URL(new URL(baseUrl),
                             appUrl + "?lzt=html-object&lzproxied=false");

        lzhistUrl = new URL(new URL(baseUrl),
                             appUrl + "?lzt=html&lzproxied=false");

        // Grab a copy of the html-object wrapper
        String str;
        BufferedReader in = new BufferedReader(new InputStreamReader(wrapperUrl.openStream()));
        while ((str = in.readLine()) != null) 
        {
            wrapperbuf.append(str+"\n");
        }
        in.close();

        // load a copy of the lzhistory HTML wrapper
        in = new BufferedReader(new InputStreamReader(lzhistUrl.openStream()));
        while ((str = in.readLine()) != null) 
        {
            lzhistbuf.append(str+"\n");
        }
        in.close();

        lzhistwrapper = lzhistbuf.toString();
        // We need to adjust the lzhistory wrapper, to make the path to lps/includes/embed.js
        // be relative rather than absolute.
        
        // remove the servlet prefix and leading slash
        lzhistwrapper = lzhistwrapper.replaceAll(request.getContextPath()+"/", "");
        lzhistwrapper = lzhistwrapper.replaceAll("[.]lzx[?]lzt=swf", ".lzx.swf?");

    } 
    catch (MalformedURLException e) { %>

 <h3><font color="red">Error retrieving URL <%= appUrl %>: <%= e.toString() %></h3>
      <% }
    catch (IOException e) { %>

 <h3><font color="red">Error retrieving URL <%= appUrl %>: <%= e.toString() %></h3>
      <% } 
} else {

    appUrl = "examples/animation/animation.lzx";
}
        
String wrapper = wrapperbuf.toString();

// replace title
wrapper = wrapper.replaceFirst("<title>.*</title>", "<title>"+title+"</title>\n");



// extract width and height with regexp

Pattern pwidth = Pattern.compile("width=\"([0-9]*)\"");
Pattern pheight = Pattern.compile("height=\"([0-9]*)\"");
Matcher mwidth = pwidth.matcher(wrapper);
Matcher mheight = pheight.matcher(wrapper);

if (mwidth.find()) {
    appwidth = mwidth.group(1);
} else {
    appwidth = "640";
}


if (mheight.find()) {
    appheight = mheight.group(1);
} else {
    appheight = "400";
}

int nwidth = 640;
int nheight = 400;

try {
    nwidth = Integer.parseInt(appwidth);
    nheight = Integer.parseInt(appheight);
} catch (Exception e) {
    out.println(e.toString());
}



    // if no form vars, we are at page #0
    if (whatpage.equals("configure")) { 
%>
<font face="helvetica,arial"> <b> <i> Setup SOLO Application Deployment</i> </b> </font>
<hr align="left" width="420" height="2"/>


<br>
     
<table><tr><td width=600>
     This wizard will generate a zip file containing all the resources you need to deploy a serverless (SOLO) application. For deployments which do not require browser the Javscript browser integration support files, it  will also generate some simple HTML wrappers which can be cut and pasted into HTML pages.
</td></tr><table>

<form  method="POST" action="<%= sUrl %>">
<input type="hidden" name="whatpage" value="preview">
<table border=0 width=800>
  <tr>
     <tr><td/><td align="left"><i>Use a pathname relative to the LPS server root, e.g. if the LPS server is mapped to</i> <tt>http://localhost:8080/lps</tt><i>, and your application is accessed at </i><tt>http://localhost:8080/lps/examples/animation/animation.lzx</tt><i> then enter </i><tt><b>examples/animation/animation.lzx</b></tt></td>
</tr>
    <td align="right">Enter pathname of your application:</td><td><input name="appurl" size="64" type="text" value="<%= appUrl %>"/></td>
  </tr>
  <tr>
    <td align="right">Title for web page:</td><td><input name="apptitle" size="40" type="text" value="Laszlo Application"/></td>
  </tr>
  <tr><td/><td/></tr>
  <tr>
    <td align="right">Width x Height (leave blank for default):</td>
    <td><input name="appwidth" size="5" type="text"/> x <input name="appheight" size="5" type="text"/>
  </tr>
                                        
</table>
<p>
<input type=submit value="Continue...">


</form>
<p>
<%
} else if  (whatpage.equals("preview")){


    

%>
<font face="helvetica,arial"> <b> <i> Preview SOLO Application in Browser</i> </b> </font>
<hr align="left" width="420" height="2"/>
<p>

<%
String soloURL = (request.getContextPath()+"/" + appUrl + ".swf?lzproxied=false");
%>

<tt>Using URL</tt> <a href="<%= soloURL %>"><tt><%= soloURL %></tt></a>

<p>


<tt>Size = <%= appwidth %> x  <%= appheight %></tt>
    <p>
    
<iframe width="<%= nwidth +20 %>" height="<%= nheight +20 %>" src="<%= lzhistUrl %>"></iframe>
     <p>
<form  method="POST">
<input type=radio name="whatpage" value="download" checked> OK, give me the HTML wrapper code
<p> 
<input type=radio name="whatpage" value="configure">Go back to change</td>
<input type="hidden" name="appurl" value="<%= appUrl %>">
<input type="hidden" name="apptitle" value="<%= title %>">

<p>
<input type=submit value="Continue...">

<%

} else if  (whatpage.equals("download")){
%>
<%
     String htmlfile = "";

     // add in all the files in the app directory
     ServletContext ctx = getServletContext();

     // destination to output the zip file, will be the current jsp directory
     File tmpdir = new File(ctx.getRealPath(request.getServletPath().toString())).getParentFile();

     // The absolute path to the base directory of the server web root 
     File basedir = new File(ctx.getRealPath(request.getContextPath().toString())).getParentFile();

     // The absolute path to the application directory we are packaging
     // e.g., demos/amazon
     File appdir = new File(ctx.getRealPath(appUrl)).getParentFile();

     // These are the files to include in the ZIP file
     ArrayList filenames = new ArrayList();
     // LPS includes, (originally copied from /lps/includes/*)
     filenames.add("lps/includes/embed.js");
     filenames.add("lps/includes/h.html");
     filenames.add("lps/includes/h.swf");
     filenames.add("lps/includes/vbembed.js");

     ArrayList appfiles = new ArrayList();
     listFiles(appfiles, appdir);

    // Create a buffer for reading the files
     byte[] buf = new byte[1024];
     char[] cbuf = new char[1024];
    
     try {
         // Create the ZIP file
         String outFilename = "solo-deploy.zip";
         ZipOutputStream zout = new ZipOutputStream(new FileOutputStream(tmpdir+"/"+outFilename));

         // create a byte array from lzhistory wrapper text
         htmlfile = new File(appUrl).getName()+".html";

         byte lbytes[] = lzhistwrapper.getBytes();
         //Write out a copy of the lzhistory wrapper as appname.lzx.html
         zout.putNextEntry(new ZipEntry(htmlfile));
         zout.write(lbytes, 0, lbytes.length);
         zout.closeEntry();

         // Compress the include files
         for (int i=0; i<filenames.size(); i++) {
             FileInputStream in = new FileInputStream(basedir + "/" + (String) filenames.get(i));
             // Add ZIP entry to output stream.
             zout.putNextEntry(new ZipEntry((String) filenames.get(i)));
             // Transfer bytes from the file to the ZIP file
             int len;
             while ((len = in.read(buf)) > 0) {
                 zout.write(buf, 0, len);
             }
             // Complete the entry
             zout.closeEntry();
             in.close();
         }

         // Compress the app files
         for (int i=0; i<appfiles.size(); i++) {
             // skip the appname.lzx.html if it exists, since we just created a new
             // one in the zip archive.
             String fname = (String) appfiles.get(i);
             if (fname.equals(htmlfile)) { continue; }

             FileInputStream in = new FileInputStream((String) appfiles.get(i));
             String zipname = fname.substring(appdir.getPath().length()+1);

             // Add ZIP entry to output stream.
             zout.putNextEntry(new ZipEntry(zipname));
             // Transfer bytes from the file to the ZIP file
             int len;
             while ((len = in.read(buf)) > 0) {
                 zout.write(buf, 0, len);
             }
             // Complete the entry
             zout.closeEntry();
             in.close();
         }

         // Complete the ZIP file
         zout.close();
     } catch (IOException e) {
  %>         
  <h3><font color="red">Error generating zip file: <%= e.toString() %></h3>
  <%
   }
  %>
     <font face="helvetica,arial"> <b> <i> Zip file containing application deployment files</i> </b> </font>
<hr align="left" width="420" height="2"/>
<p>



Click here to <a href="solo-deploy.zip">download <tt>solo-deploy.zip</tt></a> zipfile.
<p>
In the zip file, a wrapper HTML file named <tt><%= htmlfile %></tt> has been created
to launch your SOLO application.
<p>


Note: the file may take a moment to generate and save to disk, please be patient.

  <p>
<font face="helvetica,arial"> <b> <i> SOLO Application Deployment: Wrapper HTML</i> </b> </font>
<hr align="left" width="420" height="2"/>
<p>
Paste this wrapper into a browser to deploy your app:

<p>
<textarea rows="20" cols="80">
<!DOCTYPE html
  PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
   <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <link rel="SHORTCUT ICON" href="http://www.laszlosystems.com/favicon.ico">
      <title><%= title %></title>
<style type="text/css">
          html, body { margin: 0; padding: 0; height: 100%; }
          body { background-color: #eaeaea; }
        </style></head>
   <body><object type="application/x-shockwave-flash" data="<%= appUrl %>.swf?lzproxied=false" width="640" height="400">
         <param name="movie" value="<%= appUrl %>.swf?lzproxied=false">
         <param name="quality" value="high">
         <param name="scale" value="noscale">
         <param name="salign" value="LT">
         <param name="menu" value="false"></object></body>
</html>
</textarea>

<p>



<font face="helvetica,arial"> <b> <i> Browser History/Integration Wrapper HTML</i> </b> </font>
<hr align="left" width="420" height="2"/>
<p>
Paste this wrapper into a browser to deploy your app:

<p>
<textarea rows="20" cols="80">
<%= lzhistwrapper %>
</textarea>
<p>



     <font face="helvetica,arial"> <b> <i> HTML code to pop up a new window with the app</i> </b> </font>
<hr align="left" width="420" height="2"/>
<p>
     
<textarea rows="20" cols="80">
<a href="<%= appUrl %>" target=_blank
    onClick="
    swin=window.open('', '<%= title %>', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=<%= nwidth %>,height=<%= nheight %>');

swin.document.write('<!DOCTYPE html');
swin.document.write('  PUBLIC \'-//W3C//DTD HTML 4.01 Transitional//EN\' \'http://www.w3.org/TR/html4/loose.dtd\'>');
     swin.document.write('<html>');
swin.document.write('   <head>');
swin.document.write('      <meta http-equiv=\'Content-Type\' content=\'text/html; charset=utf-8\'>');
swin.document.write('   ');
swin.document.write('      <link rel=\'SHORTCUT ICON\' href=\'http://www.laszlosystems.com/favicon.ico\'>');
swin.document.write('      <title>Laszlo Application</title>');
swin.document.write('<style type=\'text/css\'>');
swin.document.write('          html, body { margin: 0; padding: 0; height: 100%; }');
swin.document.write('          body { background-color: #eaeaea; }');
swin.document.write('        </style></head>');
swin.document.write('   <body><object type=\'application/x-shockwave-flash\' data=\'<%= appUrl %>.swf?lzproxied=false\' width=\'640\' height=\'400\'>');
swin.document.write('         <param name=\'movie\' value=\'<%= appUrl %>.swf?lzproxied=false\'>');
swin.document.write('         <param name=\'quality\' value=\'high\'>');
swin.document.write('         <param name=\'scale\' value=\'noscale\'>');
swin.document.write('         <param name=\'salign\' value=\'LT\'>');
swin.document.write('         <param name=\'menu\' value=\'false\'></object></body>');
swin.document.write('</html>');

    swin.focus();
    return false"
    onmouseover="window.status='Open in a new window';return true" onmouseout="window.status='';return true">Launch App Window</a>

</textarea>
<p>

    

<%

}


%>
</body>
    </html>

<%! 
    // utility methods

    public void listFiles(ArrayList fnames, File dir) {
       if (dir.isDirectory()) {
           String[] children = dir.list();
           for (int i=0; i<children.length; i++) {
               listFiles(fnames, new File(dir, children[i]));
           }
       } else {
           fnames.add(dir.getPath());
       }
    }
%>
