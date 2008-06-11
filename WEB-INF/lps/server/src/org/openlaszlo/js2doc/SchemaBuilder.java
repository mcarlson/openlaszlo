/* *****************************************************************************
 * SchemaBuilder.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2008 Laszlo Systems, Inc.  All Rights Reserved.                   *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.js2doc;

import java.io.*;
import java.util.*;
import java.util.logging.*;
import org.openlaszlo.js2doc.JS2DocUtils.InternalError;
import org.w3c.dom.*;
import javax.xml.xpath.*;
import org.apache.xpath.NodeSet;

/**
  * Builds a specialized schema for lfc,
  * invoked via the --schema option.
  * This uses the parsed representation of the
  * javascript files after it is converted to XML.
  */
public class SchemaBuilder {

    static private Logger logger = Logger.getLogger("org.openlaszlo.js2doc");

    private Element droot;
    private TreeMap jsClasses = new TreeMap();
    private XPathFactory xpathFactory=XPathFactory.newInstance();
    private XPath xPath = xpathFactory.newXPath();

    private XPathExpression TagNameModifiersXpr;

    public static class JsClass {
        String jsname;
        String lzxname;
        String extname;
        Element classnode;
    }

    public static class JsMember {   // a method, event, attribute on a class
        String name;
        String type;            // only used for attribute, otherwise null
        boolean isfinal;
        boolean isstatic;
    }

    public SchemaBuilder(Element droot) {
        this.droot = droot;
    }

    private String getTextData(Element textElement) {
        Node ch = textElement.getFirstChild();
        if (ch == null || !(ch instanceof Text)) {
            return null;
        }
        else {
            return ((Text)ch).getData();
        }
    }

    private Element createChild(Node n, String tagname) {
        return (Element)n.appendChild(n.getOwnerDocument().createElement(tagname));
    }

    /**
     * Precompile xpath expressions that are used frequently.
     */
    private void compileXpathExpressions()
        throws XPathExpressionException {
        TagNameModifiersXpr = xPath.compile("tag[@name='modifiers']");
    }

    public void build(Element sroot) {
        try {
            compileXpathExpressions();

            // Walk the set of nodes that correspond to classes
            // to collect their names and position in the input XML tree.
            NodeList nodes = (NodeList)xPath.evaluate("/js2doc/property/doc/tag[@name='lzxname']/text", droot, XPathConstants.NODESET);
            for (int count=nodes.getLength(), i=0; i<count; i++) {
                Element elzxname = (Element) nodes.item(i);
                Element eprop = (Element)elzxname.getParentNode().getParentNode().getParentNode();
                Element classNode = (Element)xPath.evaluate("class", eprop, XPathConstants.NODE);
                if (classNode != null) {
                    JsClass j = new JsClass();
                    j.jsname = eprop.getAttribute("name");
                    j.lzxname = getTextData(elzxname);
                    j.extname = classNode.getAttribute("extends");
                    j.classnode = classNode;
                    jsClasses.put(j.jsname, j);
                }
            }

            // Walk the classes, and for each one, pull out its
            // methods, events, attrs
            for (Iterator iter = jsClasses.keySet().iterator(); iter.hasNext(); ) {
                JsClass j = (JsClass)jsClasses.get(iter.next());
                Element iface = createChild(sroot, "interface");
                iface.setAttribute("name", j.lzxname);
                String lzxExtends = "Object";
                if (j.extname != null) {
                    JsClass extj = (JsClass)jsClasses.get(j.extname);
                    if (extj != null) {
                        lzxExtends = extj.lzxname;
                    }
                }
                iface.setAttribute("extends", lzxExtends);

                TreeMap methods = new TreeMap();
                TreeMap events = new TreeMap();
                TreeMap attrs = new TreeMap();

                addMethods(methods, j, true);
                addMethods(methods, j, false);
                addEvents(events, j);

                // TODO: Class attributes needed.
                addAttributes(attrs, j, false);

                // Put the found class members into the output XML
                createMembers(methods, iface, "method");
                createMembers(events, iface, "event");
                createMembers(attrs, iface, "attribute");
            }
        }
        catch (XPathExpressionException e) {
            throw new InternalError(e);
        }
    }

    protected void addMethods(TreeMap methods, JsClass jsclass,
                              boolean classMethods)
        throws XPathExpressionException
    {
        String path = classMethods ? "property/function" : 
            "property/object/property/function";

        NodeList nodes = (NodeList)xPath.evaluate(path, jsclass.classnode,
                                                  XPathConstants.NODESET);
        for (int count=nodes.getLength(), i=0; i<count; i++) {
            JsMember member = addMember((Element) nodes.item(i).getParentNode(), classMethods);
            if (member != null) {
                // ignore constructors
                if (!member.name.equals(jsclass.jsname)) {
                    methods.put(member.name, member);
                }
            }
        }
    }

