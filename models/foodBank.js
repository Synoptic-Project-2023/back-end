const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const foodBankSchema = new Schema({
    bankName : {
        type: String,
        required : true,
    },
    description : {
        type: String,
        required : true,
    },
    location: {
        latitude: {
            type: Number,
            required: true,
        },
        longitude: {
            type: Number,
            required: true,
        },
        latitudeDelta: {
            type: Number,
            default: 0.01,
        },
        longitudeDelta: {
            type: Number,
            default: 0.01,
        }
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
}, { 
    timestamps: true 
})

const FoodBank = mongoose.model("FoodBank", foodBankSchema);

module.exports = FoodBank;