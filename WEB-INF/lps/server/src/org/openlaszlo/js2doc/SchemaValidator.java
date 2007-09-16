/* ****************************************************************************
 * Schema_Test.java
 *
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2006 Laszlo Systems, Inc.  All Rights Reserved.                   *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.js2doc;

import java.io.*;
import org.xml.sax.InputSource;
import org.xml.sax.ErrorHandler;
import org.xml.sax.SAXException;
import com.thaiopensource.util.PropertyMap;
import com.thaiopensource.util.PropertyMapBuilder;
import com.thaiopensource.validate.ValidateProperty;
import com.thaiopensource.validate.ValidationDriver;
import com.thaiopensource.xml.sax.ErrorHandlerImpl;

public class SchemaValidator {

    private ValidationDriver validationDriver;
    private StringWriter errorBuffer;
    
    public SchemaValidator(String schemaFile) {
    
        PropertyMapBuilder props = new PropertyMapBuilder();
        errorBuffer = new StringWriter();
        ErrorHandler eh = new ErrorHandlerImpl(errorBuffer);
        props.put(ValidateProperty.ERROR_HANDLER, eh);

        validationDriver = new ValidationDriver(props.toPropertyMap());
        
        try {
            FileInputStream rncFileStream = new FileInputStream(schemaFile);
            InputSource rngInputSource = new InputSource(rncFileStream);
            validationDriver.loadSchema(rngInputSource);
        } catch (FileNotFoundException e) {
            System.out.println("couldn't find schema: " + e);
            return;
        } catch (IOException e) {
            System.out.println("error opening schema: " + e);
            return;
        } catch (SAXException e) {
            System.out.println("error loading schema: " + e);
            return;
        }
    }

    boolean validates(String source) {

        boolean valid = false;
        
        StringReader xmlStringReader = new StringReader(source);
        InputSource xmlStringSource = new InputSource(xmlStringReader);

        try {
        
            valid = validationDriver.validate(xmlStringSource);
                        
        } catch (SAXException e) {
            System.out.println("sax exception: " + e);
        } catch (IOException e) {
            System.out.println("io exception: " + e);
        }
        return valid;
    }
    
}