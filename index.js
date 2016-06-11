const Q = require('q'),
      codelines = require('./codelines');

// working version, except for exit()
Q.fcall(codelines.getFilePath('Enter project file path:', (input) => {
  return codelines.walkRecursively(input);
}));

// Q.fcall(codelines.getFilePath('Enter project file path:'))
//   .then(() => {
//     return codelines.walkRecursively(input);
//   })
//   .then(() => {
//     return process.exit();
//   })
//   .catch(error => console.error());

// codelines.getFilePath('Enter project file path:', (input) => {
//   Q.fcall(codelines.walkRecursively(input))
//     .then(() => {
//       return process.exit();
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// });
