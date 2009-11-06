/* ****************************************************************************
 * ASTIdentifier.java
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.sc.parser;

public class ASTIdentifier extends SimpleNode {
    private String name = null;
    private String register = null;
    private Type type = null;
    private int hash = 0;
    private boolean ellipsis = false;
    private boolean isconstructor = false;

    public SimpleNode deepCopy() {
        ASTIdentifier result = (ASTIdentifier)super.deepCopy();
        result.name = this.name;
        result.register = this.register;
        result.type = this.type;
        result.hash = this.hash;
        result.ellipsis = this.ellipsis;
        result.isconstructor = this.isconstructor;
        return result;
    }

    // Note: this is an immutable class once configured, instances may be shared
    public static class Type {
        public String typeName = null;
        public boolean nullable = false; // has "?"
        public boolean notnullable = false; // has "!"
        public boolean untyped = false;     // is "*"

        public String toString() {
            String result = typeName;
            if (nullable)
                result += "?";
            if (notnullable)
                result += "!";
            return result;
        }
    }

    public ASTIdentifier(int id) {
        super(id);
    }

    public ASTIdentifier(Parser p, int id) {
        super(p, id);
    }

    public static Node jjtCreate(int id) {
        return new ASTIdentifier(id);
    }

    public static Node jjtCreate(Parser p, int id) {
        return new ASTIdentifier(p, id);
    }

    // Added
    public ASTIdentifier(String s) {
        setName(s);
    }

    public void setName(String name) {
        this.name = name.intern(); // to lower number of strings
        this.hash = name.hashCode();
    }

    public void setRegister(String name) {
        this.register = name;
    }

    public int hashCode() {
        return hash;
    }
  
    public String getName() {
        return name;
    }

    public String getRegister() {
        return (register != null) ? register : name;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public boolean getEllipsis() {
        return ellipsis;
    }

    public void setEllipsis(boolean ellipsis) {
        this.ellipsis = ellipsis;
    }

    public boolean isConstructor() {
        return isconstructor;
    }

    public void setIsConstructor(boolean value) {
        this.isconstructor = value;
    }

    public String toJavascriptString() {
        String dots = ellipsis ? "..." : "";
        String typesuffix = (type == null) ? "" : (": " + type.toString());
        // Use the register name if there is one
        return dots + ((register != null) ? register : name) + typesuffix;
    }

    public String toString() {
        return "ASTIdentifier(" + toJavascriptString() + ")";
    }

    /** Accept the visitor */
    public Object jjtAccept(ParserVisitor visitor, Object data) {
        return visitor.visit(this, data);
    }
}
