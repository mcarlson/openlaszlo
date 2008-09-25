/******************************************************************************
 * DebugCompiler.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.compiler;

import org.jdom.Element;
import java.io.File;
import java.io.FileNotFoundException;
import java.util.*;

/** 
 * Compiler for <code>debug</code> element.
 *
 * @author  Henry Minsky
 */
class DebugCompiler extends ViewCompiler {
    DebugCompiler(CompilationEnvironment env) {
        super(env);
    }

    static final String DEBUG_WINDOW_CLASSNAME = "LzDebugWindow";

    /** Returns true iff this class applies to this element.
     * @param element an element
     * @return see doc
     */
    public static boolean isElement(Element element) {
        return element.getName().equals("debug");
    }

    public void compile(Element element) throws CompilationError
    {
        element.setName(DEBUG_WINDOW_CLASSNAME);
        // If the canvas does not have the debug flag, or if we have already instantiated a debugger,
        // return now.
        // Or, if lzconsoledebug=true, don't compile the debugger window view, we will be using
        // a remote connection instead. 
        if (!mEnv.getBooleanProperty(mEnv.DEBUG_PROPERTY)
            || mEnv.getBooleanProperty(mEnv.USER_DEBUG_WINDOW)
            // No debug window in DHTML -- it is in its own iframe.
            || mEnv.isDHTML()
            || mEnv.getBooleanProperty(mEnv.CONSOLEDEBUG_PROPERTY)) {
            return;
        } else {
            mEnv.setProperty(mEnv.USER_DEBUG_WINDOW, true);
            super.compile(element);
        }
    }
}
