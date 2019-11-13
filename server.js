const express = require("express");
const app = express();
const router = require('./app.js')


const cors = require("cors");

const mongoose = require("mongoose");
const db = mongoose.connection

mongoose.connect(process.env.SECRET, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => console.log('Connected to Mongoose!'))

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));

//Router
app.use('/', router);




// Not found middleware
app.use((req, res, next) => {
  return next({ status: 404, message: "not found" });
});

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage;

  if (err.errors) {
    // mongoose validation error
    errCode = 400; // bad request
    const keys = Object.keys(err.errors);
    // report the first validation error
    errMessage = err.errors[keys[0]].message;
  } else {
    // generic or custom error
    errCode = err.status || 500;
    errMessage = err.message || "Internal Server Error";
  }
  res
    .status(errCode)
    .type("txt")
    .send(errMessage);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
