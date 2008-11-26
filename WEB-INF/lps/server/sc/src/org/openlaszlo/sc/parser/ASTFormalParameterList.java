/* ****************************************************************************
 * ASTFormalParamterList.java
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2007, 2008 Laszlo Systems, Inc.  All Rights Reserved.             *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.sc.parser;

public class ASTFormalParameterList extends SimpleNode {
    private ASTIdentifier.Type returnType = null;

    public ASTFormalParameterList(int id) {
        super(id);
    }

    public ASTFormalParameterList(Parser p, int id) {
        super(p, id);
    }

    public ASTIdentifier.Type getReturnType() {
        return returnType;
    }

    public void setReturnType(ASTIdentifier.Type type) {
        this.returnType = type;
    }

    public SimpleNode deepCopy() {
        ASTFormalParameterList result = (ASTFormalParameterList)super.deepCopy();
        result.returnType = this.returnType;
        return result;
    }

    public String toString() {
        String s = super.toString();
        if (this.returnType != null) {
            s += "(returns:" + this.returnType.toString() + ")";
        }
        return s;
    }
}
