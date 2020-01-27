const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

//Create Schema
const userSchema = new schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    provider: {
        type: schema.Types.Mixed,
        required: true
    },
    image: {
        type: String
    }
});

userSchema.pre('save', async function (next) {

    try {
        if (this.provider.password) {

            //Generate salt
            let salt = await bcrypt.genSalt(10);

            //Generate a password hash (salt + hash)
            let hash = await bcrypt.hash(this.provider.password, salt);

            //Reassign hashed version over orginal, plain text password
            this.provider.password = hash;
            next();
        }
    }
    catch (error) {
        next(error);
    }

});

userSchema.methods.isValidPassword = async function (password) {

    try {

        return await bcrypt.compare(password, this.provider.password);
    }
    catch (error) {
        throw new Error(error);
    }

}

//create a model
const User = mongoose.model('user', userSchema, 'user');

//export the model
module.exports = User;