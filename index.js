const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const app = express();
app.use(cors());

const userRoutes = require('./routes/userRoutes')

dotenv.config();
connectDB();

const PORT = process.env.PORT;

app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/users', userRoutes)

app.listen(PORT, () => { console.log(`server listening on port ${PORT}`) })