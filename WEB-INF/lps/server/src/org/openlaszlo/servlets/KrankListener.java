/******************************************************************************
 * KrankListener.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.servlets;

import java.net.*;
import java.io.*;
import org.jdom.*;
import org.jdom.input.*;
import org.jdom.output.*;
import org.openlaszlo.compiler.CompilationError;
import org.openlaszlo.server.LPS;
import java.util.*;

import org.openlaszlo.utils.FileUtils;

import org.apache.log4j.Logger;
/**
   Listen on port 4444 for krank serialization data, write to tmp file

*/

public class KrankListener extends Thread {
    private static Logger  mLogger = Logger.getLogger(KrankListener.class);
    public boolean busy = false;
    public String appname = "";
    // record how long the run took
    public long starttime;
    public long duration;
    public String appQueryString = "";

    public static final String IDLE = "IDLE";
    public static final String BUSY = "BUSY";
    public static final String FINISHED = "FINISHED";
    public static final String ABORTED = "ABORTED";
    public String state = IDLE;

    private Socket clientSocket;
    private ServerSocket serverSocket;


    ////////////////////////////////////////////////////////////////
    // args

    String prefix;
    File xmlFile;
    File krankedSWFfilecopy;
    File krankedSWF;
    File basepath;
    File targetSWF;
    File targetSWFgz;
    Properties myprops;
    int krankPortNum = 4444;


    public KrankListener() {};

    public KrankListener(
        String prefix,
        File xmlFile,
        File krankedSWF,
        File krankedSWFfilecopy,
        File basepath,
        File targetSWF,
        File targetSWFgz,
        Properties myprops) {

        this.prefix = prefix;
        this.xmlFile = xmlFile;
        this.krankedSWF = krankedSWF;
        this.krankedSWFfilecopy = krankedSWFfilecopy;
        this.basepath = basepath;
        this.targetSWF = targetSWF;
        this.targetSWFgz = targetSWFgz;
        this.myprops = myprops;
        this.krankPortNum = LPS.getKrankPort();
    }


    ////////////////////////////////////////////////////////////////


    // Maybe the only way to interrupt a thread which is waiting on I/O is
    // to close the socket. 
    public void closeSocket() {
        try {
            if (clientSocket != null) {
                clientSocket.close();
            } 
        } catch (IOException e) { }
            
        try {
            if (serverSocket != null) {
                serverSocket.close();
            } 
        } catch (IOException e) { }
    }


    public void setStateString(String s) {
        state = s;
    }

    public String getStateString() {
        return state;
    }

    public boolean isBusy () {
        return state.equals(BUSY);
    }

    public boolean isFinished () {
        return state.equals(FINISHED);
    }

    public boolean isAborted () {
        return state.equals(ABORTED);
    }

    public boolean isIdle () {
        return state.equals(IDLE);
    }

    public void setBusy (boolean b) {
        if (b) {
            setStateString(BUSY);
        } else {
            setStateString(IDLE);
        }
    }

    public long starttime () {
        return starttime;
    }
    public long getDuration () {
        return duration;
    }

    public void setDuration (long d) {
        duration = d;
    }

    public void setAppname (String s) {
        appname = s;
    }
    public String getAppname () {
        return appname;
    }

    public void setAppQueryString (String s) {
        appQueryString = s;
    }
    public String getAppQueryString () {
        return appQueryString;
    }

    public void run() {
        try {
            setStateString(BUSY);
mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="starting KrankListener on app " + p[0] + " now"
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                KrankListener.class.getName(),"051018-171", new Object[] {prefix})
            );
            setAppname(prefix);
            listen(xmlFile);

            // Ask the cache for the location of the kranked swf
            // file but make sure it's not gzip'd. The file should
            // exist because we wouldn't have gotten here if the
            // server hadn't delivered it to the client, and the
            // client ran it and completed sending the xml
            // serialization data back to the server listener. If
            // the file doesn't exist for some reason, then, hey, no
            // big deal, we'll throw an exception, and better luck
            // next time.

mLogger.info(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="kranked swf file is at " + p[0]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                KrankListener.class.getName(),"051018-192", new Object[] {krankedSWF.getAbsolutePath()})
            );

            FileInputStream in = new FileInputStream(krankedSWF);
            // Copy to source tree
            FileOutputStream out = new FileOutputStream(krankedSWFfilecopy);
            FileUtils.send(in, out);
            FileUtils.close(out);
            FileUtils.close(in);

            mLogger.debug("basepath = "+basepath);
            new org.openlaszlo.sc.Regenerator().compile(myprops, new String[] { basepath.getAbsolutePath()});
            setStateString(FINISHED);
mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="kranking on " + p[0] + " finished!"
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                KrankListener.class.getName(),"051018-211", new Object[] {prefix})
            );

        } catch (Exception e) {
mLogger.error(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Exception caught while invoking KrankListener.listen(" + p[0] + "): " + p[1] + ":" + p[2]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                KrankListener.class.getName(),"051018-221", new Object[] {xmlFile, e, e.getMessage()})
            );
            setStateString(ABORTED);
throw new CompilationError(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Error invoking KrankListener.listen(" + p[0] + "): " + p[1] + ":" + p[2]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                KrankListener.class.getName(),"051018-230", new Object[] {xmlFile, e, e.getMessage()})
            );
        } finally {
            // clean up
            xmlFile.deleteOnExit();
            krankedSWFfilecopy.deleteOnExit();
        }
    }


    public  void listen (File outputFile) throws IOException, CompilationError {
        mLogger.info("KrankListener.listen("+outputFile+")");
        starttime = System.currentTimeMillis();
        serverSocket = null;
        try {
            serverSocket = new ServerSocket(krankPortNum);
        } catch (IOException e) {
mLogger.error(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Could not listen on port: " + p[0] + "."
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                KrankListener.class.getName(),"051018-253", new Object[] {new Integer(krankPortNum)})
            );
throw new CompilationError(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Krank listener could not listen on port " + p[0] + " " + p[1]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                KrankListener.class.getName(),"051018-261", new Object[] {new Integer(krankPortNum), outputFile.getAbsolutePath()})
            );
        }

mLogger.info(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="listening for connection on port " + p[0]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                KrankListener.class.getName(),"051018-271", new Object[] {new Integer(krankPortNum)})
        );

        clientSocket = null;
        try {
            clientSocket = serverSocket.accept();
        } catch (IOException e) {
            mLogger.error("Accept failed.");
throw new CompilationError(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Krank listener accept() failed for" + p[0]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                KrankListener.class.getName(),"051018-285", new Object[] {outputFile.getAbsolutePath()})
            );
        }

mLogger.info(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="accept on port " + p[0] + ", sending output to '" + p[1] + "'"
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                KrankListener.class.getName(),"051018-295", new Object[] {new Integer(krankPortNum), outputFile.getAbsolutePath()})
        );
        BufferedReader in = new BufferedReader(
                new InputStreamReader(
                clientSocket.getInputStream(), "UTF-8"));
     
        PrintWriter sockout = new PrintWriter(clientSocket.getOutputStream());
        String inputLine;
        FileOutputStream fs = new FileOutputStream(outputFile);
        PrintWriter out = new PrintWriter(fs);

        try {
            int n = 0;
            int NLINES = 500;
            while ((inputLine = in.readLine()) != null) {
                inputLine = inputLine.replace((char)0, ' ');
                //mLogger.debug("SOCKREAD: "+inputLine);
                n++;
                // Perform some XML fixup on the raw input line
                out.println(inputLine);
                if ((n % NLINES) == 0) {
                    mLogger.info("...read "+n+" lines...");
                }
                // </_top> indicates that the xml file is complete
                if (inputLine.indexOf("</_top>") >= 0) {
                    mLogger.debug("got </_top>, closing socket");
                    break;
                }
            }
        } catch (IOException e) {
            setStateString(ABORTED);
            throw new CompilationError(e);
        } finally {
            sockout.write("OK"+'\000');
            sockout.flush();
            out.flush();
            out.close();
            in.close();

            clientSocket.close();
            serverSocket.close();
        }
mLogger.info(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="data stream from client closed, output is in '" + p[0] + "'"
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                KrankListener.class.getName(),"051018-343", new Object[] {outputFile.getAbsolutePath()})
        );
    }
}
