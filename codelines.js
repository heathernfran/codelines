const _ = require('lodash'),
      fs = require('fs'),
      path = require('path'),
      fspromise = require('fs-promise'),
      shelljs = require('shelljs');

let ignoreDirs = (dir) => {
  let ignore = ['node_modules', 'bower_components', 'maps', '*.min*', '.git']
  if (dir.includes('node_modules')) {
    // console.log(dir);
    return dir;
  }
  if (dir.includes('.git')) {
    return dir;
  }
};

module.exports = {
  walkRecursively: (projectDir) => {
    let fileArray = []
        totalLines = 0;
    fspromise.walk(projectDir)
      .then(currentFile => currentFile.forEach(
        file => fileArray.push(file.path)
      ))
      .then(() => {
        let revisedArray = _.filter(fileArray, _.negate(ignoreDirs));
        _.forEach(revisedArray, (value) => {
          if (fs.statSync(value).isFile()) {
            totalLines += parseInt(shelljs.exec(`cat ${value} | wc -l`));
          }
        });
      })
      .then(() => {
        console.log(totalLines);
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
