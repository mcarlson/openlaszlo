﻿/*************************************************************************
*                       
* ADOBE SYSTEMS INCORPORATED
* Copyright 2004-2008 Adobe Systems Incorporated
* All Rights Reserved.
*
* NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the 
* terms of the Adobe license agreement accompanying it.  If you have received this file from a 
* source other than Adobe, then your use, modification, or distribution of it requires the prior 
* written permission of Adobe.
*
**************************************************************************/

package fl.video {

	import flash.net.NetConnection;

	use namespace flvplayback_internal;
	
	/**
	 * <p>Holds client-side functions for remote procedure calls (rpc)
	 * from the FMS during initial connection for <code>NCManager2</code>.
	 * One of these objects is created and passed to the <code>NetConnection.client</code>
	 * property.</p>
	 *
     * @private
     *
     * @langversion 3.0
     * @playerversion Flash 9.0.28.0
	 */
	public class ConnectClientDynamicStream extends ConnectClient {
		
		public function ConnectClientDynamicStream(owner:NCManager, nc:NetConnection, connIndex:uint=0) {
			super(owner, nc, connIndex);
		}

		override public function onBWDone(...rest):void {
			var p_bw:Number;
			if (rest.length > 1) p_bw = rest[0];
			//ifdef DEBUG
			//owner.debugTrace("ConnectClient.onBWDone(" + p_bw + ")");
			//endif
			//owner.onConnected(nc, p_bw);
		}

		override public function onBWCheck(... rest):Number {
			return 0;
		}
	} // class ConnectClientDynamicStream

} // package fl.video
