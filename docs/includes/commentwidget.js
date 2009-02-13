/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************

 * write out a <script> tag which invokes a remote "show.php" url to show comments
 * for this page.
 *
 */

commentServerPath = "http://comments.openlaszlo.org/comdoc";

href = document.location.href;
// Compute the pathname of this doc page by grabbing everything after the "/docs/" in the url
lastslash = href.lastIndexOf('/docs/');
pagename =   encodeURIComponent(href.substring(lastslash+6));

document.writeln('<script type="text/javascript" src="' + commentServerPath + '/show.php?docpath='  + pagename  + '&type=js"></script>');

