const SALTY_BITS = 10;

var mongoose = require('mongoose'),
    bcrypt = require('bcryptjs');

userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    about: String,
    artist: String,
    role: String,
    file: String,
    software: String,
    created: {
        type: Number,
        default: () => Date.now()
    }
});

userSchema.pre('save', function (next) {
    var user = this;

    if (!user.isModified('password')) {
        return next();
    }
    // generate a salt value to encrypt our password
    bcrypt.genSalt(SALTY_BITS, (saltErr, salt) => { // used to guarentee uniqueness
        if (saltErr) {
            return next(saltErr);
        }
        console.info('SALT generated!');

        // now let's hash this bad boy!
        bcrypt.hash(user.password, salt, (hashErr, hashedPassword) => {
            if (hashErr) {
                return next(hashErr);
            }
            // over-ride the plain text password with the hashed one
            user.password = hashedPassword;
            next();
        });
    });
});

module.exports = mongoose.model('user', userSchema, 'users');
