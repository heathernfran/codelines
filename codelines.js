const _ = require('lodash'),
      Promise = require('bluebird'),
      fs = Promise.promisifyAll(require('fs')),
      path = require('path'),
      fspromise = require('fs-promise'),
      shelljs = require('shelljs'),
      readline = require('readline'),
      rl = readline.createInterface({
        input: Promise.promisifyAll(process.stdin),
        output: Promise.promisifyAll(process.stdout),
      });

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
        rl.close();
      })
      .catch( err => console.error());
  },
  getReadline: (consoleText) => {
    rl.question('Enter project file path:', (input) => {
      rl.close();
      console.log(`input was ${input}`);
      // rl.close();
      return input;
    });
  },
  getFilePath: (consoleText) => {
    let stdin = Promise.promisifyAll(process.stdin),
        stdout = Promise.promisifyAll(process.stdout);
    return stdin.resume()
      .then(() => {
        return stdout.write(consoleText);
      })
      .then(() => {
        return stdin.once('data').then((data) => {
          return data.toString().trim();
        });
        // return stdin.once('data', (data) => {
        //   return data.toString().trim();
        // });
      })
      // .then((data) => {
      //   return data.toString().trim();
      // })
      .catch( err => console.error());
    // return stdin.once('data')
    //   .then((data) => {
    //     return data.toString().trim();
    //   })
    //   .catch( err => console.error());
  },
  readDirWithPromises: (dirName) => {
    return fs.readdir(dirName).map((fileName) => {
      let path = path.join(dirname, fileName);
      return fs.stat(path).then((stat) => {
        return stat.isDirectory() ? readDirWithPromises(path) : path;
      });
    }).reduce((rootName, pathName) => {
      return rootName.concat(pathName);
    }, []);
  },
}
