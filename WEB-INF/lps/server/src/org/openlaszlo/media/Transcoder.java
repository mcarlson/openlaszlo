/******************************************************************************
 * Transcoder.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2010 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.media;

import java.io.InputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.BufferedInputStream;
import java.io.DataInputStream;
import java.io.FileNotFoundException;
import java.io.File;
import java.awt.geom.Rectangle2D;
import java.util.Properties;

// JGenerator APIs
import org.openlaszlo.iv.flash.api.*;
import org.openlaszlo.iv.flash.api.action.*;
import org.openlaszlo.iv.flash.api.sound.*;
import org.openlaszlo.iv.flash.api.image.*;
import org.openlaszlo.iv.flash.util.*;

import org.openlaszlo.utils.SWFUtils;
import org.openlaszlo.utils.FileUtils;
import org.openlaszlo.utils.LZUtils;
import org.openlaszlo.server.LPS;

import org.openlaszlo.sc.ScriptCompiler;

// Logger
import org.apache.log4j.*;

/**
 * Simple Media Transcoder
 *
 * Someday this should get build out.
 */
public class Transcoder {

    /** Logger */
    private static Logger mLogger = Logger.getLogger(Transcoder.class);

    /**
     * @return true if the transcoder can do the requested transcode
     * @param in input mime type
     * @param out output mime type
     */
    public static boolean canTranscode(String in, String out) {

        if (!LZUtils.equalsIgnoreCase(out, MimeType.SWF)) {

            if (LZUtils.equalsIgnoreCase(out, FontType.FFT) &&
                LZUtils.equalsIgnoreCase(in, FontType.TTF)) {
                return true;
            }
            return false;
        }

        if (LZUtils.equalsIgnoreCase(in, MimeType.JPEG) || 
            LZUtils.equalsIgnoreCase(in, MimeType.PNG)  || 
            LZUtils.equalsIgnoreCase(in, MimeType.GIF)  ||
            LZUtils.equalsIgnoreCase(in, MimeType.MP3)  ||
            LZUtils.equalsIgnoreCase(in, MimeType.XMP3) ||
            LZUtils.equalsIgnoreCase(in, MimeType.SWF)) {
            return true;
        }
        return false;
    }

    /**
     * @param input buffer of data to be transcoded, caller is responsible
     * for closing this stream someday.  
     * @param from type of input data
     * @param to type of output data
     * @param doStream true if transcode should create streaming audio
     * @throws TranscoderException if there is no transcoder for the request from/to 
     * types.
     */
    public static InputStream transcode(InputStream stream, 
            String from, String to, boolean doStream) 
        throws TranscoderException, IOException {

        if (!LZUtils.equalsIgnoreCase(to, MimeType.SWF)) {
            throw new TranscoderException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Unknown output mime-type: " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                Transcoder.class.getName(),"051018-93", new Object[] {to})
);
        }

        mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Transcoding from " + p[0] + " to " + p[1]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                Transcoder.class.getName(),"051018-103", new Object[] {from, to})
);

        // We assume this mime type is correct if we get it
        // NOTE: This will keep us from copying big swf video files
        // an extra time for now...
        if (LZUtils.equalsIgnoreCase(from, MimeType.SWF)) {
            return stream;
        } 

        // Try images
        if (LZUtils.equalsIgnoreCase(from, MimeType.JPEG) || 
            LZUtils.equalsIgnoreCase(from, MimeType.PNG) || 
            LZUtils.equalsIgnoreCase(from, MimeType.GIF) ||
            from.indexOf("image") != -1 ) {
            return convertImageToSWF(stream);
        } else if (LZUtils.equalsIgnoreCase(from, MimeType.MP3) ||
                   LZUtils.equalsIgnoreCase(from, MimeType.XMP3) ||
                   from.indexOf("audio") != -1)  {
            // Try audio
            return convertAudioToSWF(stream, doStream);
        }

        BufferedInputStream bis = null;
        try {
            if (!stream.markSupported()) {
                bis = new BufferedInputStream(stream);
                stream = bis;
            }
            String mime = guessSupportedMimeTypeFromContent(stream);
            if (mime != null) {
                InputStream out = null;
                if (mime.equals(MimeType.SWF)) {
                    out = bis;
                } else {
                    out = transcode(bis, mime, to, doStream);
                }
                // Keep us from closing the stream
                if (bis == out) {
                    bis = null;
                }
                return out;
            } else {
                throw new TranscoderException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="can't guess a supported mime-type from content"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                Transcoder.class.getName(),"051018-152")
);
            }
        } finally {
            FileUtils.close(bis);
        }
    }

    /**
     * @return mime type based on stream
     */
    public static String guessSupportedMimeTypeFromContent(String fileName) 
        throws IOException {
        InputStream is = null;
        try {
            is = new BufferedInputStream(new FileInputStream(fileName));
            return guessSupportedMimeTypeFromContent(is);
        } finally {
            FileUtils.close(is);
        }
    }

    /**
     * @return mime type based on stream
     * stream must be rewindable or we can't guess
     */
    public static String guessSupportedMimeTypeFromContent(InputStream stream) 
        throws IOException {
        if (!stream.markSupported()) {
            return null;
        }
    
        try {
            stream.mark(stream.available());
            
            mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="trying swf"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                Transcoder.class.getName(),"051018-193")
);
            if (SWFUtils.hasSWFHeader(stream)) {
                return MimeType.SWF;
            } 

            stream.reset();
            if (GIF.is(stream)) {
                return MimeType.GIF;
            }

            stream.reset();
            if (JPEG.is(stream)) {
                return MimeType.JPEG;
            }

            stream.reset();
            if (PNG.is(stream)) {
                return MimeType.PNG;
            }

            stream.reset();
            if (MP3.is(stream)) {
                return MimeType.MP3;
            }
        } finally {
            stream.reset();
        }

        return null;
    }

    /**
     * @param input File to be transcoded
     * @param from type of input data
     * @param to type of output data
     * @throws TranscoderException if there is no transcoder for 
     * the request from/to 
     */
    public static InputStream transcode(File input, String from, String to) 
        throws TranscoderException, IOException {

        if (LZUtils.equalsIgnoreCase(to, FontType.FFT)) {
            if (LZUtils.equalsIgnoreCase(from, FontType.TTF)) {
                return TTF2FFT.convert(input);
            } else {
                throw new TranscoderException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Unknown input font type: " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                Transcoder.class.getName(),"051018-245", new Object[] {from})
                                );
            }
        } else {
            InputStream fis = new FileInputStream(input);
            InputStream out = null;
            try {
                out = transcode(fis, from , to, 
                        /* non-streaming media */false);
                return out;
            } finally {
                if (fis != null && fis != out) {
                    fis.close();
                }
            }
        }
    }

    /**
     * @return true if the InputStream contains an animated GIF.
     */
    private static boolean isAnimatedGIF( BufferedInputStream is ) throws IOException {
        is.mark(is.available());
        DataInputStream dis = new DataInputStream(is);
        int b0 = dis.readUnsignedByte();
        int b1 = dis.readUnsignedByte();
        int b2 = dis.readUnsignedByte();
        int b3 = dis.readUnsignedByte();
        int b4 = dis.readUnsignedByte();
        int b5 = dis.readUnsignedByte();
        is.reset();

        if( b0 == 'G' && b1 == 'I' && b2 == 'F' && b3 == '8' && b4 == '9' && b5 == 'a' ) {  // animated gif: 'GIF89a'
            return true;
        } else {
            return false;
        }
    }

    /**
     * @param stream image input stream
     */
    private static final InputStream convertImageToSWF(InputStream stream) 
        throws IOException, TranscoderException {

        try {
            mLogger.debug("converting image to SWF");
            FlashBuffer fb = new FlashBuffer(stream);
            BufferedInputStream bis = new BufferedInputStream(fb.getInputStream());
            if (isAnimatedGIF(bis)) {
                // TODO: set the actual framerate from a compiler constant?
                GIF89a.setFrameRate(30);
                return GIF89a.gifToSwf(bis);
            }

            Bitmap bitmap = Bitmap.newBitmap(fb);
            if (bitmap == null) {
                String msg = "corrupt image or unknown image type";
                throw new TranscoderException(msg);
            }
            mLogger.debug("done bitmap file");
            Instance inst = bitmap.newInstance();
            Script script;
            script = new Script(1);
            script.setMain();
            script.newFrame().addInstance(inst, 1);
            FlashFile file = FlashFile.newFlashFile();
            file.setVersion(5);
            file.setFrameSize(inst.getBounds());
            file.setMainScript(script);
            mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="starting generate"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                Transcoder.class.getName(),"051018-292")
);
            FlashOutput out = file.generate();
            mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="ending generate"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                Transcoder.class.getName(),"051018-301")
);
            return out.getInputStream();
        } catch (IVException e) {
            throw new TranscoderException("iv exception:" + e.getMessage());
        }
    }

    /**
     * @param stream audio input stream
     * @param doStream if true, convert to streaming audio output
     */
    private static final InputStream convertAudioToSWF(InputStream stream, boolean doStream) 
        throws IOException, TranscoderException {

        // Stream and add a stop play command.
        try {
            return convertAudioToSWF(stream, doStream, true, 0, 0);
        } catch (IVException e) {
            throw new TranscoderException("iv exception:" + e.getMessage());
        }
    }

    /**
     * @param stream audio input stream
     */
    private static final InputStream convertAudioToSWF(InputStream in, boolean stream, boolean stopAction, int delay, int startframe) 
        throws IOException, IVException {

        Script script;
        script = new Script(1);

        FlashFile file = FlashFile.newFlashFile();

        // 30 FPS gets us 16000/30/60 = 8 minutes 53 sec max 
        final int  MAX_SWF_FRAMES = 16000;
        int mFrameRate = 30;
        try {
            String f = LPS.getProperty("lps.swf.audio.framerate", "30");
            mFrameRate = Integer.parseInt(f);
        } catch (Exception e) {
            mLogger.error(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Can't read property file for lps.swf.audio.framerate"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                Transcoder.class.getName(),"051018-348")
);
        }

        file.setFrameRate(mFrameRate << 8); 

        Frame stopFrame = null;

        FlashBuffer fib = new FlashBuffer(in);
        
        if( stream ) {
            mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="transcoding streaming mp3"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                Transcoder.class.getName(),"051018-365")
);
            SoundStreamBuilder ssb = SoundStreamBuilder.newSoundStreamBuilder(fib, file.getFrameRate());
            SoundStreamHead head = ssb.getSoundStreamHead();

            // Add the SoundStreamHead to the current startframe in the script
            script.getFrameAt( startframe ).addFlashObject( head );

            int frameCount = script.getFrameCount();
            int f = startframe;
            SoundStreamBlock block;

            while( ( block = ssb.getNextSoundStreamBlock() ) != null ) {
                if( f >= frameCount ) {
                    script.newFrame().addFlashObject( block );
                } else {
                    script.getFrameAt( f ).addFlashObject( block );
                }

                f++;
                if (f >= MAX_SWF_FRAMES) {
                    String msg = 
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="LPS hit max SWF frame count when converting this clip" + "; truncating it at " + p[0] + " frames"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                Transcoder.class.getName(),"051018-392", new Object[] {new Integer(MAX_SWF_FRAMES)});
                    mLogger.warn(msg);
                    script.getFrameAt(0).addFlashObject(WarningProgram(msg));
                    break;
                }
            }

            stopFrame = script.getFrameAt( f - 1 );
        } else {
            mLogger.debug("transcoding non-streaming mp3");
            MP3Sound sound = MP3Sound.newMP3Sound(fib);
            // Set the delay if provided
            if( delay != 0 ) {
                sound.setDelaySeek( delay );
            }

            SoundInfo soundInfo = SoundInfo.newSoundInfo( 0 );
            StartSound startSound = StartSound.newStartSound( sound, soundInfo );

            Frame newFrame = script.newFrame();
            newFrame.addFlashObject( startSound );

            stopFrame = newFrame;
        }

        if( stopAction ) {
            stopFrame.addStopAction();
        }

        file.setVersion(5);
        file.setFrameSize(GeomHelper.newRectangle(0,0,0,0));
        file.setMainScript(script);
        FlashOutput out = file.generate();
        return out.getInputStream();
    }

    /**
     * Return a FlashObject that contains a program that
     * will print an LFC warning to the debugger
     */
    private static FlashObject WarningProgram(String msg) {
        String p = "_root.debug.write('" + msg + "');";
        byte[] action = ScriptCompiler.compileToByteArray(p, new Properties());
        return new DoAction(new Program(action, 0, action.length));
    }
}
