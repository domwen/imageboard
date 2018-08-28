const express = require('express');
const app = express();
const bp = require('body-parser');
const db = require('./db.js');
const s3 = require('./s3.js');
var multer = require('multer');
var uidSafe = require('uid-safe');
var path = require('path');
const config = require('./config.json');

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

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

app.post('/upload', uploader.single('file'), s3.upload, (req, res) => {
    console.log('Inside app.post /upload');
    if (req.file) {
        db.saveFile(
            // call saveFile module in db.js
            config.s3Url + req.file.filename,
            req.body.title,
            req.body.description,
            req.body.username
        )
            .then(() => {
                res.json({
                    success: true
                });
            })
            .catch(err => {
                res.status(500).json({
                    success: false
                });
            });
    }
});

app.listen(8080, () => console.log(`I'm listening`));
