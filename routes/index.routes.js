const express = require("express");
const router = express.Router();

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

/* GET home page */
router.get("/", (req, res, next) => {
    const user = req.session.currentUser;
    let putLayout = "";

    if (user) {
        putLayout = "layout-login.hbs";
    } else {
        putLayout = "layout.hbs";
    }
    res.render("index", {
        userInSession: req.session.currentUser,
        layout: putLayout,
    });
});

/* GET How to Play Page LogOut */
/* router.get("/how-to-play", (req, res, next) => {
  res.render("how-to-play");
}); */

/* GET How to Play Page */
router.get("/how-to-play", (req, res) => {
    const user = req.session.currentUser;
    let putLayout = "";

    if (user) {
        putLayout = "layout-login.hbs";
    } else {
        putLayout = "layout.hbs";
    }
    res.render("how-to-play", {
        userInSession: req.session.currentUser,
        layout: putLayout,
    });
});

module.exports = router;
