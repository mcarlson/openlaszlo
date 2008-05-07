/* *****************************************************************************
 * CachedInfo.java
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2004, 2008 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.cm;
import org.openlaszlo.compiler.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;

import org.apache.log4j.*;

/** A <code>CachedInfo</code> contains all the information
 * we cache from a compilation.  This includes dependency information
 * and the canvas.
 *
 * @author  Oliver Steele
 */
public class CachedInfo implements Serializable {

    private final static Logger     mLogger  = Logger.getLogger(CachedInfo.class);
    private final DependencyTracker mTracker;
    private final Canvas            mCanvas;
    private final String            mEncoding;

    /**
     * Construct a CachedInfo
     * @param tracker the DependencyTracker
     * @param canvas the Canvas
     */
    public CachedInfo(DependencyTracker tracker, Canvas canvas, String encoding) {
        mTracker = tracker;
        mCanvas = canvas;
        mEncoding = encoding;
    }

    /**
     * Read a CachedInfo from an existing file.
     */
    public static CachedInfo readFrom(File file) 
        throws CompilationError
    {
        CachedInfo info = null;
        
        try {
            FileInputStream istream = new FileInputStream(file);
            try {
                ObjectInputStream p = new ObjectInputStream(istream);
                return (CachedInfo) p.readObject();
            } finally {
                istream.close();
            }
        } catch (java.io.InvalidClassException ioe) {
        } catch (FileNotFoundException ioe) {
        } catch (IOException ioe) {
            CompilationError e = new CompilationError(ioe);
            e.initPathname(file.getPath());
            mLogger.error(e.getMessage());
            throw e;
        } catch (ClassNotFoundException cnfe) {
        }
        return new CachedInfo(null, null, null);
    }

    /** Write a CachedInfo to an existing file
     * @param file a File to save to
     * @throws IOException if an error occurs
     */
    void writeTo(File file) throws IOException {
        mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="writeTo " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                CachedInfo.class.getName(),"051018-86", new Object[] {file.getAbsolutePath()})
);
        File dir = file.getParentFile();
        if (dir != null) {
            dir.mkdirs();
        }
        file.createNewFile();
        FileOutputStream ostream = new FileOutputStream(file);
        ObjectOutputStream p = new ObjectOutputStream(ostream);
        p.writeObject(this);
        p.flush();
        ostream.close();
    }
    
    /**
     * @return <code>true</code> if this {@link CachedInfo} instance has a
     *         {@link Canvas} associated with it, or <code>false</code>
     *         otherwise.
     */
    public boolean hasCanvas() {
        return this.mCanvas != null;
    }

    public Canvas getCanvas() {
        mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Getting canvas with size " + p[0] + " by " + p[1]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                CachedInfo.class.getName(),"051018-107", new Object[] {new Integer(mCanvas.getWidth()), new Integer(mCanvas.getHeight())})
                );
        return mCanvas;
    }

    public String getEncoding() {
        return mEncoding;
    }


    public DependencyTracker getDependencyTracker() {
        return mTracker;
    }
}
