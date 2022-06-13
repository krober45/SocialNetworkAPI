const { User, Thought } = require('../models');

const userCount = async () =>
    User.aggregate()
        .count('userCount')
        .then((numberOfUsers) => numberOfUsers);

module.exports = {
    //get all users
    getAllUsers(req, res) {
        User.find()
            .then(async (users) => {
                const userObj = {
                    users,
                    count: await userCount()
                };
                return res.json(userObj);
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    //post new user
    createUser(req, res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },
    //get single user by _id
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .then((user) => 
                !user
                    ? res.status(404).json({
                        message: 'No user found with this ID',
                    })
                    : res.status(200).json(user)
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            })
    },
    //update user by _id
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
          )
            .then((user) =>
              !user
                ? res.status(404).json({ message: 'No user with this ID!' })
                : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    //delete user by _id (remove thoughts when deleted)
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
        .then((user) =>
          !user
            ? res.status(404).json({ message: 'No user with that ID' })
            : Thought.deleteMany({ _id: { $in: user.thoughts } })
        )
        .then(() => res.json({ message: 'User and thoughts deleted!' }))
        .catch((err) => res.status(500).json(err));
      },
    /*new route within user*/

    //post to add friend to user
    newFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
        .then((user) =>
            !user
                ? res.status(404).json({ message: 'No user with that ID' })
                : User.findOneAndUpdate(
                    { _id: req.params.friendId },
                    { $addToSet: { friends: req.params.userId } },
                    { runValidators: true, new: true }
                )
        )
        .then(() => res.json({ message: 'Friends till the end:)' }))
        .catch((err) => res.status(500).json(err)); 
    },
    //delete to remove friend from user
    deleteFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
        .then((user) =>
            !user
                ? res.status(404).json({ message: 'No user with that ID' })
                : User.findOneAndUpdate(
                    { _id: req.params.friendId },
                    { $pull: { friends: req.params.userId } },
                    { runValidators: true, new: true }                   
                )
        )
        .then(() => res.json({ message: 'Friends no more:(' }))
        .catch((err) => res.status(500).json(err));
    }

}