const express = require('express');
const app = express();
require("dotenv").config();
require("./start/midilweris")(app);
require("./start/rout")(app);
require("./config/db")(app);
