/* ****************************************************************************
 * SimpleNode.java
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.sc.parser;
import java.io.Serializable;

public abstract class SimpleNode implements Node, Serializable {
    protected final static SimpleNode[] noChildren = {};
    protected Node parent;
    protected SimpleNode[] children = noChildren;
    protected int id;
    protected Parser parser;
    public String filename;     // added
    public int beginLine, beginColumn; // added
    public String comment;
  
    public SimpleNode(int i) {
        id = i;
    }

    public SimpleNode(Parser p, int i) {
        this(i);
        parser = p;
    }

    public void jjtOpen() {
    }

    public void jjtClose() {
    }
  
    public void jjtSetParent(Node n) { parent = n; }
    public Node jjtGetParent() { return parent; }

    public void jjtAddChild(Node n, int i) {
        if (i >= children.length) {
            SimpleNode c[] = new SimpleNode[i + 1];
            System.arraycopy(children, 0, c, 0, children.length);
            children = c;
        }
        children[i] = (SimpleNode)n;
    }

    public Node jjtGetChild(int i) {
        return children[i];
    }

    public int jjtGetNumChildren() {
        return (children == null) ? 0 : children.length;
    }

    /* You can override these two methods in subclasses of SimpleNode to
       customize the way the node appears when the tree is dumped.  If
       your output uses more than one line you should override
       toString(String), otherwise overriding toString() is probably all
       you need to do. */

    public String toString(String prefix) {
        String filename = getFilename();
        int line = getLineNumber();
        int col = getColumnNumber();
     
        String fileloc = "";
        if (filename != null || line != 0) {
            fileloc = " [";
            if (filename != null) {
                fileloc += filename;
            }
            if (line != 0) {
                fileloc += ":" + line;
            }
            if (col != 0) {
                fileloc += "#" + col;
            }
            fileloc += "]";
        }
        return prefix + toString() + fileloc;
    }

    /* Override this method if you want to customize how the node dumps
       out its children. */

    public void dump(String prefix) {
        System.out.println(toString(prefix));
        if (children != null) {
            for (int i = 0; i < children.length; ++i) {
                SimpleNode n = (SimpleNode)children[i];
                if (n != null) {
                    n.dump(prefix + " ");
                }
            }
        }
    }
  
    public void dump() {
        dump("");
    }

    // Added

    public SimpleNode() {
        this(0);
    }

    public String toString() {
        String name = this.getClass().getName();
        if (name.lastIndexOf('.') >= 0) {
            name = name.substring(name.lastIndexOf('.') + 1);
        }
        return name;
    }

    public SimpleNode[] getChildren() {
        return children;
    }

    public void setChildren(SimpleNode[] children) {
        this.children = children;
    }

    public SimpleNode getParent() {
        return (SimpleNode)parent;
    }
    
    // Jython interfaces
    public Node __getitem__(int n) {
        return jjtGetChild(n);
    }
    
    public int __len__() {
        return jjtGetNumChildren();
    }

    public boolean __nonzero__() {
        return true;
    }

    // Java interfaces
    public SimpleNode get(int n) {
        return children[n];
    }
    
    public SimpleNode set(int n, SimpleNode v) {
        SimpleNode old = n < children.length ? get(n) : null;
        jjtAddChild(v, n);
        return old;
    }

    public int size() {
        return jjtGetNumChildren();
    }

    //public void setLineNumber(int line) {
    //    this.beginLine = line;
    //}
  
    public int getLineNumber() {
        return beginLine;
    }
    
    public int getColumnNumber() {
        return beginColumn;
    }

    public String getFilename() {
        return filename;
    }

    public void setBeginLocation(String filename, int line, int column) {
        this.filename = filename;
        this.beginLine = line;
        this.beginColumn = column;
    }

    /**
     * Set only the location fields from another node.
     * @param that node to copy from
     */
    public void setLocation(SimpleNode that) {
        this.filename = that.filename;
        this.beginLine = that.beginLine;
        this.beginColumn = that.beginColumn;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getComment() {
        return this.comment;
    }

    /**
     * Create a deep copy (clone) of a SimpleNode.  deepCopy or
     * copyFields Must be overridden if a subclass has data fields
     * that must be copied.
     */
    public SimpleNode deepCopy() {
        SimpleNode result;
        try {
            result = (SimpleNode)getClass().getConstructor(new Class[]{int.class}).
                newInstance(new Object[]{new Integer(id)});
        }
        catch (Exception e) {
            // could be thrown if a subclass does not have a constructor(id)
            // all javacc generated classes have it.
            throw new RuntimeException(e);
        }
        result.copyFields(this);
        return result;
    }

    /**
     * Copy fields and children, but not parent.
     * @param that node to copy from
     * @return this for convenience.
     */
    public SimpleNode copyFields(SimpleNode that) {
        this.id = that.id;
        this.parser = that.parser;
        this.filename = that.filename;
        this.beginLine = that.beginLine;
        this.beginColumn = that.beginColumn;
        this.comment = that.comment;
        for (int i=0; i<that.children.length; i++) {
            this.set(i, that.children[i].deepCopy());
        }
        return this;
    }

    /** Accept the visitor */
    public Object jjtAccept(ParserVisitor visitor, Object data) {
        return visitor.visit(this, data);
    }

}
