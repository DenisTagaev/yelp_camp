const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

//review requirements schema
const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
});

module.exports = mongoose.model('Review', reviewSchema);