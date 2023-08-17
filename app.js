// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

// equal
hbs.registerHelper("when", function (operand_1, operator, operand_2, options) {
    var operators = {
            eq: function (l, r) {
                return l == r;
            },
            noteq: function (l, r) {
                return l != r;
            },
            gt: function (l, r) {
                return Number(l) > Number(r);
            },
            or: function (l, r) {
                return l || r;
            },
            and: function (l, r) {
                return l && r;
            },
            "%": function (l, r) {
                return l % r === 0;
            },
        },
        result = operators[operator](operand_1, operand_2);

    if (result) return options.fn(this);
    else return options.inverse(this);
});

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const capitalize = require("./utils/capitalize");
const projectName = "module2_project";

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const cardsRoutes = require("./routes/cards.routes");
app.use("/", cardsRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
