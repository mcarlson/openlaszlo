#!/usr/bin/perl
# Copyright 2008 Laszlo Systems.  Use according to license terms.
#
# convert_laszlo_4.2.pl
# Helps to convert 4.1 lzx programs (and potentially lzs) to
# the new API and syntax for openlaszlo 4.2.x
#
# See usage message.
#
#
# Warnings:
#
#   - PLEASE BACK UP your entire work directory before starting.
#
#   - This will probably not do everything to convert every
#     program, but it should do most of the tedious stuff.
#     There is no substitute for testing.
#     We'd like to hear about cases it doesn't handle,
#     or suggestions.
#
#   - Please compare the end result of each changed file with the
#     version before changing (filename.bak).  Our transformations can
#     be fooled - we may change comments that look like code, and code
#     with unusual styles may not necessarily be recognized.
#
# Should work with Perl 5 or greater.
# tested on OSX 10.5.2 with perl v5.8.8
# Author: Don Anderson

use File::Basename;
use File::Copy;
use Getopt::Std;

################
my $VERSION = "1.0.0";
my $PROG = basename($0);
my $USAGE = <<END;
Usage: perl convert_laszlo_4.2.pl [ options ] filename...

Options:

   -d debuglevel
           get debugging info for development

   -g graphical-difftool
           for each file changed, invoke the graphical difftool,
           and prompt the user to keep or not keep the changes

   -t
           create output for simple tests in /tmp/convtest

   -x exceptlist 
           exceptlist is a comma separated list of transforms
           to NOT apply.  These are chosen from:
                method        - <method ...> transforms
                setattribute  - setVisible -> setAttribute('visible', ...) etc.
                widthheight   - getWidth(),getHeight() to width,height
                tagname       - constructor.classname to constructor.tagname
                states        - apply=" -> applied=", state.apply()/remove() -> setAttribute('applied', true|false)

   -v
           show version number and exit

For each file, a backup file is made (filename.bak) and the file will
be converted, with the result put into filename.


Examples:

  # Convert all the lzx files in the directory, doing all conversions.
  \$ perl convert_laszlo_4.2.pl *.lzx

  # Convert just myfile.lzx, do not apply two of the conversions.
  \$ perl convert_laszlo_4.2.pl -x setattribute,tagname  myfile.lzx


END
################

##
# These are the transforms we'll do, these are turned off by the -x option.
##
%xform = {};
$xform{method}=1;       # transform <method event=
$xform{setattribute}=1; # transform calls like setVisible into setAttribute(...
$xform{widthheight}=1;  # transform getWidth(),getHeight() to width,height
$xform{tagname}=1;      # transform constructor.classname to constructor.tagname
$xform{states}=1;       # transform apply=" -> applied=", state.apply()/remove() -> setAttribute('applied', true|false)

##
# Other global variables
##
$DEBUGLEVEL=0;         # set to non-zero to get successive amounts of debug out
$curfile = "unknown file";  # track current file for error messages

##
# debug(level, string);
# debugln(level, string);
# Show the string if the level is less or equal to
# the current debug level. debug(1, '...') is more likely
# to appear, and debug(9, '...') least likely.
##
sub debug {
    my $level = $_[0];
    my $str = $_[1];
    if ($level <= $DEBUGLEVEL) {
        print STDOUT $str;
    }
}
sub debugln {
    debug($_[0], $_[1] . "\n");
}

##
# debugentry(level, funcname, @_);
# Show the function entry with args if level is <= current debug level.
##
sub debugentry {
    my $n = $#_;
    my $argstr = "";
    my $i = 2;
    while ($i <= $n) {
        if ($i != 2) {
            $argstr .= ", ";
        }
        $argstr .= $_[$i];
        $i++;
    } 
    debugln($_[0], $_[1] . "(" . $argstr . ")");
}

##
# warning(string)
# Show a warning to user.
##
sub warning {
    print STDERR "$curfile: Warning: " . $_[0] . "\n";
}

