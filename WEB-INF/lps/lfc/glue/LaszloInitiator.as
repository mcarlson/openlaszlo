/******************************************************************************
 * LzReplicationManager.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

/* An application source file contains XML that describes a view that
 * will be instantiated when the application is loaded.  These XML
 * elements are called view templates, and occur either directly
 * within the document root, or within another view template.  A root
 * view template is a view template that occurs directly within the
 * document root.
 *
 * The interface compiler compiles each root view template into
 * ActionScript bytecodes that, when executed, create an instance of
 * the object that the XML element describes.  It does this by
 * appending to the output file instructions to push a succint
 * description of the XML hierarchy onto the stack, followed by a call
 * to LzInstantiateView (below) with the runtime representation of the
 * root view template as its argument.
 *
 * The format of the runtime representation is documented in the
 * Javadoc for org.openlaszlo.ic.ScriptCompiler.xmlToScript.  In
 * brief, an XML element is compiled to a runtime object with the
 * following attributes:
 *   tagName: The element, or tag name (e.g. "window")
 *   attrs: An object whose properties are attributes, e.g.
 *     {title: "Contacts", x: 10, y: 20}
 *   children: An array of child elements.
 *
 * --- ows
 */

/* A map of element names, to functions that create instances of the
 * appropriate type. */
    // none of these have been tested except window
//  dataSource: function (args) {return new DataSource(_root, args.source);}
//  gridView: function (args) {return new lzGridView(args);}
//  menu: function (args) {return new lzMenu(args, []);}
    //view: function (args) {return new lzView(args);}
ConstructorMap = {
    agent: "LzAgent",
    animator: "LzAnimator" ,
    animatorgroup: "LzAnimatorGroup" ,
    canvas: "LzCanvas" ,
    centerconstraint: "LzCenterConstraint",
    command: "LzCommand",
    connection: "LzConnection",
    connectiondatasource: "LzConnectionDatasource",
    datapath: "LzDatapath",
    datapointer: "LzDatapointer",
    dataselectionmanager: "LzDataSelectionManager" ,
    dataset: "LzDataset",
    datasource: "LzHTTPDatasource",
    drawview: "LzDrawView",
    debug: "LzDebugWindow",
    floormodifier: "LzFloorModifier" ,
    httpdatasource: "LzHTTPDatasource",
    'import': "LzLibrary",
    inputtext: "LzInputText" , 
    javadatasource: "LzJavaDatasource",
    layout: "LzLayout" ,
    limitmodifier: "LzLimitModifier" ,
    mappingview: "LzPagingView" ,
    node: "LzNode",
    params: "LzParam",
    propconstraint: "LzViewPropConstraint" ,
    propmodifier: "LzPropertyModifier" ,
    script: "LzScript",
    selectionmanager: "LzSelectionManager" ,
    state: "LzState", 
    text:  "LzText",
    userclass: "LzUserClass",
    view:  "LzView",
    viewtemplate: "LzViewTemplate"
};

/* This constructor map overwrites the regular ConstructorMap *just* for the 
 * doc generation. e.g. dataset cannot have an API (the LFC would break), but
 * the generated LZX Reference is going to look stupid if the dataset tag is
 * not linked to the Dataset API.
 * In short, this allows for intuitive linking for the docs ONLY. LFC does not
 * use this array at all. 
ConstructorMapDocs = {
    datasource : "Datasource",
    dataset : "LzDataset"
};
*/

TagFunctionMap = {
    dataset: "setDatasetType"
}

/* Create an object from an XML element.  Operates recursively on the
 * element and its children, whose instances which are added to the
 * instance created from the element.  If the element has an "id"
 * attribute, make it available as a global variable with this name.
 *
 * The name of this function must match the value of
 * org.openlaszlo.ic.CompilationEnvironment.VIEW_INSTANTIATION_FNAME. */

function LzInstantiateView(e, tn)
{
    //LzInstantiateSubviews(canvas, e);

    //fix tags
    LzFixTags( e );

    if ( typeof(tn) == "undefined" ){
        tn = 1;
    }
    canvas.initiatorAddNode( e  , tn );
}

function LzFixTags ( e ){
    // If this code is changed, the code in ClassNode.java should be
    // changed too.
    if ( e.name == "trait" ){
        new LzTrait( e );
        return;
    }

    if ( _root.ConstructorMap[ e.name ] !=null ){
        e.name = _root.ConstructorMap[ e.name ];
    }
    if ( e.id != null )
        e.attrs.id = e.id; // Does id really still some in this way?

    var i = 0;
    while ( i < e.children.length ){
        var c = e.children[ i ];

        if ( c.name == 'datapath' ){
            //remove from child array
            if ( !e.attrs ){
                e.attrs = {};
            }
            c.name =_root.ConstructorMap[ c.name ];
            e.attrs.$datapath = c;
            e.children.splice( i , 1 );
            continue;
        }

        LzFixTags( e.children[ i++ ] );
    }
}

function lzAddLocalData(name, d) {
    return new _root.LzDataset(null, {name: name, data: d });
}
