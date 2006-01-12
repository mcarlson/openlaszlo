/* *****************************************************************************
 * SWFDeserializerUtil.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.remote.soap.encoding;

import org.apache.axis.encoding.DeserializationContext;
import org.openlaszlo.iv.flash.api.action.Program;
import org.openlaszlo.iv.flash.api.action.Actions;
import org.openlaszlo.iv.flash.util.FlashBuffer;
import org.apache.log4j.Logger;

public class SWFDeserializerUtil
{
    public static Logger mLogger =
        Logger.getLogger(SWFDeserializerUtil.class);

    /**
     * @return true if object reference isn't null and it's a Program.
     */
    public static boolean objRefExists(DeserializationContext context, String href) {
        Object ref = context.getObjectByRef(href);
        return ref != null && (ref instanceof Program);
    }

    /**
     * Get object reference.
     */
    public static void getObjectRef(Program program, String href) {
        if (mLogger.isDebugEnabled()) {
            mLogger.debug("getting object ref for " + href);
        }
        FlashBuffer fbuf = program.body();
        program.push("_root");
        program.getVar();
        program.push("LzSOAPService");
        fbuf.writeByte(Actions.GetMember);
        program.push("_m");
        fbuf.writeByte(Actions.GetMember);
        program.push(href);
        fbuf.writeByte(Actions.GetMember);
    }
}
