const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    title : {
        type: String,
        required : true,
        default : ""
    },
    description : {
        type: String,
        required : true,
        default : ""
    },
    senderId : {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    recieverId : {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    toLevel : {
        type: String
    },
    creationDate : {
        type: Date,
        default: Date.now()
    }
})

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;