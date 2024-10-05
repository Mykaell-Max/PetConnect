const express = require("express");
const router = express.Router();

const petController = require("../controller/petController");

router
    .route("/searchAll") 
    .get(petController.searchPets);

router
    .route("/register")
    .post(petController.createPet);

router
    .route("/:petId")
    .get(petController.getPet)
    .patch(petController.updatePet)
    .delete(petController.deletePet);

router
    .route("/:petId/adoption-request")
    .patch(petController.addAdoptionRequests)
    .delete(petController.removeAdoptionRequest);

module.exports = router;