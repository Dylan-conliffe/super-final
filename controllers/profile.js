var User = require('../model/user'),
    File = require('../model/file'),
    s3 = require('s3'),
    s3Options = require('../secrets').s3
    s3Client = s3.createClient(s3Options),
    ProfileController = {
        render: (req, res) => {
            res.sendFile('profile.html', {
                root: './public/html/'
            });
        },
        update: (req, res) => {
            console.log('updating user ', req.session.user._id, req.body);

            User.findOneAndUpdate({
                _id: req.session.user._id
            }, req.body.data, {
                new: true
            }, function (err, doc) {
                if (err) {
                    console.log("Something wrong when updating data!".pink);
                }
                console.log(doc);
                req.session.user = doc;
                res.send(doc);
                console.log(req.session.user.yellow);
            });
        },
        edit: (req, res) => {
            var file = req.files.files;

            console.log("FILE:".green.bold, file);

            if( !file ) {
                return ProfileController.update(req, res);
            }

            s3Upload(req, (err, url) => {
                if( err ) {
                    console.error(err);
                    res.status(500).send(err);
                } else {
                    req.body.data.file = url;
                    ProfileController.update(req, res);
                }
            });
        },
        tracks: {
            list: (req, res) => {
                File.find({
                    userId: req.session.user._id || req.query.userId
                }, (err, files) => {
                    if( err ) {
                        res.status(500).send(err);
                    } else {
                        res.send(files);
                    }
                });
            },
            post: (req, res) => {
                var file = req.files.files;

                console.log("FILE:".green.bold, file);

                if( !file ) {
                    return res.status(400).send({
                        message: 'Error, no file in payload!'
                    });
                }

                s3Upload(req, (err, url) => {
                    if( err ) {
                        console.error(err);
                        res.status(500).send(err);
                    } else {
                        new File({
                            userId: req.session.user._id,
                            name: req.body.fileName,
                            // attributes: req.body.attributes,
                            url: url
                        }).save((err, newFile) => {
                            if( err ) {
                                res.status(500).send({
                                    message: 'Could not save file into mongoose',
                                    reason: 'Shit got fucked',
                                    error: err
                                });
                            } else {
                                console.info('NEW FILE BITCHES!', newFile);
                                res.send(newFile);
                            }
                        });
                    }
                });
            }
        }
    };

function s3Upload(req, callback) {
    var file = req.files.files;

    console.log("Uploading to S3, FILE ::".green.bold, file);

    if( !file ) {
        return callback({ error: "No file found!" });
    }

    var filePath = 'profileSHIT/' + Date.now(),
        uploader = s3Client.uploadFile({
            localFile: file.path,
            s3Params: {
                Bucket: 'cypher-user-stuff',
                Key: filePath,
                ACL: 'public-read',
            }
        });

    uploader.on('progress', () => {
        console.log("progress".purple, uploader.progressAmount, uploader.progressTotal, ((uploader.progressAmount / uploader.progressTotal) * 100) + '%' .green)
    });

    uploader.on('end', () => {
        var url = s3.getPublicUrlHttp('cypher-user-stuff', filePath);

        console.log('Uploader:end'.bold.green, {
            url    : url,
            file   : filePath,
            userId : req.session.user._id,
            body   : req.body
        });

        callback(null, url);
    });
}

module.exports = ProfileController;
