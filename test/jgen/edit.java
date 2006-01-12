/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

import org.openlaszlo.iv.flash.api.*;
import org.openlaszlo.iv.flash.api.action.*;
import org.openlaszlo.iv.flash.util.*;
import java.io.*;

class edit {

    static void stripActions(Script s, int level) {
        Timeline t = s.getTimeline();
        int n = t.getFrameCount();

        boolean  didStop = false;

        for(int i = 0; i < n; i++ ) {
            Frame f = s.getFrameAt(i);

            for (int j = 0; j < f.size(); j++) {
                FlashObject o = f.getFlashObjectAt(j);
                if (o instanceof Script) {
                    stripActions((Script)o, level+1);
                } else if (o instanceof DoAction) {
                    DoAction doa = (DoAction) o;
                    Program p = new Program();
                    if (i == n - 1) {
                        p.stop();
                        didStop = true;
                    }
                    p.none();
                    doa.setProgram(p);
                }
            }
        }
        if (!didStop && level == 0) {
            Frame f = s.getFrameAt(n-1);
            Program p = new Program();
            p.stop();
            p.none();
            f.addFlashObject(new DoAction(p));
        }
    }

    public static void main(String args[]) {
        FlashFile f;
        try {
;
            f = FlashFile.parse(args[0]);
            FileOutputStream output = new FileOutputStream(args[1]);

            Script s = f.getMainScript();
            stripActions(s, 0);

            InputStream input = f.generate().getInputStream();

            byte[] buffer = new byte[1024];
            int b = 0;
            while((b = input.read(buffer)) > 0) {
                output.write(buffer, 0, b);
            }
            output.close();

        } catch (Exception e) {
            System.err.println(e.getMessage());
        }
    }
}
