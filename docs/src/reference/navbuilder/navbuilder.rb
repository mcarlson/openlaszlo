# Special-purpose ruby script to generate index-generated.html, a simple left-nav 
# for OL4 reference.
#
# usage: ruby navbuilder.rb > index-generated.html
# docs/src/reference/navbuilder/index-generated.html is managed by subversion.
# When you want to update the left-nav, tweak this script, navbuilder.rb, 
# and rerun it, then check in index-generated.html. Builds will grab
# the version-controlled index-generated.html when they build the doc. 
# author: benjamin shine ben@laszlosystems.com
# created: 2007.08.29
# built on OSX 10.4 with ruby 1.8.6
# Copyright 2007-2008 Laszlo Systems. Use according to license terms. 

################################################################
# Note: it appears this script is no longer used, as navigation
# is now driven by xml files produced by navxmlbuilder.rb .
# TODO [2008-02-20 dda] remove this script, index-generated.html, etc. from svn
################################################################
$stderr.puts("Use navxmlbuilder.rb - navbuilder.rb is not needed");

def generate_index ( prefix, comment ) 
  # generate a list of the lz stuff 
  puts "<div id=\"tags#{prefix}\">";     
  puts "<h1>" + prefix + "</h1>";
  puts "<p>" + comment + "</p>"; 
  puts "<ul>";
  file_filter = '../../../reference/' + prefix + '*';  
  name_filter = Regexp.new(prefix + ".") ;
  lz_topics = Dir.glob(file_filter).sort
  lz_topics = lz_topics.each{ |file| file.sub!(/..\/..\/..\/reference\//, '')};
  lz_topics.each { |file| 
      lz_name = file.sub(name_filter, '').sub(/.html/, '');
      puts "<li><a href=\"" + file + "\" target=\"content\">";
      yield lz_name;
      puts "</a></li>" ; 
  }
  puts "</ul></div>"
end


# search for <title>&lt;tagname&gt;</title>,
# if present, it's a tag that should appear in the index.
# This works, though it's not elegant.
def generate_index_tags ( prefix, comment ) 
  # generate a list of the lz stuff 
  puts "<div id=\"tags#{prefix}\">";     
  puts "<h1>" + prefix + "</h1>";
  puts "<p>" + comment + "</p>"; 
  puts "<ul>";
  file_filter = '../../../reference/*.html';

  tags = Hash::new()
  Dir.glob(file_filter).each{ |file|
      open(file) {|f|
          filebase = file.sub(/..\/..\/..\/reference\//, '');
          f.each_line { |line|
              line.chomp!
              if (line =~ /<title>.*<\/title>/) then
                  if (line =~ /<title>&lt;.*&gt;<\/title>/) then
                      t = line.sub(/.*<title>&lt;/, '').sub(/&gt;<\/title>.*/, '');
                      tags[t] = filebase;
                  end
                  break;
              end
          }
      }
  }
  # sort ignoring case
  hash_sort_nocase(tags) { |tag,file|
      puts "<li><a href=\"" + file + "\" target=\"content\">";
      yield tag;
      puts "</a></li>" ; 
  }
  puts "</ul></div>"
end

def hash_sort_nocase (h)
  lowerkey = Hash::new()
  h.each_pair { |k,v| lowerkey[k.downcase] = k; }
  lowerkey.sort.each { |low,key| yield key, h[key] }
end

def generate_topic_index 
  puts "<div id=\"topics\">";   
  puts "<h1>Topics</h1>"
  puts "<ul>"
  prefix = "topic";
  file_filter = '../../../reference/' + prefix + '*';  
  name_filter = Regexp.new(prefix + ".") ;
  lz_topics = Dir.glob(file_filter).sort
  lz_topics = lz_topics.each{ |file| file.sub!(/..\/..\/..\/reference\//, '')};
  lz_topics.each { |file| 
      lz_name = file.sub(name_filter, '').sub(/.html/, '').gsub(/_/, ' ').gsub(/\./, ': ');
      puts "<li><a href=\"" + file + "\" target=\"content\">" + lz_name + "</a></li>" ; 
  }
  
  puts "</ul></div>"
  
end 

def generate_class_index 
  puts "<div id=\"classes\">"; 
  puts "<h1>Classes</h1>"
  puts "<ul>"
  prefix = "Lz";
  file_filter = '../../../reference/' + prefix + '*';  
  name_filter = Regexp.new(prefix);
  lz_topics = Dir.glob(file_filter).sort
  lz_topics = lz_topics.each{ |file| file.sub!(/..\/..\/..\/reference\//, '')};
  lz_topics.each { |file| 
      lz_name = file.sub(/\.html/, '').gsub(/\+swf\d/, '').gsub(/\+dhtml/,'');
      puts "<li><a href=\"" + file + "\" target=\"content\">" + lz_name + "</a></li>" ; 
  }
  
  puts "</ul></div>";
end

def generate_top
  header = <<END_OF_STRING
  <a href="#" onclick="document.getElementById('topics').style.display = 'none'; document.getElementById('classes').style.display = 'none'; document.getElementById('tagslz').style.display = 'block'; document.getElementById('tagstag').style.display = 'none'">Tags</a>
  <a href="#" onclick="document.getElementById('topics').style.display = 'none'; document.getElementById('classes').style.display = 'block'; document.getElementById('tagslz').style.display = 'none'; document.getElementById('tagstag').style.display = 'none'">Classes</a>
  <a href="#" onclick="document.getElementById('topics').style.display = 'none'; document.getElementById('classes').style.display = 'none'; document.getElementById('tagslz').style.display = 'none'; document.getElementById('tagstag').style.display = 'block'">LZX Language</a>  
  <a href="#" onclick="document.getElementById('topics').style.display = 'block'; document.getElementById('classes').style.display = 'none'; document.getElementById('tagslz').style.display = 'none'; document.getElementById('tagstag').style.display = 'none'">Topics</a>
  <a href="#" onclick="document.getElementById('topics').style.display = 'block'; document.getElementById('classes').style.display = 'block'; document.getElementById('tagslz').style.display = 'block'; document.getElementById('tagstag').style.display = 'block'">All</a>  
END_OF_STRING
  puts header;
end


puts "<html><body>";
generate_top
generate_index_tags("lz", "lzx tags") { | elem | puts "&lt;" + elem + "&gt;" }
generate_class_index;
generate_topic_index; 
generate_index("tag", "lzx xml language elements") { | elem | puts "&lt;" + elem + "&gt;" }


puts "</body></html>";