const _ = require('lodash'),
      fs = require('fs'),
      path = require('path'),
      fspromise = require('fs-promise');

module.exports = {
  walkRecursively: (projectDir) => {
    let fileArray = [];
    fspromise.walk(projectDir)
      .then(currentFile => currentFile.forEach(
        file => fileArray.push(file.path)
      ))
      .then(() => {
        _(fileArray).forEach((value) => {
          if (!(value.includes('node_modules'))) {
            console.log(value);
          }
        })
      })
      .catch( err => console.error());
  },
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
