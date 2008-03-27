/* ****************************************************************************
 * ASTIdentifier.java
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2008 Laszlo Systems, Inc.  All Rights Reserved.                   *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.sc.parser;

import java.util.HashMap;
import java.util.Map;
import java.io.StringReader;
import org.openlaszlo.sc.Compiler.OptionMap;

public class ASTPassthroughDirective extends SimpleNode {
    private String text = null;
    private OptionMap options = new OptionMap();

    public ASTPassthroughDirective(int id) {
        super(id);
    }

    public ASTPassthroughDirective(Parser p, int id) {
        super(p, id);
    }

    public static Node jjtCreate(int id) {
        return new ASTPassthroughDirective(id);
    }

    public static Node jjtCreate(Parser p, int id) {
        return new ASTPassthroughDirective(p, id);
    }

    // Added
    public ASTPassthroughDirective(String s) {
        setText(s);
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String fileline() {
        return this.filename + " (" + this.beginLine + ")";
    }

    public void set(SimpleNode key, SimpleNode value)
    {
        if (!(key instanceof ASTIdentifier)) {
            throw new ParseException("#passthrough property: key must be identifier in " + fileline());
        }
        String keyname = ((ASTIdentifier)key).getName();

        // val is currently limited to true/false
        Object valobj;
        if (!(value instanceof ASTLiteral) ||
            (valobj = ((ASTLiteral)value).getValue()) == null ||
            !(valobj instanceof Boolean)) {
            throw new ParseException("#passthrough property: value must be literal or boolean constant in " + fileline());
        }
        options.put(keyname, valobj);
    }

    // return the map of key/value property pairs.
    public Map getProperties() {
        return options;
    }

    public boolean getBoolean(String key)
    {
        return options.getBoolean(key);
    }

    public String toString() {
        return "#ASTPassthroughDirective{" + text + "}#";
    }

    /** Accept the visitor */
    public Object jjtAccept(ParserVisitor visitor, Object data) {
        return visitor.visit(this, data);
    }
}