##
# create_test(filename);
# Put a test file into place.
##
sub create_test {
    my $file = $_[0];

    unlink($file);
    open OUT, ">$file" || die("Cannot create $file");

    # basic tests, also with '' delimiter
    print OUT
        "<!-- unrelated stuff -->\n";
    print OUT
        "<method event=\"m1\">M1</method>\n\n";
    print OUT
        "<method event=\'m2\' args=\'bar\'>M2</method>\n\n";

    # mix it up, multiline
    print OUT
      "PRELIM STUFF<method event=\"m3\" args=\"bar\" \n" .
      " name=\"blarg\">SOME STUFF</method>STILL MORE\n\n";
    print OUT
        "STUFF<method event=\"m4\">M4</method>IN BETWEEN<method\n" .
        "  event=\"m5\">M5</method>\n";

    # transforms within method bodies
    print OUT
        "<method event=\"m6\">\n" .
        "  setVisible (a,b,c);\n" .
        "  stretchResource(a,b,stretchResource(c,d,e));\n" .
        "  foo = x.getWidth();\n" .
        "  foo = stretchResource(a,b.getWidth(),setVisible(c,getHeight( ),e));\n" .
        "</method>\n";

    # <method> already converted (it has name= but no event=)
    print OUT
        "<method name=\"m7\">M7 - should be left as a METHOD</method>\n\n";

    close OUT;
    print STDOUT "Testing $file\n";
}

##
# file_cannot_exist(filename)
# Complain and die if the file exists.
##
sub file_cannot_exist {
    my $file = $_[0];
    if ( -f "$file" ) {
        print STDERR "$PROG: $file already exists, please rename/remove it and run again\n";
        exit(1);
    }
}

##
# split_around_tag(curtext, tagname, FILE)
# Given "blah blah <tagname...> stuff stuff",
# return three values, the stuff before the tagname ("blah blah "),
# the contents of the tag, ("<tagname...>"), 
# and the stuff after the tag, (" stuff stuff").
# Since the tag can span lines, the file handle is used
# to get more input until the end of the tag is found.
# This does *not* get the matching </tagname>.
##
sub split_around_tag {
    $curline = $_[0];
    $tagname = $_[1];
    $INFILE = $_[2];

    # TODO: we don't want false positives, e.g. <methodzz ...
    my $pos = index($curline, "<" . $tagname);
    my $before = substr $curline, 0, $pos;
    my $all = substr $curline, $pos;
    debugentry(1, "split_around_tag", @_);
    $pos = index($all, ">");
    debugln(2, " pos=" . $pos . ", curline=" . $curline . ", all=" . $all);
    while ($pos < 0) {
        $curline = <$INFILE>;
        if (substr($all, -1) eq "\n") {
            chop $all;
        }
        $all .= " " . $curline;
        $pos = index($all, ">");
        debugln(2, " pos=" . $pos . ", curline=" . $curline . ", all=" . $all);
    }
    my $tagpart = substr($all, 0, $pos+1);
    my $after = substr($all, $pos+1);
    debugln(2, "split_around_tag returns:");
    debugln(2, " before=$before");
    debugln(2, " tagpart=$tagpart");
    debugln(2, " after=$after");
    return ($before, $tagpart, $after);
}

##
# extract_attr(string, name)
# Given string: <tag ... name="value"...>,
# return "value" when given the "name" attribute.
##
sub extract_attr {
    my $str = $_[0];
    my $name = $_[1];
    my $value = "";
    debugentry(1, "extract_attr", @_);
    my $pos = index($str, $name . "=");
    if ($pos >= 0) {
        my $delimpos = $pos + length($name . "=");
        if ($delimpos < 0) {
            # malformed or unusual
            warning("  Unusual delimiter style parsing: $str");
            return ($str, "");
        }
        my $delim = substr($str, $delimpos, 1);
        my $end = index($str, $delim, $delimpos + 1);
        if ($end < 0) {
            # malformed or unusual
            warning("  Unusual delimiter style parsing: $str");
            return ($str, "");
        }
        debugln(2, " delim=$delim, end=$end, delimpos=$delimpos");
        $value = substr($str, $delimpos + 1, $end - $delimpos - 1);
        $str = substr($str, 0, $pos) . substr($str, $end + 1);
    }
    debugln(2, "extract_attr returns:");
    debugln(2, " $name=$value");
    debugln(2, " remainder=$str");
    return ($str, $value);
}

