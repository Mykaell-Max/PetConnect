const express = require("express");
const api = express();

const userRoutes = require("./routes/userRoutes");
const petRoutes = require("./routes/petRoutes");
const chatRoutes = require("./routes/chatRoutes");
api.use(express.json());

api.use('/api/users', userRoutes);
api.use('/api/pets', petRoutes);
api.use('/api/chats', chatRoutes);


api.listen(8000, () => {console.log('Running')});