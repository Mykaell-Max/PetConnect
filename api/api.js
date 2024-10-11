const express = require("express");
const cors = require('cors');
const morgan = require('morgan');

const api = express();

const userRoutes = require("./routes/userRoutes");
const petRoutes = require("./routes/petRoutes");
const chatRoutes = require("./routes/chatRoutes");
const {limiter} = require("../middlewares/limiterMiddleware");

api.use(morgan('combined'));
api.use(limiter);
api.use(cors());
api.use(express.json());

api.use('/api/users', userRoutes);
api.use('/api/pets', petRoutes);
api.use('/api/chats', chatRoutes);


api.listen(8000, () => {console.log('Running')});