/* *****************************************************************************
 * ScriptCompiler.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
 * Copyright 2001-2006, 2008, 2009 Laszlo Systems, Inc.  All Rights Reserved.              *
 * Use is subject to license terms.                                            *
 * J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.sc;
import java.io.*;

/** Utility class to hold information about a run of the script compiler
 * @author  Henry Minsky
 */
public class ScriptCompilerInfo {
    /** Path to the main application's as3 working directory */
    public File mainAppWorkDir = null;
    /** Path to a (library) compile's as3 working directory */
    public File workDir = null;

    public String buildDirPathPrefix = null;

    public String toString() {
        return "{ScriptCompilerInfo: mainAppWorkDir="+mainAppWorkDir+
            ", workDir="+workDir+
            " buildDirPathPrefix="+buildDirPathPrefix+"}";
    }

}

