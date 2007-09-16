/* *****************************************************************************
   unzip a zlib compressed file
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
 * Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.              *
 * Use is subject to license terms.                                            *
 * J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.test;

import java.io.*;
import java.util.zip.*;

public class unzip {

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

   static public void main (String args[]) {
       try {
           byte compressedData[] = readFileBytes(System.in, 8);

           // Create the decompressor and give it the data to compress
           Inflater decompressor = new Inflater();
           decompressor.setInput(compressedData);
    
           // Create an expandable byte array to hold the decompressed data
           ByteArrayOutputStream bos = new ByteArrayOutputStream(compressedData.length);
    
           // Decompress the data
           byte[] buf = new byte[1024];
           while (!decompressor.finished()) {
               try {
                   int count = decompressor.inflate(buf);
                   bos.write(buf, 0, count);
               } catch (DataFormatException e) {
               }
           }
           try {
               bos.close();
           } catch (IOException e) {
           }
    
           // Get the decompressed data
           byte[] decompressedData = bos.toByteArray();
           send(new ByteArrayInputStream(decompressedData), System.out);
       } catch (Exception e) {
           e.printStackTrace();
       }
   } 
}
