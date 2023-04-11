const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      Review = require('./review');

const ImgSchema = new Schema({
    url: String, 
    filename: String,
});

ImgSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/c_scale,w_200,h_150');
});

const CampSchema = new Schema({
    title: String,
    images: [ImgSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

CampSchema.post('findOneAndDelete', async function(camp) {
    if(camp) {
        await Review.deleteMany({
            _id: {
                $in: camp.reviews
            }
        })
    }
});

module.exports = mongoose.model('Campground', CampSchema);