const Joi = require('joi')

module.exports.museumSchema = Joi.object({
    museum: Joi.object({
        name: Joi.string().required(),
        image: Joi.string().required(),
        description: Joi.string().required(),
        website: Joi.string().required(),
        location: Joi.string().required()
    }).required()
});

