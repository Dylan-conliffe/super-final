var User = require('../model/user'),
    File = require('../model/file'),
    s3 = require('s3'),
    s3Options = require('../secrets').s3
    s3Client = s3.createClient(s3Options);

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
        var body = req.body.data;
        var file = req.files.files;

        console.log("FILE:".green.bold, file);

        if( !file ) {
            return ProfileController.update(req, res);
        }

        var filePath = 'profileSHIT/' + (new Date()).getTime();

        var uploader = s3Client.uploadFile({
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

            req.body.data.file = url;
            ProfileController.update(req, res);

            // new File({
            //     userId: req.session.user._id,
            //     name: req.body.fileName,
            //     // attributes: req.body.attributes,
            //     url: url
            // }).save((err, newFile) => {
            //     if( err ) {
            //         res.status(500).send({
            //             message: 'Could not save file into mongoose',
            //             reason: 'Shit got fucked',
            //             error: err
            //         });
            //     } else {
            //         console.info('NEW FILE BITCHES!', newFile);
            //         ProfileController.update(req, res);
            //     }
            // });
            // req.session.user.file = filePath;
            // console.log('help:',req.session.user,typeof(req.session.user) );
            //req.session.user.save();            // We will save the s3 URL using File
        });
    },
    getFiles : (req, res) => {
        File.find({
            userId: req.session.userId || req.query.userId
        }, (err, files) => {
            if( err ) {
                res.status(500).send(err);
            } else {
                //res.send(files);
                
            }
        });
        // File.findOne({_id: req.session.user._id},(err,file) =>{
        //     console.log('file',file)
        //     res.json(file);
            
        // } )
    }
};

module.exports = ProfileController;
