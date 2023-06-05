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

//User
app.get('/api/user', async (req, res) => {
    const users = await User.find()

    res.json(users);
})

app.get('/api/user/:id', async (req, res) => {
    if(req.params.id == ''){ return; }
    const user = await User.findById(req.params.id)

    res.json(user);
})

app.delete('/api/user/:id', async (req, res) => {
    if(req.params.id == ''){ return; }
    const deleteUser = await User.findByIdAndDelete(req.params.id)

    res.json(deleteUser);
})

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
