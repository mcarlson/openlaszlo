/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/
            
import org.openlaszlo.iv.flash.api.* ;
import java.io.*;


public class testit {
    public static void main(String args[]) {

        try {
            if (args.length != 2) {
                System.out.println("usage: testit in out");
                System.exit(-1);
            }
            FlashFile in = FlashFile.parse(args[0]);
            Script script = in.getMainScript();
            FlashFile file = FlashFile.newFlashFile();
            // Script script = new Script(1);
            script.setMain();
            file.setMainScript(script);
            Frame frame = script.newFrame();
    
            InputStream s = file.generate().getInputStream();
            OutputStream o = new FileOutputStream(args[1]);
            send(s, o, 1024);
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

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

}
