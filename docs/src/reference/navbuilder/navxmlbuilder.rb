# Special-purpose ruby script to generate xml data files for a simple left-nav 
# for OL4 reference.
#
# usage: ruby navxmlbuilder.rb
#
# docs/nav/classes.xml and docs/nav/tags.xml are managed by subversion.
# When you want to update the left-nav, run this script from the directory
# it is in, then mv classes.xml and tags.xml to ../../nav. Builds will grab
# the version-controlled *.xml when they build the doc. 
#
# author: benjamin shine ben@laszlosystems.com
# created: 2007.08.29
# built on OSX 10.4 with ruby 1.8.6
# Copyright 2007-2008 Laszlo Systems. Use according to license terms. 

require 'date'
require 'getoptlong'
require 'rdoc/usage'

YEAR = Date::today().year.to_s

$debuglevel = 0
$indir = '../../../reference/'   # always terminated by slash
$outdir = '.'

def debug ( lev, str )
  if (lev <= $debuglevel) then
     $stdout.puts str + "\n"
  end
end
  
def generate_index ( filepat, outfilename, roottag="index" )
  debug(1, "generate " + outfilename + " using file pattern " + filepat);
  f = File.new(outfilename, "w")
  f.puts "<#{roottag}>"
  f.puts "    <!-- DO NOT EDIT: generated by navxmlbuilder.rb -->\n"
  file_filter = $indir + filepat
  lz_topics = Dir.glob(file_filter).sort
  h = Hash::new();
  lz_topics.each { |fullname| 
      ftype = File::ftype(fullname)
      if (ftype != "directory") then
          debug(2, "process " + fullname);
          file = fullname
          if (fullname[0, $indir.length] == $indir)
             file = fullname[$indir.length..fullname.length]
          end
          lz_name = yield file, fullname
          if (lz_name) then
            h[lz_name] = file
          end
      end
  }
  hash_sort_ignorecase (h) { |lz_name,file|
      f.puts "    <item href=\"" + file + "\" title=\"#{lz_name}\" />\n"
  }
  f.puts "    <!-- Copyright " + YEAR + " Laszlo Systems -->\n"
  f.puts "</#{roottag}>"
  f
end

def hash_sort_ignorecase (h)
  lowerkey = Hash::new()
  h.each_pair { |k,v| lowerkey[k.downcase] = k; }
  lowerkey.sort.each { |low,key| yield key, h[key] }
end

# If the title of this document has a tag name, return it.
# We look for &lt;.....&gt;  (e.g. <canvas>), but we
# also allow that the title may contain platform information,
# like <splash> (as2).  We return the title without brackets,
# e.g. "canvas", or "splash (as2)" as that is how it appears
# in the index.
def tagname_for(filename)
  tag = nil;
  open(filename) {|f|
      f.each_line { |line|
          line.chomp!
          if (!tag && line =~ /<title>.*<\/title>/) then
              if (line =~ /<title>&lt;.*&gt;.*<\/title>/) then
                  tag = line.sub(/.*<title>&lt;/, '').sub(/&gt;/, '').sub(/<\/title>.*/, '')
              end
          end
          if (line =~ /<link.*\.Incubator\./) then
             tag = nil
             break
          end
      }
  }
  tag
end

# items that are classes are marked by an 'info comment'
# marker
def is_marked_as_class(filename)
  result = nil
  open(filename) {|f|
    f.each_line { |line|
      line.chomp!
      if (line =~ /@@ info is-class=/) then
        result = true
        break
      end
    }
  }
  result
end

def javascriptname_for(filename)
  js = nil;
  open(filename) {|f|
      f.each_line { |line|
          line.chomp!
          if (line =~ /@@ info jsname=.*@@/) then
              js = line.sub(/.*@@.*= */, '').sub(/ *@@ *-->/, '')
              break
          end
      }
  }
  js
end

# If the title of this document does not have a tag name, return it.
def nontagname_for(filename)
  name = nil;
  open(filename) {|f|
      f.each_line { |line|
          line.chomp!
          if (!name && line =~ /<title>.*<\/title>/) then
              if (line =~ /<title>.*<\/title>/ &&
                  line !~ /<title>&lt;.*&gt;.*<\/title>/) then
                  name = line.sub(/.*<title>/, '').sub(/<\/title>.*/, '')
              end
          end
          if (line =~ /<link.*\.Incubator\./) then
             name = nil
             break
          end
      }
  }
  name
end

opts = GetoptLong.new(
  [ '--help', GetoptLong::NO_ARGUMENT ],
  [ '--inputdir', GetoptLong::REQUIRED_ARGUMENT ],
  [ '--outputdir', GetoptLong::REQUIRED_ARGUMENT ],
  [ '--debug', GetoptLong::REQUIRED_ARGUMENT ]
)

opts.each do |opt, arg|
  case opt
    when '--help'
      RDoc::usage
    when '--inputdir'
      $indir = arg + '/';
    when '--outputdir'
      $outdir = arg
    when '--debug'
      $debuglevel = arg.to_i
  end
end
# only appears if $debuglevel set to 1 or higher
debug(1, "debug level is set to " + $debuglevel.to_s)

# Filenames are like lz.alert, LzAnimator.html, tag.attribute.html, tag-br.html
# The file pattern for Lz/lz should work around any file case issues
# on Windows vs. Unix/Linux.

generate_index("{[Ll]z,tag}*.html", $outdir + "/tags.xml", "index") { | file,fullname |
  name = tagname_for(fullname);
  if (name) then
    name = "&amp;lt;" + name + "&amp;gt;";
  end

  name
 }
generate_index("{lz.*,Lz*,Debug*}.html", $outdir + "/classes.xml", "index") { | file,fullname | 
  name = nil
  if (is_marked_as_class(fullname)) then
    jsname = javascriptname_for(fullname);
    if (jsname && jsname != "") then
      name = tagname_for(fullname);
      if (name) then
        name = 'lz.' + name;
      else
        name = jsname.sub(/\$lzc\$class_/, 'lz.').sub(/^Lz/, 'lz.');
      end
    end
  end
  name
}