##
# convert_file(filename)
# Do all conversions for the file.
##
sub convert_file {
    my $file = $_[0];
    my $inmethod=0;
    my $event;
    my $name;

    debugentry(1, "convert_file", @_);
    $curfile = $file;
    copy("$file", "$file.bak") || die("Cannot copy to $file.bak");
    open(IN, "<$file") || die("Cannot open $file");
    unlink("$file.tmp");
    open(OUT, ">$file.tmp") || die("Cannot create $file.tmp");

    my @testnames = ();
    my $intest = 0;
    my $space = "        ";

    while (<IN>) {
        # check for
        # <TestCase ...>  or
        # <class name="foo" extends="TestCase">
        if (/class .*extends=\"TestCase\"/) {
            $intest = 1;
        }

        if (/<TestCase[ >]/) {
            print "starting <TestCase>\n";
            $intest = 1;
        }


        if (/( *)<method /) {
            $space = $1;
        }
        
        if ((/<\/class>/) || (/\/TestCase>/)) {
            $intest = 0;
            if ($#testnames >= 0) {
                print OUT
                    "${space}<method name=\"addTests\"> \n";
                foreach my $item (@testnames) {
                    print OUT "${space}    this.addTest(\"$item\");\n";
                }
                print OUT
                    "${space}</method> \n";
                @testnames = ();
            }
        }

        if (/<method *name=\"test/ && $intest) {
            my ($before, $tag, $after) = split_around_tag($_, "method", IN);
            ($ignore, $testname) = &extract_attr($tag, "name");
            print("adding test named $testname\n");
            push(@testnames, $testname);
        }

        print OUT $_;
    }
    close(OUT);
    close(IN);
    move("$file.tmp", "$file") || die("Cannot create $file");
    print STDOUT "Converted $file\n";
}

##
# Main program
# parse arguments and dispatch work to convert_file.
##
my $file;
my %options;
$ok = getopts("d:tx:vg:", \%options);
if (!$ok) {
    print STDERR "$USAGE";
    exit(1);
}

$DEBUGLEVEL = $options{d} || '0';
my $xopt = $options{x} || '';
my @xvalues = split(',', $xopt);
foreach my $xval (@xvalues) {
    if (!exists $xform{$xval}) {
        print STDERR "$xval: unknown transform\n";
        print STDERR "$USAGE";
        exit(1);
    }
    print STDOUT "Turning off $xval\n";
    $xform{$xval} = 0;
}

if ($options{v}) {
    print STDOUT "$PROG: version $VERSION\n";
    exit(0);
}

if ($options{t}) {
    create_test("/tmp/convtest");
    convert_file("/tmp/convtest");
    exit(0);
}

my $diffTool = "";
my $confirm = 0;
if ($options{g}) {
    $diffTool = $options{g};
    $confirm = 1;
}

if ($#ARGV < 0) {
    print STDERR "$USAGE";
    exit(1);
}

foreach $file (@ARGV) {
    if (! -f $file) {
    }
    file_cannot_exist("$file.bak");
}

foreach $file (@ARGV) {
    if (! -f $file ) {
        print STDERR "$PROG: $file does not exist, skipping\n";
    }
    else {
        convert_file($file);
        if($confirm) {
            my $isDiff = system("diff -q $file.bak $file");
            if($isDiff != 0) {
                system("$diffTool $file.bak $file");
                print STDOUT "Would you like to: [u]se new, [k]eep old, [e]dit new: ";
                $| = 1;
                my $todo = <STDIN>;
                chomp $todo;
                if($todo eq 'k'){
                    system("rm", $file);
                    system("mv", "$file.bak", "$file");
                } elsif($todo eq 'e'){
                    system("\$EDITOR $file");
                }
            } else {
                print STDOUT "Files are the same... Continuing\n";
            }
        }
    }
}
