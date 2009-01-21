/* J_LZ_COPYRIGHT_BEGIN *******************************************************
 * Copyright 2009 Laszlo Systems, Inc.  All Rights Reserved.                   *
 * Use is subject to license terms.                                            *
 * J_LZ_COPYRIGHT_END *********************************************************/
package org.openlaszlo.media;
import java.awt.Graphics;
import java.awt.Image;
import java.awt.Toolkit;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Vector;

import javax.imageio.ImageIO;

import org.apache.log4j.*;

public class ImageMontageMaker {
    protected static Logger mLogger = org.apache.log4j.Logger.getLogger(ImageMontageMaker.class);

    public static void assemble(List files, String outfile) throws FileNotFoundException, IOException {
        int numfiles = files.size();
        // build up across - columns only...
        int columnTotal = numfiles, rowTotal = 1;
        int index = 0, col = 0, row  = 0;

        Image[] images = new Image[numfiles];

        Toolkit toolkit = Toolkit.getDefaultToolkit();

        // maximum size of all images
        int maxwidth = 0, maxheight = 0;

        // read all files into images array, detemine extants
        while(index<numfiles){
            //System.out.println(index + ":" + files.get(index));
            String infile = (String)files.get(index);
            mLogger.debug("Adding to sprite: " + infile);

            // Have to use this instead of JAI because of bugs in PNG decoder :(
            Image img = toolkit.createImage(infile);
            int wait = 200;
            while (img.getHeight(null) < 0 && wait-- > 0) {
                try {
                    Thread.sleep(10);
                }
                catch (Exception e) {}
            }
            
            int width = img.getWidth(null);
            int height = img.getHeight(null);
            if (width > maxwidth) maxwidth = width;
            if (height > maxheight) maxheight = height;

            images[index] = img;
            index++;
        }

        // combine into one large sprite
        BufferedImage finalImage = new BufferedImage(maxwidth * numfiles, maxheight, BufferedImage.TYPE_INT_ARGB);
        Graphics g = finalImage.createGraphics();

        // translate each image
        index = 0;
        while(col<columnTotal){
            row=0;
            while(row<rowTotal){
                g.drawImage((Image)images[index], maxwidth * col, maxheight * row, maxwidth, maxheight, null);
                row++;
                index++;
            }
            col++;
        }

        mLogger.debug("writing css sprite to: " + outfile);
        ImageIO.write(finalImage, "png", new File(outfile));
    }
}
