/*
 * VideoStream.java
 *
 * ===========================================================================
 */
/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2006 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/
package org.openlaszlo.iv.flash.api.sound;

import java.io.PrintStream;
import org.openlaszlo.iv.flash.util.*;
import org.openlaszlo.iv.flash.parser.*;
import org.openlaszlo.iv.flash.api.*;
import org.openlaszlo.iv.flash.api.action.*;

public class VideoStream extends FlashDef {

    int width;
    int height;
    int codec;
    int framecount = 0;

    int smoothing = 1;
    int deblocking = 0;

    public int reserved;                                   // 5 bits ( reserved, always 0 )

    int DEFAULTWIDTH = 160; // pixels
    int DEFAULTHEIGHT = 120;
    int DEFAULTCODEC = 0;

    public VideoStream(int width,int height) {
        this.width = width;
        this.height = height;
    }

    public VideoStream(int width,int height, int codec) {
        this.width = width;
        this.height = height;
        this.codec = codec;
    }

    public VideoStream() {
        this.width  = DEFAULTWIDTH;
        this.height = DEFAULTHEIGHT;
        this.height = DEFAULTCODEC;
    }

    public int getTag() {
        return Tag.DEFINEVIDEOSTEAM;
    }

    /* This tag defines a video stream. To playback the video stream, one needs to add a list of VideoFrame tags.

    struct swf_definevideostream 
        swf_tag         f_tag;   
        unsigned short      f_id;
        unsigned short      f_frame_count;
        unsigned short      f_width;    
        unsigned short      f_height;
        unsigned char       f_reserved : 5;
        unsigned char       f_deblocking : 2;
        unsigned char       f_smoothing : 1;
        unsigned char       f_codec;

*/

    private int tagcode;                                // tag of this obj

    public static VideoStream parse( Parser p )
    {
        VideoStream o = new VideoStream();

        o.tagcode = p.getTagCode();
        o.setID( p.getUWord() );
        o.framecount = p.getUWord();
        o.width = p.getUWord();
        o.height = p.getUWord();
        p.initBits();
        o.reserved = p.getBits(5); // reserved
        o.deblocking = p.getBits( 2 );
        o.smoothing = p.getBits(1);
        o.codec = p.getByte();
        return o;
    }

    public void write( FlashOutput fob )
    {
        fob.writeTag( getTag(), 10 );
        //fob.skip(6);   
        fob.writeDefID( this );
        fob.writeWord(framecount); // frame count = 0
        fob.writeWord(width); // width
        fob.writeWord(height); // height        
        fob.initBits(); // Prepare to write to bit buffer

        //fob.writeBits( 0, 5 ); // Reserved
        fob.writeBits(reserved, 5);
        fob.writeBits( deblocking, 2 );
        fob.writeBits( smoothing, 1);
        fob.flushBits(); // End of first byte
        fob.writeByte(codec);      // codec 
    }

    public boolean isConstant()
    {
        return true;
    }

    protected FlashItem copyInto( FlashItem item, ScriptCopier copier )
    {
        super.copyInto( item, copier );

        ( (VideoStream) item ).tagcode      = tagcode;
        ( (VideoStream) item ).width =  width;
        ( (VideoStream) item ).height = height;
        ( (VideoStream) item ).deblocking = deblocking;
        ( (VideoStream) item ).smoothing = smoothing;
        ( (VideoStream) item ).framecount = framecount;
        ( (VideoStream) item ).codec = codec;

        return item;
    }
    public FlashItem getCopy( ScriptCopier copier )
    {
        return copyInto( new VideoStream(), copier );
    }

    public void printContent( PrintStream out, String indent )
    {
        if ( getTag() == Tag.DEFINEVIDEOSTEAM )
        {
            out.println( indent + "VideoStream" );
        }
        else
        {
            out.println( indent + "VideoStream!" );
        }

        out.println( indent + "    width: " + width );
        out.println( indent + "    height: " + height );
        out.println( indent + "    codec: " + codec );

        out.println( indent + "    frame count: " + framecount );
        out.println( indent + "    smoothing: " + smoothing );
        out.println( indent + "    deblocking: " + deblocking );
    }

}

