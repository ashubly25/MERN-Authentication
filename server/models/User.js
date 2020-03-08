var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
    name: {type: String,lowercase: true},
    mail: {type: String,lowercase: true},
    key: {type: String,}
}, {timestamps: true});

UserSchema.pre('save', function(next) {
    user = this;
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.key, salt, (err, hash) => {
            if (err) return next(err);
            user.key = hash;
            next();
        });
    });
});

UserSchema.statics.isBad = rq => {
    
    let present = rq.name && rq.key && rq.mail
    if (!present) return { missing:true, bad:true };
    
    const isString = str=>Object.prototype.toString.call(str) === "[object String]";

    const rxName = /^[a-zA-Z][a-zA-Z0-9]{3,}$/;
    const rxMail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    
    let okay = isString(rq.name) && rxName.test(rq.name);
    okay = okay && isString(rq.mail) && rxMail.test(rq.mail);
    okay = okay && rq.key.length>=5;
    
    return { missing:false, bad:!okay, user:{name:rq.name,mail:rq.mail,key:rq.key} };
}

module.exports = mongoose.model('user', UserSchema);