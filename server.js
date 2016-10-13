var express = require('express'),
    bodyParser = require('body-parser'),
    routes = require('./routes'),
    mongoose = require('mongoose'),
    logger = require('morgan'),
    ejs = require('ejs'),
    sessions = require('client-sessions'),
    fileServer = express.static('public'),
    colors = require('colors'),
    port = process.env.PORT || 3000;

app = express();

mongoose.connect('mongodb://localhost/Cypher', function (error) {
    if (error) {
        console.error('I can not run fam', error);
    } else {
        console.log('good shit...DB is up' .rainbow);
    }
});

app.set('view engine', 'ejs');

app.use(logger('dev'));

app.use(sessions({
    cookieName: 'cypherCookie',
    secret: 'B00tyD3w',
    requestKey: 'session',
    duration: (86400 * 1000) * 7,
    cookie: {
        ephemeral: false,
        httpOnly: true,
        secure: false
    }
}))

app.post('*', bodyParser.json());
app.post('*', bodyParser.urlencoded({
    extended: true
}));

app.use(fileServer);

routes(app);

app.listen(port, function () {
    console.log('yoooo!', port)
});
