const _ = require('lodash'),
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
            totalLines += parseInt(shelljs.exec(`cat ${value} | wc -l`));
          }
        });
      })
      .then(() => {
        console.log(totalLines);
      })
      .catch( err => console.error());
  },
}
