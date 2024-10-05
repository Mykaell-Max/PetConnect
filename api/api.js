const express = require("express");
const api = express();

const userRoutes = require("./routes/userRoutes");
const petRoutes = require("./routes/petRoutes");
api.use(express.json());

api.use('/api/users', userRoutes);
api.use('/api/pets', petRoutes);


api.listen(8000, () => {console.log('Running')});