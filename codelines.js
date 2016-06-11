const _ = require('lodash'),
      Q = require('q'),
      fs = require('fs'),
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
            return totalLines += parseInt(shelljs.exec(`cat ${value} | wc -l`));
          }
        });
      })
      .then(() => {
        return console.log(totalLines);
      })
      .then(() => {
        return process.exit();
      })
      .catch( err => console.error());
  },
  getFilePath: (consoleText, callback) => {
    // process.stdin.resume();
    process.stdout.write(consoleText);
    process.stdin.once('data', (data) => {
      callback(data.toString().trim());
    });
  },
}
