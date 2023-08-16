const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  /*   const user = req.session.currentUser;
  console.log(user); */
  res.render("index");
});

/* GET How to Play Page */
router.get("/how-to-play", (req, res, next) => {
  /*   const user = req.session.currentUser;
  console.log(user); */
  res.render("how-to-play");
});

module.exports = router;
