const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => console.log('Mongo is CONNECTED'))
    .catch(err => console.log(err));

const sample = arr => arr[Math.floor(Math.random() * arr.length)]

const seedDB = async() => {
    await Campground.deleteMany({});
    
    for (let i = 0; i <= 50; i++) {
        const rand1000 = Math.floor(Math.random() * 1000);
        await new Campground({
          location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
          title: `${sample(descriptors)} ${sample(places)}`,
          author: "6430d30c867188bfc8f038f8",
          image: `https://source.unsplash.com/collection/483251/in-the-woods`,
          description:
            "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti tempora delectus nobis libero animi ab repellendus aperiam error doloribus. Aut quasi itaque odit velit maxime nulla aspernatur similique commodi architecto!",
          price: Math.floor(Math.random() * 25) + 10,
        }).save();
    }
};

seedDB().then(() => mongoose.connection.close());