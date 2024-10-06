const express = require("express");
const router = express.Router();
const multer = require("multer");
const petController = require("../controller/petController");

const imageHandler = multer().array("petPictures", 5);

router
    .route("/searchAll") 
    .get(petController.searchPets);

router
    .route("/register")
    .post(imageHandler, petController.createPet);

router
    .route("/:petId")
    .get(petController.getPet)
    .patch(petController.updatePet)
    .delete(petController.deletePet);

router
    .route("/:petId/adoption-request")
    .patch(petController.addAdoptionRequests)
    .delete(petController.removeAdoptionRequest);

router
    .route("/:petId/picture")
    .post(imageHandler, petController.addPetPictures)
    .delete(petController.deletePetPicture)

module.exports = router;