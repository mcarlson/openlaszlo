/******************************************************************************
 * LZClientObject.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.remote.json;

import java.io.*;
import java.lang.reflect.*;
import javax.servlet.http.*;
import org.openlaszlo.iv.flash.util.*;
import org.openlaszlo.iv.flash.api.action.*;
import org.openlaszlo.iv.flash.api.*;
import org.openlaszlo.utils.*;
import org.openlaszlo.xml.internal.DataCommon;
import org.openlaszlo.xml.internal.DataContext;
import org.openlaszlo.sc.ScriptCompiler;
import org.apache.log4j.*;

/**
 * Utility class to create object JSON based on a server object.
 */
public class LZClientObject
{
    public static Logger mLogger = Logger.getLogger(LZClientObject.class);

    /**
     */
    public static String createObjectProgram(String classname, String scope, Class c) {
        if (mLogger.isDebugEnabled()) {
            mLogger.debug("createObjectProgram (JSON)(" + classname + "," + "," + scope + "," 
                          + c.getName() + ")" );
        }


        StringBuffer body = new StringBuffer();

        // Tells client data returned is an object 
        // this.__LZstubload = true
        body.append("{");
        body.append("\"__LZstubload\": true, ");
        // SOAP specific information
        body.append("\"stubinfo\": ");
        body.append("{\"remoteClass\": "+ScriptCompiler.quote(classname)+"}, ");


        // object.stub
        body.append("\"stub\": ");
        body.append("{");

        int count = 0;
        boolean onlyStatic = "staticobject".equals(scope);

        //------------------------------------------------------------
        // Create methods for object
        Method[] methods = c.getMethods();
        for (int i=0; i < methods.length; i++) {

            // Skip Object methods
            if (methods[i].getDeclaringClass() == Object.class) {
                continue;
            }

            // Check if we only want static methods
            if (onlyStatic &&
                ! Modifier.isStatic(methods[i].getModifiers())) {
                continue;
            }

            // Skip toString method.
            String methodName = methods[i].getName();
            if ("toString".equals(methodName)) {
                continue;
            }

            count++;

            if (i > 0) {
                body.append(",");
            }

            //------------------------------------------------------------
            //
            body.append(ScriptCompiler.quote(methodName)+": {");
            // Check to see if method's last two parameters are
            // HttpServletRequest and HttpServletResponse.
            Class[] params = methods[i].getParameterTypes();
            int len = params.length;
            boolean doreq = // next to last or last argument
                (len > 1 && params[len-2] == HttpServletRequest.class) ||
                (len > 0 && params[len-1] == HttpServletRequest.class);
            boolean dores = // should be last argument
                (len > 0 && params[len-1] == HttpServletResponse.class);

            // arguments.callee.args gets set in the client and includes
            // secure and secureport information.  
            //
            // _root.LzRemote.invoke(
            //     arguments,
            //     delegate,
            //     classname,
            //     classname + "." + methodName,
            //     { op: 'session', doreq..., dores... },
            //     this.secure,
            //     this.secureport
            // );

            // { op: 'invoke', oname: varname, scope: scope, 
            //   objectreturntype: objectreturntype, 
            //   doreq: TBD, dores: TBD}
                    
            body.append("\"op\": \"invoke\", ");
            body.append("\"classname\": "+ScriptCompiler.quote(classname)+", ");
            body.append("\"methodname\": "+ScriptCompiler.quote(classname+"."+methodName));

            if (doreq) {
                body.append(", \"doreq\": true");
            }
            if (dores) {
                body.append(", \"dores\": true");
            }

            body.append("}\n");
        }
        body.append ("}");
        body.append("}\n");

        return body.toString();
    }

    /**
       Return JSON representation of CLASSNAME
     */
    public static byte[] createObject(String classname, String scope)
        throws IOException {
        if (mLogger.isDebugEnabled()) {
            mLogger.debug("createObject(JSON)(" + classname + "," + scope + ")" );
        }

        Class c;
        try {
            c = Class.forName(classname);
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("Can't find class " + classname);
        }

        int i = 0;
        try {
            String buf = createObjectProgram(classname, scope, c);
            mLogger.debug("ClientObject:");
            mLogger.debug(buf);
            return buf.getBytes("UTF-8");
        } catch (IOException e) {
            mLogger.error("io error creating object JSON: " + e.getMessage());
            throw e;
        }
    }

}
