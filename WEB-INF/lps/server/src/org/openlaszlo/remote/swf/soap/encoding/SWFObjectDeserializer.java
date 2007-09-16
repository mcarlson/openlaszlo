/* *****************************************************************************
 * SWFObjectDeserializer.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

/*
 * Copyright 2001-2007 The Apache Software Foundation.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.openlaszlo.remote.swf.soap.encoding;

import org.openlaszlo.remote.swf.soap.LZSOAPUtils;
import org.openlaszlo.iv.flash.util.FlashBuffer;
import org.openlaszlo.iv.flash.api.action.Actions;
import org.openlaszlo.iv.flash.api.action.Program;
import org.apache.axis.Constants;
import org.apache.axis.components.logger.LogFactory;
import org.apache.axis.encoding.DeserializationContext;
import org.apache.axis.encoding.Deserializer;
import org.apache.axis.encoding.DeserializerImpl;
import org.apache.axis.encoding.DeserializerTarget;
import org.apache.axis.message.SOAPHandler;
import org.apache.axis.utils.ClassUtils;
import org.apache.axis.utils.JavaUtils;
import org.apache.axis.utils.Messages;
import org.apache.axis.wsdl.symbolTable.SchemaUtils;
import org.apache.commons.logging.Log;
import org.apache.axis.soap.SOAPConstants;
import org.apache.axis.MessageContext;

import org.apache.axis.utils.DOM2Writer;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;

import javax.xml.namespace.QName;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.StringTokenizer;

import org.apache.axis.message.MessageElement;
import org.apache.log4j.Logger;
import org.openlaszlo.iv.flash.util.FlashBuffer;


public class SWFObjectDeserializer extends DeserializerImpl
{
    public static Logger mLogger =
        Logger.getLogger(SWFObjectDeserializer.class);

    static int BUFSIZE = 8192;

    String mClassName = "";
    String mClassNameSpace = "";

    HashMap mMembers = new HashMap();

    public void onStartElement(String namespace, String localName,
                               String prefix, Attributes attributes,
                               DeserializationContext context)
        throws SAXException {

        if (mLogger.isDebugEnabled()) {
            mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Enter: SWFObjectDeserializer::onStartChild" + "( namespace: " + p[0] + ", localname: " + p[1] + ", prefix: " + p[2] + ")"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                SWFObjectDeserializer.class.getName(),"051018-87", new Object[] {namespace, localName, prefix})
            );
        }

        // Use the xsi:type setting on the attribute if it exists.
        QName itemType = 
            context.getTypeFromAttributes(namespace, localName, attributes);

        if (itemType == null) {
            // FIXME: [2007-07-11 pkang] what do we do in this case? ideally
            // treat the rest this as an element.
            mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="itemType is null"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                SWFObjectDeserializer.class.getName(),"051018-104")
); 
        } else {
            mClassName = itemType.getLocalPart();
            mClassNameSpace = itemType.getNamespaceURI();
        }
    }


    public SOAPHandler onStartChild(String namespace, String localName,
                                    String prefix, Attributes attributes,
                                    DeserializationContext context)
        throws SAXException
    {
        if (mLogger.isDebugEnabled()) {
            mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Enter: SWFObjectDeserializer::onStartChild" + "( namespace: " + p[0] + ", localname: " + p[1] + ", prefix: " + p[2] + ")"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                SWFObjectDeserializer.class.getName(),"051018-87", new Object[] {namespace, localName, prefix})
            );
        }

        // Use the xsi:type setting on the attribute if it exists.
        QName itemType = 
            context.getTypeFromAttributes(namespace, localName, attributes);

        // Get the deserializer for the type. 
        Deserializer dSer = null;
        if (itemType != null && (context.getCurElement().getHref() == null)) {
            dSer = context.getDeserializerForType(itemType);
        }


        if (dSer == null) {
            dSer = new SWFObjectDeserializer();
        }

        // Register the callback value target, and keep track of this index so
        // we know when it has been set.
        dSer.registerValueTarget(new DeserializerTarget(this, localName));
        
        // The framework handles knowing when the value is complete, as long as
        // we tell it about each child we're waiting on.
        addChildDeserializer(dSer);

        return (SOAPHandler)dSer;
    }


    public void setChildValue(Object value, Object hint) throws SAXException
    { 
        mMembers.put(hint, value);
    }

    public void valueComplete() throws SAXException { 

        if (mLogger.isDebugEnabled()) {
            mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Enter: SWFObjectDeserializer::valueComplete()"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                SWFObjectDeserializer.class.getName(),"051018-170")
);
        }

        //----------------------------------------------------------------------
        // FIXME [2005-03-11 pkang]: if there are targets and this is not an
        // href, create the object.  This is to get around a weird problem
        // deserializing an object returned by
        // //depot/qa/test/private/photospace test case.
        // If top-level SOAP response node is an href, valueComplete() to get
        // called twice. Understand this code better.
        //----------------------------------------------------------------------
        if (targets != null && !isHref) {

            if (componentsReady()) {

                FlashBuffer fbuf = new FlashBuffer(BUFSIZE);
                Program program = new Program( fbuf );

                // push all members
                Iterator iter = mMembers.entrySet().iterator();
                String keys = "";
                while (iter.hasNext()) {
                    Map.Entry entry = (Map.Entry)iter.next();
                    String k = (String)entry.getKey();
                    Program v = (Program)entry.getValue();
                    program.push(k);
                    if (v == null) {
                        LZSOAPUtils.pushNull(fbuf);
                    } else {
                        // copy the body of each member's program
                        fbuf.writeFOB(v.body());
                    }
                }

                program.push("__LZclassnamespace");
                program.push(mClassNameSpace);
                program.push("__LZclassname");
                program.push(mClassName);
                program.push(mMembers.size() + 2);
                program.body().writeByte(Actions.InitObject);

                // Call _root.LzSOAPService.__LZnormObj(). This function will set the
                // object's prototype to one that exists in the namespace and will
                // return the object so it stays in the stack
                program.push(1);
                program.push("_root");
                program.getVar();
                program.push("LzSOAPService");
                program.body().writeByte(Actions.GetMember);
                program.push("__LZnormObj");
                program.callMethod();

                value = program;
            }     

        }
        
        super.valueComplete();

    }
}
