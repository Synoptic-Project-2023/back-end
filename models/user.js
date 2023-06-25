const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: {  
        type: String, 
        required: true 
    },
    email: { 
        type: String,
        required: true
    },
    password: { 
        type: String, 
        required: true 
    },
    banks: [{
        type: mongoose.Types.ObjectId,
        ref: 'Foodbank'
    }],
    access: {
        type: String,
        required: true
    },
    creationDate: { 
        type: Date, 
        default: Date.now 
    }
});

userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) {
        return next();
        }
        const hashedResult = await bcrypt.hash(this.password, 5);
        this.password = hashedResult;
        return next();
    } catch (e) {
        console.log(e);
        return next();
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;