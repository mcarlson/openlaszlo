#!/usr/bin/perl
# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************

use strict;
use English;
use Config;
use Getopt::Long;
use Cwd;
use LWP::UserAgent;
use File::Basename;

# List of options to use
use vars qw($g_sServletContainer
			$g_sSCHome
			$g_sJavaHome
			$g_sHost
			$g_sPath
			$g_sLPSHome
			$g_sPort
			$g_sHelp
			$g_sProgramName
			$g_sRetries
			$g_sJVMDir
			$g_sProgramPath
			$g_sTitle);

# Option names
*g_sServletContainer = \"servlet-engine";
*g_sSCHome			 = \"se-path";
*g_sJavaHome		 = \"java-home";
*g_sJVMDir			 = \"jvm-dir";
*g_sHost			 = \"host";
*g_sLPSHome			 = \"home";
*g_sPath			 = \"path";
*g_sProgramName		 = \"command";
*g_sPort			 = \"port";
*g_sHelp			 = \"help";
*g_sRetries			 = \"retries";
*g_sProgramPath		 = \"scriptdir";
*g_sTitle			 = \"title";

my $g_sDefEngine = "Tomcat";
my $g_sDefService = "Apache Tomcat";
my $g_sJVMexe = "java";

my @g_aPassthroughOpts = ($g_sHost, $g_sPath, $g_sLPSHome, $g_sPort, $g_sRetries, $g_sTitle);

my %g_hDefaults =
(
	$g_sServletContainer => $g_sDefEngine,
	$g_sSCHome			 => $ENV{'TOMCAT_HOME'},
	$g_sJavaHome		 => [ ],
	$g_sJVMDir			 => '',
	$g_sHost			 => `hostname`,
	$g_sLPSHome			 => dirname($0) . "/..",
	$g_sPath			 => 'lps',
	$g_sPort			 => 8080,
	$g_sProgramName		 => './quickcheck.py',
	$g_sProgramPath		 => './',
	$g_sRetries			 => 3
);

my %g_hHelpStrings =
(
	$g_sServletContainer => "servlet engine name (default: $g_sDefEngine)",
	$g_sSCHome			 => "path to servlet container (default: $g_hDefaults{$g_sSCHome})",
	$g_sJavaHome		 => "path to individual JDK, can specify more than one",
	$g_sJVMDir			 => "path to multiple JDK container; can be combined with $g_sJavaHome",
	$g_sHost			 => "host to run tests against (default: $g_hDefaults{$g_sHost})",
	$g_sLPSHome			 => "location of LPS to test against (default: $g_hDefaults{$g_sLPSHome})",
	$g_sPath			 => "web path of LPS (default: $g_hDefaults{$g_sPath})",
	$g_sPort			 => "port LPS runs on (default: $g_hDefaults{$g_sPort})",
	$g_sProgramName		 => "name of script that will run tests (default: $g_hDefaults{$g_sProgramName})",
	$g_sProgramPath		 => "location of test script (default: $g_hDefaults{$g_sProgramPath})",
	$g_sRetries			 => "number of attempts to make when querying LPS (default: $g_hDefaults{$g_sRetries})",
	$g_sHelp			 => "this message"
);

# Configuration object
my $g_rConfig = \%g_hDefaults;

our (%g_hStartupStrings, %g_hShutdownStrings);

sub usage
{
    print "Usage: perl swapjvm.pl [options]\nOptions:\n";

	my ($opt, $desc);
    format =
    ^<<<<<<<<<<<<<<<<^<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<~~
	$opt, $desc
.

    foreach (keys %g_hHelpStrings)
    {
		($opt, $desc) = ("-$_", $g_hHelpStrings{$_});
		write;
	}
	print "\nAll arguments are optional; if no JDK path specified, value of JAVA_HOME will be used. ";
	print "To pass options through to test script, separate from this script's options with '--'\n";
	exit
}

sub absolutize($)
{
	my $path = shift;
	$path =~ s/\\/\//g;
	$path = Cwd::abs_path($path);
	$path = qx(cygpath -w -m -a "$path") if ($^O eq 'cygwin');
	chomp $path;
	return $path
}

