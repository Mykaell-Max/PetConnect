const express = require("express");
const router = express.Router();
const multer = require("multer");
const petController = require("../controller/petController");

const imageHandler = multer().array("petPictures", 5);
// {limits: { fileSize: 1024 * 1024 * 2 }} not sure what to do with this

const {verifyJWT} = require("../../middlewares/jwtAuth");
const {petOwnerShip, petAdoptionAuth, petRemoveAdoptionAuth} = require("../../middlewares/verifyAuth")

router
    .route("/searchAll") 
    .get(petController.searchPets);

router.use(verifyJWT);

router
    .route("/register")
    .post(imageHandler, petController.createPet);

router
    .route("/:petId")
    .get(petController.getPet)
    .patch(petOwnerShip, petController.updatePet)
    .delete(petOwnerShip, petController.deletePet);

router
    .route("/:petId/adoption-request")
    .patch(petAdoptionAuth, petController.addAdoptionRequests)
    .delete(petRemoveAdoptionAuth, petController.removeAdoptionRequest);

router
    .route("/:petId/picture")
    .post(petOwnerShip, imageHandler, petController.addPetPictures)
    .delete(petOwnerShip, petController.deletePetPicture);

module.exports = router;