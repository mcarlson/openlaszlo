/* *****************************************************************************
   extract tags from swf file
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

import java.io.*;
import java.util.zip.*;

public class etag {

    /* usage:
       etag tagid [nth]
       reads from stdin, writes to stdout

    */

    public static int BUFFER_SIZE = 10240;

    public static int send(InputStream input, OutputStream output, int size) 
        throws IOException {
        int c = 0;
        byte[] buffer = new byte[size];
        int b = 0;
        while((b = input.read(buffer)) > 0) {
            c += b;
            output.write(buffer, 0, b);
        }
        return c;
    }

    public static int send(InputStream input, OutputStream output) 
        throws IOException {

        int available = input.available();
        int bsize;
        if (available == 0) {
            bsize = BUFFER_SIZE;
        } else {
            bsize = Math.min(input.available(), BUFFER_SIZE);
        }
        return send(input, output, bsize);
    }

    public static byte[] readFileBytes(InputStream istr, int skip) 
        throws IOException
    {
        byte bytes[] = new byte[istr.available()];
        System.err.println("read "+istr.available()+" bytes from input stream");
        istr.read(bytes);
        istr.close();
        
        byte bytes2[] = new byte[bytes.length - skip];

        System.arraycopy(bytes, skip, bytes2, 0, bytes2.length);
        return bytes2;
    }


    /* Compute the number of bytes occupied by a RECT record, which starts
     * at OFFSET in DATA.
     */
    public static int findRectLength(byte data[], int offset) {
        int bsize = data[offset] >> 3;
        //System.out.println("rect bits = "+bsize);
        int nbits = bsize * 4;
        int nbytes = (int) Math.ceil((5 + nbits) /  8.0);
        //System.out.println("nbytes = "+nbytes);
        return nbytes;

    }
    /*

This header has been stripped:
Signature UI8 Signature byte: C
Signature UI8 Signature byte always “W”
Signature UI8 Signature byte always “S”
Version UI8 Single byte file version (for example, 0x06 for SWF 6)
FileLength UI32 Length of entire file in bytes



xmin xmax ymin ymax

0    500  0    375
     1f4       177

We get:
FrameSize RECT Frame size in twips
FrameRate UI16 Frame delay in 8.8 fixed number of frames per second
FrameCount UI16 Total number of frames in movie

2 frames , 24 fps ,500 x 375 

================
RECT [5] n n n n
pad to byte boundary
================

TAG = UI16 :=

upper 10 bits = code

TagID = Code >> 6;
Length = Code & 0x3f;

if length = 3f, LENGTH = UI32

UI16 code/len=3f
UI32 length
    */

    static class TagNotFoundException extends RuntimeException {

    }

    /** Scan for the nth tag matching TAG, return the contents **/
    static byte[] getTag(int tag, int nth, byte data[], int offset) throws TagNotFoundException {
        int nth1 = nth;
        int index = offset;
        System.err.println("searching for "+Integer.toString(tag, 16)+" ["+nth+"]");
        while (index < data.length) {
            int ptag = (data[index] & 0xff) | ((data[index+1] << 8) & 0xff00);
            int tagid = ((ptag & 0xffc0) >> 6);
            int taglen = (ptag & 0x3f);

            int oindex = index;
            index += 2;

            if (taglen == 0x3f) {
                // it's a long tag, get length from following UI32
                taglen =
                    (data[index] & 0xff) |
                    ( (data[index+1] << 8) & 0xff00) |
                    ( (data[index+2] << 16) & 0xff0000) |
                    ( (data[index+3] << 24) & 0xff000000);
                index += 4;
            }

            // System.err.println("tagid = "+Integer.toString(tagid, 16)+",  length = "+taglen);

            if (tagid == tag) {
                if (nth == 0) {
                byte bytes2[] = new byte[taglen];
                System.arraycopy(data, index, bytes2, 0, bytes2.length);
                System.err.println("match found for occurence "+nth1+" length="+bytes2.length);
                return bytes2;
                } else {
                    nth--;
                }
            }
                            
            index += taglen;
        }
        throw new TagNotFoundException();
    }

    static void printTag(byte data[], OutputStream os) throws IOException{
        System.err.println("writing "+data.length+" bytes to output");
        for (int i = 0; i < data.length; i++) {
            os.write(data[i]);
        }
    }
    
    static public void main (String args[]) {
       try {
           byte data[] = readFileBytes(System.in, 0);
           int nbytes = findRectLength(data,0);
           int offset = nbytes + 4; // skip rect + speed + nframes

           int tag = Integer.parseInt(args[0], 16);
           int nth = 0;
           if (args.length > 1) {
               nth = Integer.parseInt(args[1]);
           }
           try {
               byte contents[] = getTag(tag, nth, data, offset);
               printTag(contents, System.out);
               System.out.close();
           } catch (TagNotFoundException ex) {
               System.err.println("Tag "+Integer.toString(tag,16)+" ["+nth+"] not found.");
           }


       } catch (Exception e) {
           e.printStackTrace();
       }
   } 
}
