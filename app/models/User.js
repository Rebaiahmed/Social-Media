var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var userSchema = mongoose.Schema({

    local: {
        email: String,
        password: String,
        username : String
    },

    facebook: {
        id: String,
        token: String,
        email: String,
        name: String

    },
    twitter: {
        id: String,
        token: String,
        email: String,
        displayName: String,
        username: String

    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String

    }
})


userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
}


userSchema.methods.generateJwt = function(){
    var today = new Date()
    var exp = new Date();
    exp.setHours(today.getHours()+24);//expiry in 24 hours

    return jwt.sign({
        _id:this._id,
        email :this.local.email,
        username : this.local.username,
        exp :parseInt(exp.getTime()/1000)
    },'secret_Client')

}


//export the model


module.exports = mongoose.model('User', userSchema);
