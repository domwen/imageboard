const spicedPg = require('spiced-pg');
const { pgUser, pgPw } = require('./secrets.json');

var dbUrl = `postgres:${pgUser}:${pgPw}@localhost:5432/imageboard`;

const db = spicedPg(dbUrl);

module.exports.getImageData = function() {
    const q = 'SELECT * FROM images';
    return db.query(q);
};

module.exports.saveFile = (url, title, description, username) => {
    const q = `INSERT INTO images (url, title, description, username)
    VALUES ($1,$2,$3,$4)`;
    return db.query(q, [
        url || null,
        title || null,
        description || null,
        username || null
    ]);
};
