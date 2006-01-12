<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<%@ page import="java.util.ArrayList,
                 java.io.*"%>

<%


      String res = "/test/results.txt";
      String src = "/test/all_lzx.txt";
      int offset=-1;
      int result=-1;

      String fileMessage = "";

      if ( request.getParameter("offset") != null && !  request.getParameter("offset").equals("")){
        offset=Integer.parseInt(request.getParameter("offset"));
      } 
      if ( request.getParameter("result") != null && !  request.getParameter("result").equals("")){
        result=Integer.parseInt(request.getParameter("result"));
      } 
      if ( request.getParameter("file") != null){
        res ="/test/"+request.getParameter("file")+"_results.txt";
      } 
      String srcFilePath=application.getRealPath(src);
      String resFilePath=application.getRealPath(res);


      try {
        File resFile = new File(resFilePath);
        if (! resFile.exists()) { // results file not there 
          // fileMessage="No File--- have to create it";
          File srcFile = new File(srcFilePath);
          if (! srcFile.exists()) {
            fileMessage="No all_lzx.txt, you can't run this test";
          } else {
            BufferedReader reader = new BufferedReader(new FileReader(srcFile));
            String line;
            StringBuffer sb = new StringBuffer();
            while ((line = reader.readLine()) != null) {
                sb.append(line+"\"0\"\n");
            }
            reader.close();
            String resData=sb.toString();
            BufferedWriter writer = new BufferedWriter(new FileWriter(resFile));
            writer.write(resData);
            writer.flush();
            writer.close();
          }
        }
        // load resFile into memory:
        BufferedReader reader = new BufferedReader(new FileReader(resFile));
        String line;
        ArrayList fileArray = new ArrayList(0);
        while ((line = reader.readLine()) != null) {
          // split the line:
          String[] lArry = line.split(",");
          fileArray.add(lArry);
        }
        reader.close();
        if ( offset > -1 && result > -1){
          if (! ((String[])fileArray.get(offset))[1].equals("\""+result+"\"")){
            ((String[])fileArray.get(offset))[1]="\""+result+"\"";
            // and we write out the file;
            StringBuffer sb = new StringBuffer();
            for (int i=0; i < fileArray.size(); i++){
              String[] lArry = (String[])fileArray.get(i);
              sb.append(lArry[0]+","+lArry[1]+"\n");
            }
            String resData=sb.toString();
            BufferedWriter writer = new BufferedWriter(new FileWriter(resFile));
            writer.write(resData);
            writer.flush();
            writer.close();
          }
        }
        StringBuffer sb = new StringBuffer();
        for (int i=0; i < fileArray.size(); i++){
          String[] lArry = (String[])fileArray.get(i);
          String style="";
          if (lArry[1].equals("\"0\"")) {lArry[1] = "&nbsp;";}  
          if (lArry[1].equals("\"1\"")) {lArry[1] = "PASS"; style="pass";} 
          if (lArry[1].equals("\"2\"")) {lArry[1] = "FAIL"; style="fail";}  
          sb.append("<tr><td><a name=\""+i+"\">"+i+"</a></td><td><span id=\""+style+"\">"+lArry[1]+"</span></td><td>"+lArry[0]+"</td></tr>");
        }
        String resData=sb.toString();
// now we can decide what we're gonna do...

%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>Hand Test Results</title>
<style>
      td {
        font-family: arial, helvetica;
        font-size:11;
      }
      #fail {
      background-color:red;
      font-family: arial, helvetica;
      color: white;
      font-size:11;
      font-weight:bold;
      }
      #pass {
      background-color:green;
      font-family: arial, helvetica;
      color: white;
      font-size:11;
      font-weight:bold;
      }
</style>
  </head>

  <body>
<table border="1">
<%= resData %>
</table>

</body>
</html>
<%
    } catch (Exception e) {
        out.println(e.getMessage());
    }
%>

