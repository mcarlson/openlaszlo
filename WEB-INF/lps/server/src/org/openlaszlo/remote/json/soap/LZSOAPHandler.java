/* *****************************************************************************
 * LZSOAPHandler.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.remote.json.soap;

import java.util.*;
import javax.xml.namespace.QName;
import javax.xml.rpc.handler.*;
import javax.xml.rpc.handler.soap.*;
import javax.xml.soap.*;
import org.apache.log4j.*;

public class LZSOAPHandler extends GenericHandler
{
    private static Logger mLogger = Logger.getLogger(LZSOAPHandler.class);

    public QName[] getHeaders() {
        return null;
    }

    public boolean handleRequest(MessageContext context) {
        mLogger.debug(
            /* (non-Javadoc)
             * @i18n.test
             * @org-mes="========== handleRequest(" + p[0] + ") "
             */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                LZSOAPHandler.class.getName(),"051018-34", new Object[] {context})
                      );
        displaySOAPMessage(context);
        mLogger.debug("==========");

        return true;
    }

    public boolean handleResponse(MessageContext context) {
        mLogger.debug(
            /* (non-Javadoc)
             * @i18n.test
             * @org-mes="========== handleResponse(" + p[0] + ") "
             */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                LZSOAPHandler.class.getName(),"051018-50", new Object[] {context})
                      );
        displaySOAPMessage(context);
        mLogger.debug("==========");
        return true;
    }

    public void displaySOAPMessage(MessageContext context) {
        try {
            SOAPMessageContext soapContext = (SOAPMessageContext)context;

            SOAPMessage message = soapContext.getMessage();
            SOAPPart sp = message.getSOAPPart();
            SOAPEnvelope envelope = sp.getEnvelope();
            SOAPBody body = envelope.getBody();
            SOAPHeader header = envelope.getHeader();

            mLogger.debug(envelope.getClass().getName() + '@' + Integer.toHexString(envelope.hashCode()));
            mLogger.debug(envelope);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