sub config
{
	&GetOptions($g_rConfig,
				"$g_sServletContainer:s",
				"$g_sSCHome:s",
				"$g_sJavaHome:s@",
				"$g_sHost:s",
				"$g_sPath:s",
				"$g_sPort:s",
				"$g_sLPSHome:s",
				"$g_sJVMDir:s"	=>
					sub
					{
						if (opendir JVM_PATH, $_[1])
						{
							my $sJVMdir = $_[1];
							map { push @{$g_rConfig -> {$g_sJavaHome}}, "$sJVMdir/$_" if (!/^\.+$/ && -d "$sJVMdir/$_")}
								readdir(JVM_PATH);
							closedir JVM_PATH;
						}
					},
				"$g_sRetries:s",
				"$g_sProgramPath:s",
				"$g_sProgramName:s",
				"$g_sHelp" =>	sub { usage(); }
 	) or usage();

	push @{$g_rConfig->{$g_sJavaHome}}, $ENV{'JAVA_HOME'} if (!scalar(@{$g_rConfig->{$g_sJavaHome}}));

	chomp $g_rConfig -> {$g_sHost};
	
	$g_rConfig -> {$g_sLPSHome} = absolutize($g_rConfig -> {$g_sLPSHome});
	my $sPath = absolutize($g_rConfig -> {$g_sSCHome});
	
	%g_hStartupStrings =
	(
		$g_sDefEngine	=>	"$sPath/bin/startup.sh", 
		"Jetty" 		=>  "$g_sJVMexe \$JAVA_OPTS -jar start.jar etc/jetty.xml > /dev/null",
		"WebSphere"	=>	"$sPath/bin/startServer.sh server1"
	);

	%g_hShutdownStrings =
	(
		$g_sDefEngine	=>  "$sPath/bin/shutdown.sh",
		"Jetty" 		=>  $g_rConfig -> {$g_sJavaHome}[$#{$g_rConfig -> {$g_sJavaHome}}] . 
			"/bin/$g_sJVMexe -jar $sPath/stop.jar $sPath/etc/jetty.xml",
		"WebSphere"	=>	"$sPath/bin/stopServer.sh server1"
	);

	# Hack to prevent temp dir from being set to cygwin-style path
	$ENV{'CATALINA_TMPDIR'} = "$sPath/temp";

	# Ensure we don't run out of memory
	$ENV{'JAVA_OPTS'} .= "-Xms128m -Xmx512m";
}

sub stopServletEngine()
{
	my $ps = 'ps -e';
	$ps .= 'W' if ($Config{'osname'} eq 'cygwin');

	my $sProcList = qx($ps);

	my $sSengStop;
	if ($sProcList =~ $g_sJVMexe)
	{
		$sSengStop = "\"" . $g_hShutdownStrings{$g_rConfig->{$g_sServletContainer}} . "\"";
	}
	else
	{
		$sSengStop = "net stop \"$g_sDefService\"" if ($sProcList =~ /$g_sDefEngine/i);
	}
	print "Stopping servlet engine ...\n";
	system($sSengStop);
}

sub startServletEngine($)
{
	my $sJVMpath = shift;

	print "Starting servlet engine ...\n";
	print "Using JVM located at: $sJVMpath\n";
	my $sSengStart = "\"" . $g_hStartupStrings{$g_rConfig->{$g_sServletContainer}} . "\"";
	my $curdir = cwd();
	if ($g_rConfig->{$g_sServletContainer} eq "Jetty") 
	{
		chdir $g_rConfig->{$g_sSCHome};
		$sSengStart = join '/', $sJVMpath, 'bin', $sSengStart; 
	}
	my $pid = fork;
	my $sSengCmd;
	unless ($pid)
	{
		exec $sSengStart;
		exit;
	}

	if ($g_rConfig -> {$g_sServletContainer} eq $g_sDefEngine)
	{
		installWAR();
	}
	else 
	{
		chdir $curdir;
	}
}

sub sendRequest($)
{
	my $sRequestURL = shift;

	my $client = new LWP::UserAgent(timeout => 60);
	my $response = $client -> get($sRequestURL);

	my $sAtt = $g_rConfig -> {$g_sRetries};
	while ($response -> code != 200 && $sAtt--)
	{
		$response = $client -> get($sRequestURL);
		sleep(2);
	}
	
	die "Error while getting " , $response->request->uri ,
		" -- " , $response->status_line
	  	unless $response->is_success or !$sAtt;
	return $response -> content;
}

sub clearCache
{
	my $sCC_URL = "http://$g_rConfig->{$g_sHost}:$g_rConfig->{$g_sPort}/$g_rConfig->{$g_sPath}/foo.lzx?lzt=clearcache&pwd=laszlo";
	eval
	{
		sendRequest($sCC_URL);
	};
	warn $@, "\tClear cache request failed!" if $@;
}

sub installWAR
{
	my $sBaseURL = "http://admin:laszlo\@$g_rConfig->{$g_sHost}:$g_rConfig->{$g_sPort}/manager";
	my $sListURL = "$sBaseURL/list";

	eval
	{
		if (sendRequest($sListURL) !~ $g_rConfig -> {$g_sPath})
		{
			my $sInstallURL = "$sBaseURL/install?path=/$g_rConfig->{$g_sPath}&war=file://" . $g_rConfig -> {$g_sLPSHome};
			sendRequest($sInstallURL);
		}
	};
	warn $@, "\tUnable to install application into path ", $g_rConfig->{$g_sPath} if $@;
}


sub startTests
{
	my %hArgs = ();
	foreach (@g_aPassthroughOpts)
	{
		$hArgs{"-$_"} = $g_rConfig ->{$_};
	}
	my $curdir = cwd();
	chdir $g_rConfig->{$g_sProgramPath};
	system($g_rConfig->{$g_sProgramName}, (%hArgs, @ARGV));
	chdir $curdir;
}

sub main()
{
	config();

	foreach (@{$g_rConfig->{$g_sJavaHome}})
	{
		eval
		{
			die "$_ is not a directory" if (!-d $_);
			chop if /[\\\/]$/;
			$ENV{'JAVA_HOME'} = $_;

			stopServletEngine();
			startServletEngine($_);
			clearCache();

			s/^(.*[\\\/])(.*)$/$2/;
			$g_rConfig -> {$g_sTitle} = $_;
			startTests();
		};
		print $@ . "\n" if ($@);
	}
}

exit (main());
