/*
 * ScriptLimits.java
 *
 * ===========================================================================
 */
/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/
package org.openlaszlo.iv.flash.api;

import java.io.PrintStream;
import org.openlaszlo.iv.flash.util.*;
import org.openlaszlo.iv.flash.parser.*;
import org.openlaszlo.iv.flash.api.*;
import org.openlaszlo.iv.flash.api.action.*;

public class ScriptLimits extends FlashDef {

    int recursion = 0;
    int timeout = 0;

    // Determined empirically
    public static int DEFAULT_RECURSION = 256;
    public static int DEFAULT_TIMEOUT = 15;

    public ScriptLimits(int recursion, int timeout) {
      this.recursion = (recursion == 0 ? DEFAULT_RECURSION : recursion);
      this.timeout = (timeout == 0 ? DEFAULT_TIMEOUT : timeout);
    }

    public ScriptLimits() {
        this.recursion  = DEFAULT_RECURSION;
        this.timeout = DEFAULT_TIMEOUT;
    }

    public int getTag() {
        return Tag.SCRIPTLIMITS;
    }

    /* This tag set script execution limits (added to the player as of
     * Flash 8).
     *
     * according to FLASM, the tag looks like this

     writeTagHeader(TAG_SCRIPTLIMITS, 4);
     flputShort(recursion);
     flputShort(timeout);

*/

    private int tagcode;                                // tag of this obj

    public static ScriptLimits parse( Parser p )
    {
        ScriptLimits o = new ScriptLimits();

        o.tagcode = p.getTagCode();
        o.recursion = p.getUWord();
        o.timeout = p.getUWord();
        return o;
    }

    public void write( FlashOutput fob )
    {
        fob.writeTag( getTag(), 4 );
        fob.writeWord(recursion); // recursion max depth
        fob.writeWord(timeout); // timeout in seconds
    }

    public boolean isConstant()
    {
        return true;
    }

    protected FlashItem copyInto( FlashItem item, ScriptCopier copier )
    {
        super.copyInto( item, copier );

        ( (ScriptLimits) item ).tagcode   = tagcode;
        ( (ScriptLimits) item ).recursion = recursion;
        ( (ScriptLimits) item ).timeout   = timeout;
        return item;
    }
    public FlashItem getCopy( ScriptCopier copier )
    {
        return copyInto( new ScriptLimits(), copier );
    }

    public void printContent( PrintStream out, String indent )
    {
        if ( getTag() == Tag.SCRIPTLIMITS )
        {
            out.println( indent + "ScriptLimits" );
        }
        else
        {
            out.println( indent + "ScriptLimits!" );
        }

        out.println( indent + "    recursion: " + recursion );
        out.println( indent + "    timeout: " + timeout );
    }
}

