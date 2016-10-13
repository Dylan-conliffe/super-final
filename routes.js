var Auth = require('./controllers/auth'),
    Profile = require('./controllers/profile'),
    multiparty = require('connect-multiparty')();

module.exports = function routes(app) {
    //
    // ─── USERS ROUTES ───────────────────────────────────────────────────────────────
    //
    app.get('/', (req, res) => {
        res.sendFile('index.html', {
            root: './public/html/'
        });
    });
    app.get('/me', (req, res) => {
        res.send(req.session.user)
    });

    app.all('/profile*', Auth.middlewares.session);
    app.get('profile/track/list',Profile.tracks.list);
    
    app.get('/profile', Profile.render);
    //app.get('/profile/files',);
    app.post('/profile/edit', multiparty, Profile.edit);
    app.post('/profile/tracks',multiparty, Profile.tracks.post )
    //
    // ─── AUTH ROUTES ───────────────────────────────────────────────────────────────────────
    //
    app.get('/register', (req, res) => {
        res.sendFile('register.html'), {
            root: './public/html'
        }
    });
    app.get('/logout', Auth.logout);
    app.post('/login', Auth.login);
    app.post('/register', Auth.register);
};
