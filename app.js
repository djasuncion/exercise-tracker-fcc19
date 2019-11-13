const express = require('express')
const app = express();
const router = express.Router();


router.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});


router.get('/sayHello', (req, res) => {
  res.send('Hello')
})

module.exports = router;