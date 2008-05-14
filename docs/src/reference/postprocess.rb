# ruby script to post process doc files for OL4 reference.
#
# usage: ruby postprocess.rb
#
# author: don anderson
# created: 2008.05.13
# built on OSX 10.4 with ruby 1.8.6
# Copyright 2008 Laszlo Systems. Use according to license terms. 
#
# Some of the doc XSL processing leaves in undefined tags
# of the form <postprocess-...>....</postprocess>.  These
# are converted to <font color="red">&lt;postprocess-....
# and this ruby script recognizes that and converts them.
# Someday we'll pull this all back into the XSL world.

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
        if (line =~ /<font color="red">&lt;/) then
          foundthis = true
          if (line =~ /&lt;postprocess-html-/) then
            # A simple html tag that we want to pass through
            line.gsub!(/&lt;(\/*)postprocess-html-([^&]*)&gt;/, '<\1\2>')
          elsif (line =~ /&lt;postprocess-methodname/)
            # We want to have a band with the background color stretched
            # the entire width.
            line.gsub!(/&lt;postprocess-methodname&gt;/, '<table width="100%" style="border-left: 0px;"><tr><th style="background-color:#e8e8e8; font-size: 14px;" align="left">')
            line.gsub!(/&lt;\/postprocess-methodname&gt;/, '</th></tr></table>')
          elsif (line =~ /&lt;postprocess-method-end/)
            # Create an horizontal rule
            outf.write('<hr/>')
            line.gsub!(/&lt;(\/*)postprocess-method-end&gt;/, '')
          elsif (line =~ /&lt;postprocess-attribute-end/)
            # Create an horizontal rule
            outf.write('<hr/>')
            line.gsub!(/&lt;(\/*)postprocess-attribute-end&gt;/, '')
          else
            foundthis = false
          end
          if (foundthis)
            line.gsub!(/<font color="red">/, '')
            line.gsub!(/<\/font>/, '')
            found = true
          end
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
