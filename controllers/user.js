const user = require('../models/user');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "DA693C13E7C5528473D915EB827EC";

JWT_TOKEN = (user) => {

    return jwt.sign({
        'user_id': user._id,
        'email': user.email,
        'name': user.name,
        'exp': new Date().setDate(new Date().getDate() + 1) //current time + 1 day
    }, JWT_SECRET);
}

module.exports = {

    signup: async (req, res, next) => {

        const email = req.body.email;

        //check if email exists or not
        const checkUser = await user.findOne({ email });

        //If user exists
        if (checkUser) res.status(400).send({ error: 'Email already in use.' });

        //If user doesn't exists 
        const newUser = new user({
            name: req.body.name,
            email: req.body.email,
            provider: {
                password: req.body.password
            },
            image: req.body.image
        });

        //Create new user
        await newUser.save();

        //Get token
        const token = JWT_TOKEN(newUser);

        //Send Response
        res.status(201).send({token});
    },

    signin: async (req, res, next) => {
       
        //Get token
        const token = JWT_TOKEN(req.user);

        //Send Response
        res.status(200).send({token});
    },

    checkUser: async (req, res, next) => {

        const email = req.body.email;

        //check if email exists or not
        const checkUser = await user.findOne({ email });

        //If user exists
        if (checkUser && checkUser.provider.password) {

            //let resetToken = JWT_TOKEN(checkUser);

            crypto.randomBytes(20, function (err, buffer) {
                var resetToken = buffer.toString('hex');
                done(err, user, token);
            });

            res.status(200).send({ userExists: true, email, name: checkUser.name, resetToken });
        } 

        else res.status(400).send({ error: "Email doesn't exist." });
    },

    resetPassword: async (req, res, next) => {

        console.log(req.body);
        console.log(req.params);
        console.log(req.query);
    }
}