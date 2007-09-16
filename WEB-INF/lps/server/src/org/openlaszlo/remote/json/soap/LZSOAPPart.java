/* *****************************************************************************
 * LZSOAPPart.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.remote.json.soap;

import java.math.BigDecimal;
import java.net.URI;
import javax.xml.namespace.QName;
import javax.xml.rpc.ParameterMode;
import javax.xml.rpc.ServiceException;
import org.apache.axis.Constants;
import org.apache.log4j.Logger;

public class LZSOAPPart
{
    public static Logger mLogger = Logger.getLogger(LZSOAPPart.class);

    String mName = null;
    String mElement = null;
    ComplexType mType = null;

    // Only used when soap message is in request and is rpc
    ParameterMode mParameterMode = ParameterMode.IN;

    public LZSOAPPart(String name) {
        mName = name;
    }

    public String getName() {
        return mName;
    }

    public String getElement() {
        return mElement;
    }

    public ComplexType getType() {
        return mType;
    }

    public ParameterMode getParameterMode() {
        return mParameterMode;
    }

    public void setName(String name) {
        mName = name;
    }

    public void setElement(String element) {
        mElement = element;
    }

    public void setType(ComplexType type) {
        mType = type;
    }

    public void setParameterMode(ParameterMode parameterMode) {
        mParameterMode = parameterMode;
    }

    /**
     * Convert string to object value based on part type.
     * @param param string to convert to object based on part type.
     * @return object value of string based on part type. 
     * @throws SOAPException if value can't be converted.
     */
    public Object valueOf(String param) 
        throws ServiceException {

        // TODO: [2007-06-28 pkang] return more values based on
        // Constants.XSD_XXX
        try {

            //----------------------------------------------------------------
            // From Constants.equals(QName first, QName second)
            //
            // The first QName is the current version of the name.  The second
            // qname is compared with the first considering all namespace uri
            // versions.
            //----------------------------------------------------------------

            QName typeQName = mType.getName();
            if (Constants.equals(Constants.XSD_INT, typeQName)) {
                return Integer.valueOf(param);
            } else if (Constants.equals(Constants.XSD_LONG, typeQName)) {
                return Long.valueOf(param);
            } else if (Constants.equals(Constants.XSD_FLOAT, typeQName)) {
                return Float.valueOf(param);
            } else if (Constants.equals(Constants.XSD_DOUBLE, typeQName)) {
                return Double.valueOf(param);
            } else if (Constants.equals(Constants.XSD_BOOLEAN, typeQName)) {
                return Boolean.valueOf(param);
            } else if (Constants.equals(Constants.XSD_DECIMAL, typeQName)) {
                return new BigDecimal(param);
            } else if (Constants.equals(Constants.XSD_SHORT, typeQName)) {
                return Short.valueOf(param);
            } else if (Constants.equals(Constants.XSD_BYTE, typeQName)) {
                return Byte.valueOf(param);
            } else if (Constants.equals(Constants.XSD_ANYURI, typeQName)) {
                return new URI(param);
            }
            return param;
        } catch (Exception e) {
            mLogger.error(e.getMessage());
            throw new ServiceException(e.getMessage());
        }
    }

    public void toXML(StringBuffer sb) {
        sb.append("<part ")
            .append(" name=\"").append(mName).append("\"")
            .append(" element=\"").append(mElement).append("\"")
            .append(" type=\"").append(mType.getName()).append("\"")
            .append(" parameterMode=\"").append(mParameterMode).append("\"")
            .append("/>");
    }
}
