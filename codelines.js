const fs = require('fs'),
      path = require('path');

module.exports = {
  walkThroughProject: function(projectDir) {
    fs.readdir(projectDir, function(error, files) {
      if (error) {
        console.log(error);
        return;
      } else if (files == "node_modules") {
        console.log('ignored directory');
      } else {
        console.log(files);
        files.forEach(function(filename) {
          let filePath = path.join(projectDir, filename),
              stat = fs.statSync(filePath);
          if (stat.isFile()) {
            // callback(filePath, stat);
            fs.readFile(filePath, function(error, fileContents) {
              if (error) {
                console.log(error);
                return;
              } else {
                console.log(fileContents);
              }
            });
            console.log('file: ' + stat.isFile());
          } else if (stat.isDirectory()) {
            console.log('directory: ' + stat.isDirectory());
            // walkThroughProject(filePath);
          }
        });
      }
    });
  }
}
