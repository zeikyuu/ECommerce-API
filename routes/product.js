const express = require("express");
const router = express.Router();
const Product = require("../models/Product.js");
const productController = require("../controllers/productController.js");
const auth = require("../auth.js")


// route to new Product
router.post("/create", auth.verify, (req, res) => {
	const data = {
		product: req.body,
		isAdmin: auth.decode(req.headers.authorization).isAdmin
	}

	productController.addProduct(data).then(resultFromController => {
		res.send(resultFromController);
	})
})


// route to all Product
router.get("/All", (req, res) => {
	productController.getAllProducts().then(resultFromController => {
		res.send(resultFromController);
	})
})

// route to active Product
router.get("/active", (req, res) => {
	productController.getActiveProducts().then(resultFromController => {
		res.send(resultFromController)
	})
})



module.exports = router;