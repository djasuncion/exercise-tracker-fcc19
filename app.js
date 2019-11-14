const express = require("express");
const app = express();
const moment = require('moment');

const router = express.Router();
const User = require("./userModel");

router.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

router.get("/sayHello", (req, res) => {
  res.send("Hello");
});

router.get("/api/exercise/users", (req, res) => {
  User.find()
    .then(users => {
      let usersArr = [];
      users.forEach(user => {
        usersArr.push({
          user: user.username,
          exercises:
            user.exercises.length === 0
              ? "No exercises listed yet"
              : user.exercises
        });
      });
      res.send(usersArr);
    })

    .catch(err => console.error(err));
});

router.get("/api/exercise/log", (req, res) => {
  const user = req.query.userId;
  const from = req.query.from;
  const to = req.query.to;
  const limit = req.querty.limit;
  console.log(user);
  User.findById(user, (err, userData) => {
    let userExercises = [];
    
    if(err) res.send(`User not found`);
    if(from && to){
      userExercises = userData.filter(exercise => {
       exercise.date >= from && exercise.date <= to;
      });
    } else if (from) {
      userExercises = userData.filter(exercise => {
        exercise.date >= from;
      });
    };
    
    if ( userData.exercises.length > limit ) {
        userExercises = userExercises.slice( 0, limit );
      }
      
      res.send({
        user: user.username,
        total: userExercises.length,
        exercise: userExercises
      });
    
    
    
    
    
    res.send(userData);
  });
});

router.post("/api/exercise/new-user", (req, res) => {
  const username = req.body.username;
  const newUser = new User({ username });

  newUser
    .save()
    .then(user => {
      console.log(`${username} has been saved with id: ${user.id}`);
      res.json({ username, id: user.id });
    })
    .catch(err => {
      res.send(`${username} has already been taken`);
    });
});

router.post("/api/exercise/add", (req, res) => {
  const userId = req.body.userId;
  const date = moment().format('YYYY-MM-DD');
  const update = {
    description: req.body.description,
    duration: req.body.duration,
    date: req.body.date || date
  };

  User.findByIdAndUpdate(
    { _id: userId },
    { $push: { exercises: [update] } },
    { new: true, upsert: true },
    (err, user) => {
      if (err) return console.error(err);

      res.json({
        user: user.username,
        exercises: user.exercises
      });
    }
  );
});

module.exports = router;
