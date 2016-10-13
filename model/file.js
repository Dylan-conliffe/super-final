module.exports = require('mongoose').model('file', {
    userId: String,
    // name: String,
    // attributes: Object,
    url: {
        type: String,
        required: true
    },
    created: {
        type: Number,
        default: () => Date.now()
    }
}, 'files');
