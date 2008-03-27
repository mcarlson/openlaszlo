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
  * <class>LzDataProvider</class> implements the DataProvider interface, to support data requests.
  * </p>
  * @shortdesc DataProvider 
  */

class LzDataProvider extends LzNode {

    /** @access private
     * @modifiers override 
     */
    static var tagname = 'dataprovider';

    /**
     * Executes the given DataRequest
     * @access public
     * @param LzDataRequest dreq: The data request to run
     */
    function doRequest ( dreq ) {
    }

    function LzDataProvider ( parent:* = null, attrs:* = null, children:* = null, instcall:*  = null) {
        super(parent,attrs,children,instcall);
    }  

}

ConstructorMap[LzDataProvider.tagname] = LzDataProvider;
