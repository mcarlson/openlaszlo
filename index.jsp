<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<%@ page contentType="text/html" %>
<!DOCTYPE html 
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
    <head> <title>Internal OpenLaszlo Index</title> 
    <link rel="STYLESHEET" type="text/css" href="docs/includes/styles.css" />
    <link rel="SHORTCUT ICON" href="http://www.laszlosystems.com/images/laszlo.ico" />
    </head>
    <body>
        <img class="logo" src="lps/includes/logo_web_sm.gif" alt="OpenLaszlo logo" />
        <h1>Internal Index for
            <%= new java.io.File(org.openlaszlo.utils.LZHttpUtils.getRealPath(application, "/")).getName() %> 
        </h1>
        <p>Here's our stuff (we don't ship this internal index):</p>
        <ul>
            <li><a href="docs/release-notes.html">Release Notes</a>
            </li>
            <li><a href="quick-index.html">OpenLaszlo Quick Index</a> (this replaces this file in the distro)
            </li>
            <li>Laszlo Explorer
                <ul>
                <li>Laszlo Explorer (<a href="laszlo-explorer/index.jsp?lzr=swf8&amp;bookmark=Welcome">flash</a>) (<a href="laszlo-explorer/index.jsp?lzr=dhtml&amp;bookmark=Welcome">dhtml</a>)</li>
                <li>World Clock (<a href="lps/utils/welcome_support/coverpages/welcome_cover.lzx">flash</a>) (<strike>dhtml</strike>)</li>
                </ul>
            </li>
            <li><a href="demos">Demos</a>
                <ul>
                    <li>amazon (<a href="demos/amazon/amazon.lzx?lzr=swf8">flash</a>) (<a href="demos/amazon/amazon.lzx?lzr=dhtml">dhtml</a>)</li>
                    <li>amazon-soap (<a href="demos/amazon-soap/amazon.lzx?lzr=swf8">flash</a>) (<a href="demos/amazon-soap/amazon.lzx?lzr=dhtml">dhtml</a>)</li>
                    <li>calendar (<a href="demos/calendar/calendar.lzx?lzr=swf8">flash</a>) (<a href="demos/calendar/calendar.lzx?lzr=dhtml">dhtml</a>)</li>
                    <li>chat (<a href="demos/chat/chat.lzx?lzr=swf8">flash</a>) (<a href="demos/chat/chat.lzx?lzr=dhtml">dhtml</a>)</li>
                    <li>lzpix (<a href="demos/lzpix/app.lzx?lzr=swf8">flash</a>) (<a href="demos/lzpix/app.lzx?lzr=dhtml">dhtml</a>)</li>
                    <li>lzproject (<a href="demos/lzproject/lzx/lzproject/LZProject.lzx?lzr=swf8">flash</a>) (<a href="demos/lzproject/lzx/lzproject/LZProject.lzx?lzr=dhtml">dhtml</a>)</li>
                    <li>noughts (<a href="demos/noughts/noughts.lzx?lzr=swf8">flash</a>) (<a href="demos/noughts/noughts.lzx?lzr=dhtml">dhtml</a>)</li>
                    <li>vacation-survey (<a href="demos/vacation-survey/vacation-survey.lzx?lzr=swf8">flash</a>) (<a href="demos/vacation-survey/vacation-survey.lzx?lzr=dhtml">dhtml</a>)</li>
                    <li>weather (<a href="demos/weather/weather.lzx?lzr=swf8">flash</a>)  (<a href="demos/weather/weather.lzx?lzr=dhtml">dhtml</a>)</li>
                    <li>youtube (<a href="demos/youtube/youtube.lzx?lzr=swf8">flash</a>)</li>
                </ul>
            </li>
            <li><a href="examples">Examples</a>
                <ul>
                <li>animation (<a href="examples/animation/animation.lzx?lzr=swf8">flash</a>) (<a href="examples/animation/animation.lzx?lzr=dhtml">dhtml</a>)</li>
                <li>contactlist (<a href="examples/contactlist/contactlist.lzx?lzr=swf8">flash</a>) (<a href="examples/contactlist/contactlist.lzx?lzr=dhtml">dhtml</a>)</li>
                <li>image-loading (<a href="examples/image-loading/dataimage.lzx?lzr=swf8">flash</a>) (<a href="examples/image-loading/dataimage.lzx?lzr=dhtml">dhtml</a>)</li>
                <li>music (<a href="examples/music/music.lzx?lzr=swf8">flash</a>) (<a href="examples/music/music.lzx?lzr=dhtml">dhtml</a>)</li>
                <li><a href="examples/components">Components</a>
                    <ul>
                    <li>Component Sampler (<a href="examples/components/component_sampler.lzx?lzr=swf8">flash</a>) (<a href="examples/components/component_sampler.lzx?lzr=dhtml">dhtml</a>)</li>
                    <li>Form Components
                        <ul>
                        <li>button (<a href="examples/components/button_example.lzx?lzr=swf8">flash</a>) (<a href="examples/components/button_example.lzx?lzr=dhtml">dhtml</a>)</li>
                        <li>checkbox (<a href="examples/components/checkbox_example.lzx?lzr=swf8">flash</a>) (<a href="examples/components/checkbox_example.lzx?lzr=dhtml">dhtml</a>)</li>
                        <li>combobox (<a href="examples/components/combobox_example.lzx?lzr=swf8">flash</a>) (<a href="examples/components/combobox_example.lzx?lzr=dhtml">dhtml</a>)</li>
                        <li>datacombobox (<a href="examples/components/datacombobox_example.lzx?lzr=swf8">flash</a>) (<a href="examples/components/datacombobox_example.lzx?lzr=dhtml">dhtml</a>)</li>
                        <li>datepicker (<a href="examples/components/datepicker_example.lzx?lzr=swf8">flash</a>) (<a href="examples/components/datepicker_example.lzx?lzr=dhtml">dhtml</a>)</li>
                        <li>edittext (<a href="examples/components/edittext_example.lzx?lzr=swf8">flash</a>) (<a href="examples/components/edittext_example.lzx?lzr=dhtml">dhtml</a>)</li>
                        <li>form (<a href="examples/components/form_example.lzx?lzr=swf8">flash</a>) (<a href="examples/components/form_example.lzx?lzr=dhtml">dhtml</a>)</li>
                        <li>list (<a href="examples/components/list_example.lzx?lzr=swf8">flash</a>) (<a href="examples/components/list_example.lzx?lzr=dhtml">dhtml</a>)</li>
                        <li>radiogroup (<a href="examples/components/radiogroup_example.lzx?lzr=swf8">flash</a>) (<a href="examples/components/radiogroup_example.lzx?lzr=dhtml">dhtml</a>)</li>
                        <li>slider (<a href="examples/components/slider_example.lzx?lzr=swf8">flash</a>) (<a href="examples/components/slider_example.lzx?lzr=dhtml">dhtml</a>)</li>
                        </ul>
                    </li>
                    <li>General Components
                        <ul>
                        <li>grid (<a href="examples/components/grid_example.lzx?lzr=swf8">flash</a>) (<a href="examples/components/grid_example.lzx?lzr=dhtml">dhtml</a>)</li>
                        <li>menu (<a href="examples/components/menu_example.lzx?lzr=swf8">flash</a>) (<a href="examples/components/menu_example.lzx?lzr=dhtml">dhtml</a>)</li>
                        <li>floatinglist (<a href="examples/components/floatinglist_example.lzx?lzr=swf8">flash</a>) (<a href="examples/components/floatinglist_example.lzx?lzr=dhtml">dhtml</a>)</li>
                        <li>scrollbar (<a href="examples/components/scrollbar_example.lzx?lzr=swf8">flash</a>) (<a href="examples/components/scrollbar_example.lzx?lzr=dhtml">dhtml</a>)</li>
                        <li>tabs (<a href="examples/components/tabs_example.lzx?lzr=swf8">flash</a>) (<a href="examples/components/tabs_example.lzx?lzr=dhtml">dhtml</a>)</li>
                        <li>tabslider (<a href="examples/components/tabslider_example.lzx?lzr=swf8">flash</a>) (<a href="examples/components/tabslider_example.lzx?lzr=dhtml">dhtml</a>)</li>
                        <li>tree (<a href="examples/components/tree_example.lzx?lzr=swf8">flash</a>) (<a href="examples/components/tree_example.lzx?lzr=dhtml">dhtml</a>)</li>
                        <li>window (<a href="examples/components/window_example.lzx?lzr=swf8">flash</a>) (<a href="examples/components/window_example.lzx?lzr=dhtml">dhtml</a>)</li>
                        </ul>
                    </li>
                    </ul>
                </li>
                <li>class hierarchy (<a href="docs/component-browser/components.lzx?lzr=swf8">flash</a>) (<a href="docs/component-browser/components.lzx?lzr=dhtml">dhtml</a>)</li>
                </ul>
            </li>
            <li><a href="test">Tests</a> (these won't ship with the product)</li>
        </ul>
        <p>Docs</p>
        <ul>
            <li><a href="docs">Docs index</a></li>
            <!-- change title per LPP-4804, IORIO 14 oct 2007 -->
            <li><a href="docs/developers">Application Developer's Guide</a></li>
 <!--           <li><a href="docs/component-design">UI Designer's Guide</a></li>-->
            <!-- change title per LPP-4804, IORIO 14 oct 2007 -->
            <li><a href="docs/deployers">System Administrator's Guide</a></li>
            <li><a href="http://www.openlaszlo.org/lps3/docs/reference">Reference Guide (for OL 3.4, served from www.openlaszlo.org)</a> or <a href="docs/reference">Reference Guide (local)</a></li>
<!--    remove link to nonexistant contrib. guide. IORIO: 22may08 -->
            <li><a href="docs/release-notes.html">Latest Release Notes</a></li>
        </ul>        
    </body>
</html>
