const user = require('../models/user');

module.exports = {

    get_data: async (req, res, next) => {

        //Get Data
        const data = await user.find(req.query);

        //Send response
        res.status(200).send(data);
    },

    post_data: async (req, res, next) => { },

    put_data: async (req, res, next) => { },

    delete_data: async (req, res, next) => { }
}