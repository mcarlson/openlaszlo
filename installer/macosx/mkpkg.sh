#!/bin/sh
# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004, 2008 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************

# LPS_HOME must be set for this to work

VERSION=$1            # 1.0 for now
VERSIONUPPER=$2            # gm for now
TOMCAT=$3            # developer or deployer

BASE="openlaszlo-$VERSION-osx-dev-install"
PKG="$BASE.pkg"
NAME="OpenLaszlo Server $VERSION"

# Make flex utils and LPS utils executable
# because ant won't do it for us.
/bin/chmod a+x "$LPS_HOME/lps-$VERSION/Server/lps-$VERSION/WEB-INF/bin/"*
/bin/chmod a+x "$LPS_HOME/lps-$VERSION/Server/lps-$VERSION/WEB-INF/lps/server/bin/"*

/bin/rm -rf /tmp/$PKG
/bin/mkdir /tmp/$PKG
/bin/mkdir /tmp/$PKG/Contents
/bin/mkdir /tmp/$PKG/Contents/Resources

/bin/echo -n pmkrpkg1 >        /tmp/$PKG/Contents/PkgInfo

/bin/cat - <<EOF >            /tmp/$PKG/Contents/Info.plist
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleGetInfoString</key>
    <string>OpenLaszlo Server $VERSIONUPPER</string>
    <key>CFBundleIdentifier</key>
    <string>org.openlaszlo.lps</string>
    <key>CFBundleName</key>
    <string>OpenLaszlo Server</string>
    <key>CFBundleShortVersionString</key>
    <string>$VERSIONUPPER</string>
    <key>IFMajorVersion</key>
    <integer>1</integer>
    <key>IFMinorVersion</key>
    <integer>0</integer>
    <key>IFPkgFlagAllowBackRev</key>
    <false/>
    <key>IFPkgFlagAuthorizationAction</key>
    <string>AdminAuthorization</string>
    <key>IFPkgFlagDefaultLocation</key>
    <string>/Applications</string>
    <key>IFPkgFlagInstallFat</key>
    <false/>
    <key>IFPkgFlagIsRequired</key>
    <false/>
    <key>IFPkgFlagOverwritePermissions</key>
    <false/>
    <key>IFPkgFlagRelocatable</key>
    <true/>
    <key>IFPkgFlagRestartAction</key>
    <string>NoRestart</string>
    <key>IFPkgFlagRootVolumeOnly</key>
    <false/>
    <key>IFPkgFlagUpdateInstalledLanguages</key>
    <false/>
    <key>IFPkgFlagUseUserMask</key>
    <false/>
    <key>IFPkgFormatVersion</key>
    <real>0.10000000149011612</real>
</dict>
</plist>
EOF


/bin/cp $LPS_HOME/installer/macosx/background.jpg /tmp/$PKG/Contents/Resources
/bin/cp $LPS_HOME/installer/macosx/welcome.html /tmp/$PKG/Contents/Resources/Welcome.html
#/bin/cp $LPS_HOME/installer/macosx/readme.html /tmp/$PKG/Contents/Resources/ReadMe.html
/bin/cp $LPS_HOME/LICENSE.rtf /tmp/$PKG/Contents/Resources/License.rtf

/bin/cat - <<EOF >        /tmp/$PKG/Contents/Resources/Description.plist
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>IFPkgDescriptionDeleteWarning</key>
    <string></string>
    <key>IFPkgDescriptionDescription</key>
    <string></string>
    <key>IFPkgDescriptionTitle</key>
    <string>OpenLaszlo Server</string>
    <key>IFPkgDescriptionVersion</key>
    <string>$VERSIONUPPER</string>
</dict>
</plist>
EOF

if [ -d "$LPS_HOME/lps-$VERSION/$TOMCAT" ]; then
/bin/cat - <<EOF >        /tmp/$PKG/Contents/Resources/postflight
#!/bin/sh
/bin/chmod -R a+rw "\$2/$NAME"
/bin/chmod +x "\$2/$NAME/"*.command
/usr/bin/osascript <<OSA
set a to posix file "\$2/$NAME"
set b to posix file "\$2/$NAME/Server/lps-$VERSION/my-apps"
set c to posix file "\$2/$NAME/OpenLaszlo Explorer.command"
set d to posix file "\$2/$NAME/Start Openlaszlo Server.command"
set e to posix file "\$2/$NAME/Stop Openlaszlo Server.command"
tell application "Finder"
set the extension hidden of c to true
set the extension hidden of d to true
set the extension hidden of e to true
make new alias at the desktop to c      
make new alias at a to b with properties {name:"My Apps"}
end tell
OSA
/usr/bin/open "\$2/$NAME"
/usr/bin/open "\$2/$NAME/OpenLaszlo Explorer.command"
exit 0
EOF
/bin/chmod +x /tmp/$PKG/Contents/Resources/postflight
fi

tmp=/tmp/mkpkg.$$
/bin/rm -r $tmp 2>/dev/null
/bin/mkdir $tmp
/bin/mkdir "$tmp/$NAME"
(cd $LPS_HOME/lps-$VERSION; tar -cf - .) | \
        (cd "$tmp/$NAME"; tar -xf -)
if [ -d "$tmp/$NAME/$TOMCAT" ]; then
    /bin/chmod +x "$tmp/$NAME/$TOMCAT/bin/catalina.sh" \
        "$tmp/$NAME/$TOMCAT/bin/startup.sh" \
        "$tmp/$NAME/$TOMCAT/bin/shutdown.sh" \
        "$tmp/$NAME/OpenLaszlo Explorer.command" \
        "$tmp/$NAME/Start OpenLaszlo Server.command" \
        "$tmp/$NAME/Stop OpenLaszlo Server.command"
fi
pushd $tmp

/bin/pax -w . | /usr/bin/gzip -c - >    /tmp/$PKG/Contents/Archive.pax.gz

/usr/bin/mkbom .            /tmp/$PKG/Contents/Archive.bom

/bin/rm -rf $tmp

popd

installer/macosx/mkdmg.sh /tmp/$PKG "$BASE"
mv "/tmp/$BASE.dmg" $LPS_HOME
rm -rf /tmp/$PKG
exit

# the following code is left as an example and documentation of previous modus-operandi

if [ -x /usr/local/bin/stuff ]; then
	rm $LPS_HOME/$PKG.sit # make sure it is gone
	/usr/local/bin/stuff -q -D -n $LPS_HOME/$PKG.sit /tmp/$PKG
else
        cd /tmp
	tar -czf $LPS_HOME/$PKG.tgz $PKG
	rm -rf /tmp/$PKG
fi
