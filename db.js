const spicedPg = require('spiced-pg');
const { pgUser, pgPw } = require('./secrets.json');

var dbUrl = `postgres:${pgUser}:${pgPw}@localhost:5432/imageboard`;

const db = spicedPg(dbUrl);

module.exports.getImageData = function() {
    const q = 'SELECT * FROM images';
    return db.query(q);
};
