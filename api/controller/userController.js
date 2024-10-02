const User = require("../../mongo/userModel");

async function createUser(req, res) {
    try{
        const newUser = new User(req.body);
        await newUser.save();
        return res.status(201).json(newUser);
    }
    catch (error) {
        return res.status(500).send(error.message);
    }
}


async function getUser(req, res){
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
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
        const user = await User.findByIdAndUpdate(userId, req.body, {new:true});
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
        const user = await User.findByIdAndDelete(userId); 
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
    getUser, 
    updateUser, 
    deleteUser
};