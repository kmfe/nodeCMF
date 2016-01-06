var zipper = require("zip-local");
zipper.zip("./p_big2.jpg", function(zipped) {

    zipped.compress(); // compress before exporting

    var buff = zipped.memory(); // get the zipped file as a Buffer

    // or save the zipped file to disk
    zipped.save("../ccc.zip", function() {
        console.log("saved successfully !");
    });
});



// zipping a file to memory without compression
var buff = zipper.sync.zip("./hello-world.java").memory();

// zipping a directory to disk with compression
// the directory has the following structure
// |-- hello-world.txt
// |-- cpp
//     |-- hello-world.cpp
// |-- java
//     |--hello-world.java
zipper.sync.zip("./hello/world/").compress().save("pack.zip");