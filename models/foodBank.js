const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const foodBankSchema = new Schema({
    name : {
        type: String,
        required : true,
        default : ""
    },
    description : {
        type: String,
        required : true,
        default : ""
    },
    position : {
        coordinates: [Number]
    },
    stock : {
        type : String,
        default : 'High'
    },
    halal : {
        type: Boolean,
        default: false
    },
    kosher : {
        type: Boolean,
        default: false
    },
    vegetarian : {
        type: Boolean,
        default: false
    },
    vegan : {
        type: Boolean,
        default: false
    },
    creationDate : {
        type: Date,
        default: Date.now()
    }
})

const FoodBank = mongoose.model("FoodBank", foodBankSchema);

module.exports = FoodBank;