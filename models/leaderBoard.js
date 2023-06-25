const mongoose = require("mongoose");

const leaderBoardSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true 
    },
    score: {
        type: Number,
        required: true
    },
    creationDate: { 
        type: Date, 
        default: Date.now 
    }
});

const LeaderBoard = mongoose.model("LeaderBoard", leaderBoardSchema);

module.exports = LeaderBoard;