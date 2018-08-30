const spicedPg = require('spiced-pg');
const { pgUser, pgPw } = require('./secrets.json');

var dbUrl = `postgres:${pgUser}:${pgPw}@localhost:5432/imageboard`;

const db = spicedPg(dbUrl);

module.exports.getImageData = function() {
    const q = `SELECT * FROM images
    ORDER BY id DESC
    LIMIT 20
    `;
    return db.query(q);
};

module.exports.getImagebyId = function(image_id) {
    const q = `SELECT * FROM images
    WHERE id = $1`;
    return db.query(q, [image_id]);
};

module.exports.saveFile = (url, title, description, username) => {
    const q = `INSERT INTO images (url, title, description, username)
    VALUES ($1,$2,$3,$4) RETURNING id, title, url`;
    return db.query(q, [
        url || null,
        title || null,
        description || null,
        username || null
    ]);
};
