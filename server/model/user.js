const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const userSchema = new Schema({
    googleId : String
});

mongoose.model('user',userSchema);

module.exports={userSchema};