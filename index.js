const express = require('express');
const app = express();
const bp = require('body-parser');
const db = require('./db.js');

app.use(
    require('body-parser').urlencoded({
        extended: false
    })
);

app.use(express.static('./public'));

app.get('/images', (req, res) => {
    var imageInfo = db
        .getImageData()
        .then(results => {
            console.log('Results from getimages :', results);
            res.json(results.rows);
        })
        .catch(err => {
            console.log('There was an error: ', err);
            res.render('error', {
                layout: 'main',
                error: true
            });
        });
});

app.listen(8080, () => console.log(`I'm listening`));
