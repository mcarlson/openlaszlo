/**
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @access public
  * @topic LFC
  * @subtopic Data
  * @access public
  */

/**
  * <p>
  * <class>LzDataRequest</class> is an abstract class that can be extended to create new kinds 
  * of data requests, which are passed to a <class>DataProvider</class> when making a request.
  * </p>
  * <event>onstatus</event>: Sent as data or other conditions occur during the execution of this request.
  *
  * @shortdesc An abstract class to represent data requests.
  * @lzxname datarequest
  */

class LzDataRequest extends LzNode {

    /** @access private
     * @modifiers override 
     */
    static var tagname = 'datarequest';
    
    /* Status value constants */
    static var SUCCESS = 'success';
    static var TIMEOUT = 'timeout';
    static var ERROR   = 'error';
    static var READY   = 'ready';


    var requestor = null; 
    var src       = null; 
    var timeout   = Infinity;
    var status    = null; 
    var rawdata   = null; 

    // Used by dataprovider to record error messages
    var error = null; 
    
    /** @lzxtype event */
    var onstatus = LzDeclaredEvent;

    function LzDataRequest ( parent:* = null, attrs:* = null, children:* = null, instcall:*  = null) {
        super(parent,attrs,children,instcall);
        this.requestor = parent;
    }  

}

ConstructorMap[LzDataRequest.tagname] = LzDataRequest;
