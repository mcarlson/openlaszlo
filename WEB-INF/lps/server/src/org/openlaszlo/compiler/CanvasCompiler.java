/* *****************************************************************************
 * CanvasCompiler.java
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.compiler;

import java.io.*;
import java.util.*;

import org.openlaszlo.compiler.ViewCompiler.*;
import org.openlaszlo.compiler.ViewSchema.ColorFormatException;
import org.openlaszlo.sc.*;
import org.openlaszlo.server.*;
import org.openlaszlo.utils.*;
import org.jdom.*;
import org.apache.log4j.*;
import org.openlaszlo.css.CSSParser;

/** Compiler for the <code>canvas</code> element. */
class CanvasCompiler extends ToplevelCompiler {
    /** Logger */
    private static Logger mLogger = Logger.getLogger(CanvasCompiler.class);

    CanvasCompiler(CompilationEnvironment env) {
        super(env);
    }
    
    static boolean isElement(Element element) {
        return element.getName().equals("canvas");
    }
    
    public void compile(Element element) throws CompilationError
    {
        Canvas canvas = new Canvas();
        // explicitly supplied lzproxied query arg or command line arg
        String lzproxied = mEnv.getCommandLineOption(mEnv.PROXIED_PROPERTY);
        // canvas attribute
        String cproxied = element.getAttributeValue("proxied");

        canvas.setDebug(mEnv.getBooleanProperty(CompilationEnvironment.DEBUG_PROPERTY));
        canvas.setProfile(mEnv.getBooleanProperty(CompilationEnvironment.PROFILE_PROPERTY));
        canvas.setBacktrace(mEnv.getBooleanProperty(CompilationEnvironment.BACKTRACE_PROPERTY));
        canvas.setSourceAnnotations(mEnv.getBooleanProperty(CompilationEnvironment.SOURCE_ANNOTATIONS_PROPERTY));

        // Set the "proxied" flag for this app.
        // canvas attribute overrides passed in arg, warn for conflict
        if (cproxied != null && !cproxied.equals("inherit")) {
            if (lzproxied != null && !lzproxied.equals(cproxied)) {
                mEnv.warn(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="The canvas attribute 'proxied=" + p[0] + "' conflicts with the 'lzproxied=" + p[1] + "' query arg"
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                CanvasCompiler.class.getName(),"051018-56", new Object[] {cproxied, lzproxied})
                        , element);
            }
            canvas.setProxied(cproxied.equals("true"));
        } else {
            // inherit from lzproxied arg, or system default
            canvas.setProxied(mEnv.getBooleanProperty(mEnv.PROXIED_PROPERTY));
        }

