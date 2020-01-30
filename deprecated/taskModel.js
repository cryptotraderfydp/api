var mongoose = require('mongoose');

var taskSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    currency_pair: {
        type: String,
        required: true
    },
    risk_level: {
        type: String,
        required: true
    },
    start_time: {
        type: Date,
        required: true
    },
    end_time: {
        type: Date,
        required: true
    },
    current_return: {
        type: Number,
        required: true
    },
    max_return: {
        type: Number
    },
    create_date: {
        type: Date,
        default: Date.now
    }
    
});

var Task = module.exports = mongoose.model('task', taskSchema, 'tasks');
module.exports.get = function (callback, limit) {
    Contact.find(callback).limit(limit);
}