/* *****************************************************************************
 * DataCompiler.java
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.compiler;
import org.openlaszlo.auth.AuthenticationException;
import org.openlaszlo.iv.flash.api.action.*;
import java.io.*;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.openlaszlo.sc.ScriptCompiler;
import org.openlaszlo.xml.internal.XMLUtils;

/** Compiler for local data elements.
 *
 * @author  Henry Minsky
 * @author  Oliver Steele
 */
class DataCompiler extends ElementCompiler {
    static final String LOCAL_DATA_FNAME = "lzAddLocalData";

    DataCompiler(CompilationEnvironment env) {
        super(env);
    }

    static boolean isElement(Element element) {
        if (element.getName().equals("dataset")) {
            // return type in ('soap', 'http') or src is url
            String src = element.getAttributeValue("src");
            String type = element.getAttributeValue("type");
            if (type != null && (type.equals("soap") || type.equals("http"))) {
                return false;
            }
            if (src != null && src.indexOf("http:") == 0) {
                return false;
            }
            return src == null || !XMLUtils.isURL(src);
        }
        return false;
    }
    
    public void compile(Element element) {
        String dsetname = XMLUtils.requireAttributeValue(element, "name");
        String content = NodeModel.getDatasetContent(element, mEnv);
        mEnv.compileScript(LOCAL_DATA_FNAME+"("+ScriptCompiler.quote(dsetname) + ", " +content+");\n");
    }

}
