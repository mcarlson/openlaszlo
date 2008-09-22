# ruby script to post process doc files for OL4 reference.
#
# usage: ruby postprocess.rb
#
# author: don anderson
# created: 2008.05.13
# built on OSX 10.4 with ruby 1.8.6
# Copyright 2008 Laszlo Systems. Use according to license terms. 
#
# To handle difficult cases, some of the doc XSL processing
# leaves in undefined tags of the form
#    <para role="postprocess-XXXX">....</para>.
# These are converted to one of:
#    <p class="postprocess-XXXX"/>
#    <p class="postprocess-XXXX">....</p>.
#
# Each XXXX is an 'operation' telling this script what to do.
# The script recognizes these and applies special ad hoc conversions.
# These handle all the strange cases that can not be easily
# handled within docbook XSL, although we have hopes to
# someday pull this all back into the XSL world.

require 'getoptlong'
require 'rdoc/usage'

$debuglevel = 0
$indir = '../../reference/'   # always terminated by slash
$ecode = true

def debug ( lev, str )
  if (lev <= $debuglevel) then
     $stdout.puts str + "\n"
  end
end
  
opts = GetoptLong.new(
  [ '--help', GetoptLong::NO_ARGUMENT ],
  [ '--inputdir', GetoptLong::REQUIRED_ARGUMENT ],
  [ '--debug', GetoptLong::REQUIRED_ARGUMENT ]
)

opts.each do |opt, arg|
  case opt
    when '--help'
      RDoc::usage
    when '--inputdir'
      $indir = arg + '/';
    when '--debug'
      $debuglevel = arg.to_i
  end
end
# only appears if $debuglevel set to 1 or higher
debug(1, "debug level is set to " + $debuglevel.to_s)

def process ( fname, outname )
  found = false
  open(fname) {|f|
    open(outname, "w") {|outf|
      f.each_line { |line|
        if (line =~ /class="postprocess/) then
          foundthis = true
          pptagname = line.sub(/.*<p class=\".*postprocess-([^"]*)".*/, '\1').chomp

          if (pptagname =~ /^html-/) then
            # A simple html tag that we want to pass through
            htmltagname = pptagname.sub(/html-/, '')
            line.gsub!(/<p class="postprocess-html-([^>]*)>/, '<' + htmltagname + '>')
            line.gsub!(/<\/p>/, '</' + htmltagname + '>')
          elsif (pptagname =~ /^methodname$/)
            # We want to have a band with the background color stretched
            # the entire width.
            line.gsub!(/<p class="postprocess-methodname([^>]*)>/, '<table width="100%" style="border-left: 0px;"><tr><th style="background-color:#e8e8e8; font-size: 14px;" align="left">')
            line.gsub!(/<\/p>/, '</th></tr></table>')
          elsif (pptagname =~ /^method-end$/)
            # Create an horizontal rule
            outf.write('<hr/>')
            line.gsub!(/<p class="postprocess-method-end([^>]*)>/, '')
            line.gsub!(/<\/p>/, '')
          elsif (pptagname =~ /^attribute-end$/)
            # Create an horizontal rule
            outf.write('<hr/>')
            line.gsub!(/<p class="postprocess-method-end([^>]*)>/, '')
            line.gsub!(/<\/p>/, '')
          elsif (pptagname =~ /^info-/)
            line.gsub!(/<p class="postprocess-info-([^"]*)">([^<]*)<\/p>/, '<!-- @@ info \1=\2 @@ -->')
          elsif (pptagname =~ /^xlink-/)
            # Create an external link to an anchor
            line.gsub!(/<p class="postprocess-xlink-/, '<a href="')
            line.gsub!(/<\/p>/, '</a>')
          else
            foundthis = false
          end
          # if (foundthis) ... could do extra cleanup here
        end
        if (foundthis)
            found = true
        end
        outf.write(line)
      }
    }
  }
  found
end

def process_dir ( dir )
  filepat = dir + '*.html';
  filenames = Dir.glob(filepat).sort
  filenames.each { |filename| 
    ftype = File::ftype(filename)
    if (ftype != "directory") then
      debug(2, "process " + filename);
      outname = filename + '.pptmp';
      if (process(filename, outname))
        File::rename(outname, filename)
      else
        File::delete(outname)
      end
    end
  }
end

process_dir ($indir)

if (!$ecode) then
   $stderr.puts('Error: postprocess.rb failed')
   exit(1)
end
