# Special-purpose ruby script to generate index-generated.html, a simple left-nav 
# for OL4 reference.
# usage: ruby navbuilder.rb > index-generated.html
# docs/src/reference/navbuilder/index-generated.html is managed by subversion.
# When you want to update the left-nav, tweak this script, navbuilder.rb, 
# and rerun it, then check in index-generated.html. Builds will grab
# the version-controlled index-generated.html when they build the doc. 
# author: benjamin shine ben@laszlosystems.com
# created: 2007.08.29
# built on OSX 10.4 with ruby 1.8.6
# Copyright 2007 Laszlo Systems. Use according to license terms. 




def generate_index ( prefix, outfilename, roottag="index" )
  f = File.new(outfilename, "w"); 
  f.puts "<#{roottag}>"
  file_filter = '../../../reference/' + prefix + '*';  
  name_filter = Regexp.new(prefix + ".") ;
  lz_topics = Dir.glob(file_filter).sort
  lz_topics = lz_topics.each{ |file| file.sub!(/..\/..\/..\/reference\//, '')};
  lz_topics.each { |file| 
      lz_name = yield file
      f.puts "    <item href=\"" + file + "\" title=\"#{lz_name}\" />\n"
  }
  f.puts "</#{roottag}>"
  f
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



generate_index("lz", "lz.xml", "index") { | file | file.sub(Regexp.new("lz."), '').sub(/.html/, ''); }
generate_index("tag", "tags.xml", "index") { | file | file.sub(Regexp.new("lz."), '').sub(/.html/, ''); }
generate_index("Lz", "classes.xml", "index") { | file | 
       file.sub(/\.html/, '').gsub(/\+swf\d/, '').gsub(/\+dhtml/,'');
    }

