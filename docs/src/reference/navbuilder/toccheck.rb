# ruby script to check toc.xml for broken links.
#
# usage: ruby toccheck.rb
#
# author: donald anderson dda@ddanderson.com
# built on OSX 10.4 with ruby 1.8.6
# Copyright 2008 Laszlo Systems. Use according to license terms. 

require 'getoptlong'
require 'rdoc/usage'

$debuglevel = 0
$indir = '../../../reference/'   # always terminated by slash

def debug ( lev, str )
  if (lev <= $debuglevel) then
     $stdout.puts str + "\n"
  end
end
  
def for_line(filename)
  tag = nil;
  open(filename) {|f|
      f.each_line { |line|
          line.chomp!
          yield line
      }
  }
end

def check_link(fromname, refname)
  result = true
  if (!File.exist?($indir + refname)) then
    $stderr.puts("Error: broken link in doc navigation: " + refname + " referenced from " + fromname + " does not exist")
    basename = refname.sub(/[.][^.]*/,'').sub(/[+].*/,'')
    Dir.glob($indir + basename + '*' ).sort.each { |altname|
      altname = altname.sub($indir, '')
      $stderr.puts('    maybe use ' + altname + '?')
      result = false
    }
  end
  return result
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

todo_count = 0
ecode = true
for_line($indir + 'toc.xml') { | line |
   if (line =~ /TODO/) then
      todo_count = todo_count + 1
   end
   if (line =~ /<!--/) then
      line = line.sub(/<!--.*-->/, '')
   end
   if (line =~ /<item.*href=/) then
      filename = line.sub(/^.*href="([^"]*)".*$/, '\1')
      if (!check_link('toc.xml', filename))
         ecode = false
      end
   end
}

if (todo_count != 0) then
  $stderr.puts('' + todo_count.to_s + ' TODOs found in toc.xml')
end

if (!ecode) then
   $stderr.puts('Error: docs/src/nav/toc.xml is out of date, see broken link messages above')
   exit(1)
end
