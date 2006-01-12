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
use LWP::Simple;
use File::Basename;
use Time::HiRes qw( gettimeofday tv_interval );
use File::Copy;

# List of options to use
use vars qw(	$g_sHost
		$g_sPath
		$g_sLPSHome
		$g_sPort
		$g_sHelp
		$g_sRetries
		$g_sFile);

# Option names
*g_sHost			 = \"host";
*g_sLPSHome			 = \"home";
*g_sPath			 = \"path";
*g_sPort			 = \"port";
*g_sHelp			 = \"help";
*g_sRetries			 = \"retries";
*g_sFile			 = \"file";

my %g_hDefaults =
(
	$g_sHost			 => `hostname`,
	$g_sLPSHome			 => dirname($0) . "/..",
	$g_sPath			 => 'lps',
	$g_sPort			 => 8080,
	$g_sRetries			 => 1,
	$g_sFile			 => 'components/style_example.lzx'
);

my %g_hHelpStrings =
(
	$g_sHost			 => "host to run tests against (default: $g_hDefaults{$g_sHost})",
	$g_sLPSHome			 => "location of LPS to test against (default: $g_hDefaults{$g_sLPSHome})",
	$g_sPath			 => "web path of LPS (default: $g_hDefaults{$g_sPath})",
	$g_sPort			 => "port LPS runs on (default: $g_hDefaults{$g_sPort})",
	$g_sRetries			 => "number of attempts to make when querying LPS (default: $g_hDefaults{$g_sRetries})",
	$g_sFile			 => "test file (default: $g_hDefaults{$g_sFile})",
	$g_sHelp			 => "this message"
);

# Configuration object
my $progName = basename($0);
my $g_rConfig = \%g_hDefaults;

# test file variables
my $styleLzx;
my $cpStyleLzx;
my $newStyleLzx;

my $testNumber = 1;
my $resultsFile = "compileperf.html";
my $baseUrl;
my $startTime = scalar localtime;

sub usage
{
	print "Usage: perl $progName [options]\n";
	print "Run compile performance tests for SWF 6 and SWF 7 output.\n";
	print "Report results in compileperf.html.\n";
	print "Options:\n";

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
	print "\nAll arguments are optional\n";
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
				"$g_sHost:s",
				"$g_sPath:s",
				"$g_sPort:s",
				"$g_sLPSHome:s",
				"$g_sRetries:s",
				"$g_sFile:s",
				"$g_sHelp" =>	sub { usage(); }
	) or usage();

	chomp $g_rConfig -> {$g_sHost};
	
	$g_rConfig -> {$g_sLPSHome} = absolutize($g_rConfig -> {$g_sLPSHome});
	
	# get the test file name
	$styleLzx = $g_rConfig->{$g_sFile};
	# build the filenames for the copy and renamed files
	my $name;
	my $path;
	my $suffix;
	($name, $path, $suffix) = fileparse($styleLzx, '\..*');
	$cpStyleLzx = "${path}${name}_${$}${suffix}";
	$newStyleLzx = "${path}new${name}${suffix}";
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
		"\n-- " , $response->status_line
	  	unless $response->is_success or !$sAtt;
	return $response -> content;
}

sub clearCache
{
	# get the cache type if provided
	my $num = @_;
	my $cacheType = "";
	if ( $num > 0)
	{
		$cacheType = shift;
	}
	my $sCC_URL = "$baseUrl/foo.lzx?lzt=clearcache&pwd=laszlo$cacheType";
	eval
	{
		sendRequest($sCC_URL);
	};
	warn $@, "\tClear cache request failed!" if $@;
}

sub timeCompile
{
	# get the URL and the output string
	my $url = shift;
	my $outString = shift;
	my %td = ();
	my $t0;
	my $t1;
	$td{"swf6"} = 0;
	$td{"swf7"} = 0;
	my $swftype;
	my $lzxUrl;
	foreach $swftype (keys %td)
	{
		$lzxUrl = $url . "&lzr=$swftype";
		# print "URL = $lzxUrl\n";
		# time the compile
		$t0 = [gettimeofday];
		sendRequest($lzxUrl);
		$t1 = [gettimeofday];
		$td{$swftype} = tv_interval $t0, $t1;
		print "$outString ($swftype) took $td{$swftype} seconds\n";
	}
	postResult($testNumber++, $outString, $td{"swf6"}, $td{"swf7"});
}

