const User = require("../../mongo/userModel");
const jwt = require('jsonwebtoken');
const {comparePasswords} = require('../../utils/hashPassword')


async function createUser(req, res) {
    try{
        const newUser = new User(req.body);
        const user = await newUser.save();

        const payload = { userId: user.id } 

        const token = jwt.sign(payload, global.env.JWTKEY);

        const response = {
            user: user,
            token: token
        };

        return res.status(201).json(response);
    }
    catch (error) {
        return res.status(500).send(error.message);
    }
}


async function loginUser(req, res) {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({'email': email});

        if (!user) {
            return res.status(403).json({ message: 'Wrong credentials.' });
        }

        const result = await hashCompare(password, user.password)

        if(result) {
            const payload = {
                userId: user.id
            }

            const token = jwt.sign(payload, global.env.JWTKEY);

            const response = {
                message: "Logged sucessfully!",
                token: token
            }

            return res.status(200).json(response);
        } else {
            return res.status(403).send('Wrong credentials.')
        }
    } 
    catch (error) {
        return res.status(500).send(error.message);    
    }
}


async function getUser(req, res){
    try {
        const userId = req.params.userId;
        const user = await User.findOne({_id: userId});
        if (!user) {
            return res.status(404).json({ message: 'User not found!' }); 
        }
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).send(error.message);
    }
}


async function updateUser(req, res) {
    try{
        const userId = req.params.userId;
        const user = await User.findOneAndUpdate({_id: userId}, req.body, {new:true});
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).send(error.message);
    }
}


async function deleteUser(req, res) {
    try {
        const userId = req.params.userId;
        const user = await User.findOneAndDelete({_id: userId}); 
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }
        return res.status(204).json(user);
    }
    catch (error) {
        return res.status(500).send(error.message);
    }
}


module.exports = {
    createUser, 
    loginUser,
    getUser, 
    updateUser, 
    deleteUser
};