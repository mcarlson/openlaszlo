/*
 * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  */


public class LzParsedPath {
    public static function trim(rp:String):String { return rp; }
}

public class LzDataset {
    function LzDataset(...rest) { } 
    public static var slashPat = "/";
}


public class LzDataNode {
    static public function trim (...rest) {}
    
}





public class LzDataAttrBind {
    public function LzDataAttrBind(a:*,b:*,c:*) { }
}

public class LzDatapath {
    public function LzDatapath (...rest) { }
}

class LzDataElement  extends LzDataNode {
    public var children = [];
    public function  LzDataElement (name , cattrs) {
    }

    public function setChildNodes(l) {
        children.push(l);
        trace("setChildNodes", l);
    }

}



class LzDataText  extends LzDataNode {
    public function LzDataText (nv) {
        
    }

}
