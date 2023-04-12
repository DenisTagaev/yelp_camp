const baseJoi = require('joi'),
    sanitizeHTML = require('sanitize-html');

//adding security layer to eliminate basic SQL injections on the client side
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helper) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if(clean !== value) return helper.error('string.escapeHTML', { value });
                return clean;
            }
        }
    }
});

//includes the security layer for the model
const Joi = baseJoi.extend(extension);

//campground schema
module.exports.JoiSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        description: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
});

//review schema
module.exports.JoiReview = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
});