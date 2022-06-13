const username = [
    'BillyTheKid',
    'UberSmash64',
    'BeachLover12',
    'PollyPocket',
    'TheBride'
];

const email = [
    'billy12@seed.test',
    'smashthis@seed.test',
    'volleyballstar@seed.test',
    'mydollhouse@seed.test',
    'billkilltodo@seed.test'
];

// Get a random item given an array
const getRandomArrItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Gets a random username
const getRandomName = () => `${getRandomArrItem(username)}`;

// Gets a random email
const getRandomEmail = () => `${getRandomArrItem(email)}`;

module.exports = { getRandomName, getRandomEmail };