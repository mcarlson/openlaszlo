/*
 * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  */


public class LzParsedPath {
    public static function trim(rp:String):String { return rp; }
}
lz.ParsedPath = LzParsedPath;  // publish

public class LzDataset {
    function LzDataset(...rest) { } 
    public static var slashPat = "/";
}
lz.Dataset = LzDataset;  // publish


public class LzDataNode {
    static public function trim (...rest) {}
    
}
lz.DataNode = LzDataNode;  // publish





public class LzDataAttrBind {
    public function LzDataAttrBind(a:*,b:*,c:*) { }
}
lz.DataAttrBind = LzDataAttrBind;  // publish

public class LzDatapath {
    public function LzDatapath (...rest) { }
}
lz.Datapath = LzDatapath;  // publish

class LzDataElement  extends LzDataNode {
    public var children = [];
    public function  LzDataElement (name , cattrs) {
    }

    public function setChildNodes(l) {
        children.push(l);
        trace("setChildNodes", l);
    }

}
lz.DataElement = LzDataElement;  // publish



class LzDataText  extends LzDataNode {
    public function LzDataText (nv) {
        
    }

}
lz.DataText = LzDataText;  // publish
