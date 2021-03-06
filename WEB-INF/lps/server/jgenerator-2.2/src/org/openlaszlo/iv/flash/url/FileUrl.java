/*
 * $Id: FileUrl.java,v 1.3 2002/02/24 02:10:19 skavish Exp $
 *
 * ==========================================================================
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

package org.openlaszlo.iv.flash.url;

import java.io.*;
import java.net.*;
import org.openlaszlo.iv.flash.util.*;
import org.openlaszlo.iv.flash.api.*;


/**
 * This class is implementation of IVUrl for local files
 *
 * @author Dmitry Skavish
 */
public class FileUrl extends IVUrl {

    private File file;
    private String ref;

    /**
     * Creates FileUrl from absolute file name
     *
     * @param absolutePath absolute file name
     * @exception IVException
     */
    public FileUrl( String absolutePath ) throws IVException {
        int idx = absolutePath.lastIndexOf('#');
        if( idx >= 0 ) {
            ref = absolutePath.substring(idx+1);
            absolutePath = absolutePath.substring(0, idx);
        }
        absolutePath = parseFilePath(absolutePath);
        file = new File(absolutePath);
        check();
    }

    /**
     * Creates FileUrl from file name and path
     *
     * @param name file name
     * @param path file path
     * @exception IVException
     */
    public FileUrl( String name, String path ) throws IVException {
        file = new File(parseFilePath(path), Util.translatePath(name));
        check();
    }

    /**
     * Creates FileUrl from relative file name and FlashFile
     *
     * @param surl relative file name
     * @param flashFile flash file
     * @exception IVException
     */
    public FileUrl( String surl, FlashFile flashFile ) throws IVException {
        int idx = surl.lastIndexOf('#');
        if( idx >= 0 ) {
            ref = surl.substring(idx+1);
            surl = surl.substring(0, idx);
        }
        String fileurl = parseFilePath(surl);
        file = new File(fileurl);
        if( !file.isAbsolute() && flashFile != null )
            file = new File(flashFile.getFileDir(), file.getPath());
        check();
    }

    private String parseFilePath( String s ) throws IVException {
        int idx = s.indexOf('?');
        if( idx >= 0 ) {
            parse(s, idx);
            s = s.substring(0,idx);
        }
        return Util.translatePath(s);
    }

    private void check() throws IVException {
        if( !file.exists() || !file.isFile() )
            throw new IVException( Resource.FILENOTFOUND, new Object[] {file.getAbsolutePath()} );
    }

    public String getName() {
        return file.getAbsolutePath();
    }

    public long lastModified() {
        return file.lastModified();
    }

    public String getRef() {
        return ref;
    }

    public InputStream getInputStream() throws IOException {
        return new FileInputStream(file);
    }

}
