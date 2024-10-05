const User = require("../../mongo/userModel");
const path = require('path')
const jwt = require('jsonwebtoken');
const {comparePasswords} = require('../../utils/hashPassword')
const {uploadFile, deleteFile} = require('../../firebase/firebaseFunctions')

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


async function uploadProfilePic(req, res){
    try{
        const userId = req.params.userId;
        const user = await User.findOne({_id: userId});

        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }
        
        const image = req.file;
        const imageName = `${userId}${path.extname(image.originalname)}`

        const imageUrl = await uploadFile(imageName, `users/${userId}`, image)
        
        if(imageUrl.status == 0){
            return res.status(500).send(imageUrl.error);
        }

        user.profilePicture = imageUrl.url;
        await user.save()

        return res.status(201).json({message: 'Profile picture uploaded!'});
    } 
    catch (error) {
        return res.status(500).send(error.message);   
    }
}


async function deleteProfilePic(req, res) {
    try {
        const userId = req.params.userId;
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({message: 'User not found!'});
        }

        if (!user.profilePicture) {
            return res.status(400).json({message: 'No profile picturee!'});
        }

        const imageUrl = user.profilePicture;
        const regularExp = /\/o\/(.+?)\?/; 
        const match = imageUrl.match(regularExp);

        if (!match) {
            return res.status(400).json({ message: 'Invalid URL, BONACHÃO!' });
        }

        const filePath = match[1].replace(/%2F/g, '/');

        const result = await deleteFile(filePath, '');

        if (result.status === 0) {
            return res.status(500).send(result.error);
        }

        user.profilePicture = '';
        await user.save();

        return res.status(200).json({ message: 'Profile picture deleted!' });
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
    deleteUser,
    uploadProfilePic,
    deleteProfilePic
};