    protected void addEvents(TreeMap events, JsClass jsclass)
        throws XPathExpressionException
    {
        String path = "property/object/property[((doc/tag[@name='lzxtype']/text) = 'event')]";

        NodeList nodes = (NodeList)xPath.evaluate(path, jsclass.classnode,
                                                  XPathConstants.NODESET);
        for (int count=nodes.getLength(), i=0; i<count; i++) {
            Element eprop = (Element)nodes.item(i);
            JsMember member = addMember(eprop, false);
            if (member != null) {
                events.put(member.name, member);
            }
        }
    }

    protected void addAttributes(TreeMap attrs, JsClass jsclass,
                                 boolean classAttrs)
        throws XPathExpressionException
    {
        // TODO: class attributes needs to be tested, this
        // guess is probably wrong.
        String path = classAttrs ? "property[doc]" : 
            "property[@name='__ivars__']/object/property[@access='public']";

        //showNodeTree(jsclass.classnode, "  ");
        NodeList nodes = (NodeList)xPath.evaluate(path, jsclass.classnode,
                                                  XPathConstants.NODESET);
        for (int count=nodes.getLength(), i=0; i<count; i++) {
            Element eprop = (Element)nodes.item(i);
            JsMember member = addMember(eprop, classAttrs);
            if (member != null) {
                member.type = eprop.getAttribute("type");
                if ("".equals(member.type)) {
                    member.type = null;
                }
                if (member.type == null) {
                    System.err.println("Warning: attribute " + jsclass.jsname + "." + member.name + " has no type for schema");
                }
                attrs.put(member.name, member);
            }
        }
    }

    protected JsMember addMember(Element eprop, boolean isstatic)
        throws XPathExpressionException
    {
        String access = eprop.getAttribute("access");
        JsMember meth = null;
        if (!"private".equals(access)) {
            meth = new JsMember();
            meth.name = eprop.getAttribute("name");
            meth.isfinal = isFinal(eprop);
            meth.isstatic = isstatic;
        }
        return meth;
    }

    protected boolean isFinal(Element eprop)
        throws XPathExpressionException
    {
        NodeList nodes;

        // Modifiers can exist as attributes on the property containing
        // function and also as <tag name="modifiers"> nodes under property.
        String mods = eprop.getAttribute("modifiers");
        if (mods == null) {
            mods = "";
        }
        Element emod = (Element)TagNameModifiersXpr.evaluate(eprop, XPathConstants.NODE);
        if (emod != null) {
            String modtext = getTextData(emod);
            if (modtext != null) {
                mods += " " + modtext;
            }
        }
        //TODO: <tag name="modifiers"><text>final</text></tag>
        // TODO: how are multiple modifiers delimited?
        return (mods != null && mods.contains("final"));
    }

    protected void createMembers(TreeMap methods, Element iface, String tag) {
        for (Iterator iter = methods.keySet().iterator(); iter.hasNext(); ) {
            JsMember member = (JsMember)methods.get(iter.next());
            createMember(iface, member, tag);
        }
    }

    protected void createMember(Element iface, JsMember member, String tag) {
        Element emember = createChild(iface, tag);
        emember.setAttribute("name", member.name);
        if (member.isfinal) {
            emember.setAttribute("final", "true");
        }
        if (member.type != null) {
            emember.setAttribute("type", convertAttributeType(member.type));
        }
        // TODO: mark isstatic?
    }

    String convertAttributeType(String s) {
        if ("String".equals(s)) {
            return "string";
        } else if ("Number".equals(s)) {
            return "number";
        } else {
            return s;
        }
    }

    // Used for debugging
    private void showNodeTree(Element e, String prefix)
    {
        System.out.print(prefix + "<" + e.getTagName());
        NamedNodeMap attrs = e.getAttributes();
        for (int i=0; i<attrs.getLength(); i++) {
            Node n = attrs.item(i);
            System.out.print(" " + n.getNodeName() + "='" + n.getNodeValue() + "'");
        }
        System.out.println(">");
        NodeList children = e.getChildNodes();
        for (int i=0; i<children.getLength(); i++) {
            Node n = children.item(i);
            if (n instanceof Element) {
                showNodeTree((Element)n, prefix + "  ");
            }
        }
        System.out.println(prefix + "</" + e.getTagName() + ">");
    }
}
