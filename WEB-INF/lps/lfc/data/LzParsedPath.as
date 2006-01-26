/******************************************************************************
 * LzParsedPath.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//=============================================================================
// DEFINE OBJECT: LzParsedPath
// @keywords private
//=============================================================================
_root.LzParsedPath = function ( pa, node ){
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
            var dsrc = this.trim( sourceparts[ 0 ] );
            var dset = this.trim( sourceparts[ 1 ] );
            if (dsrc == 'local') {
                nowarn=true;
                this.islocaldata = dset.split('.');
                this.context = node.getLocalDataContext(this.islocaldata);
            } else {
                //we have a datasource and a dataset
                this.context =_root.canvas[ dsrc ]
                                        [ dset ]; 
            }
        } else {
            var name = this.trim( sourceparts[ 0 ] );
            if ( name == "new" ){
                //_root.Debug.write( "setting to anondset" );
                this.context = new this.AnonDatasetGenerator( this );
        /*    } else if ( name == "localdata" ) {
                this.context = node.getLocalDataContext();
                _root.Debug.write('found local dataset 2', this.context);
                this.islocaldata = true; 
        */
            } else {
                this.context =  _root.canvas.datasets[ name ];
            }
        }
        if ( this.context == null && nowarn != true){
            _root.Debug.write( "couldn't find dataset for " + pa );
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
            var cnode = this.trim( nodes[ i ] );

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
                        this.gotError( "Unknown operator: " + cnode );
                    }
                    continue;
                } else if ( cnode == "" ){
                    //this is a trailing slash -- it should be ignored
                    continue;
                }
            }

            //parse predicates
            var preds = cnode.split( '[' );
            var n = this.trim( preds[ 0 ] );
            this.selectors.push ( n =="" ? "/" : n );

            if ( n =="" || n==".." ){
                this.hasDotDot = true;
            }
            if (preds != null) {
                for ( var j = 1; j < preds.length ; j++ ){
                    var pred = this.trim( preds[ j ] );
                    pred = pred.substring( 0, pred.length-1);
                    //_root.Debug.write( 'predicate ' + pred );

                    if ( this.trim ( pred ).charAt( 0 ) == '@'){
                        //_root.Debug.write( 'found predicate ' + pred ); 
                        var attrpred = pred.split( '=' );
                        var a;
                        var tattr = attrpred[ 0 ].substring(1);

                        if ( attrpred.length > 1 ){
                            var aval = this.trim( attrpred[1] );
                            aval = aval.substring( 1 , aval.length-1);
                            a = { pred : 'attrval' ,
                                  attr : this.trim( tattr ),
                                  val :  this.trim( aval  )};
                        } else {
                            a = { pred : 'hasattr',
                                  attr : this.trim( tattr )};
                        }

                        //_root.Debug.write( a.pred , a.attr , a.val );
                        this.selectors.push( a );
                        this.hasOpSelector = true;
                    } else {
                        //we have an offset

                        var a = pred.split("-");
                        //_root.Debug.write( 'offset ' + a );
                        a[ 0 ] = this.trim( a[ 0 ] );


                        if ( a[ 0 ] == "" ){
                            a[ 0 ] = 1;
                        }

                        if ( a[ 1 ] != null ){
                            a[ 1 ] = this.trim( a[ 1 ] );
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
_root.LzParsedPath.operatorArgs = null;

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzParsedPath.prototype.trim = function ( s ){
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
//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzParsedPath.prototype.toString = function (  ){
    return  "Parsed path for path: " + this.path;
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzParsedPath.prototype.debugWrite = function (  ){
    _root.Debug.write( this );
    _root.Debug.write( "  c:" + this.context + "|");
    _root.Debug.write( "  n:" + this.selectors.join('|') + "|");
    _root.Debug.write( "  d:" + this.operator + "|");
    _root.Debug.write( "  " );
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzParsedPath.prototype.AnonDatasetGenerator = function ( pp ){
    this.pp = pp;
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzParsedPath.prototype.AnonDatasetGenerator.prototype.getContext = function (){
    var d = new _root.LzDataset( );
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

LzParsedPath.prototype.AnonDatasetGenerator.prototype.noncontext = true;