        String versionNumber = element.getAttributeValue("version");
        if (versionNumber != null) {
            String msg = 
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="The canvas is declared with version=\"" + p[0] + "\".  This version of the LPS compiles version 1.1 files.  This applicaton may not behave as intended when compiled with this version of the product."
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                CanvasCompiler.class.getName(),"051018-77", new Object[] {versionNumber})
;
            if (versionNumber.equals("4.2"))
                ;
            else if (versionNumber.equals("1.1") || versionNumber.equals("1.0")) 
                mEnv.warn(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes=p[0] + "  It is recommended that you run it in debug mode and fix all compiler and debugger warnings, and that you read the migration guide in the developer documentation."
 */
                org.openlaszlo.i18n.LaszloMessages.getMessage(
                    CanvasCompiler.class.getName(),"051018-88", new Object[] {msg})
, element);
            else
                mEnv.warn(msg, element);
        }

        String scriptLimits = element.getAttributeValue("scriptlimits");
        if (scriptLimits != null) {
          try {
            Map properties = new CSSParser(new AttributeStream(element, "scriptlimits")).Parse();
            int recursion =
              properties.containsKey("recursion") ?
              ((Integer)properties.get("recursion")).intValue() : 0;
            int timeout =
              properties.containsKey("timeout") ?
              ((Integer)properties.get("timeout")).intValue() : 0;
            mEnv.setScriptLimits(recursion, timeout);
          } catch (org.openlaszlo.css.ParseException e) {
            throw new CompilationError(e);
          } catch (org.openlaszlo.css.TokenMgrError e) {
            throw new CompilationError(e);
          }
        }

        if (mEnv.isSWF()) {
          String baseLibraryName = getBaseLibraryName(mEnv);
          String baseLibraryBecause = "Required for all applications";

          // TODO [2004-06-02]: explanation for debug attribute and
          // request parameter
        
            mEnv.getGenerator().importBaseLibrary(baseLibraryName, mEnv);
        }
        
        canvas.setRuntime(mEnv.getRuntime());
        initializeFromElement(canvas, element);
        
        // Default to true, embed fonts in swf file
        boolean embedFonts = true;
        String embed = element.getAttributeValue(CompilationEnvironment.EMBEDFONTS_PROPERTY);
        if ("false".equals(embed)) {
            embedFonts = false;
        }
        mEnv.setEmbedFonts(embedFonts);
        ViewSchema schema = mEnv.getSchema();
        NodeModel model = NodeModel.elementOnlyAsModel(element, schema, mEnv);
        computePropertiesAndGlobals(element, model, schema);

        Map map = createCanvasObject(element, canvas, model);
        String script;
        try {
            java.io.Writer writer = new java.io.StringWriter();
            writer.write("canvas = new " + map.get("class") + "(null, ");
            ScriptCompiler.writeObject(map.get("attrs"), writer);
            writer.write(");"); 
            script = writer.toString();
        } catch (java.io.IOException e) {
            throw new ChainedException(e);
        }
        if (mEnv.isCanvas()) {
            throw new CompilationError(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="An application may only have one canvas tag.  Check included files for a duplicate canvas tag"
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                CanvasCompiler.class.getName(),"051018-131")
, element);
        }
        
        mEnv.setCanvas(canvas, script);
        
        // Compile (import) canvas's fonts first
        for (Iterator iter = 
                 element.getChildren("font", element.getNamespace()).iterator(); 
             iter.hasNext(); ) {
            Compiler.compileElement((Element)iter.next(), mEnv);
        }
        
        handleAutoincludes(mEnv, element);
        
        // NOTE: [2009-02-18 ptw] Replaces super.compile(), Cf., ToplevelCompiler
        // Compile child elements
        for (Iterator iter = element.getChildren().iterator();
             iter.hasNext(); ) {
            Element child = (Element) iter.next();
            // fonts were compiled above
            // createCanvasObject, so ignore them here
            if (!NodeModel.isPropertyElement(child) && !FontCompiler.isElement(child)) {
                Compiler.compileElement(child, mEnv);
            }
        }
        
        outputTagMap(mEnv);
    }
        
    private Map createCanvasObject(Element element, Canvas canvas, NodeModel model) {
        // Cheating, but canvas needs to add inits, since the compiler
        // does not know that these are already properties of the
        // superclass
        Map inits = new LinkedHashMap();

        // default dimension is 100% by 100%
        inits.put("width",  model.attrs.containsKey("width") ? model.attrs.get("width") : "100%");
        inits.put("height",  model.attrs.containsKey("height") ? model.attrs.get("height") : "100%");

        setDimension(inits, "width", canvas.getWidth());
        setDimension(inits, "height", canvas.getHeight());
        
        inits.put("lpsbuild", ScriptCompiler.quote(LPS.getBuild()));
        inits.put("lpsbuilddate", ScriptCompiler.quote(LPS.getBuildDate()));
        inits.put("lpsversion", ScriptCompiler.quote(LPS.getVersion()));
        inits.put("lpsrelease", ScriptCompiler.quote(LPS.getRelease()));
        inits.put("runtime", ScriptCompiler.quote(canvas.getRuntime()));
        inits.put("appbuilddate", ScriptCompiler.quote(org.openlaszlo.utils.DateUtils.getISO8601DateString(new Date())));
        inits.put("__LZproxied",
                  ScriptCompiler.quote(
                      mEnv.getProperty(mEnv.PROXIED_PROPERTY)));
        
        inits.put("embedfonts", Boolean.toString(mEnv.getEmbedFonts()));
        inits.put("bgcolor", new Integer(canvas.getBGColor()));
        FontInfo fontInfo = canvas.getFontInfo();
        inits.put("fontname", ScriptCompiler.quote(fontInfo.getName()));
        inits.put("fontsize", new Integer(fontInfo.getSize()));
        inits.put("fontstyle", ScriptCompiler.quote(fontInfo.getStyle()));
        if (element.getAttribute("id") != null)
            inits.put("id", ScriptCompiler.quote(element.getAttributeValue("id")));
        // Remove this so that Debug.write works in canvas methods.
        model.attrs.remove("debug");
        // Remove this since it isn't a JavaScript expression.
        model.attrs.remove("libraries");
        Map map = model.asMap();
        LinkedHashMap modelinits = (LinkedHashMap)map.get("attrs");
        if (modelinits == null) {
          map.put("attrs", inits);
        } else {
          modelinits.putAll(inits);
        }
        return map;
    }
    
    protected void setDimension(Map attrs, String name, int value) {
        String strval = (String) attrs.get(name);
        if (strval != null && isPercentageDimension(strval))
            attrs.put(name, ScriptCompiler.quote(strval));
        else
            attrs.put(name, new Integer(value));
    }
    
    protected boolean isPercentageDimension(String str) {
        return str.matches("\\s*(?:\\d+[.\\d*]|.\\d+)%\\s*");
    }
    
    /** 
     * Initializes the canvas from the Element and
     * removes any "special" children elements that
     * should not be compiled.
     *
     * @param elt element that contains the canvas
     */
    public void initializeFromElement(Canvas canvas, Element elt) {
        final String BGCOLOR_ATTR_NAME = "bgcolor";
        boolean resizable = false;
        
        String width = elt.getAttributeValue("width");
        String height = elt.getAttributeValue("height");
        String bgcolor = elt.getAttributeValue(BGCOLOR_ATTR_NAME);
        String title = elt.getAttributeValue("title");
        String id = elt.getAttributeValue("id");
        String accessible = elt.getAttributeValue("accessible");
        String history = elt.getAttributeValue("history");
        String framerate = elt.getAttributeValue("framerate");
        
        if (width != null) {
            if (isPercentageDimension(width)) {
                resizable = true;
                canvas.setWidthString(width);
            } else {
                try {
                    canvas.setWidth(Integer.parseInt(width));
                } catch (NumberFormatException e) {
                    throw new CompilationError(elt, "width", e);
                }
            }
        }
        if (height != null) {
            if (isPercentageDimension(height)) {
                resizable = true;
                canvas.setHeightString(height);
            } else {
                try {
                    canvas.setHeight(Integer.parseInt(height));
                } catch (NumberFormatException e) {
                    throw new CompilationError(elt, "height", e);
                }
            }
        }

        if (bgcolor != null) {
            try {
                canvas.setBGColor(ViewSchema.parseColor(bgcolor));
            } catch (ColorFormatException e) {
                throw new CompilationError(elt, BGCOLOR_ATTR_NAME, e);
            }
        }
        if (title != null) {
            canvas.setTitle(title);
        }
        if (id != null) {
            canvas.setID(id);
        }
        if (accessible != null) {
            canvas.setAccessible(accessible.equals("true"));
        }
        if (history != null) {
            canvas.setHistory(history.equals("true"));
        }
        if (framerate != null) {
            try {
                canvas.setFrameRate(Integer.parseInt(framerate));
            } catch (NumberFormatException e) {
                throw new CompilationError(elt, "framerate", e);
            }
        }
        
        // Persistent connection parameters
        canvas.initializeConnection(elt);
        
        String version = elt.getAttributeValue("version");
        if (version != null && !version.equals(canvas.DEFAULT_VERSION)) {
            if (version.equals("1.0")) {
                // TODO: [2003-10-25 bloch] these should come from a
                // properties file
                canvas.defaultFont = "lztahoe8";
                canvas.defaultFontFilename = "lztahoe8.ttf";
                canvas.defaultBoldFontFilename = "lztahoe8b.ttf";
                canvas.defaultItalicFontFilename = "lztahoe8i.ttf";
                // NOTE: [2003-10-30 bloch] we don't have lztahoe8bi yet
                // But 1.0 didn't either so this is prolly ok.
                canvas.defaultBoldItalicFontFilename = "lztahoe8bi.ttf"; 
            }
        }
        
        String font      = elt.getAttributeValue("font");
        String fontstyle = elt.getAttributeValue("fontstyle");
        String fontsize  = elt.getAttributeValue("fontsize");
        if (font == null || font.equals("")) {
            font = canvas.defaultFont();
        }
        if (fontstyle == null || fontstyle.equals("")) {
            fontstyle = canvas.DEFAULT_FONTSTYLE;
        }
        if (fontsize == null || fontsize.equals("") ) {
            fontsize = canvas.defaultFontsize();
        }
        
        canvas.setFontInfo(new FontInfo(font, fontsize, fontstyle));
        
    }
}
