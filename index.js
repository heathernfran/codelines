const Q = require('q'),
      Promise = require('bluebird'),
      codelines = require('./codelines');

// working version, with callback
// Q.fcall(codelines.getFilePath('Enter project file path:', (input) => {
//   return codelines.walkRecursively(input);
// }));

// Q.fcall(codelines.getReadline).then((input) => {
//   return codelines.walkRecursively(input);
// });


 Q.fcall(() => {
   return codelines.getFilePath('Enter path:');
 })
 .then((input) => {
    return codelines.walkRecursively(input);
  })
  .catch( err => console.error());
