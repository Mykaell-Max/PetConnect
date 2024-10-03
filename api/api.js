const express = require("express");
const api = express();

const userRoutes = require("./routes/userRoutes");

api.use(express.json());

api.use('/api/users', userRoutes);


api.listen(8000, () => {console.log('Running')});