sub startTests
{
	print "Running tests ...\n";
	$startTime = scalar localtime;
	# compile an app
	# build URL for style_example
	# make a copy of the original file
	copy($styleLzx, $cpStyleLzx);
	my $styleURL = "$baseUrl/test/$cpStyleLzx?lzt=swf";

	openResults();

	# time the compile
	my $fname = basename($styleLzx);
	timeCompile($styleURL, $fname);

	# edit file and time the compile of the changed file
	editFile();
	timeCompile($styleURL, "Edited $fname");

	# rename app
	rename($cpStyleLzx, $newStyleLzx);
	# compile again
	my $styleURL = "$baseUrl/test/$newStyleLzx?lzt=swf";
	timeCompile($styleURL, "Renamed $fname");

	# clear the compilation cache
	clearCache("&cache=compilation");
	# compile again
	timeCompile($styleURL, "$fname with new compile cache");

	# clear the script cache
	clearCache("&cache=script");
	# compile again
	timeCompile($styleURL, "$fname with new script cache");
	
	closeResults();
	unlink $cpStyleLzx;
}

sub editFile()
{
	# open the files
	open (SRC, "<$styleLzx") ||
		die "Failed to open $styleLzx";
	open (DEST, ">$cpStyleLzx") ||
		die "Failed to open $cpStyleLzx";
	# change a few strings
	while ( <SRC> )
	{
		$_ =~ s/pistachio/chocolate/;
		$_ =~ s/chocolate chip/vanilla/;
		$_ =~ s/coffee/strawberry/;
		print DEST $_;
	}
	# close the files
	close (DEST);
	close (SRC);
}

sub openResults
{
	# Get the LPS Server info
	my $infoUrl = "$baseUrl/foo.lzx?lzt=serverinfo";
	my $content = sendRequest($infoUrl);
	my @lines = split(/\n/, $content);
	my $line;
	my $tag;
	my $version;
	my $build;
	my $jreversion;
	foreach $line (@lines)
	{
		#print "$line\n";
		if ( $line =~ /\s+version=/ )
		{
			($tag, $version) = split(/\"/, $line);
		}
		if ( $line =~ /\s+build=/ )
		{
			($tag, $build) = split(/\"/, $line);
		}
		if ( $line =~ /\s+jre-version=/ )
		{
			($tag, $jreversion) = split(/\"/, $line);
		}
	}

	# output the results file header including LPS server info
	open (RES, ">$resultsFile") ||
		die "Failed to open $resultsFile";
	print RES "<html>\n<head><h2>Compile Performance Test Results:</h2>";
	print RES "Executed on <a href=$baseUrl><strong>$g_rConfig->{$g_sHost}</strong></a>, LPS Version:  <b>$version</b>, Build: <b>$build</b><br>\n";
	print RES "JRE-Version: <b>$jreversion</b></head>\n";
        print RES "<p/><b>Started: &nbsp;&nbsp;$startTime</b>\n";
	print RES "<body>\n";

	# output the table header
	print RES "<br><br>\n";	
	print RES "<b>$styleLzx</b><p/>\n";
	print RES "<table border=2 cellspacing=2 cellpadding=2 >\n";
	print RES "<tr><td><b>Test Case #</b></td>\n";
	print RES "    <td><b>Description</b></td>\n";
	print RES "    <td><b>SWF 6 Time (secs)</b></td>\n";
	print RES "    <td><b>SWF 7 Time (secs)</b></td></tr>\n";
	
}

sub postResult
{
	# get args: test number, description, swf version, time
	my $testnum = shift;
	my $description = shift;
	my $timeSwf6 = shift;
	my $timeSwf7 = shift;
	print RES "<tr><td><b>$testnum</b></td><td><b>";
	print RES "$description";
	print RES "</b></td>";
	printf RES "<td align=right><b>%10.2f</b></td>\n", $timeSwf6;
	printf RES "<td align=right><b>%10.2f</b></td></tr>\n", $timeSwf7;
}

sub closeResults
{
	print RES "</table>\n</body>\n</html>\n";
	close(RES);
}

sub main()
{
	config();

	$baseUrl = "http://$g_rConfig->{$g_sHost}:$g_rConfig->{$g_sPort}/$g_rConfig->{$g_sPath}";
	eval
	{
		clearCache();
		clearCache("&cache=script");
		startTests();
	};
	print $@ . "\n" if ($@);
}

exit (main());

