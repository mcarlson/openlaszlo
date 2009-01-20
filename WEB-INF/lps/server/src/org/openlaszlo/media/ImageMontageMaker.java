/* J_LZ_COPYRIGHT_BEGIN *******************************************************
 * Copyright 2009 Laszlo Systems, Inc.  All Rights Reserved.                   *
 * Use is subject to license terms.                                            *
 * J_LZ_COPYRIGHT_END *********************************************************/
package org.openlaszlo.media;
import java.awt.Graphics;
import java.awt.GraphicsConfiguration;
import java.awt.GraphicsDevice;
import java.awt.GraphicsEnvironment;
import java.awt.HeadlessException;
import java.awt.Image;
import java.awt.Toolkit;
import java.awt.Transparency;
import java.awt.image.BufferedImage;
import java.awt.image.RenderedImage;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Vector;

import javax.imageio.ImageIO;
import javax.media.jai.RenderedOp;
import javax.media.jai.operator.MosaicDescriptor;
import javax.media.jai.operator.TranslateDescriptor;
import javax.swing.ImageIcon;

import org.apache.log4j.*;

public class ImageMontageMaker {
    protected static Logger mLogger = org.apache.log4j.Logger.getLogger(ImageMontageMaker.class);

    public static void assemble(List files, String outfile) throws FileNotFoundException, IOException {
        int numfiles = files.size();
        // build up across - columns only...
        int columnTotal = numfiles, rowTotal = 1;
        int index = 0, col = 0, row  = 0;

        Vector renderedOps = new Vector();
        BufferedImage[] renderedImages = new BufferedImage[numfiles];

        Toolkit toolkit = Toolkit.getDefaultToolkit();

        // maximum size of all images
        int maxwidth = 0, maxheight = 0;

        // read all files into renderedImages, detemine extants
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

            renderedImages[index] = toBufferedImage(img);
            index++;
        }

        // translate each image
        index = 0;
        while(col<columnTotal){
            row=0;
            while(row<rowTotal){
                //System.out.println("c:" + col + "r:" + row);
                // TRANSLATE
                // Translate source images to correct places in the mosaic.
                RenderedOp op = TranslateDescriptor.create((BufferedImage)renderedImages[index],new Float(maxwidth * col),new Float(maxheight * row),null,null);
                renderedOps.add(op);
                row++;
                index++;
            }
            col++;
        }

        // combine into one large sprite
        RenderedOp finalImage = MosaicDescriptor.create(
                (RenderedImage[]) renderedOps.toArray(new RenderedOp[renderedOps.size()]),
                MosaicDescriptor.MOSAIC_TYPE_OVERLAY,null,null,null,null,null
                );
        mLogger.debug("writing css sprite to: " + outfile);
        ImageIO.write(finalImage, "png", new File(outfile));
    }

    // This method returns a buffered image with the contents of an image
    public static BufferedImage toBufferedImage(Image image) {
        if (image instanceof BufferedImage) {
            return (BufferedImage)image;
        }
    
        // This code ensures that all the pixels in the image are loaded
        image = new ImageIcon(image).getImage();
    
        // Determine if the image has transparent pixels; for this method's
        // implementation, see e661 Determining If an Image Has Transparent Pixels
        // always use alpha so the MOSAIC_TYPE_OVERLAY operator works...
        boolean hasAlpha = true; //hasAlpha(image);
    
        // Create a buffered image with a format that's compatible with the screen
        BufferedImage bimage = null;
        GraphicsEnvironment ge = GraphicsEnvironment.getLocalGraphicsEnvironment();
        try {
            // Determine the type of transparency of the new buffered image
            int transparency = Transparency.OPAQUE;
            if (hasAlpha) {
                transparency = Transparency.BITMASK;
            }
    
            // Create the buffered image
            GraphicsDevice gs = ge.getDefaultScreenDevice();
            GraphicsConfiguration gc = gs.getDefaultConfiguration();
            bimage = gc.createCompatibleImage(
                image.getWidth(null), image.getHeight(null), transparency);
        } catch (HeadlessException e) {
            // The system does not have a screen
        }
    
        if (bimage == null) {
            // Create a buffered image using the default color model
            int type = BufferedImage.TYPE_INT_RGB;
            if (hasAlpha) {
                type = BufferedImage.TYPE_INT_ARGB;
            }
            bimage = new BufferedImage(image.getWidth(null), image.getHeight(null), type);
        }
    
        // Copy image to buffered image
        Graphics g = bimage.createGraphics();
    
        // Paint the image onto the buffered image
        g.drawImage(image, 0, 0, null);
        g.dispose();
    
        return bimage;
    }
}
