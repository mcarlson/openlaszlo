/* *****************************************************************************
 * CompressFlashFile.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.sc;

import org.openlaszlo.utils.FileUtils;
import org.openlaszlo.utils.StringUtils;
import org.openlaszlo.compiler.FontInfo;
import org.openlaszlo.iv.flash.api.*;
import org.openlaszlo.iv.flash.api.action.*;
import org.openlaszlo.iv.flash.api.image.*;
import org.openlaszlo.iv.flash.api.sound.*;
import org.openlaszlo.iv.flash.api.text.*;
import org.openlaszlo.iv.flash.util.*;
import org.openlaszlo.iv.flash.cache.*;
import org.apache.log4j.*;

import java.io.*;
import java.util.*;

/** Parse a flash 6 file and re-output it with flash 6 zip compression enabled
 * 
 */

public class CompressFlashFile {
    private static Logger mLogger = Logger.getLogger(CompressFlashFile.class);

    static public void main (String args[]) {
        if (args.length != 2) {
            System.out.println(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="usage: compressFlashFile infile outfile"
 */
			org.openlaszlo.i18n.LaszloMessages.getMessage(
				CompressFlashFile.class.getName(),"051018-41")
);
            System.exit(1);
        }
        compressFile(args[0], args[1]);
    }

    static public void compressFile (String infile, String outfile) {
        try {
            FlashFile f = FlashFile.parse(infile);
            OutputStream out = new FileOutputStream(outfile);
            FontsCollector fc = new FontsCollector();
            HashMap fontsTable = new HashMap();

            java.util.Enumeration defs = f.definitions();
            while(defs.hasMoreElements()) {
                FlashDef def = (FlashDef)defs.nextElement();
                if (def instanceof FontDef) {
                    FontDef fontDef = (FontDef)def; 
                    Font font = fontDef.getFont();
                    String bold = ((font.BOLD & font.flags) > 0 ? "bold" : "");
                    String italic = ((font.ITALIC & font.flags) > 0 ? 
                                     "italic" : "");
                    //System.out.println("Copying font " + font.getFontName() 
                    //+ bold + italic);
                    FontDef fdef = fc.addFont(font, null);
                    fdef.setWriteAllChars(true);
                    fdef.setWriteLayout(true);
                    fontsTable.put(font.getFontName() + "::"+bold+italic, font);
                }
            }
            // Set flash 6 compression
            f.setCompressed(true);
            writeFlashFile(f, fc, out);
        } catch (Exception e) {
            mLogger.error(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="exception in CompressFlashFile.compressFile"
 */
			org.openlaszlo.i18n.LaszloMessages.getMessage(
				CompressFlashFile.class.getName(),"051018-82")
				, e);
        }
    }

    static void writeFlashFile(FlashFile f, FontsCollector fc, OutputStream out) {
        try {
            InputStream input;
            input = f.generate(fc, null, false).getInputStream();
            FileUtils.send(input, out);
            input.close();
            out.close();
        } catch (Exception e) {
            mLogger.error(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="exception in CompressFlashFile.writeFlashFile"
 */
			org.openlaszlo.i18n.LaszloMessages.getMessage(
				CompressFlashFile.class.getName(),"051018-101")
				, e);
        }
    }

}
