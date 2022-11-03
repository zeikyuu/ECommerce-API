const express = require("express");
const router = express.Router();
const Product = require("../models/Product.js");

const auth = require("../auth.js")


module.exports = router