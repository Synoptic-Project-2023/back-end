const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const url = require('./config.js');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

const FoodBank = require('./models/foodBank');
const User = require('./models/user');
const Message = require('./models/message')

connectToDatabase();



// User
app.get('/api/user', async (req, res) => {
    const users = await User.find()

    res.json(users);
})

app.get('/api/user/:id', async (req, res) => {
    if(req.params.id == ''){ return; }
    const user = await User.findById(req.params.id)

    res.json(user);
})

app.get('/api/user/:id/foodbanks', async (req, res) => {
    if(req.params.id == ''){ return; }
    const user = await User.findById(req.params.id)
    if(!user){
        return res.status(404).json({ message : 'Unable to find user'})
    }

    const banks = await FoodBank.find({ _id: {$in: user.banks}})
    res.json(banks);
})

app.put('/api/user/:id/update', async (req, res) => {
    const { banks, access } = req.body;
    if(!req.params.id) return res.status(400)

    if(!banks && !access){
        return res.status(400).json({
            message: 'No parameters to update'
        })
    }

    const updateFields = {}
    if(banks){
        updateFields.$push = { banks: banks }
    }
    if(access){
        updateFields.access = access 
    }
    
    User.findByIdAndUpdate(req.params.id, updateFields, { new: true })
        .then(updatedUser => {
            if(!updatedUser) {
                return res.status(404).json({ message: 'User not found'});
            }
            res.json(updatedUser)
    })
})

app.delete('/api/user/:id', async (req, res) => {
    if(req.params.id == ''){ return res.status(400); }
    const deleteUser = await User.findByIdAndDelete(req.params.id)

    res.json(deleteUser);
})


// Foodbanks
app.get('/api/foodbank', async (req, res) => {
    const bank = await FoodBank.find()
    res.json(bank);
})

app.get('/api/foodbank/:id', async (req, res) => {
    if(req.params.id == ''){ return res.status(400); }
    const bank = await FoodBank.findById(req.params.id)

    res.json(bank);
})

app.put('/api/foodbank/:id', async (req, res) => {
    if(req.params.id == ''){ return res.status(400); }
    const bank = await FoodBank.findById(req.params.id)

    res.json(bank);
})

app.get('/api/foodbank/filter', async (req , res) => {
    // to make a request to this you would type something like
    // URL.com/api/foodbank/filter?halal=true&vegetarian=true
    const fields = ['halal', 'kosher', 'vegetarian', 'vegan'];
    const filters = {};

    fields.forEach(field => {
        if (req.query[field]){
            filters[field] = req.query[field] === 'true'
        }
    });

    const foodbanks = await FoodBank.find(filters);
    res.json(foodbanks)
})

// Log in and registration
app.post('/api/user/login', async (req , res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).json({ message: 'Invalid Username' });
    }

    console.log(user)
    console.log(password)

    const passwordValidation = await bcrypt.compare(password, user.password);
    if (!passwordValidation){
        return res.status(401).json({ message: 'Invalid Password' });
    }

    res.json(user)
})

app.post('/api/user/register', async (req, res) => {
    const { username, password, email } = req.body;
    if(!username || !password || !email){
        console.log('Registration failed')
        return res.status(500).json({message: 'Registration Failed: required fields are empty'});
    } 

    const existingUser = await User.findOne({ username })
    if(existingUser){
        console.log('User Exists');
        return res.status(500).json({message: 'Registration Failed: User exists'});
    }

    //hashing is handled in the schema
    const newUser = new User({
        username,
        password,
        email,
        access: 'user'
    })

    await newUser.save();
    res.json(newUser);
})


app.listen(PORT, () => console.log("Server started on port : " + PORT))

//Connect to database
function connectToDatabase(){
    mongoose.connect(url ,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log("Connected to " + url))
        .catch(console.error);
    
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log('Database connected!');
    });
}
