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
  * <class>LzDatasource</class> is an abstract class that can be extended to create new kinds 
  * of datasources, such as <class>Javadatasource</class> and <class>HTTPdatasource</class>. These datasources 
  * are the client's representation of a backend entity. There is no tag that 
  * corresponds to this class.
  * </p>
  * <p>
  *  Datasources represent queryable server-side Datasources, capable of creating 
  *  or changing Datasets.  Datasources are type-specific, i.e. http, jdbc or 
  *  soap.
  *  Datasources manage connections to the server,  handle timeouts and send 
  *  <event>ondata</event> and <event>onerror</event> events. 
  * </p>
  * <p>
  * In addition to any fields documented in the section below, these fields are also available:
  * <attribute>src</attribute> String: The http request to make for the datasource.
  *
  * <attribute>timeout</attribute>  Number: Interval (in milliseconds) to wait for
  * response before timing out on request.  Default 30000.</p>
  *
  * <p>
  * In addition to any events documented in the section below, these events are also available:
  *
  * <event>ontimeout</event>: Sent when a request from one of the datasource's 
  * datasets times out.
  *
  * <event>onerror</event>: Sent when an error occurs for this datasource.
  *
  * <event>ondata</event>: Sent when new data arrives for this datasource.</p>
  *
  * @shortdesc An abstract class to represent backend data sources.
  * @lzxname datasource
  */
class LzDatasource extends LzNode {

  static var setters = new LzInheritedHash(LzNode.setters);
  static var getters = new LzInheritedHash(LzNode.getters);
  static var defaultattrs = new LzInheritedHash(LzNode.defaultattrs);
  static var options = new LzInheritedHash(LzNode.options);
  static var __LZdelayedSetters:* = new LzInheritedHash(LzNode.__LZdelayedSetters);
  static var earlySetters:* = new LzInheritedHash(LzNode.earlySetters);


/**
  * @lzxtype booleanLiteral | "inherit"
  * @lzxdefault inherit
  */
var proxied = null;
var src;

    function LzDatasource ( parent:* = null , attrs:* = null, children:* = null, instcall:*  = null) {
        super(parent,attrs,children,instcall);
    }

function loadSuccess (loader, data) { loader.dataset.gotRawData(data); }
function loadError   (loader, data) { loader.dataset.gotError(data);   }
function loadTimeout (loader, data) { loader.dataset.gotTimeout(data); } 

/**
  * Returns a new loader for the given dataset. The returned object supports
  * a "request" method which can be used to make backend requests.
  * @access protected
  * @param LzDataset dataset: The dataset to get the loader for.
  * @param Boolean proxied:
  * @return LzHTTPLoader
  */
function getLoaderForDataset ( dataset, proxied ){
    var tloader = dataset.getOption( "dsloader" );

    // If there is no loader, or if the loader changed it's proxied
    // flag, make a new loader.
    if ( !tloader){
        tloader = new LzHTTPLoader(this, proxied);
        dataset.setOption( 'dsloader' , tloader );
        tloader.setQueueing(dataset.queuerequests);
        tloader.loadSuccess = this.loadSuccess;
        tloader.loadError   = this.loadError;
        tloader.loadTimeout = this.loadTimeout;
    }
    
    if (typeof(dataset.timeout) != "undefined" && dataset.timeout != null) {
        tloader.setTimeout(dataset.timeout);
    }
    tloader.setProxied(proxied);

    var secure = ('secure' in dataset) ? dataset.secure : null;

    if (secure == null) {
        if (this.src.substring(0, 5) == "https") {
            secure = true;
        }
    }

    if (secure) {
        tloader.baserequest = LzBrowser.getBaseURL( secure, dataset.secureport );
        //Debug.write('basereq ' + tloader.baserequest);
    }

    tloader.secure = secure;
    if (secure) {
        tloader.secureport = dataset.secureport;
    }
    
    return tloader;
}

/**
  * Interrupts any load in progress for the given dataset.
  * @access protected
  * @param LzDataset forset: The dataset for which to interrupt the load.
  */
function abortLoadForDataset ( forset ){
    forset.getOption( "dsloader" ).abort();
}

/**
  * Returns the amount of time it took the given datset to load
  * @param LzDataset forset: The daataset for which to report the load time
  * @return Number
  */
function getLoadTimeForDataset ( forset ){
    return forset.getOption( "dsloader" ).getLastLoadtime();
}


/**
  * Get string representation
  * @access private
  * @return: String representation of this object
  */
override function toString() {
    return "LzDatasource '" + this.name + "'";
}


} // End of LzDatasource
