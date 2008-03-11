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
YEAR = Date::today().year.to_s
DEBUGLEVEL = 0

def debug ( lev, str )
  if (lev <= DEBUGLEVEL) then
     $stdout.puts str + "\n"
  end
end
# only appears if DEBUGLEVEL set to 1 or higher
debug(1, "debug level is set to " + DEBUGLEVEL.to_s)
  
def generate_index ( filepat, outfilename, roottag="index" )
  debug(1, "generate " + outfilename + " using file pattern " + filepat);
  f = File.new(outfilename, "w")
  f.puts "<#{roottag}>"
  f.puts "    <!-- DO NOT EDIT: generated by navxmlbuilder.rb -->\n"
  file_filter = '../../../reference/' + filepat
  lz_topics = Dir.glob(file_filter).sort
  h = Hash::new();
  lz_topics.each { |fullname| 
      ftype = File::ftype(fullname)
      if (ftype != "directory") then
          debug(2, "process " + fullname);
          file = fullname.sub(/..\/..\/..\/reference\//, '')
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
          if (line =~ /<title>.*<\/title>/) then
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

# Filenames are like lz.alert, LzAnimator.html, tag.attribute.html, tag-br.html
# The file pattern for Lz/lz should work around any file case issues
# on Windows vs. Unix/Linux.

generate_index("{[Ll]z,tag}*.html", "tags.xml", "index") { | file,fullname |
    tagname_for(fullname);
 }
generate_index("Lz*.html", "classes.xml", "index") { | file,ignored | 
   file.sub(/\.html/, '').sub(/([^+]*)\+(.*)/, '\1 (\2)').gsub(/\+/, ' ').
        sub('swf7 swf8 swf9', 'swf');
}
