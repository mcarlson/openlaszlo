// usage: findtests.js [tag-filename]

// read in file of "@affects tag1 tag2 tag3..." lines which were grepped from modified files
// and build union of tags, output them as
// a comma delimited list "tag1,tag2,tag3,..."
// Copyright 2007 Laszlo Systems


fname = arguments[0];

importPackage(java.io);

inp = new BufferedReader(new FileReader(fname));

alltags = {};

while ((line = inp.readLine()) != null) {
    tags = line.split(" ");
    for (var i = 0; i < tags.length; i++) {
        tag = tags[i];
        if (tag.length() > 0) {
            alltags[tag] = true;
        }
    }
}



tagarray = [];
for (var tag in alltags) {
    tagarray.push(tag);
}

var pattern = tagarray.join(",");
print (pattern);
