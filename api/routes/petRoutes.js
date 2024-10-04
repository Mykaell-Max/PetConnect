const express = require("express");
const router = express.Router();

const petController = require("../controller/petController");

router.post('/register', petController.createPet);
router.get('/:petId', petController.getPet);
router.patch('/:petId', petController.updatePet);
router.delete('/:petId', petController.deletePet);
router.patch('/:petId/adoption-request', petController.addAdoptionRequests);
router.delete('/:petId/adoption-request', petController.removeAdoptionRequest);

module.exports = router;