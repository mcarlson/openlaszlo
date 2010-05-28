/* *****************************************************************************
 * ScriptElementCompiler.java
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2008, 2010 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.compiler;
import org.openlaszlo.utils.FileUtils;
import java.io.File;
import java.io.IOException;
import org.jdom.Element;

/** Compiler for <code>script</code> elements.
 *
 * @author  Oliver Steele
 */
class ScriptElementCompiler extends ElementCompiler {
    private static final String SRC_ATTR_NAME = "src";

    ScriptElementCompiler(CompilationEnvironment env) {
        super(env);
    }

    /** Returns true iff this class applies to this element.
     * @param element an element
     * @return see doc
     */
    static boolean isElement(Element element) {
        return element.getName().intern() == "script";
    }

    /** Returns true if ITEM is in a comma separated list L
     * @param item
     * @param l comma separated list
     * @return see doc
     */
    private boolean stringMember(String item, String l) {
        if (l != null) {
            String elts[] = l.split(",");
            for (int k = 0; k < elts.length; k++) {
                String elt = elts[k].trim();
                if (item.equals(elt)) {
                    return true;
                }
            }
            return false;
        } else {
            return false;
        }
    }
        

    public void compile(Element element) {
        if (!element.getChildren().isEmpty()) {
            throw new CompilationError("<script> elements can't have children",
                                       element);
        }
        String pathname = null;
        String script = element.getText();
        if (element.getAttribute(SRC_ATTR_NAME) != null) {
            pathname = element.getAttributeValue(SRC_ATTR_NAME);
            File file = mEnv.resolveReference(element, SRC_ATTR_NAME);
            try {
                script = "#file " + element.getAttributeValue(SRC_ATTR_NAME)
                    + "\n" +
                    "#line 1\n" + FileUtils.readFileString(file);
            } catch (IOException e) {
                throw new CompilationError(e);
            }
        }
        try {
            // If it is when=immediate, emit code inline
            if ("immediate".equals(element.getAttributeValue("when"))) {
                // Check if a 'runtimes' attribute is present on this
                // script element, and if current target runtime is
                // one of those listed.
                //
                // Also check that compiler options match what the lzo
                // was compiled with.
                //
                // If it's a match, that means we've got the script
                // compiled as a platform-specific 'binary' library
                // object file in the lzo file, so no need to compile
                // it now. We can just discard this lzx script code
                // block, and the compiler will link or append with
                // the binary object file.
                //
                // If the runtime and compiler options don't match,
                // use the lzs script block.
                String runtimes = element.getAttributeValue("runtimes");
                String options = element.getAttributeValue("options");

                // compute if the current compiler options match what's in the lzo
                String appOptions = "debug:"+mEnv.getBooleanProperty(mEnv.DEBUG_PROPERTY) + ";" +
                    "backtrace:"+mEnv.getBooleanProperty(mEnv.BACKTRACE_PROPERTY) + ";" +
                    "profile:"+mEnv.getBooleanProperty(mEnv.PROFILE_PROPERTY);
                boolean optionsMatch = appOptions.equals(options);
                SourceLocator loc = ((ElementWithLocationInfo)element).getSourceLocator();
                if (stringMember(mEnv.getRuntime(), runtimes) && optionsMatch) {
                    // Ignore the script, we're going to link to the precompiled .swc or .js directly
                    //
                    // In DHTML this outputs the .js file inline right now into the app object file.
                    //
                    // In SWF10, this is a no-op here, and the SWF9Writer sets up the linking for the flex compiler
                    // using the list of lzo's that was found earlier during include-file parsing. 
                    mEnv.getGenerator().outputLZO(loc.pathname);
                } else {
                    mEnv.compileScript(
                        CompilerUtils.sourceLocationDirective(element, true) + script + CompilerUtils.endSourceLocationDirective,
                        element);
                } 
            } else {
                // Compile scripts to run at construction time in the view
                // instantiation queue.

                mEnv.compileScript(
                    // Provide file info for anonymous function name
                    CompilerUtils.sourceLocationDirective(element, true) +
                    VIEW_INSTANTIATION_FNAME +
                    "({'class': lz.script, attrs: " +
                    "{script: function () {\n" +
                    "#beginContent\n" +
                    "#pragma 'scriptElement'\n" +
                    CompilerUtils.sourceLocationDirective(element, true) +
                    script +
                    CompilerUtils.endSourceLocationDirective +
                    "\n#endContent\n" +
                    // Scripts have no children
                    "}}}, 1)",
                    element);
            }
        } catch (CompilationError e) {
            // TODO: [2003-01-16] Instead of this, put the filename in ParseException,
            // and modify CompilationError.initElement to copy it from there.
            if (pathname != null) {
                e.setPathname(pathname);
            }
            throw e;
        }
    }
}
