/*
 * $Id: ReplicateMovieClipCommand.java,v 1.8 2002/07/17 05:13:37 skavish Exp $
 *
 * ===========================================================================
 *
 * The JGenerator Software License, Version 1.0
 *
 * Copyright (c) 2000 Dmitry Skavish (skavish@usa.net). All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in
 *    the documentation and/or other materials provided with the
 *    distribution.
 *
 * 3. The end-user documentation included with the redistribution, if
 *    any, must include the following acknowlegement:
 *    "This product includes software developed by Dmitry Skavish
 *     (skavish@usa.net, http://www.flashgap.com/)."
 *    Alternately, this acknowlegement may appear in the software itself,
 *    if and wherever such third-party acknowlegements normally appear.
 *
 * 4. The name "The JGenerator" must not be used to endorse or promote
 *    products derived from this software without prior written permission.
 *    For written permission, please contact skavish@usa.net.
 *
 * 5. Products derived from this software may not be called "The JGenerator"
 *    nor may "The JGenerator" appear in their names without prior written
 *    permission of Dmitry Skavish.
 *
 * THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED.  IN NO EVENT SHALL DMITRY SKAVISH OR THE OTHER
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF
 * USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
 * OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 *
 */

package org.openlaszlo.iv.flash.commands;

import java.io.*;
import org.openlaszlo.iv.flash.parser.*;
import org.openlaszlo.iv.flash.api.*;
import org.openlaszlo.iv.flash.util.*;

import org.openlaszlo.iv.flash.context.Context;

public class ReplicateMovieClipCommand extends GenericCommand {

    public ReplicateMovieClipCommand() {}

    public void doCommand( FlashFile file, Context context, Script parent, int frameNum ) throws IVException {
        String datasource = getParameter( context, "datasource" );
        boolean expand = getBoolParameter( context, "expand", true );

        Instance inst = getCommandInstance(file, context, parent, frameNum);
        //inst.printContent(System.out, "!");
        Script template = inst.getScript();
        //template.printContent(System.out, "!");

        String[][] data;
        try {
            UrlDataSource ds = new UrlDataSource(datasource,file);
            data = ds.getData();
        } catch( IOException e ) {
            throw new IVException(Resource.ERRDATAREAD, new Object[] {datasource, getCommandName()}, e);
        }

        if( data.length < 1 ) {
            throw new IVException( Resource.INVALDATASOURCE, new Object[] {datasource, getCommandName()} );
        }

        Script newScript = new Script(20);

        int totalFrames = 0;
        for( int row=1; row<data.length; row++ ) {
            Context myContext = makeContext( context, data, row );
            Script myScript = template.copyScript();
            file.processScript( myScript, myContext );
            totalFrames += myScript.getFrameCount();
            myScript.reserveLayers(1, newScript.getMaxDepth()); // shift all the layers up, this fix some flash player bug
            newScript.appendScript( myScript );
        }

        inst.setScript( newScript );

        if( expand && !isComponent() ) {
            // create new frames if needed
            parent.getFrameAt(frameNum+totalFrames-1);
        }
    }

}
