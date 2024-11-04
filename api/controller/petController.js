const Pet = require('../../mongo/petModel');
const User = require('../../mongo/userModel');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const APIFeatures = require('../../utils/APIFeatures');
const {uploadFile, deleteFile} = require('../../firebase/firebaseFunctions')


async function createPet(req, res) {
    try {
        let petData;
        try {
            petData = JSON.parse(req.body.petData);
        } catch (error) {
            return res.status(400).send("Invalid JSON format!");
        }
        
        const userId = petData.donor;

        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.status(404).send("User not found!");
        }

        const newPet = new Pet(petData);
        const petPictures = req.files;

        if (!petPictures || petPictures.length < 1 || petPictures.length > 5) {
            return res.status(400).send("The pet needs to have at least one picture (and a maximum of five)");
        }

        const picturesUrls = [];

        for (const picture of petPictures) {
            const picName = `${uuidv4()}.png`;

            const { orientation } = await sharp(picture.buffer).metadata();
            let correctedBuffer;

            if (orientation && orientation !== 1) {
                
                correctedBuffer = await sharp(picture.buffer).rotate().toBuffer();
            } else {
                correctedBuffer = picture.buffer;
            }

            const pngPictureBuffer = await sharp(correctedBuffer).png().toBuffer();
            const result = await uploadFile(picName, `pets/${newPet._id}`, pngPictureBuffer);

            if (result.status === 1) {
                picturesUrls.push(result.url);
            } else {
                return res.status(500).send(`Error: ${result.error}`);
            }
        }

        newPet.pictures = picturesUrls;
        await newPet.save();

        await User.findOneAndUpdate({ _id: userId }, { $addToSet: { registeredPets: newPet._id } }, { new: true });

        return res.status(201).json(newPet);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}


const deletePetPicture = async (req, res) => {
    try {
        const petId = req.params.petId;
        const pictureUrl = req.query.pictureUrl;

        const pet = await Pet.findById(petId);

        if (!pet) {
            return res.status(404).json({ message: 'Pet not found!' });
        }

        if (!pet.pictures.includes(pictureUrl)) {
            return res.status(400).json({ message: 'Image not found in pet pictures!' });
        }

        if (pet.pictures.length === 1) {
            return res.status(400).json({ message: 'The pet must have at least one picture!' })
        }

        const regularExp = /\/o\/(.+?)\?/;
        const match = pictureUrl.match(regularExp);

        if (!match) {
            return res.status(400).json({ message: 'Invalid image URL!' });
        }

        const filePath = match[1].replace(/%2F/g, '/');

        const result = await deleteFile(filePath, ''); 

        if (result.status === 0) {
            return res.status(500).send(result.error);
        }

        pet.pictures = pet.pictures.filter(url => url !== pictureUrl);

        await pet.save();

        return res.status(200).json({ message: 'Pet picture deleted successfully!' });
    } catch (error) {
        return res.status(500).send(error.message);
    }
};


const addPetPictures = async (req, res) => {
    try {
        const petId = req.params.petId;
        const petPictures = req.files;

        const pet = await Pet.findById(petId);

        if (!pet) {
            return res.status(404).json({ message: 'Pet not found!' });
        }

        const petPicturesUrls = [];

        for (const picture of petPictures) {
            const picName = `${uuidv4()}.png`;

            const { orientation } = await sharp(picture.buffer).metadata();
            let correctedBuffer;

            if (orientation && orientation !== 1) {
                
                correctedBuffer = await sharp(picture.buffer).rotate().toBuffer();
            } else {
                correctedBuffer = picture.buffer;
            }

            const pngPictureBuffer = await sharp(correctedBuffer).png().toBuffer();
            const result = await uploadFile(picName, `pets/${pet._id}`, pngPictureBuffer);

            if (result.status === 1) {
                petPicturesUrls.push(result.url);
            } else {
                return res.status(500).send(`Error: ${result.error}`);
            }
        }

        pet.pictures.push(...petPicturesUrls);
        await pet.save();

        return res.status(200).json({ message: 'Pictures added successfully!', pictures: pet.pictures });
    } catch (error) {
        return res.status(500).send(error.message);
    }
};


async function getPet(req, res){
    try {
        const petId = req.params.petId;
        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).send("Pet not found!");
        }
        return res.status(200).json(pet);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}


async function updatePet(req, res){
    try {
        const petId = req.params.petId;
        const pet = await Pet.findByIdAndUpdate(petId, req.body, { new: true });
        if (!pet) {
            return res.status(404).send("Pet not found!");
        }
        return res.status(200).json(pet);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}


async function deletePet(req, res){
    try {
        const petId = req.params.petId;
        const pet = await Pet.findById(petId);

        if (!pet) {
            return res.status(404).send("Pet not found!");
        }

        const userId = pet.donor;
        await User.findByIdAndUpdate(userId, { $pull: { registeredPets: petId } });

        await Pet.findByIdAndDelete(petId);

        return res.status(204).send();
    } catch (error) {
        return res.status(500).send(error.message);
    }
}


async function addAdoptionRequests(req, res) {
    try {
        const petId = req.params.petId;
        const adopterId = req.body.adopterId;

        const pet = await Pet.findById(petId);

        if (!pet) {
            return res.status(404).send("Pet not found!");
        }

        if (String(pet.donor) === adopterId) {
            console.log("aaaaaaaaaa")
            return res.status(400).send("Cannot adopt your own registered pet!");
        }

        const updatedPet = await Pet.findByIdAndUpdate(petId, { $addToSet: { adoptionRequests: adopterId } }, { new: true });
        const user = await User.findByIdAndUpdate(adopterId, { $addToSet: { adoptionRequestsSent: petId } }, { new: true });

        if (!user) {
            return res.status(404).send("User not found!");
        }

        return res.status(201).json({ pet: updatedPet, user });
    } catch (error) {
        return res.status(500).send(error.message);
    }
}


async function removeAdoptionRequest(req, res) {
    try {
        const petId = req.params.petId;
        const adopterId = req.query.adopterId;

        const pet = await Pet.findByIdAndUpdate(petId, { $pull: { adoptionRequests: adopterId } }, { new: true });

        if (!pet) {
            return res.status(404).send("Pet not found!");
        }

        const user = await User.findByIdAndUpdate(adopterId, { $pull: { adoptionRequestsSent: petId } }, { new: true });

        if (!user) {
            return res.status(404).send("User not found!");
        }

        return res.status(204).json({pet, user});
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

async function searchPets(req, res){
    try{
        const pets = new APIFeatures(Pet.find(), req.query).filter().sort().limitFields().paginate().query;
        const result = await pets;
        const petList = result.map(pet => ({
            id: pet._id,
            name: pet.name,
            age: pet.age,
            picture: pet.pictures[0], 
            address: pet.address.neighborhood
        }));
        return res.status(200).json(petList);

    }
    catch(error){
        return res.status(500).send(error.message);
    }
}


module.exports = {
    createPet,
    getPet,
    searchPets,
    updatePet,
    deletePet,
    addAdoptionRequests,
    removeAdoptionRequest,
    deletePetPicture,
    addPetPictures
};