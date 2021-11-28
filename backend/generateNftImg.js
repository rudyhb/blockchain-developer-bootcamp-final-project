const identicon = require('identicon');

const generateNftImg  = id => new Promise((resolve, reject) => {
  identicon.generate({ id, size: 150 }, (err, buffer) => {
    if (err) return reject(err.message);
    // buffer is identicon in PNG format.
    return resolve(buffer);
  });
})

module.exports = {
  generateNftImg
};
