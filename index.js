const Q = require('q'),
      codelines = require('./codelines');

// working version, except for exit()
Q.fcall(codelines.getFilePath('Enter project file path:', (input) => {
  return codelines.walkRecursively(input);
}));
