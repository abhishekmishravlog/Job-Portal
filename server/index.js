const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors=require('cors')
const dotenv=require('dotenv')

// MongoDB
mongoose.set('strictQuery', true);
dotenv.config();
mongoose.connect(process.env.MONGO_URL, {
  dbName: "JobPortal",
}).then(() => {
  console.log("DB Connected");
}).catch((err) => {
  console.log(err);
});

const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Setting up middlewares
app.use(cors());
app.use(express.json());

app.listen(4000, () => {
    console.log('Server is running on port 4000');
})