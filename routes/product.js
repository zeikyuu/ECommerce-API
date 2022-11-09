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


// route to single product
router.get("/:productId", (req, res) => {
	productController.getProduct(req.params.productId).then(resultFromController => {
		res.send(resultFromController)
	})
})


// Update product

/*router.patch('/:productId/update', auth.verify, (req, res) => {
    const data = {
      productId: req.params.productId,  
      isAdmin: auth.decode(req.headers.authorization).isAdmin
    }  
  
    updateProduct(data, req.body).then(
      resultFromController => res.send(resultFromController))
})*/



/*router.patch("/:productId", auth.verify, (req, res) => {
	const data = {
		productId: req.params.productId,
		isAdmin: auth.decode(req.headers.authorization).isAdmin
	}

	updateProduct(data).then(resultFromController => {
		res.send(resultFromController);
	})
})
*/

router.patch("/:productId", auth.verify, (req, res) => {
	productController.updateProduct(req.params.productId, req.body).then(resultFromController => {
		res.send(resultFromController)
	})
})




// Archiving a single product
router.patch("/:productId/archive", auth.verify, (req, res) => {
	productController.archiveProduct(req.params.productId).then(resultFromController => {
		res.send(resultFromController)
	})
})



module.exports = router;