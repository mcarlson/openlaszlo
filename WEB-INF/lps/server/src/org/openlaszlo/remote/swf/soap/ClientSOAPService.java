/******************************************************************************
 * ClientSOAPService.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.remote.swf.soap;

import java.io.*;
import java.util.*;
import javax.xml.namespace.QName;

import org.openlaszlo.iv.flash.api.*;
import org.openlaszlo.iv.flash.api.action.*;
import org.openlaszlo.iv.flash.util.*;
import org.openlaszlo.utils.*;
import org.openlaszlo.xml.internal.DataCommon;
import org.openlaszlo.xml.internal.DataContext;
import org.apache.log4j.Logger;


public class ClientSOAPService
{
    public static Logger mLogger = Logger.getLogger(ClientSOAPService.class);

    public static Program createObjectProgram(LZSOAPService service) {

        int size = 4096;
        FlashBuffer body = new FlashBuffer(size);
        Program program = new Program(body);
        DataContext dc = new DataContext();


        // object.__LZstubload
        //------------------------------------------------------------
        // Tells client data returned is an object 
        // this.__LZstubload = true
        program.push("__LZstubload");
        program.push(1);


        // SOAP specific information
        // object.stubinfo
        program.push("stubinfo");
        {
            //------------------------------------------------------------
            // this.service = service.getServiceName()
            program.push("service");
            DataCommon.pushStringData(service.getServiceName(), body, dc);

            //------------------------------------------------------------
            // this.port = service.getPort()
            program.push("port");
            DataCommon.pushStringData(service.getPort(), body, dc);

            //------------------------------------------------------------
            // this.wsdl = service.getWSDL()
            program.push("wsdl");
            DataCommon.pushStringData(service.getWSDL(), body, dc);

            //------------------------------------------------------------
            // this.ctypes = <complexTypeInfoObject>
            program.push("__LZctypes");
            pushComplexTypeInfo(program, service.getSchemaComplexTypes(), dc);

            //------------------------------------------------------------
            // this._namespace = namespace /* target namespace */
            program.push("__LZnamespace");
            program.push(service.getTargetNS());
        }
        program.push(5);
        body.writeByte(Actions.InitObject);


        // object.stub
        program.push("stub");
        {
            int count = 0;
            //------------------------------------------------------------
            // Create client-side service operations. Assuming that 
            // operations won't be null.
            //------------------------------------------------------------
            Map operations = service.getOperations();
            Iterator iter = operations.keySet().iterator();
            while (iter.hasNext()) {

                String opName = (String)iter.next();
                LZSOAPOperation op = (LZSOAPOperation)operations.get(opName);

                if (mLogger.isDebugEnabled()) {
mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="adding operation: " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                ClientSOAPService.class.getName(),"051018-99", new Object[] {opName})
);
                }

                //------------------------------------------------------------
                //
                count++;
                DataCommon.pushStringData(opName, body, dc);
                body.writeByte(Actions.DefineFunction);
                body.writeWord(5); // length of header (1 byte + 2 words (2bytes))
                body.writeByte(0); // function name string (if empty, it is
                // anonymous)
                body.writeWord(0); // number of parameters
                {

                    FlashBuffer fbuf = new FlashBuffer(500);
                    Program fprog = new Program(fbuf);

                    // arguments.callee.args gets set in the client and includes
                    // secure and secureport information.
                    //
                    // var args = arguments.callee.args;
                    DataCommon.pushStringData("args", fbuf, dc);
                    {
                        DataCommon.pushStringData("arguments", fbuf, dc);
                        fprog.getVar();
                        DataCommon.pushStringData("callee", fbuf, dc);
                        fbuf.writeByte(Actions.GetMember);
                        DataCommon.pushStringData("args", fbuf, dc);
                        fbuf.writeByte(Actions.GetMember);
                    }
                    fprog.setVar();


                    // _root.LzSOAP.invoke(
                    //     delegate,
                    //     args
                    //     header
                    //     opts, /* wsdl, service, port, operation, parts */
                    //     this.secure,
                    //     this.secureport,
                    // );

                    // 6. secureport
                    DataCommon.pushStringData("args", fbuf, dc);
                    fprog.getVar();
                    DataCommon.pushStringData("superclass", fbuf, dc);
                    fbuf.writeByte(Actions.GetMember);
                    DataCommon.pushStringData("secureport", fbuf, dc);
                    fbuf.writeByte(Actions.GetMember);

                    // 5. secure
                    DataCommon.pushStringData("args", fbuf, dc);
                    fprog.getVar();
                    DataCommon.pushStringData("superclass", fbuf, dc);
                    fbuf.writeByte(Actions.GetMember);
                    DataCommon.pushStringData("secure", fbuf, dc);
                    fbuf.writeByte(Actions.GetMember);

                    // 4. opts
                    {
                        // 6. argument array of parameter type tuples like:
                        //     [
                        //       [ name1, element1, type1(qname) ], 
                        //       [ name2, element2, type2(qname) ]
                        //     ]
                        DataCommon.pushStringData("parts", fbuf, dc);
                        pushParts(fprog, op.getInputMessage(), op.getStyle(), dc);

                        // 5. operation type
                        DataCommon.pushStringData("opstyle", fbuf, dc);
                        DataCommon.pushStringData(op.getStyle(), fbuf, dc);

                        // 4. operation name
                        DataCommon.pushStringData("operation", fbuf, dc);
                        DataCommon.pushStringData(opName, fbuf, dc);

                        // 3. SOAP port
                        DataCommon.pushStringData("port", fbuf, dc);
                        DataCommon.pushStringData(service.getPort(), fbuf, dc);

                        // 2. SOAP service
                        DataCommon.pushStringData("service", fbuf, dc);
                        DataCommon.pushStringData(service.getServiceName(), fbuf, dc);

                        // 1. SOAP wsdl
                        DataCommon.pushStringData("wsdl", fbuf, dc);
                        DataCommon.pushStringData(service.getWSDL(), fbuf, dc);
                    }
                    fprog.push(6);
                    fbuf.writeByte(Actions.InitObject);


                    // 3. requestheaders
                    DataCommon.pushStringData("args", fbuf, dc);
                    fprog.getVar();
                    DataCommon.pushStringData("superclass", fbuf, dc);
                    fbuf.writeByte(Actions.GetMember);
                    DataCommon.pushStringData("requestheaders", fbuf, dc);
                    fbuf.writeByte(Actions.GetMember);

                    // 2. arguments[0] (should be array of arguments)
                    DataCommon.pushStringData("arguments", fbuf, dc);
                    fprog.getVar();
                    fprog.push(0);
                    fbuf.writeByte(Actions.GetMember);

                    // 1. arguments[1] (should be delegate)
                    DataCommon.pushStringData("arguments", fbuf, dc);
                    fprog.getVar();
                    fprog.push(1);
                    fbuf.writeByte(Actions.GetMember);

                    // Number of parameters
                    fprog.push(6);

                    // call function
                    DataCommon.pushStringData("_root", fbuf, dc);
                    fprog.getVar();
                    DataCommon.pushStringData("LzSOAPService", fbuf, dc);
                    fbuf.writeByte(Actions.GetMember);
                    DataCommon.pushStringData("invoke", fbuf, dc);

                    fprog.callMethod();

                    // return seqnum from invoke() 
                    fbuf.writeByte(Actions.Return);

                    body.writeWord(fbuf.pos); // length of defined function body
                    body.writeFOB(fbuf);
                }
            }
            program.push(count);
            body.writeByte(Actions.InitObject);
        }

        program.push(3);
        body.writeByte(Actions.InitObject);


        //------------------------------------------------------------
        // call into the viewsystem
        program.push("_parent");
        program.getVar();
        program.push(2); 
        program.push("_parent"); 
        program.getVar();
        program.push("loader"); 
        body.writeByte(Actions.GetMember);
        program.push("returnData"); 
        program.callMethod();
        program.pop();

        // Collect the string dictionary data
        byte pooldata[] = DataCommon.makeStringPool(dc);
        // 'out' is the main FlashBuffer for composing the output file
        final int MISC = 64;
        FlashBuffer out = new FlashBuffer(body.getSize() + pooldata.length + MISC);
        // Write out string constant pool
        out.writeByte( Actions.ConstantPool );
        out.writeWord( pooldata.length + 2 ); // number of bytes in pool data + int (# strings)
        out.writeWord( dc.cpool.size() ); // number of strings in pool
        out.writeArray( pooldata, 0, pooldata.length); // copy the data
        // Write out the code to build nodes
        out.writeArray(body.getBuf(), 0, body.getSize());

        return new Program(out);
    }

    static void pushParts(Program program, LZSOAPMessage inMesg, String style, 
                          DataContext dc) {

        FlashBuffer body = program.body();
        if (inMesg == null) {
            LZSOAPUtils.pushNull(body);
            return;
        }

        List parts = inMesg.getParts();
        for (int i = parts.size()-1; i >= 0; i--) {
            LZSOAPPart part = (LZSOAPPart)parts.get(i);
            String name = part.getName();
            String element = part.getElement();
            ComplexType type = part.getType();
            QName typeName = ( type != null ? type.getName() : null );

            LZSOAPUtils.pushQName(program, typeName, dc);
            if (style.equals("rpc")) {
                // rpc calls use the name of the part as the name of element.
                LZSOAPUtils.pushString(program, name, dc);
            } else {
                // documents use element name
                LZSOAPUtils.pushString(program, element, dc);
            }
            program.push(2);
            body.writeByte(Actions.InitArray);
        }
        program.push(parts.size());
        body.writeByte(Actions.InitArray);
    }

    /**
     * @param program Program
     * @param ctm complex type map
     */
    public static void pushComplexTypeInfo(Program program, Map ctm, DataContext dc) {
        FlashBuffer body = program.body();
        if (ctm == null) {
            LZSOAPUtils.pushNull(body);
            return;
        }

        Iterator iter = ctm.entrySet().iterator();
        if (! iter.hasNext()) {
            LZSOAPUtils.pushNull(body);
            return;
        }

        int nattrs = 0;
        while (iter.hasNext()) {
            Map.Entry entry = (Map.Entry)iter.next();
            ComplexType ct = (ComplexType)entry.getValue();

            DataCommon.pushStringData(ct.getName().getLocalPart(), body, dc);
            {
                // namespace
                DataCommon.pushStringData("ns", body, dc);
                DataCommon.pushStringData(ct.getName().getNamespaceURI(), body, dc);

                // type is one of simple, complex, array
                DataCommon.pushStringData("type", body, dc);
                DataCommon.pushStringData(ct.getTypeString(), body, dc);

                // QName for array type; null if complex type is not an array
                DataCommon.pushStringData("typeQ", body, dc);
                LZSOAPUtils.pushQName(program, ct.getArrayItemTypeQName(), dc);

                // push members
                DataCommon.pushStringData("members", body, dc);
                pushMembers(program, ct, dc);

                // push base
                ComplexType base = ct.getBase();
                QName baseQName = (base != null ? base.getArrayItemTypeQName() : null);
                DataCommon.pushStringData("base", body, dc);
                LZSOAPUtils.pushQName(program, baseQName, dc);

                program.push(5);
                body.writeByte(Actions.InitObject);
            }
            nattrs++;
        }

        program.push(nattrs);
        body.writeByte(Actions.InitObject);
    }


    /** 
     * Push members of a complex type. 
     */
    static void pushMembers(Program program, ComplexType ct, DataContext dc) {
        FlashBuffer body = program.body();
        Map members = ct.getMembers();
        if (members == null) {
            LZSOAPUtils.pushNull(body);
            return;
        }

        Iterator iter = members.entrySet().iterator();
        if (! iter.hasNext()) {
            LZSOAPUtils.pushNull(body);
            return;
        }

        int count = 0;
        while (iter.hasNext()) {
            Map.Entry entry = (Map.Entry)iter.next();
            String key = (String)entry.getKey();
            QName value = (QName)entry.getValue();
            DataCommon.pushStringData(key, body, dc);
            LZSOAPUtils.pushQName(program, value, dc);
            count++;
        }

        ComplexType baseType = ct.getBase();
        if (baseType != null) {
            count += pushBaseMembers(program, baseType, dc);
        }

        program.push(count);
        body.writeByte(Actions.InitObject);
    }


    /** 
     * Push base members and returns count of members added. Helper method for
     * pushMembers().
     * @return count of members pushed
     */
    static int pushBaseMembers(Program program, ComplexType ct, DataContext dc) {
        
        Map members = ct.getMembers();
        if (members == null) return 0;

        Iterator iter = members.entrySet().iterator();
        if (! iter.hasNext()) return 0;

        int count = 0;
        FlashBuffer body = program.body();
        while (iter.hasNext()) {
            Map.Entry entry = (Map.Entry)iter.next();
            String key = (String)entry.getKey();
            QName value = (QName)entry.getValue();
            DataCommon.pushStringData(key, body, dc);
            LZSOAPUtils.pushQName(program, value, dc);
            count++;
        }

        ComplexType baseType = ct.getBase();
        if (baseType != null) {
            count += pushBaseMembers(program, baseType, dc);
        }
        return count;
    }
    

    /**
     */
    public static FlashFile createObjectFile(LZSOAPService service, int swfnum)
        throws IOException {
        // Create FlashFile object nd include action bytes
        FlashFile file = FlashFile.newFlashFile();
        Script s = new Script(1);
        file.setMainScript(s);
        file.setVersion(swfnum);
        Frame frame = s.newFrame();
        Program program = createObjectProgram(service);
        frame.addFlashObject(new DoAction(program));
        return file;
    }

    /**
     */
    public static byte[] createObject(LZSOAPService service, int swfnum)
        throws IOException {

        int i = 0;
        try {
            FlashFile file = createObjectFile(service, swfnum);
            FlashOutput fob = file.generate();
            byte[] buf = new byte[fob.getSize()];
            System.arraycopy(fob.getBuf(), 0, buf, 0, fob.getSize());
            return buf;
        } catch (IVException e) {
            throw new ChainedException(e);
        } catch (IOException e) {
mLogger.error(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="io error creating object SWF: " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                ClientSOAPService.class.getName(),"051018-462", new Object[] {e.getMessage()})
);
            throw e;
        }
    }

}
