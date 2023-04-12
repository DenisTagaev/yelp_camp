const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      passLocalMongoose = require('passport-local-mongoose');
   
//registration requirements schema
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }

});

UserSchema.plugin(passLocalMongoose);

module.exports = mongoose.model('User', UserSchema);