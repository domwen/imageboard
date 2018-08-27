const spicedPg = require('spiced-pg');

var dbUrl = 'postgres:postgres:postgres@localhost:5432/imageboard';

const db = spicedPg(dbUrl);

module.exports.getImageData = function() {
    const q = 'SELECT * FROM images';
    return db.query(q);
};
