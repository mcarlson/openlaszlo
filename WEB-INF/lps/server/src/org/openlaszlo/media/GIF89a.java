/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2009-2010 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.media;

import java.awt.Graphics;
import java.awt.Rectangle;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.util.Iterator;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.metadata.IIOMetadata;
import javax.imageio.metadata.IIOMetadataNode;
import javax.imageio.stream.ImageInputStream;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.openlaszlo.iv.flash.api.FlashFile;
import org.openlaszlo.iv.flash.api.Frame;
import org.openlaszlo.iv.flash.api.Instance;
import org.openlaszlo.iv.flash.api.Script;
import org.openlaszlo.iv.flash.api.action.ASAssembler;
import org.openlaszlo.iv.flash.api.action.DoAction;
import org.openlaszlo.iv.flash.api.image.Bitmap;
import org.openlaszlo.iv.flash.util.FlashBuffer;
import org.openlaszlo.iv.flash.util.FlashOutput;
import org.openlaszlo.iv.flash.util.IVException;
import org.openlaszlo.utils.FileUtils;
import org.w3c.dom.Node;

public class GIF89a {
    private static final int TWIP = 20;

    // TODO: pull from LPS model
    private static int FPS = 30;

    public static void setFrameRate(int framerate) throws IOException {
        FPS = framerate;
    }

/* test harness
    public static void main(String[] args) throws IOException {
        //System.out.println("reading " + inputfile);
        BufferedInputStream bis = new BufferedInputStream(new FileInputStream(new File( args[0] )));
        
        InputStream output = gifToSwf(bis);
        BufferedOutputStream bos = new BufferedOutputStream( new FileOutputStream( args[1] ) );
        FileUtils.send(output, bos);
        bos.close();
    }
*/

    /* find number of loops - 0 == forever, -1 means none found */
    private static int getLoopCount(BufferedInputStream filescanner) throws IOException {
        filescanner.mark(filescanner.available());
        int loops = -1;
        // scan looking for NETSCAPE 2.0 extension to determine loop count
        DataInputStream scanner = new DataInputStream(filescanner);
        while (scanner.available() > 3) {
            int nextstring = scanner.readInt();
            if (nextstring == 0x4e455453) {
                // found NETS
                nextstring = scanner.readInt();
                if (nextstring == 0x43415045) {
                    // found CAPE
                    nextstring = scanner.readInt();
                    if (nextstring == 0x322e3003) {
                        // found 2.0, skip the next byte
                        scanner.skipBytes(1);
                        int low = scanner.readByte();
                        int high = scanner.readByte();
                        loops = (low & 0xff) + ((high & 0xff) << 8);
                    }
                }
            }
        }
        filescanner.reset();
        return loops;
    }
    
