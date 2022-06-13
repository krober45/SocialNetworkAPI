const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { getRandomName, getRandomEmail } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('connected');

    // Drop existing Users
    await User.deleteMany({});
    // Drop existing Thoughts
    await Thought.deleteMany({});

    // Create user
    const user = [];
    const username = getRandomName();
    const email = getRandomEmail();

    console.log(username);
    console.log(email);

    user.push({
        username,
        email
    });

    // Add user to database
    await User.collection.insertMany(user);

    // Log
    console.table(user);
    console.info('Seeding complete! 🌱');
    process.exit(0);
});