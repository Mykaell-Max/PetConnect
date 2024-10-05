const Pet = require('../../mongo/petModel');
const APIFeatures = require('../../utils/APIFeatures');
async function createPet(req, res){
    try{
        const newPet = new Pet(req.body);
        await newPet.save();
        return res.status(201).json(newPet);
    }
    catch(error){
        return res.status(500).send(error.message);
    }
}


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
        const pet = await Pet.findByIdAndDelete(petId);
        if (!pet) {
            return res.status(404).send("Pet not found!");
        }
        return res.status(204).send();
    } catch (error) {
        return res.status(500).send(error.message);
    }
}


async function addAdoptionRequests(req, res) {
    try {
        const petId = req.params.petId;
        const adopterId= req.body.adopterId;
        
        const pet = await Pet.findByIdAndUpdate(petId, { $addToSet: { adoptionRequests: adopterId } }, { new: true });

        if (!pet) {
            return res.status(404).send("Pet not found!");
        }

        return res.status(200).json(pet);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}


async function removeAdoptionRequest(req, res) {
    try {
        const petId = req.params.petId;
        const adopterId= req.body.adopterId;

        const pet = await Pet.findByIdAndUpdate(petId, { $pull: { adoptionRequests: adopterId } }, { new: true });

        if (!pet) {
            return res.status(404).send("Pet not found!");
        }

        return res.status(200).json(pet);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

async function searchPets(req, res){
    try{
        const pets = new APIFeatures(Pet.find(), req.query).filter().sort().limitFields().paginate().query;
        const result = await pets;
        return res.status(200).json(result);

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
    removeAdoptionRequest
};