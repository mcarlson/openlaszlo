/**
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @access private
  * @topic LFC
  * @subtopic Data
  */

/**
  * @access private
  */
class LzParsedPath {

  /** 
    * The xpath for this LzParsedPath
    * 
    * @access private
    */
  var path = null;
  
  /** 
    * Array containing selector-operations for this LzParsedPath
    * 
    * @access private
    */
  var selectors = null;
  
  /** 
    * Pointer to the dataset (if part of the path) otherwise null
    * (currently only used for "new"-datasets, see deprecated message)
    * 
    * @access private
    * @deprecated may lead to memory leaks (LPP-4214)
    */
  var context = null;
  
  /** 
    * Name of the dataset (if part of the path)
    * 
    * @access private
    */
  var dsetname = null;
  
  /** 
    * Name of the datasource (if part of the path)
    * 
    * @access private
    */
  var dsrcname = null;
  
  /** 
    * Array containing the path to the local-dataset
    * 
    * @access private
    */
  var islocaldata = null;
  
  /* Parsing information */
  
  /** 
    * One of: "nodeName", "__LZgetText", "serialize", "attributes" 
    * or "attributes.xxx" with 'xxx' as an attribute-name
    * 
    * @access private
    */
  var operator = null;
  
  /** 
    * One of: "position" or "last" 
    * 
    * @access private
    */
  var aggOperator = null;
  
  /** 
    * null or 0
    * 
    * @access private
    */
  var operatorArgs = null;
  
  /** 
    * true if terminal operator is a attribute-selector, otherwise false
    * 
    * @access private
    */
  var hasAttrOper = false;
  
  /** 
    * true if path contains a attribute-predicate
    * 
    * @access private
    */
  var hasOpSelector = false;
  
  /** 
    * true if path contains ".." or "//", otherwise false
    * 
    * @access private
    */
  var hasDotDot = false;
  
  /** 
    * Return the context for this LzParsedPath
    * Should be used instead of accessing directly the deprecated field context. 
    *
    * @access private
    */
  function getContext ( dp ) {
      if (this.context != null) {
          return this.context;
      } else {
          if (this.islocaldata != null) {
              return dp.getLocalDataContext(this.islocaldata);
          } else {
              if (this.dsrcname != null) {
                  return (canvas[ this.dsrcname ])[ this.dsetname ];
              } else {
                  if (this.dsetname != null) {
                      return canvas.datasets[ this.dsetname ];
                  }
              }
          }
      }
      return null;
  }
  
