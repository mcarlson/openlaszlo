# ruby script to check toc.xml for broken links.
#
# usage: ruby toccheck.rb
#
# author: donald anderson dda@ddanderson.com
# built on OSX 10.4 with ruby 1.8.6
# Copyright 2008 Laszlo Systems. Use according to license terms. 

DEBUGLEVEL = 0

REFDOC_DIR = '../../../reference'

def debug ( lev, str )
  if (lev <= DEBUGLEVEL) then
     $stdout.puts str + "\n"
  end
end
# only appears if DEBUGLEVEL set to 1 or higher
debug(1, "debug level is set to " + DEBUGLEVEL.to_s)
  
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
  if (!File.exist?(REFDOC_DIR + '/' + refname)) then
    $stderr.puts(refname + ": referenced from " + fromname + " does not exist")
    basename = refname.sub(/[.][^.]*/,'').sub(/[+].*/,'')
    Dir.glob(REFDOC_DIR + '/' + basename + '*' ).sort.each { |altname|
      altname = altname.sub(REFDOC_DIR + '/', '')
      $stderr.puts('    ' + altname + '?')
    }
  end
end

todo_count = 0
for_line(REFDOC_DIR + '/toc.xml') { | line |
   if (line =~ /TODO/) then
      todo_count = todo_count + 1
   end
   if (line =~ /<!--/) then
      line = line.sub(/<!--.*-->/, '')
   end
   if (line =~ /<item.*href=/) then
      filename = line.sub(/^.*href="([^"]*)".*$/, '\1')
      check_link('toc.xml', filename)
   end
}

if (todo_count != 0) then
  $stderr.puts('' + todo_count.to_s + ' TODOs found in toc.xml')
end