    public static final InputStream gifToSwf(BufferedInputStream inputstream) throws IOException {
        int loops = getLoopCount(inputstream);
        //System.out.println("found repeat: " + loops);

        ImageInputStream stream = ImageIO.createImageInputStream(inputstream);
        Iterator readers = ImageIO.getImageReaders(stream);
        if (!readers.hasNext()) {
            throw new RuntimeException("no image reader found");
        }
        ImageReader reader = (ImageReader) readers.next();
        reader.setInput(stream); // don't omit this line!
        int n = reader.getNumImages(true); // don't use false!
        //System.out.println("numImages = " + n);

        Script script = new Script(n);
        script.setMain();

        Rectangle size = new Rectangle();
        Frame lastframe = null;
        for (int i = 0; i < n; i++) {
            BufferedImage inputimage = reader.read(i);

            // copy to new ARGB image to work around transparency issues with paletted images in jgenerator
            BufferedImage image = new BufferedImage(inputimage.getWidth(), inputimage.getHeight(), BufferedImage.TYPE_INT_ARGB);
            Graphics g = image.createGraphics();
            g.drawImage(inputimage, 0, 0, inputimage.getWidth(), inputimage.getHeight(), null);

            IIOMetadata metadata = reader.getImageMetadata(i);
            //System.out.println("image[" + i + "] = " + image);

            IIOMetadataNode root = (IIOMetadataNode) metadata.getAsTree(metadata.getNativeMetadataFormatName());

            IIOMetadataNode imgdesc = (IIOMetadataNode) root.getFirstChild();
            int left = Integer.parseInt(imgdesc.getAttribute("imageLeftPosition"));
            int top = Integer.parseInt(imgdesc.getAttribute("imageTopPosition"));

            // set size of swf based on the first frame's size
            if (i == 0) {
                size.setFrame(0.0, 0.0, Float.parseFloat(imgdesc.getAttribute("imageWidth")) * TWIP, Float.parseFloat(imgdesc.getAttribute("imageHeight")) * TWIP);
            }
            IIOMetadataNode gce = (IIOMetadataNode) imgdesc.getNextSibling();

            // Only add delay if we have more than one image
            float delay = 0;
            if (n > 1) delay = Float.parseFloat(gce.getAttribute("delayTime"));

            /*
            String filename = getBase(inputfile) + i + ".png";
            ImageIO.write(image, "png", new File(filename));
             */

            lastframe = appendImage(script, image, left, top, delay, i + 1);
            //System.out.println("IIOMetadata: " + left + ", " + top + ", " + delay + " : " + nodeToString(root));
        }
        stream.close();

        FlashFile file = FlashFile.newFlashFile();
        file.setVersion(8);
        file.setFrameSize(size);
        file.setMainScript(script);
        file.setFrameRate(FPS << 8);

        // if we found a loop count, stop after that number of repetitions ( < 1 means loop forever)
        if (loops > 0) {
            ASAssembler as = new ASAssembler(file);        
            // if (!counter) counter = 0;
            as.getVar("counter");
            as.jumpIfTrue("varisset");
            as.setVar("counter", new Integer(0));
            as.label("varisset");
            // if (loops == counter) stop();
            as.push(loops);
            as.getVar("counter");
            as.equal();
            as.logicalNot();
            as.jumpIfTrue("skipstop");
            as.stop();
            as.label("skipstop");
            // counter += 1;
            as.push("counter");
            as.getVar("counter");
            as.push(1);
            as.add();
            as.setVar();
            as.play();

            DoAction actions = new DoAction(as.toProgram());
            lastframe.addFlashObject(actions);
        }

        FlashOutput fob = null;
        try {
            //System.out.println("writing " + outputfile);
            fob = file.generate();
        } catch (IVException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return fob.getInputStream();
    }
    
/* used for debugging
    private static String nodeToString(Node node) {
        StringWriter sw = new StringWriter();
        try {
            Transformer t = TransformerFactory.newInstance().newTransformer();
            t.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
            t.transform(new DOMSource(node), new StreamResult(sw));
        } catch (TransformerException te) {
            //System.out.println("nodeToString Transformer Exception");
        }
        return sw.toString();
    }
*/

    private static byte[] imageToByteArray(BufferedImage image) throws IOException {
        ByteArrayOutputStream os = new ByteArrayOutputStream( 1000 );
        ImageIO.write( image, "png", os );
        os.flush();
        byte[] bytes = os.toByteArray();
        os.close();
        return bytes;
    }

    private static Frame appendImage(Script script, BufferedImage image, int x, int y, float delay, int depth) throws IOException {
        // Have to use this instead of JAI because of bugs in PNG decoder :(            
        byte[] bytes = imageToByteArray(image);
        //System.out.println("bytes: " + bytes.length); 

        // GIF89a spec says units for delay are 1/100 of a second
        /* 
        vii) Delay Time - If not 0, this field specifies the number of
        hundredths (1/100) of a second to wait before continuing with the
        processing of the Data Stream. The clock starts ticking immediately
        after the graphic is rendered. This field may be used in
        conjunction with the User Input Flag field.
         */

        double frames = FPS * (delay / 100.0);

        Bitmap bitmap = null;
        try {
            bitmap = Bitmap.newBitmap(new FlashBuffer(bytes));
            //System.out.println("bitmap: " + bitmap); 
        } catch (IVException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        Instance inst = bitmap.newInstance();
        inst.matrix = new AffineTransform();
        inst.matrix.translate(x * TWIP, y * TWIP);

        // Scaling helps with aliasing issues...
        inst.matrix.scale(.999, .999);
        //System.out.println("transform: " + inst.matrix);
        //System.out.println("frames: " + frames + ", " + delay + ", " + depth);

        Frame frame = script.newFrame();
        frame.addInstance(inst, depth);
        if (delay == 0) {
            // Stop animating
            frame.addStopAction();
        } else {
            // add frames to reproduce timing
            while (frames > 1) {
                frame = script.newFrame();
                frames--;
            }
        }
        return frame;
    }
}
