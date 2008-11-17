/*****************************************************************************
 * ObjectWriter.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.compiler;

import org.openlaszlo.sc.ScriptCompiler;
import org.openlaszlo.server.LPS;
import org.openlaszlo.utils.ChainedException;
import org.openlaszlo.utils.FileUtils;
import org.openlaszlo.utils.ListFormat;
import org.openlaszlo.iv.flash.api.*;
import org.openlaszlo.iv.flash.api.action.*;
import org.openlaszlo.iv.flash.api.button.*;
import org.openlaszlo.iv.flash.api.image.*;
import org.openlaszlo.iv.flash.api.sound.*;
import org.openlaszlo.iv.flash.api.shape.*;
import org.openlaszlo.iv.flash.api.text.*;
import org.openlaszlo.iv.flash.util.*;
import org.openlaszlo.iv.flash.cache.*;
import org.openlaszlo.compiler.CompilationEnvironment;

import org.openlaszlo.media.*;

import java.io.*;
import java.util.*;
import java.lang.Math;
import java.lang.Character;

import org.jdom.Element;

// jgen 1.4
import java.awt.geom.Rectangle2D;

import org.apache.log4j.*;

/** Accumulates code, XML, and assets to an object file.
 *
 * Properties documented in Compiler.getProperties.
 */
abstract class ObjectWriter {
    /** Stream to write to. */
    protected OutputStream mStream = null;

    /** True iff close() has been called. */
    protected boolean mCloseCalled = false;

    FontsCollector mFontsCollector = new FontsCollector();

    /** InfoXML */
    // [todo hqm 2006-08-02] change the name of this to something more
    // generic than 'swf'
    protected Element mInfo = new Element("swf");

    protected final CompilationEnvironment mEnv;

    /** Set of resoures we're importing into the output */
    protected final HashSet mMultiFrameResourceSet = new HashSet();

    /** Unique name supply for clip/js names */
    protected SymbolGenerator mNameSupply = new SymbolGenerator("$LZ");

    /** Has the preloader been added? */
    protected boolean mPreloaderAdded = false;

    /** Constant */
    protected final int TWIP = 20;

    /** Properties */
    protected Properties mProperties;

    protected String liburl = "";

    /** media cache for transcoding */
    protected CompilerMediaCache mCache = null;

    /** <String,Resource> maps resource files to the Resources 
     * definition in the swf file. */
    protected Map mResourceMap = new HashMap();
    protected Map mClickResourceMap = new HashMap();
    protected Map mMultiFrameResourceMap = new HashMap();

    /** Logger */
    protected static Logger mLogger = org.apache.log4j.Logger.getLogger(ObjectWriter.class);

    /** Canvas Height */
    protected int mHeight = 0;

    /** Canvas Width */
    protected int mWidth = 0;

    protected int mRecursionLimit   = 0;
    protected int mExecutionTimeout = 0;

    /**
     * Initialize jgenerator
     */
    static {
        org.openlaszlo.iv.flash.util.Util.init(LPS.getConfigDirectory());
    }

    /** Logger for jgenerator */
    /**
     * Initializes a ObjectWriter with an OutputStream to which a new object file
     * will be written when <code>ObjectWriter.close()</code> is called.
     * 
     * @param stream A <code>java.io.OutputStream</code> that the
     * movie will be written to.
     * @param props list of properties
     * @param cache media cache
     * @param importLibrary If true, the compiler will add in the LaszloLibrary.
     */
    ObjectWriter(Properties props, OutputStream stream,
              CompilerMediaCache cache,
              boolean importLibrary,
              CompilationEnvironment env) {
        this.mProperties   = props;
        this.mCache        = cache;
        this.mStream       = stream;
        this.mEnv          = env;
    }
    
    /**
     * Sets the canvas for the app
     *
     * @param canvas
     * 
     */
    abstract void setCanvas(Canvas canvas, String canvasConstructor);

    abstract void setCanvasDefaults(Canvas canvas, CompilerMediaCache mc);

