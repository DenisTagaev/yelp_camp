const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      Review = require('./review');

const ImgSchema = new Schema({
    url: String, 
    filename: String,
});

//compressing the image for data saving during editing
ImgSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/c_scale,w_200,h_150');
});

//including the thumbnail predownload from the remote
const options = {toJSON: {virtuals: true}};

//campground requirements schema
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
}, options);

//customizing the popup when the pin on the map is clicked
CampSchema.virtual('properties.popUpLink').get(function(){
    return `<h6><a href="/campgrounds/${this._id}">${this.title}</a></h6>
        <p>${this.description.substring(0,20)}...</p>`;
})

//cleaning the reviews for the campground deleted
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