  function LzParsedPath ( pa, node ){
    //split context part
    this.path = pa;
    this.selectors = [];
    var nowarn = false;

    var sourceindex = pa.indexOf( ":/" );

    //this.context = pointer to the dataset (if part of the path) otherwise null

    if ( sourceindex > -1 ){
        //we have a dset and possible dsource
        var sourceparts = pa.substring( 0 , sourceindex ).split( ":" );
        if ( sourceparts.length > 1 ){
            var dsrc = LzParsedPath.trim( sourceparts[ 0 ] );
            var dset = LzParsedPath.trim( sourceparts[ 1 ] );
            if (dsrc == 'local') {
                nowarn=true;
                this.islocaldata = dset.split('.');
            } else {
                //we have a datasource and a dataset
                nowarn = ((canvas[ dsrc ])[ dset ] != null);
                this.dsrcname = dsrc;
                this.dsetname = dset;
            }
        } else {
            var name = LzParsedPath.trim( sourceparts[ 0 ] );
            if ( name == "new" ){
                //Debug.write( "setting to anondset" );
                this.context = new AnonDatasetGenerator( this );
        /*    } else if ( name == "localdata" ) {
                this.context = node.getLocalDataContext();
                Debug.write('found local dataset 2', this.context);
                this.islocaldata = true; 
        */
            } else {
                nowarn = (canvas.datasets[ name ] != null);
                this.dsetname = name;
            }
        }
        if (nowarn != true){
            if ($debug) {
                Debug.error( "couldn't find dataset for %w", pa );
            }
        }

        var rest = pa.substring( sourceindex + 2 );
    } else {
        var rest = pa;
    }

    // Too simple - see lpp-737
    // var nodes = rest.split( "/" );

    var nodes = [];
    var currnode = '';
    var instring = false;
    var escape = false;
    for (var i = 0; i < rest.length; i++) {
        var c = rest.charAt(i);
        if (c == '\\' && escape == false) {
            escape = true;
            continue;
        } else if (escape == true) {
            escape = false;
            currnode += c;
            continue;
        } else if (instring == false && c == "/") {
            // only count slashes as new nodes if we're not inside a string 
            // literal

            nodes.push(currnode);
            currnode = '';
            continue;
        } else if (c == "'") {
            instring = instring ? false : true;   
        }
        currnode += c;
    }
    nodes.push(currnode);
            

    if (nodes != null) {
        for ( var i = 0 ; i < nodes.length ; i++ ){
            var cnode = LzParsedPath.trim( nodes[ i ] );

            if ( i == nodes.length - 1 ){
                //could be terminal operator...
                if ( cnode.charAt( 0 ) == "@" ){
                    //attribute
                    this.hasAttrOper = true;
                    if ( cnode.charAt(1) == "*" ){
                        this.operator = "attributes";
                    } else {
                        this.operator = "attributes."  + 
                            cnode.substring( 1, cnode.length );
                    }
                    continue;
                } else if ( cnode.charAt( cnode.length -1 ) == ")" ){
                    //name, text , serialize
                    if ( cnode.indexOf( "last" ) > -1 ){
                        this.aggOperator = "last";
                    } else if ( cnode.indexOf( "position" ) > -1 ){
                        this.aggOperator = "position";
                    } else if ( cnode.indexOf( "name" ) > -1 ){
                        this.operator = "nodeName";
                    } else if ( cnode.indexOf( "text" ) > -1 ){
                        this.operator = "__LZgetText";
                        this.operatorArgs = 0;
                    } else if ( cnode.indexOf( "serialize" ) > -1 ){
                        this.operator = "serialize";
                        this.operatorArgs = 0;
                    } else {
//TODO No gotError in this class
//                        this.gotError( "Unknown operator: " + cnode );
                    }
                    continue;
                } else if ( cnode == "" ){
                    //this is a trailing slash -- it should be ignored
                    continue;
                }
            }

            //parse predicates
            var preds = cnode.split( '[' );
            var n = LzParsedPath.trim( preds[ 0 ] );
            this.selectors.push ( n =="" ? "/" : n );

            if ( n =="" || n==".." ){
                this.hasDotDot = true;
            }
            if (preds != null) {
                for ( var j = 1; j < preds.length ; j++ ){
                    var pred = LzParsedPath.trim( preds[ j ] );
                    pred = pred.substring( 0, pred.length-1);
                    //Debug.write( 'predicate ' + pred );

                    if ( LzParsedPath.trim ( pred ).charAt( 0 ) == '@'){
                        //Debug.write( 'found predicate ' + pred ); 
                        var attrpred = pred.split( '=' );
                        var a;
                        var tattr = attrpred[ 0 ].substring(1);

                        if ( attrpred.length > 1 ){
                            var aval = LzParsedPath.trim( attrpred[1] );
                            aval = aval.substring( 1 , aval.length-1);
                            a = { pred : 'attrval' ,
                                  attr : LzParsedPath.trim( tattr ),
                                  val :  LzParsedPath.trim( aval  )};
                        } else {
                            a = { pred : 'hasattr',
                                  attr : LzParsedPath.trim( tattr )};
                        }

                        //Debug.write( a.pred , a.attr , a.val );
                        this.selectors.push( a );
                        this.hasOpSelector = true;
                    } else {
                        //we have an offset

                        var a = pred.split("-");
                        //Debug.write( 'offset ' + a );
                        a[ 0 ] = LzParsedPath.trim( a[ 0 ] );


                        if ( a[ 0 ] == "" ){
                            a[ 0 ] = 1;
                        }

                        if ( a[ 1 ] != null ){
                            a[ 1 ] = LzParsedPath.trim( a[ 1 ] );
                        }

                        if (  a[ 1 ] == "" ){
                            a[ 1 ] = Infinity;
                        } else if ( a.length == 1 ){
                            a[ 1 ] = a [ 0 ];
                        }

                        a.pred = "range";
                        this.selectors.push( a );
                    } 
                }
            }
        }
    }
        
    //this.nodearray = an array of strings and offset pairs that represent the 
    //slash-separated path for the datapath, with the dataset and operator 
    //removed. The offset part of the pair can be:
    //*null  if there is no offset given
    //*int   if the offset is a single number
    //*array if the offset is dash separated
    
    //this.operator = "t" , "n" , or "a" plus "." and the attribute name 
    //text, name or attribute, respectively
}

/**
  * @access private
  */
static function trim ( s ){
    var st = 0;
    var dotrim = false;
    while( s.charAt( st ) == " " ){
        st++;
        dotrim = true;
    }

    var len = s.length - st;

    while( s.charAt( st + len - 1 ) == " " ){
        len--;
        dotrim = true;
    } 

    return dotrim ? s.substr( st , len ) : s;
}
/**
  * @access private
  */
function toString (  ){
    return  "Parsed path for path: " + this.path;
}

/**
  * @access private
  */
function debugWrite (  ){
    if ($debug) {
        Debug.write( this );
        Debug.write( "  c:" + this.context + "|");
        Debug.write( "  n:" + this.selectors.join('|') + "|");
        Debug.write( "  d:" + this.operator + "|");
        Debug.write( "  " );
    }
}

} // End of LzParsedPath


/**
  * @access private
  */
class AnonDatasetGenerator {

var pp;
/**
  * @access private
  */
function AnonDatasetGenerator  ( pp ){
    this.pp = pp;
}

/**
  * @access private
  */
function getContext (){
    var d = new LzDataset( );
    var dp = d.getPointer();
    //start at 1 to skip '/'
    if (this.pp.selectors != null) {
        for ( var i = 0; i < this.pp.selectors.length; i++ ){
            if ( this.pp.selectors[ i ] == "/" ) continue;
            dp.addNode( this.pp.selectors[ i ] );
            dp.selectChild();
        }
    }
        
    return d;
}

var noncontext = true;
} // End of AnonDatasetGenerator