    /** Compiles the specified script to bytecodes
     * and add its bytecodes to the app.
     *
     * @param script the script to be compiled
     * @return the number of bytes
     */
    public abstract int addScript(String script);

    class ImportResourceError extends CompilationError {

        ImportResourceError(String fileName, CompilationEnvironment env) {
            super("Can't import " + stripBaseName(fileName, env));
        }
        ImportResourceError(String fileName, String type, CompilationEnvironment env) {
            super("Can't import " + type + " " + stripBaseName(fileName, env));
        }
        ImportResourceError(String fileName, Exception e, CompilationEnvironment env) {
            super("Can't import " + stripBaseName(fileName, env) + ": " + e.getMessage());
        }
        ImportResourceError(String fileName, Exception e, String type, CompilationEnvironment env) {
            super("Can't import " + type + " " + stripBaseName(fileName, env) + ": " + e.getMessage());
        }

    }

    public static String stripBaseName (String fileName, CompilationEnvironment env) {
        try {
            fileName = (new File(fileName)).getCanonicalFile().toString();
        } catch (java.io.IOException e) {
        }
        String base = env.getErrorHandler().fileBase;
        if (base == null || "".equals(base)) {
            return fileName;
        }
        base = (new File(base)).getAbsolutePath() + File.separator;
        if (base != null) {
            int i = 1;
            // Find longest common substring
            while (i < base.length() && fileName.startsWith(base.substring(0, i))) { i++; }
            // remove base string prefix
            return fileName.substring(i-1);
        } else {
            return fileName;
        }
    }


   /** Find a resource for importing into a movie and return a flashdef.
     * Includes stop action.
     *
     * @param fileName file name of the resource
     * @param name name of the resource
     */
    protected Resource getResource(String fileName, String name)
        throws ImportResourceError
    {
        return getResource(fileName, name, true);
    }

