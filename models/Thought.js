const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction.js');

//create Thought model
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (date) => {
                if (date) {
                    return date.toLocaleDateString();
                }
            }
        },
        username: {
            type: String,
            required: true
        },
        reactions: [reactionSchema]
    },
    {
        toJSON: {
            getters: true,
        },
        id: false
    }
);

thoughtSchema.virtual('reactionCount')
    .get(function() {
        return this.reactions.length;
    });

const Thought = model('thoughts', thoughtSchema);

module.exports = Thought;