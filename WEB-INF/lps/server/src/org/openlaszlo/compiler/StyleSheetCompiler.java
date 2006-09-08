/* *****************************************************************************
 * StyleSheetCompiler.java
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.compiler;
import org.openlaszlo.css.CSSHandler;
import org.openlaszlo.utils.FileUtils;
import java.io.File;
import java.io.IOException;
import org.jdom.Element;
import org.apache.log4j.*;

/** Compiler for <code>stylesheet</code> elements.
 *
 * @author  Benjamin Shine
 */
class StyleSheetCompiler extends ElementCompiler {
    private static final String SRC_ATTR_NAME = "src";

    StyleSheetCompiler(CompilationEnvironment env) {
        super(env);
    }

    /** Returns true iff this class applies to this element.
     * @param element an element
     * @return see doc
     */
    static boolean isElement(Element element) {
        return element.getName().intern() == "stylesheet";
    }

    public void compile(Element element) {
        
         Logger.getLogger(StyleSheetCompiler.class)
                .info("StyleSheetCompiler.compile called!");
                
        if (!element.getChildren().isEmpty()) {
            throw new CompilationError("<stylesheet> elements can't have children",
                                       element);
        }
        String pathname = null;
        String stylesheet = element.getText(); 
        // TODO: if the stylesheet is actually a link to a file, read
        // in that file. 

        
        // Compile stylesheets to run at construction time in the view
        // instantiation queue.
        try {
            CSSHandler handler = CSSHandler.getHandler(stylesheet);
            mEnv.compileScript( handler.toJavascript() );                              
        } catch (CompilationError e) {
            Logger.getLogger(StyleSheetCompiler.class)
                .error("Error compiling StyleSheet element: " + stylesheet); 
            throw e;
        }
    }
}






