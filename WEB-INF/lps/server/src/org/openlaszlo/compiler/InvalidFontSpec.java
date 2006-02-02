/* *****************************************************************************
 * InvalidFontSpec.java
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.compiler;
import java.io.File;
import org.jdom.Element;


/** Represents an exception when an attribute value for font/size/style cannot be understood.
 *
 * @author  Henry Minsky
 */
public class InvalidFontSpec extends CompilationError {

    public InvalidFontSpec() {
        super("INVALID FONTSPEC");
        System.out.println(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="new InvalidFontSpec ()"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                InvalidFontSpec.class.getName(),"051018-28")
);
 }

    public InvalidFontSpec(String message, Element element) {
        super(message, element);
        System.out.println(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="new InvalidFontSpec (" + p[0] + ", " + p[1] + ")"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                InvalidFontSpec.class.getName(),"051018-40", new Object[] {message, element.getName()})
);
    }

}