   /** Find a resource for importing into a movie and return a flashdef.
     *
     * @param name name of the resource
     * @param fileName file name of the resource
     * @param stop include stop action if true
     */
    protected Resource getResource(String fileName, String name, boolean stop)
        throws ImportResourceError
    {
        try {
            String inputMimeType = MimeType.fromExtension(fileName);
            if (!Transcoder.canTranscode(inputMimeType, MimeType.SWF) 
                && !inputMimeType.equals(MimeType.SWF)) {
                inputMimeType = Transcoder.guessSupportedMimeTypeFromContent(fileName);
                if (inputMimeType == null || inputMimeType.equals("")) {
                    throw new ImportResourceError(fileName, new Exception(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="bad mime type"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                ObjectWriter.class.getName(),"051018-549")
), mEnv);
                }
            }
            // No need to get these from the cache since they don't need to be
            // transcoded and we usually keep the cmcache on disk.
            if (inputMimeType.equals(MimeType.SWF)) {
        
                long fileSize =  FileUtils.getSize(new File(fileName));
    
                Element elt = new Element("resource");
                    elt.setAttribute("name", name);
                    elt.setAttribute("mime-type", inputMimeType);
                    elt.setAttribute("source", fileName);
                    elt.setAttribute("filesize", "" + fileSize);
                mInfo.addContent(elt);
    
                return importSWF(fileName, name, false);
            }

            // TODO: [2002-12-3 bloch] use cache for mp3s; for now we're skipping it 
            // arguably, this is a fixme
            if (inputMimeType.equals(MimeType.MP3) || 
                inputMimeType.equals(MimeType.XMP3)) {
                return importMP3(fileName, name);
            }
    
            File inputFile = new File(fileName);
            File outputFile = mCache.transcode(inputFile, inputMimeType, MimeType.SWF);
            mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="importing: " + p[0] + " as " + p[1] + " from cache; size: " + p[2]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                ObjectWriter.class.getName(),"051018-584", new Object[] {fileName, name, new Long(outputFile.length())})
                                        );

            long fileSize =  FileUtils.getSize(outputFile);

            Element elt = new Element("resource");
                elt.setAttribute("name", name);
                elt.setAttribute("mime-type", inputMimeType);
                elt.setAttribute("source", fileName);
                elt.setAttribute("filesize", "" + fileSize);
            mInfo.addContent(elt);

            return importSWF(outputFile.getPath(), name, stop);
        } catch (Exception e) {
            mLogger.error(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Can't get resource " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                ObjectWriter.class.getName(),"051018-604", new Object[] {fileName})
);
            throw new ImportResourceError(fileName, e, mEnv);
        }

    }

    abstract void addPreloaderScript(String script);
    abstract void addPreloader(CompilationEnvironment env);

    /** Import a resource file into the preloader movie.
     * Using a name that already exists clobbers the
     * old resource (for now).
     *
     * @param fileName file name of the resource
     * @param name name of the MovieClip/Sprite
     * @throws CompilationError
     */
    abstract public void importPreloadResource(String fileName, String name) 
      throws ImportResourceError;

    abstract public void importPreloadResource(File fileName, String name) 
      throws ImportResourceError;

    /** Import a multiframe resource into the current movie.  Using a
     * name that already exists clobbers the old resource (for now).
     */
    abstract public void importPreloadResource(List sources, String name, File parent)
      throws ImportResourceError;



    /** Imports file, if it has not previously been imported, and
     * returns in any case the name of the clip that refers to it.
     * File should refer to a graphical asset. */
    public String importResource(File file)
    {
        mLogger.debug("ObjectResource:importResource(File) "+file.getPath());
        Resource res;

        try {
            file = file.getCanonicalFile();
            res = (Resource) mResourceMap.get(file.getPath());
        } catch (java.io.IOException e) {
            throw new CompilationError(e);
        }
        if (res == null) {
            String clipName = createName();
            importResource(file.getPath(), clipName);
            return clipName;
        } else {
            return res.getName();
        }
    }


    /** Import a resource file into the current movie.
     * Using a name that already exists clobbers the
     * old resource (for now).
     *
     * @param fileName file name of the resource
     * @param name name of the MovieClip/Sprite
     * @throws CompilationError
     */
    abstract public void importResource(String fileName, String name)
      throws ImportResourceError;

    abstract public void importResource(File fFile, String name)
      throws ImportResourceError;

    abstract public void importResource(List sources, String name, File parent);

    /** Returns a new unique js name. */
    String createName() {
        return mNameSupply.next();
    }
    

    /**
     * collect fonts for later use
     */
    private void collectFonts(Script s) {

        Timeline tl = s.getTimeline();
        // If preloader is added, skip frame 0. Assume that preloader is only
        // one frame long starting at frame 0.
        for(int i=0; i<tl.getFrameCount(); i++ ) {
            Frame frame = tl.getFrameAt(i);
            for( int k=0; k<frame.size(); k++ ) {
                FlashObject fo = frame.getFlashObjectAt(k);
                fo.collectFonts( mFontsCollector );
                //mLogger.debug("FONTS size " 
                         //+ mFontsCollector.getFonts().size());
            }
        }
    }

    /**
     * @param fileName
     * @param name
     * @param addStop if true, add stop action to last frame
     */
    protected Resource importSWF(String fileName, String name, boolean addStop) 
        throws IVException, FileNotFoundException  {

        FlashFile f = FlashFile.parse(fileName);
        Script s = f.getMainScript();
        collectFonts(s);
        if (addStop) {
            Frame frame = s.getFrameAt(s.getFrameCount() - 1);
            frame.addStopAction();
        }

        Rectangle2D rect = s.getBounds();
        int mw = (int)(rect.getMaxX()/TWIP);
        int mh = (int)(rect.getMaxY()/TWIP);

        Resource res = new Resource(name, s, mw, mh);

        // Add multi-frame SWF resources that have bounds that
        // are different than their first frame to the resource table.
        if (s.getFrameCount() > 1) {

            Rectangle2D f1Rect = new Rectangle2D.Double();
            s.getFrameAt(0).addBounds(f1Rect);
            int f1w = (int)(f1Rect.getMaxX()/TWIP);
            int f1h = (int)(f1Rect.getMaxY()/TWIP);
            if (f1w < mw || f1h < mh) {
                mMultiFrameResourceSet.add(res);
            }
        }
 
        return res;
    }



    /**
     * @param fileName
     * @param name
     */
    protected Resource importMP3(String fileName, String name) 
        throws IVException, IOException {

        long fileSize =  FileUtils.getSize(new File(fileName));
        FileInputStream stream = new FileInputStream(fileName);
        FlashBuffer buffer = new FlashBuffer(stream);
        Sound sound = MP3Sound.newMP3Sound(buffer);

        Element elt = new Element("resource");
            elt.setAttribute("name", name);
            elt.setAttribute("mime-type", MimeType.MP3);
            elt.setAttribute("source", fileName);
            elt.setAttribute("filesize", "" + fileSize);
        mInfo.addContent(elt);

        stream.close();

        return new Resource(sound);
    }

    /** Writes the object code to the <code>OutputStream</code> that was
     * supplied to the ObjectWriter's constructor.
     * @throws IOException if an error occurs
     */
    abstract public void close() throws IOException;

    abstract public void openSnippet(String url) throws IOException;

    abstract public void closeSnippet() throws IOException;

    /**
     * Generate a warning message
     */
    void warn(CompilationEnvironment env, String msg) {
        CompilationError cerr;
        env.warn(msg);
    }

    /**
     * A resource we've imported
     */
    class Resource implements Comparable {
        /** Name of the resource */
        protected String mName = "";
        /** width of the resource in pixels */
        protected int mWidth = 0;
        /** height of the resource in pixels */
        protected int mHeight = 0;
        /** Flash definition of this resource */
        protected FlashDef mFlashDef = null;

        /** Create a resource that represents this flash def
         * @param def
         */
        public Resource(FlashDef def) {
            mFlashDef = def;
        }

        /** Create a resource 
         */
        public Resource(String name, FlashDef def, int width, int height) {
            mName = name;
            mFlashDef = def;
            mWidth = width;
            mHeight = height;
        }

        public Resource(String name, int width, int height) {
            mName = name;
            mWidth = width;
            mHeight = height;
        }


        public String getName()  { return mName; }
        public int getWidth()  { return mWidth; }
        public int getHeight() { return mHeight; }
        public FlashDef getFlashDef() { return mFlashDef; }

        public int compareTo(Object other) throws ClassCastException {
          Resource o = (Resource)other;
          return mName.compareTo(o.mName);
        }
    }

    abstract public void importBaseLibrary(String library, CompilationEnvironment env);
    abstract public String importClickResource(File file) throws ImportResourceError;

   /** Find a resource for importing into a movie and return a flashdef.
     * Doesn't includes stop action.
     *
     * @param fileName file name of the resource
     * @param name name of the resource
     */
    protected Resource getMultiFrameResource(String fileName, String name, int fNum) 
        throws ImportResourceError
    {
        Resource res = (Resource)mMultiFrameResourceMap.get(fileName);
        if (res != null) {
            return res;
        }

        res = getResource(fileName, "$" + name + "_lzf_" + (fNum+1), false);

        mMultiFrameResourceMap.put(fileName, res);
        return res;
    }


    /* [todo 2006-02-09 hqm] These methods are to be compatible with
       SWF font machinery -- this should get factored away someday so that the FontCompiler
       doesn't try to do anything with <font> tags in DHTML, (except maybe make aliases for them?)
    */
    abstract FontManager getFontManager();

    abstract public boolean isDeviceFont(String face);
    abstract public void setDeviceFont(String face);
    abstract public void setFontManager(FontManager fm);

    abstract void importFontStyle(String fileName, String face, String style,
                                  CompilationEnvironment env)
      throws FileNotFoundException, CompilationError;


    public void setScriptLimits(int recursion, int timeout) { 
        this.mRecursionLimit = recursion;
        this.mExecutionTimeout = timeout;
    }

}

