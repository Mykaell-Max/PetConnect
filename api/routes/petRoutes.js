const express = require("express");
const router = express.Router();
const multer = require("multer");
const petController = require("../controller/petController");

const imageHandler = multer({limits: { fileSize: 1024 * 1024 * 2 }}).array("petPictures", 5);

const {verifyJWT} = require("../../middlewares/jwtAuth");
const {petOwnerShip, petAdoptionAuth} = require("../../middlewares/verifyAuth")

router.use(verifyJWT);

router
    .route("/searchAll") 
    .get(petController.searchPets);

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
    .delete(petAdoptionAuth, petController.removeAdoptionRequest);

router
    .route("/:petId/picture")
    .post(petOwnerShip, imageHandler, petController.addPetPictures)
    .delete(petOwnerShip, petController.deletePetPicture);

module.exports = router;