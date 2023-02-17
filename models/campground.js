const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      Review = require('./review');

const CampSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
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